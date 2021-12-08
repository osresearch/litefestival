sketches.push(function() {
let rects = [];
let rect_w = 175;
let rect_h = 336;

let x_coords = [0, 204, 504, 708, 1047, 1249, 1550, 1752, 1920];
let y_coords = [0, 372, 745, 1080];


const segments = [
	[0,0, 1,0], // 0
	[1,0, 1,1], // 1
	[1,1, 1,2], // 2
	[1,2, 0,2], // 3
	[0,2, 0,1], // 4
	[0,1, 0,0], // 5
	[0,1, 1,1], // 6
];


const digits = [
	[ 0, 1, 2, 3, 4, 5], // 0
	[ 1, 2 ], // 1
	[ 0, 1, 6, 4, 3 ], // 2
	[ 0, 1, 2, 3, 6 ], // 3
	[ 5, 6, 1, 2 ], // 4
	[ 0, 5, 6, 2, 3 ], // 5
	[ 0, 5, 6, 2, 3, 4 ], // 6
	[ 0, 1, 2 ], // 7
	[ 0, 1, 2, 3, 4, 5, 6 ], // 8
	[ 6, 5, 0, 1, 2 ], // 9
];

let t = 0;

function draw_digit(pos, val)
{
	const x_base = x_coords[pos * 2] + rect_w / 2;
	const y_base = rect_h / 2;
	const c1 = color(0xf7,0x65,0xa3); // color(0,0,255);
	const c2 = color(0x16, 0x5b, 0xfa); //color(255,0,0);
	push();
	translate(x_base, y_base);

	for(let segment of digits[int(val)])
	{
		const seg = segments[segment]
		const x0 = seg[0] * rect_w;
		const y0 = seg[1] * rect_h;
		const x1 = seg[2] * rect_w;
		const y1 = seg[3] * rect_h;;

		for(let i = 0 ; i < 16 ; i++)
		{
			const weight = i == 0 ? 1 : random(1,i*3);
			let c = lerpColor(c1, c2, sin(t + PI*weight/16)/2 + 0.5);
			//let c = lerpColor(c1, c2, sin(t + 2*PI*weight/16)/2 + 0.5);
			//stroke(256/weight,256/(weight/1),0, 256 / weight);
			c.setAlpha(256/(weight*weight));
			stroke(c);
			strokeWeight(weight * weight);

			push()
			//translate(0,0,-weight/10);
			let n = 10 * weight;
			line(
				x0 + random(-n,n),
				y0 + random(-n,n),
				x1 + random(-n,n),
				y1 + random(-n,n),
			);
			pop();
		}
	}

	pop();

	t += 0.001;
	//t += 0.01;
	if (t > 2*PI)
		t = 0;
}

return function()
{
	background(0, 20);

	//fill(0,0,0,10);
	//rect(0,0,width,height);

	const now = new Date();
	let hour = now.getHours();
	let min = now.getMinutes();
	let sec = now.getSeconds();

	//hour = min; min = sec;
	push();
	translate(1920,0);
	scale(-1,1);

	draw_digit(0, hour / 10);
	draw_digit(1, hour % 10);
	draw_digit(2, min / 10);
	draw_digit(3, min % 10);
	pop();

	draw_qrcode("qrs", rect_w/2, 1080-100);
}
});
