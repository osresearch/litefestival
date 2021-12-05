let Truchet = function() {
let c1;
let c2;
let t = 0;

function truchet_tile(x,y,s)
{
	//const v = noise(t/2,sin(t) + x/100,cos(t) + y/100);
	//const v = noise(t/2, sin(t) + x/150,cos(t) + y/150);
	//const v = noise(t/2, x/150, y/150);
	const v = noise(sin(t) + cos(t/2), x/150 + t/2, y/150);

	noFill();
	stroke(lerpColor(c1, c2, noise(t/2,x/300 - t/2,y/300)));
	//stroke(lerpColor(c1, c2, v));
	strokeWeight(s/10);

	if (v < 0.5)
	{
		const mx = s * 4 * v * v * v;
		beginShape();
		vertex(x, y + s/2);
		vertex(x + mx, y + mx);
		vertex(x+s/2, y);
		endShape();

		beginShape();
		vertex(x+s/2, y+s);
		vertex(x + s - mx, y + s - mx);
		vertex(x+s, y+s/2);
		endShape();
	} else {
		const mx = s * (1 - v) * (1 - v) * (1-v) * 4;
		beginShape();
		vertex(x, y + s/2);
		vertex(x + mx, y + s - mx);
		vertex(x+s/2, y + s);
		endShape();

		beginShape();
		vertex(x+s/2, y);
		vertex(x + s - mx, y + mx);
		vertex(x+s, y+s/2);
		endShape();
	}

}

function truchet(x,y,w,h,c)
{
	push();
	const s = w / 4;
	noFill();
	for(let dx = 0 ; dx < w ; dx += s)
		for(let dy = 0 ; dy < h ; dy += s)
			truchet_tile(x+dx,y+dy,s,c);
	pop();
}

return class {
constructor() {
	c1 = color(256,256,256);
	c2 = color(0,20,250);
}

draw()
{
	background(0,30);
	noStroke();

	const s = 32;
	//translate(s*sin(t), s*cos(t));
	noFill();
	strokeJoin(ROUND);
	strokeCap(ROUND);
	

	for(let x = -s ; x < 1920+s ; x += s)
	{
		for(let y = -s ; y < 1080+s ; y += s)
		{
			truchet_tile(x,y,s);
		}
	}

	t += 0.05;
}
}
}();
