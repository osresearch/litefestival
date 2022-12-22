let a, b;
let mat = new ProjectionMatrix(null,null,"lites2021");
let ag, bg;
let t = 0;
const rect_w = 175
const rect_h = 336


let sketches = [];
let art = [];
let a_pg;
let b_pg;
let fade_pg;
let a_art = 0;
let b_art = 1;

let hold_time = 120e3; // ms == 2 minutes
let fade_time =  3e3;

let start = 0;
let authors = {};

let fading = false;
let paused = false;
let holding = false;

// mqtt for doorbell button
let host = "dashboard";
let port = 9001;
let mqtt = new Paho.MQTT.Client(host, port, "litefestival");

function handle_doorbell(msg)
{
        let topic = msg.destinationName;
        let payload_str = msg.payloadString;
        let payload = JSON.parse(payload_str);

        console.log(topic, payload);
        if (payload.action == "single")
	{
		// switch to the next one
		start = 0;
		a_art = (a_art + 1) % art.length;
	}

        //if (payload.action == "double")
                //paused = !paused;
}

function mqtt_connect()
{
        mqtt.connect({
                timeout: 3,
                onSuccess: () => mqtt.subscribe('zigbee/doorbell-button'),
        });
        mqtt.onConnectionLost = () => setTimeout(mqtt_connect, 5000);
        mqtt.onMessageArrived = handle_doorbell;
}

mqtt_connect();


function preload()
{
	for(let author of ["qrs", "andy", "holly", "rickroll", "qrcode", "qguv"])
		authors[author] = loadImage('images/' + author + '.png');

	rickroll_frames = loadBytes('images/rickroll.bin');
}

function setup()
{
	//createCanvas(windowWidth-10, windowHeight-15, WEBGL);
	createCanvas(windowWidth-0, windowHeight-0, WEBGL);
	frameRate(50);

	a_pg = createGraphics(1920,1080);
	b_pg = createGraphics(1920,1080);
	fade_pg = createGraphics(1920,1080);

	a_pg.background(0);
	b_pg.background(0);
	fade_pg.background(0);

	for(let sketch of sketches)
		art.push(sketch());

	mat.load();
}

function draw_qrcode(author,x=rect_w/2, y=1080 - rect_h/2) //1080-rect_h/2)
{
	if (fading)
		return;
	//if (!(author in authors))
		//return;

	// add the author qr code
	push();
	translate(x+128/2,y - 128/2);
	scale(-1,1);
	image(authors[author], 0, 0, 128, 128);
	//image(authors["qrcode"], 0, 0, 128, 128);
	pop();
}

function draw()
{
	const now = new Date().getTime();
	if (start == 0)
		start = now;
	const t = now - start;

	const orig = background(0);
	const orig_renderer = orig._renderer;

	if (holding)
	{
		fill(255,0,0);
		rect(-width/2,-height/2,20,20);
	}

	// draw into ag
	fading = false;
	orig._renderer = a_pg._renderer;
	if (!paused)
	{
		push();
		art[a_art](now);
		pop();
	}

	// render b if we are cross fading
	if (!holding && !paused && t >= hold_time && art.length != 1)
	{
		// draw into bg
		if (!b_pg)
		{
			b_pg = createGraphics(1920,1080);
			b_pg.background(0);
		}

		orig._renderer = b_pg._renderer;
		push();
		art[b_art](now);
		pop();

		// cross fade into fade_pg
		fading = true;
		orig._renderer = fade_pg._renderer;
		let fade = 256 * (t - hold_time) / fade_time;
		tint(255, 255 - fade);
		image(a_pg, 0, 0);
		tint(255, fade);
		image(b_pg, 0, 0);
	}

	// switch back to the webgl renderer and
	// apply the projection mapping matrix
	orig._renderer = orig_renderer;
	mat.apply();

	if (mat.edit)
		mat.drawMouse();

	// flip the display for rear projection
	// and draw either the cross faded image or the original
	//scale(-1,1);
	//tanslate(-1920,0);
	if (fading)
	{
		image(fade_pg, 0, 0);
	} else {
		image(a_pg, 0, 0);
	}

	if (paused || holding)
		return;

	if (t < hold_time + fade_time || art.length == 1)
		return;

	// if b has fully faded in, make it the new a
	a_art = b_art;
	a_pg = b_pg;
	b_pg = null;

	// and choose a new b (that is not the same as the a)
	do {
		b_art = int(random(0, art.length));
	} while (b_art == a_art);

	console.log("New art", b_art);

	// and restart the clock
	start = 0;
}

function keyPressed()
{
	if (key == ' ')
		mat.edit ^= 1;

	if (key == 's')
		mat.save();
	if (key == 'p')
		paused ^= 1;
	if (key == 'h')
		holding ^= 1;

	if (key == '1')
	{
		// switch to the next one
		start = 0;
		a_art = (a_art + 1) % art.length;
	}
}

function windowResized()
{
	resizeCanvas(windowWidth-0, windowHeight-4);
}


// fixup image tinting
p5.Renderer2D.prototype._getTintedImageCanvas = function(img) {
  if (!img.canvas) {
    return img;
  }

  if (!img.tintCanvas) {
    // Once an image has been tinted, keep its tint canvas
    // around so we don't need to re-incur the cost of
    // creating a new one for each tint
    img.tintCanvas = document.createElement('canvas');
  }

  // Keep the size of the tint canvas up-to-date
  if (img.tintCanvas.width !== img.canvas.width) {
    img.tintCanvas.width = img.canvas.width;
  }
  if (img.tintCanvas.height !== img.canvas.height) {
    img.tintCanvas.height = img.canvas.height;
  }

  // Goal: multiply the r,g,b,a values of the source by
  // the r,g,b,a values of the tint color
  const ctx = img.tintCanvas.getContext('2d');

  ctx.save();
  ctx.clearRect(0, 0, img.canvas.width, img.canvas.height);

  if (this._tint[0] < 255 || this._tint[1] < 255 || this._tint[2] < 255) {
    // Color tint: we need to use the multiply blend mode to change the colors.
    // However, the canvas implementation of this destroys the alpha channel of
    // the image. To accommodate, we first get a version of the image with full
    // opacity everywhere, tint using multiply, and then use the destination-in
    // blend mode to restore the alpha channel again.

    // Start with the original image
    ctx.drawImage(img.canvas, 0, 0);

    // This blend mode makes everything opaque but forces the luma to match
    // the original image again
    ctx.globalCompositeOperation = 'luminosity';
    ctx.drawImage(img.canvas, 0, 0);

    // This blend mode forces the hue and chroma to match the original image.
    // After this we should have the original again, but with full opacity.
    ctx.globalCompositeOperation = 'color';
    ctx.drawImage(img.canvas, 0, 0);

    // Apply color tint
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = `rgb(${this._tint.slice(0, 3).join(', ')})`;
    ctx.fillRect(0, 0, img.canvas.width, img.canvas.height);

    // Replace the alpha channel with the original alpha * the alpha tint
    ctx.globalCompositeOperation = 'destination-in';
    ctx.globalAlpha = this._tint[3] / 255;
    ctx.drawImage(img.canvas, 0, 0);
  } else {
    // If we only need to change the alpha, we can skip all the extra work!
    ctx.globalAlpha = this._tint[3] / 255;
    ctx.drawImage(img.canvas, 0, 0);
  }

  ctx.restore();
  return img.tintCanvas;
};
