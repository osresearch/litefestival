sketches.push(function() {
// objects to be drawn
let rects = [];
let colors = [];
let bright = 3;


//const smooth = 128; // slow, but noticable
//let smooth = 128;

// valid horizontal steps
const dividers = [
	0,
	204,
	504,
	708,
	1047,
	1249,
	1550,
	1752,
];

const h_dividers = [
	0,
	372,
	736,
];

const rect_w = 175;
const rect_h = 336;

class Spinner
{
constructor(x,y,w,h) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.t = 20;
	this.color = color(random(255), random(80), random(255));
}

draw()
{
	push();
	translate(this.x, this.y);
	let t = this.t;
	this.t += this.speed;
	if (t > 10)
	{
		this.t = 0;
		this.speed = random(0.01,0.1);
		this.new_color = color(random(30,255), random(60), random(40,255));
	}

	if (t > 1)
		t = 0;

	noStroke();

	this.color = lerpColor(this.color, this.new_color, 0.05);
	fill(this.color);

	beginShape();
	vertex(0, t * this.h);
	vertex(t * this.w, this.h);
	vertex(this.w, (1-t) * this.h);
	vertex((1-t) * this.w, 0);
	endShape();


	pop();
}

}

let tx = 0;
let ty = 0;


for(let x of dividers)
{
	for(let y of h_dividers)
	{
		rects.push(new Spinner(x,y,rect_w, rect_h));
	}
}


return function()
{
	background(0);

	//translate(-width/2, -height/2);

	for(let s of rects)
		s.draw();

	draw_qrcode("qrs");
}
});
