/*
 * little swarms inside each square, with a wasp that can move freely
 */
sketches.push(function () {

let rect_w = 175;
let rect_h = 336;

let x_coords = [0, 204, 504, 708, 1047, 1249, 1550, 1752, 1920];
let y_coords = [0, 372, 745, 1080];

let max_v = 400;
let max_a = 300;

let debug = false;

function clamp(x,lower,upper)
{
	if (x < lower)
		return lower;
	if (x > upper)
		return upper;
	return x;
}

function Now()
{
	return new Date().getTime();
}

class Bee
{
constructor(w,h)
{
	this.w = w;
	this.h = h;
	this.x = random(0,w);
	this.y = random(0,h);
	this.vx = random(max_v/2, max_v);
	this.vy = max_v; // random(max_v/2, max_v);
	this.max_a = max_a;
	this.max_v = max_v;
	this.size = 50;
	this.noise = max_v / 8;
	this.birth = Now();
}
draw()
{
	push();
	translate(this.x, this.y);
	rotate(atan2(this.vy, this.vx));
	beginShape();
	vertex(this.size, 0);
	vertex(0,-this.size/3);
	vertex(0,+this.size/3);
	endShape(CLOSE);
	pop();
	
	//rect(this.x - this.size/2, this.y-this.size/2, this.size, this.size);
	//line(this.x, this.y, this.x - this.vx/10, this.y - this.vy/10);
}
step(tx,ty,dt)
{
	// randomsize the bees
	const now = Now();
	const age = now - this.birth;
	if (age > random(5e3,60e3))
	{
		this.birth = now;
		this.x = random(0, this.w);
		this.y = random(0, this.h);
		this.vx = random(-this.max_v, this.max_v);
		this.vy = random(-this.max_v, this.max_v);
	}

	const dx = tx - this.x;
	const dy = ty - this.y;
	const dist2 = dx*dx + dy*dy;
	const dist = dist2 == 0 ? 1 : sqrt(dist2);

	// update velocity towards the target at max accel
	const dvx = dt * (dx * this.max_a) / dist;
	const dvy = dt * (dy * this.max_a) / dist;
	this.vx = clamp(this.vx + dvx, -this.max_v, this.max_v) + this.noise * (noise(0, this.x/100, this.y/100) - 0.5);
	this.vy = clamp(this.vy + dvy, -this.max_v, this.max_v) + this.noise * (noise(1, this.x/100, this.y/100) - 0.5);
	this.x += dt * this.vx;
	this.y += dt * this.vy;

	//console.log(dt, dx, dy, dvx, dvy);

	// bounce off the walls and slow down
	if (this.x < 0 || this.x > this.w)
	{
		this.x -= dt * this.vx;
		this.vx = -this.vx * 0.5;
	}
	if (this.y < 0 || this.y > this.h)
	{
		this.y -= dt * this.vy;
		this.vy = -this.vy * 0.5;
	}
}
}

class Swarm
{
constructor(n,x,y,w,h)
{
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.last = Now();
	this.bee_color = color(255);
	this.wasp_color = color(255,0,0);

	this.bees = [];
	for(let i = 0 ; i < n ; i++)
		this.bees.push(new Bee(w,h));

	// the wasp is not velocity limited
	this.wasp = new Bee(w,h);
	this.wasp.size *= 2;
	this.wasp.max_a = 2500;
	this.wasp.max_v = 750;
	this.wasp.noise = 200;
	this.tx = w/2;
	this.ty = h/2;
}
draw()
{
	push();
	translate(this.x, this.y);

	fill(this.wasp_color);
	this.wasp.draw();

	fill(this.bee_color);
	for(let bee of this.bees)
		bee.draw();

	pop();
}
step(tx,ty)
{
	const now = Now();
	//const dt = (now - this.last) / 1e6;
	const dt = 0.04;

	// pick a new random wasp location?
	const age = now - this.wasp.birth;

	if (age > random(2000,5000))
	{
		this.wasp.birth = now;
		this.tx = this.w * (x_coords[int(random(x_coords.length))] + rect_w/2) / 1920;
		this.ty = this.h * (y_coords[int(random(y_coords.length))] + rect_h/2) / 1080;
		if (debug)
		console.log(this.wasp);
	}

	this.wasp.step(this.tx, this.ty, dt);

	for(let bee of this.bees)
		bee.step(tx, ty, dt); // this.wasp.x,this.wasp.y,dt);
}
}

	

//let swarm = new Swarm(20,width,height);
let swarms = [];
for(let x of x_coords)
{
	for(let y of y_coords)
	{
		let swarm = new Swarm(20,x*10,y*10,rect_w*10, rect_h*10);
		swarm.bee_color = color(256 * x / 1920, 256 * (1920 - x) / 1920, 256 * y / 1080);
		swarm.wasp_color = color(256 * (1920 - x) / 1920, 256 * x / 1920, 256 * (1080 - y) / 1080);
		swarms.push(swarm);
	}
}

// create a swarm that just has a wasp in it
let wasp = new Swarm(0,0,0,1920*10,1080*10);
wasp.wasp.max_v = 600;
wasp.wasp.size = 300;

return function()
{
	// this is the only way to get it to go solid back
	blendMode(DIFFERENCE);
	background(3);

	blendMode(BLEND);

	push();

	scale(0.1);
	fill(255);
	noStroke();

	debug = true;
	wasp.step();
	debug = false;

	const tx = wasp.wasp.x;
	const ty = wasp.wasp.y;

	for(let swarm of swarms)
	{
		if (swarm.x < tx && tx < swarm.x + swarm.w
		&&  swarm.y < ty && ty < swarm.y + swarm.h)
		{
			// big wasp is inside the little swarm
			swarm.tx = tx - swarm.x;
			swarm.ty = ty - swarm.y;
			swarm.step(swarm.tx, swarm.ty);
		} else {
			swarm.step(swarm.wasp.x, swarm.wasp.y);
		}


		swarm.draw();
	}

	//stroke(0,0,255);
	//strokeWeight(10);
	wasp.wasp_color = color(255);

	wasp.draw();


	pop();
}});
