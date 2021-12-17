sketches.push(function (){
let rects = [];
let rect_w = 175;
let rect_h = 336;

let x_coords = [0, 204, 504, 708, 1047, 1249, 1550, 1752];
let y_coords = [0, 372, 745];

let last_x = 0;
let last_y = 0;

return function()
{
	// this is the only way to get it to go solid back
	blendMode(DIFFERENCE);
	background(2);

	blendMode(BLEND);

	if (random() < 0.05)
	{
		last_x = x_coords[int(random(x_coords.length))];
		last_y = y_coords[int(random(y_coords.length))];
	}

	fill(255, 20);
	rect(last_x,last_y, rect_w, rect_h);

	draw_qrcode("qrs", rect_w/2, 1080-80);
}
});
