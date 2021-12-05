sketches.push(function (){
let rects = [];
let rect_w = 175;
let rect_h = 336;

let x_coords = [0, 204, 504, 708, 1047, 1249, 1550, 1752];
let y_coords = [0, 372, 745];

class Rect
{
constructor(x,y,w,h,dir) {
	this.x = x;	
	this.y = y;
	this.w = w;
	this.h = h;
	this.t = 2;
	this.dir = dir;
	this.speed = 0;
	this.color2 = color(255,0,0);
	this.color1 = color(0,0,255);
}

draw() {
	push();
	this.t += this.speed;
	if (this.t > 1)
	{
		this.speed = random(0.01, 0.1);
		this.t = -1;
	}

	const offset = this.dir ? this.t : -this.t;
	// noise(this.t, this.x, this.y);

	noStroke();
	translate(this.x, this.y);

	for(let y = 0 ; y < this.h ; y += 2)
	{
		let d = y/this.h + offset;
		if (d > 1)
			fill(lerpColor(this.color2, this.color1, d - 1));
		else
		if (d > 0)
			fill(lerpColor(this.color1, this.color2, d));
		else
			fill(lerpColor(this.color2, this.color1, d + 1));
		rect(0, y, this.w, 2);
	}

	pop();
}
}

let dir = true;

for(let x of x_coords)
{
	dir = !dir;
	for(let y of y_coords)
		rects.push(new Rect(x,y, rect_w, rect_h, dir));
}

return function()
{
	background(0);

	for(let r of rects)
		r.draw();

}
});
