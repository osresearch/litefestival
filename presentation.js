let a, b;
let mat = new ProjectionMatrix(null,null,"lites2021");
let ag, bg;
let t = 0;

let sketches = [];
let art = [];
let pg = [];
let a_art = 0;
let b_art = 1;

let hold_time = 20e3; // ms
let fade_time =  5e3;

let start = 0;

function setup()
{
	createCanvas(displayWidth, displayHeight, WEBGL);
	frameRate(25);

	for(let sketch of sketches)
	{
		art.push(sketch());
		pg.push(createGraphics(1920,1080));
	}

	mat.load();
	mat.edit = 1;
}

function draw()
{
	const now = new Date().getTime();
	const t = now - start;

	const orig = background(0);
	const orig_renderer = orig._renderer;

	// draw into ag
	orig._renderer = pg[a_art]._renderer;
	art[a_art]();

	// render b if we are cross fading
	if (t > hold_time)
	{
		// draw into bg
		orig._renderer = pg[b_art]._renderer;
		art[b_art]();
	}

	// switch back to the webgl renderer and
	// apply the projection mapping matrix
	orig._renderer = orig_renderer;
	mat.apply();

	if (t < hold_time)
	{
		// no cross fade
		image(pg[a_art], 0, 0);
		return;
	}

	// cross fade
	const fade = 256 * (t - hold_time) / fade_time;
	tint(256, 256 - fade);
	image(pg[a_art], 0, 0);
	tint(256, fade);
	image(pg[b_art], 0, 0);

	if (fade < 255)
		return;

	// b has fully faded in, make it the new a
	a_art = b_art;

	// and choose a new b (that is not the same as the a)
	do {
		b_art = int(random(0, art.length));
	} while (b_art == a_art);

	console.log("New art", b_art);

	// and restart the clock (in milliseconds)
	start = now;
}
