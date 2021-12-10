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

let hold_time = 60e3; // ms
let fade_time =  3e3;

let start = 0;
let qr_qrs;
let qr_andy;
let authors = {};

let fading = false;
let paused = false;

function preload()
{
	authors["qrs"] = loadImage('qrs.png');
	authors["andy"] = loadImage('andy.png');
	authors["holly"] = loadImage('holly.png');
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
	if (!(author in authors))
		return;

	// add the author qr code
	push();
	translate(x+128/2,y - 128/2);
	scale(-1,1);
	image(authors[author], 0, 0, 128, 128);
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

	// draw into ag
	fading = false;
	orig._renderer = a_pg._renderer;
	if (!paused)
	{
		push();
		art[a_art]();
		pop();
	}

	// render b if we are cross fading
	if (!paused && t >= hold_time && art.length != 1)
	{
		// draw into bg
		if (!b_pg)
		{
			b_pg = createGraphics(1920,1080);
			b_pg.background(0);
		}

		orig._renderer = b_pg._renderer;
		push();
		art[b_art]();
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
