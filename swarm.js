/*
 * little swarms inside each square, with a wasp that can move freely
 */
sketches.push(function () {

let rect_w = 175;
let rect_h = 336;

let x_coords = [0, 204, 504, 708, 1047, 1249, 1550, 1752, 1920];
let y_coords = [0, 372, 745, 1080];

let max_v = 400;
let max_a = 800;

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
	this.vy = random(max_v/2, max_v);
	this.max_a = max_a;
	this.max_v = max_v;
	this.size = 30;
	this.noise = max_v / 4;
	this.birth = Now();
}
draw()
{
	rect(this.x - this.size/2, this.y-this.size/2, this.size, this.size);
	line(this.x, this.y, this.x - this.vx/10, this.y - this.vy/10);
}
step(tx,ty,dt)
{
	const dx = tx - this.x;
	const dy = ty - this.y;
	const dist2 = dx*dx + dy*dy;
	const dist = dist2 == 0 ? 1 : sqrt(dist2);

	// update velocity towards the target at max accel
	const dvx = dt * (dx * this.max_a) / dist;
	const dvy = dt * (dy * this.max_a) / dist;
	this.vx = clamp(this.vx + dvx, -this.max_v, this.max_v) + random(-this.noise, this.noise);
	this.vy = clamp(this.vy + dvy, -this.max_v, this.max_v) + random(-this.noise, this.noise);
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
	this.wasp.size = 50;
	this.wasp.max_a = 10000;
	this.wasp.max_v = 550;
	this.wasp.noise = 300;
	this.tx = w/2;
	this.ty = h/2;
}
draw()
{
	push();
	translate(this.x, this.y);
	scale(0.1);

	fill(this.wasp_color);
	this.wasp.draw();

	fill(this.bee_color);
	for(let bee of this.bees)
		bee.draw();

	pop();
}
step()
{
	const now = Now();
	const dt = 2 * (now - this.last) / 1e6;

	// pick a new random wasp location?
	if ((now - this.wasp.birth) > random(1000,10000))
	{
		this.wasp.birth = now;
		this.tx = this.w * random(); // (random(2) > 1 ? 0.75 : 0.25);
		this.ty = this.h * random(); // (random(2) > 1 ? 0.75 : 0.25);
		console.log(this.wasp);
	}

	this.wasp.step(this.tx, this.ty, dt);

	for(let bee of this.bees)
		bee.step(this.wasp.x,this.wasp.y,dt);
}
}

	

//let swarm = new Swarm(20,width,height);
let swarms = [];
for(let x of x_coords)
{
	for(let y of y_coords)
	{
		let swarm = new Swarm(20,x,y,rect_w*10, rect_h*10);
		swarm.bee_color = color(256 * x / 1920, 256 * (1920 - x) / 1920, 256 * y / 1080);
		swarms.push(swarm);
	}
}

return function()
{
	background(0,20);

	fill(255);
	strokeWeight(5);
	stroke(80);

	for(let swarm of swarms)
	{
		swarm.step();
		swarm.draw();
	}
}});
