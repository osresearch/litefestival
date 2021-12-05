let a, b;
let mat = new ProjectionMatrix(null,null,"lites2021");
let ag, bg;
let t = 0;

let sketches = [];
let art = [];
let a_pg;
let b_pg;
let a_art = 0;
let b_art = 1;

let hold_time = 20e3; // ms
let fade_time =  5e3;

let start = 0;

function setup()
{
	createCanvas(displayWidth, displayHeight, WEBGL);
	frameRate(50);

	a_pg = createGraphics(1920,1080);
	b_pg = createGraphics(1920,1080);

	a_pg.background(0);
	b_pg.background(0);

	for(let sketch of sketches)
	{
		art.push(sketch());
	}

	mat.load();
}

function draw()
{
	const now = new Date().getTime();
	const t = now - start;

	const orig = background(0);
	const orig_renderer = orig._renderer;

	// draw into ag
	orig._renderer = a_pg._renderer;
	push();
	art[a_art]();
	pop();

	// render b if we are cross fading
	if (t > hold_time && b_art < art.length)
	{
		// draw into bg
		if (!b_pg)
			b_pg = createGraphics(1920,1080);

		orig._renderer = b_pg._renderer;
		push();
		art[b_art]();
		pop();
	}

	// switch back to the webgl renderer and
	// apply the projection mapping matrix
	orig._renderer = orig_renderer;
	mat.apply();

	// flip the display for rear projection
	scale(-1,1);
	translate(-1920,0);

	if (t < hold_time || b_art >= art.length)
	{
		// no cross fade
		//noTint();
		image(a_pg, 0, 0);
		return;
	}

	// cross fade
	const fade = 256 * (t - hold_time) / fade_time;
	tint(256, 256 - fade);
	image(a_pg, 0, 0);
	tint(256, fade);
	image(b_pg, 0, 0);

	if (fade < 255)
		return;

	// b has fully faded in, make it the new a
	a_art = b_art;
	a_pg = b_pg;
	b_pg = null;

	// and choose a new b (that is not the same as the a)
	do {
		b_art = int(random(0, art.length));
	} while (b_art == a_art);

	console.log("New art", b_art);

	// and restart the clock (in milliseconds)
	start = now;
}

function keyPressed()
{
	if (key == ' ')
		mat.edit ^= 1;
	if (key == 's')
		mat.save();
	if (key == '1')
	{
		start = new Date().getTime();
		a_art = (a_art + 1) % art.length;
	}
}
