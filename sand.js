/*
 * "LED sand" pixel simulator
 * Based on Adafruit_PixelDust.cpp, written by Phil "PaintYourDragon" Burgess for Adafruit Industries.
 * BSD license, all text here must be included in any redistribution.
 *
 * This handles the "physics engine" part of a sand/rain simulation.
 * The term "physics" is used loosely here...it's a relatively crude
 * algorithm that's appealing to the eye but takes many shortcuts with
 * collision detection, etc.
 */
sketches.push(function() {

// size of the play area (in grain space)
let w;
let h;
// size of the play area (in pixel space)
let pw;
let ph
let bitmap;

// scale from grain space to window space
let scale;
let reinit;

// 1-axis elastic bounce, 0 to 256. higher is "bouncier"
let elasticity = 1
function bounce(n)
{
	return int((-n * elasticity) / 256)
}


function bitmap_get(x,y)
{
	let v = bitmap[int(x>>8) + int(y>>8) * pw];
	return v != 0
}

function bitmap_set(x,y)
{
	bitmap[int(x>>8) + int(y>>8) * pw] = 1;
/*
	if display:
		display.pixel(x,y, 1)
*/
}
	
function bitmap_clear(x,y)
{
	bitmap[int(x>>8) + int(y>>8) * pw] = 0;
/*
	if display:
		display.pixel(x,y, 0)
*/
}

class Grain
{
	constructor()
	{
		this.vx = 0
		this.vy = 0

		while(1)
		{
			// find free random location
			this.x = random(0,w)
			this.y = random(0,h)
			if (bitmap_get(this.x, this.y))
				continue;

			bitmap_set(this.x, this.y);
			break;
		}
	}

	update_vel(ax, ay, az)
	{
		this.vx += ax + random(0,az)
		this.vy += ay + random(0,az)
		let v2 = this.vx * this.vx + this.vy * this.vy

		// Terminal velocity (in any direction) is 256 units -- equal to
		// 1 pixel -- which keeps moving grains from passing through each other
		// and other such mayhem.  Though it takes some extra math, velocity is
		// clipped as a 2D vector (not separately-limited X & Y) so that
		// diagonal movement isn't faster than horizontal/vertical.
		if (v2 > 65535)
		{
			let v = int(sqrt(v2))
			this.vx = int(256 * this.vx / v)
			this.vy = int(256 * this.vy / v)
		}
	}


	update_pos()
	{
		// ...then update position of each grain, one at a time, checking for
		// collisions and having them react.  This really seems like it shouldn't
		// work, as only one grain is considered at a time while the rest are
		// regarded as stationary.  Yet this naive algorithm, taking many not-
		// technically-quite-correct steps, and repeated quickly enough,
		// visually integrates into something that somewhat resembles physics.
		// (I'd initially tried implementing this as a bunch of concurrent and
		// "realistic" elastic collisions among circular grains, but the
		// calculations and volume of code quickly got out of hand for both
		// the tiny 8-bit AVR microcontroller and my tiny dinosaur brain.)
		let new_x = this.x + this.vx // New position in grain space
		let new_y = this.y + this.vy

		// Check for the bounding box
		if (new_x < 0)
		{
			new_x = 0 // keep it inside the box
			this.vx = bounce(this.vx) // and bounce off wall
		} else
		if (new_x > w)
		{
			new_x = w // keep it inside the box
			this.vx = bounce(this.vx) // and bounce off wall
		}

		if (new_y < 0)
		{
			new_y = 0 // keep it inside,
			this.vy = bounce(this.vy) // and bounce off wall
		} else
		if (new_y > h)
		{
			new_y = h // keep it inside,
			this.vy = bounce(this.vy) // and bounce off wall
		}

		// convert from grain space to pixel space
		let new_px = new_x >> 8
		let new_py = new_y >> 8
		let px = this.x >> 8
		let py = this.y >> 8

		if (new_px == px && new_py == py)
		{
			// still in the same pixel, bitmap is unchanged
			this.x = new_x
			this.y = new_y
			return
		}

		if (!bitmap_get(new_x, new_y))
		{
			// motion to a clear new pixel,
			// nothing to change here
		} else
		if (new_py == py)
		{
			// collision only in the x direction (same py)
			new_x = this.x // cancel X motion, stay in this pixel
			this.vx = bounce(this.vx) // and bounce X velocity
		} else
		if (new_px == px)
		{
			// collision only in the y direction (same px)
			new_y = this.y // cancel Y motion, stay in this pixel
			this.vy = bounce(this.vy) // and bounce Y velocity
		} else
		if (abs(this.vx) >= abs(this.vy))
		{
			// diagonal collision, X axis velocity is faster so try Y first
			if (!bitmap_get(new_x, this.y))
			{
				// That pixel's free!  Take it!  But...
				new_y = this.y // Cancel Y motion
				this.vy = bounce(this.vy) // and bounce Y velocity
			} else
			if (!bitmap_get(this.x, new_y))
			{
				new_x = this.x // Cancel X motion
				this.vx = bounce(this.vx) // and bounce X velocity
			} else {
				// Both spots are occupied, cancel motion and bounce velocity
				this.vx = bounce(this.vx)
				this.vy = bounce(this.vy)
				return
			}
		} else {
			// diagonal collision with Y axis faster, start there
			if (!bitmap_get(this.x, new_y))
			{
				new_x = this.x // Cancel X motion
				this.vx = bounce(this.vx) // and bounce X velocity
			} else
			if (!bitmap_get(new_x, this.y))
			{
				// That pixel's free!  Take it!  But...
				new_y = this.y // Cancel Y motion
				this.vy = bounce(this.vy) // and bounce Y velocity
			} else {
				// Both spots are occupied, cancel motion and bounce velocity
				this.vx = bounce(this.vx)
				this.vy = bounce(this.vy)
				return
			}
		}

		// move to the new pixel
		bitmap_clear(this.x, this.y)
		bitmap_set(new_x, new_y)
		this.x = new_x
		this.y = new_y
	}
}


pw = 32
ph = int(height * pw / width)
scale = height / ((ph+1) * 256);
w = pw << 8
h = ph << 8
bitmap = new Uint8Array(pw*ph)

grains = []
for(let i = 0 ; i < 256 ; i++)
	grains.push(new Grain());

reinit = false

/*
let wake_request;

function mousePressed()
{
	let fs = fullscreen()
	if (fs)
	{
		// already full screen, turn it off
		// and cancel any wakelock
		fullscreen(false)
		if (wake_request)
			wake_request.cancel()
	} else {
		// go full screen and request a wake lock
		fullscreen(true)
		navigator.getWakeLock("screen").then(function(wakeLock) {
			wake_request = wakeLock.createRequest();
		});
	}
	reinit = true
}

*/

return function()
{
	background(0,0,0,40)
	//background(0,0,0)

	// avoid the mouse cursor
/*
	for(let x = -10 ; x < 10 ; x++)
		for(let y = -10 ; y < 10 ; y++)
			bitmap_set(mouseX + x * 256, mouseY + y * 256)
*/

/*
	// Calculate one frame of particle interactions
	//let az = 0;
	let ax = rotationY
	let ay = rotationX
	let az = accelerationZ
	if (!ax && !ay && !az)
	{
		ax = (mouseX - width/2) * 5 / width;
		ay = (mouseY - height/2) * 5 / height;
		az = random(-2,2)
	}
*/
	ax = 3 * sin(frameCount/100);
	ay = 3 * cos(frameCount/100);
	az = random(-2,2);

/*
	fill(0)
	rect(0,0, 100, 100)
	fill(255)
	text(ax, 10, 10)
	text(ay, 10, 30)
	text(az, 10, 50)
*/

	// A tiny bit of random motion is applied to each grain, so that tall
	// stacks of pixels tend to topple (else the whole stack slides across
	// the display).  This is a function of the Z axis input, so it's more
	// pronounced the more the display is tilted (else the grains shift
	// around too much when the display is held level).

	// Clip & invert
	if (az >= 4)
		az = 1
	else
		az = 5 - az

	ax -= az // Subtract Z motion factor from X, Y,
	ay -= az // then...
	let az2 = az * 2 + 1 // max random motion to add back in

	noStroke();
	//stroke(0);

	// Apply 2D accel vector to grain velocities...
	let pscale = scale * 256 // * 0.7
	//translate(100,100)
	for(var grain of grains)
	{
		grain.update_vel(ax, ay, az2)
		grain.update_pos()

		//fill(128,0,255);
		let v = sqrt(grain.vx*grain.vx + grain.vy*grain.vy);
		fill(
			256 * grain.x / w + 256 * (h - grain.y) / h,
			v / 2,
			256 * (w - grain.x) / w + 256 * grain.y / h,
			//120
		);

		//ellipse((grain.x>>8)*pscale, (grain.y>>8)*pscale, pscale, pscale)
		ellipse(
			(grain.x/256)*pscale,
			(grain.y/256)*pscale,
			v/64 + pscale*0.8,
			v/64 + pscale*0.8,
		)
/*
		push()
		translate((grain.x/256)*pscale, (grain.y/256)*pscale)
		rotate(atan2(grain.vy, grain.vx))
		rect(0, 0, pscale, pscale)
		pop()
*/
	}
}
});
