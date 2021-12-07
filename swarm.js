/*
 * little swarms inside each square, with a wasp that can move freely
 */
sketches.push(function () {

let max_v = 1000;
let max_a = 1500;

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
	this.vx = 0;
	this.vy = 0;
	this.max_a = max_a;
	this.max_v = max_v;
	this.size = 3;
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
	this.vx = clamp(this.vx + dvx, -this.max_v, this.max_v); // + random(-1,1));
	this.vy = clamp(this.vy + dvy, -this.max_v, this.max_v); // + random(-1,1));
	this.x += dt * this.vx;
	this.y += dt * this.vy;

	//console.log(dt, dx, dy, dvx, dvy);

	// bounce off the walls
	if (this.x < 0 || this.x > this.w)
	{
		this.x -= dt * this.vx;
		this.vx = -this.vx;
	}
	if (this.y < 0 || this.y > this.h)
	{
		this.y -= dt * this.vy;
		this.vy = -this.vy;
	}
}
}

class Swarm
{
constructor(n,w,h)
{
	this.w = w;
	this.h = h;
	this.last = Now();

	this.bees = [];
	for(let i = 0 ; i < n ; i++)
		this.bees.push(new Bee(w,h));

	// the wasp is not velocity limited
	this.wasp = new Bee(w,h);
	this.wasp.size = 10;
	this.wasp.max_a = 10000;
	this.wasp.max_v = 150;
	this.tx = w/2;
	this.ty = h/2;
}
draw()
{
	this.wasp.draw();

	for(let bee of this.bees)
		bee.draw();
}
step()
{
	const now = Now();
	const dt = (now - this.last) / 1000000;

	// pick a new random wasp location?
	if ((now - this.wasp.birth) > random(1000,10000))
	{
		this.wasp.birth = now;
		this.tx = random(0,this.w);
		this.ty = random(0,this.h);
		console.log(this.wasp);
	}

	this.wasp.step(this.tx, this.ty, dt);

	for(let bee of this.bees)
		bee.step(this.wasp.x,this.wasp.y,dt);
}
}

	

//let swarm = new Swarm(20,width,height);
let swarm = new Swarm(20,1920,1080);
console.log(swarm);

return function()
{
	background(0,10);

	fill(255);
	strokeWeight(1);
	stroke(80);

	swarm.step();
	swarm.draw();
}});
