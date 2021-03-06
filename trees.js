sketches.push(function(){
class TreeNode
{
constructor(gen, alpha=255)
{
	this.min_width = 2 * gen;
	this.max_width = 5 * gen;

	this.min_len = 100;
	this.max_len = 350;

	this.min_angle = -40 * PI/180;
	this.max_angle = +10 * PI/180;

	this.child_scale = 0.8;
	this.alpha = alpha + Math.random() * 50 - 25;

	this.gen = gen;
	this.left = null;
	this.right = null;

	this.pick_next();
	this.width = this.next_width;
	this.len = this.next_len;
	this.angle = this.next_angle;
	this.next_steps = 1;

	if (gen == 0)
		return;

	this.left = new TreeNode(gen-1, alpha * 0.9);
	this.right = new TreeNode(gen-1, alpha * 0.9);
}

random(min,max)
{
	// uniform, maybe want gausian?
	return Math.random() * (max - min) + min;
}

pick_next()
{
	this.next_width = this.random(this.min_width, this.max_width);
	this.next_len = this.random(this.min_len, this.max_len);
	this.next_angle = this.random(this.min_angle, this.max_angle);
	this.next_steps = int(this.random(200, 800));
	this.lerp_speed = 1 / this.next_steps;
}

draw()
{
	if (--this.next_steps == 0)
		this.pick_next();

	this.width = lerp(this.width, this.next_width, this.lerp_speed);
	this.len = lerp(this.len, this.next_len, this.lerp_speed);
	this.angle = lerp(this.angle, this.next_angle, this.lerp_speed);

	push();

	//strokeWeight(this.width);
	noStroke();
	fill(this.alpha);
	rotate(this.angle);

	beginShape();
	vertex(-this.width, 0);
	vertex(+this.width, 0);
	vertex(+this.width/2, this.len+this.width);
	vertex(-this.width/2, this.len+this.width);
	endShape(CLOSE);
	//line(0, 0, 0, this.len);

	// avoid z-fighting
	translate(0, this.len, -this.gen);
	scale(this.child_scale);
	if (this.left)
	{
		//rotate(-30 * PI/180);
		this.left.draw();
		//rotate(+30 * PI/180);
	}

	if (this.right)
	{
		// flip the sense of the angles
		rotate(this.max_angle - this.min_angle);
		this.right.draw();
	}

	pop();
}
}

let trees = [];
let rect_w = 175;
let x_coords = [0, 204, 504, 708, 1047, 1249, 1550, 1752, 1920];

trees.push(new TreeNode(5));
trees.push(new TreeNode(6));
trees.push(new TreeNode(8));
trees.push(new TreeNode(5));
trees.push(new TreeNode(5));
trees.push(new TreeNode(8));
trees.push(new TreeNode(6));
trees.push(new TreeNode(5));

return function()
{
	background(0);

	push();

	translate(1920, 1080+10);
	rotate(PI);

	for(let i = 0 ; i < trees.length ; i++)
	{
		push();
		//translate(1920 / (trees.length+1), 0);
		translate(x_coords[i] + rect_w/2, 0);
		trees[i].draw();
		pop();
	}

	pop();

	draw_qrcode("qrs", rect_w/2, 128);
}
});
