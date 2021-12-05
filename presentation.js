let a, b;
let mat = new ProjectionMatrix(null,null,"lites2021");
let ag, bg;
let t = 0;

let sketches = [];
let art = [];

function setup()
{
	createCanvas(displayWidth, displayHeight, WEBGL);
	ag = createGraphics(1920,1080);
	bg = createGraphics(1920,1080);

	for(let sketch of sketches)
		art.push(sketch());

	mat.load();
	mat.edit = 1;
}

function draw()
{
	const orig = background(0);
	const orig_renderer = orig._renderer;

	// draw into ag
	orig._renderer = ag._renderer;
	art[0]();

	// draw into ag
	orig._renderer = bg._renderer;
	art[1]();

	// copy ag and bg to the output
	orig._renderer = orig_renderer;
	mat.apply();

	tint(255, 256 * sin(t) + 128);
	image(ag, 0, 0);
	tint(255, 128 * cos(t) + 128);
	image(bg, 0, 0);

	t += 0.005;
}
