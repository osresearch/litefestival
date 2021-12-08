/*
 * Holly's snowflakes
 */
sketches.push(function() {

function Snowflake(x, num_splines, scale_size, rotation_dir) {
	this.xpos = x;
	this.num_splines = num_splines;
	this.scale_size = scale_size;
	this.rotation_dir = rotation_dir;
	this.ypos = 0;

	let speed = random(2, 6);
	let rotation_rate = 0; 
	let rotation_state = 0;
	let max_speed = 0.05;

	// snowflake spline settings
	let radius1 = random(5, 20);
	let radius2 = random(5, 20);
	let radius3 = random(5, 20);

	let pos1 = random(-25, 55);
	let pos2 = random(-25, 55);
	let pos3 = random(-25, 55);

	this.display = function() {
		push();
		fill('rgba(255, 255, 255, 0.8)');
		
		// move to the first spline position
		translate(this.xpos, this.ypos);
		this.ypos += speed;	

		// adjust rotation rate in relation to how close the mouse is
		let x_distance = mouseX - this.xpos;
		let y_distance = mouseY - this.ypos;
		let radial = sqrt(x_distance * x_distance + y_distance * y_distance);
		this.spin(radial);

		// impart spin to the snowflake
		rotate(rotation_state += rotation_rate);	

		// scale the snowflake
		scale(scale_size);

		// draw the snowflake
		for (let i = 0; i < num_splines; i++) {
			rect(-1, -10, 1, 55);
			ellipse(0, pos1, radius1, radius1);
			ellipse(0, pos2, radius2, radius2);
			ellipse(0, pos3, radius3, radius3);
			rotate(2*PI/num_splines)
		}

		pop();

		rotation_rate *= 0.97; 	// exponential decay
	}

	// rotate snowflake, speed up, and don't slow down until mouse is gone
	this.spin = function(distance) {
		if (distance < 100) { 	// if we're close
			if (abs(rotation_rate < max_speed)) {  // and rot is < max speed
				rotation_rate += max_speed * rotation_dir;
			}
		}
	}
}


let flurry = [];
let direction = [-1, 1];

return function()
{
	background(133, 138, 248);
	noStroke();
	
	// add snowflakes at random times
	if (random() < 0.20) {
		let rotation_dir = random(direction);

		flurry.push(new Snowflake(
						random(50, width - 50),
						6,
						random(0.5, 1.5),
						rotation_dir,	
					));
	}

	// clear snowflakes that have fallen below the window
	// display the rest
	for (let i = 0; i < flurry.length; i++) {
		if (flurry[i].ypos > height) { 
			flurry.splice(i, 1);	
		} else {
			flurry[i].display();
		}
	}
}
});
