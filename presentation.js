let a, b;
let mat = new ProjectionMatrix(null,null,"lites2021");
let ag, bg;
let t = 0;

let sketches = [];
let art = [];
let pg = [];
let a_art = 0;
let b_art = 1;

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
	const orig = background(0);
	const orig_renderer = orig._renderer;

	// draw into ag
	orig._renderer = pg[a_art]._renderer;
	art[a_art]();

	// draw into ag
	orig._renderer = pg[b_art]._renderer;
	art[b_art]();

	// copy ag and bg to the output
	orig._renderer = orig_renderer;
	mat.apply();

	let fade = t; //128 * cos(t * 2 * PI / 100) + 128;
	tint(255, 256 - fade);
	image(pg[a_art], 0, 0);
	tint(255, fade);
	image(pg[b_art], 0, 0);

	t += 1;

	// pick a new B art when B goes to zero
	if (t == 256)
	{
		a_art = b_art;
		b_art = int(random(0, art.length));
		console.log("B art", b_art);
		t = 0;
	}
}
