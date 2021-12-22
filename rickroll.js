sketches.push(function (){
let rect_w = 175;
let rect_h = 336/2 - 15;

let x_coords = [0, 204, 504, 708, 1047, 1249, 1550, 1752];
let y_coords = [
	0,
	0 + 336/2 + 15,
	372,
	372 + 336/2 + 15,
	745,
	745 + 336/2 + 15,
];


/*
async function fetch_raw(file)
{
	let raw = await fetch(file)
		.then(response => response.text());

	let bytes;
	var f = new FileReader();
	f.onload = (e) => bytes = new Uint8Array(e.target.result);
	f.readAsArrayBuffer(new Blob([raw]));

	return bytes;
}

let frames = fetch_raw("rickroll.bin");
console.log(frames);
*/
let t = 0;
let skip = 0;

return function()
{
	background(0, 10);

	for(let y of y_coords)
	{
		for(let x of x_coords)
		{
			let r = rickroll_frames.bytes[t++];
			let g = rickroll_frames.bytes[t++];
			let b = rickroll_frames.bytes[t++];

			fill(r,g,b, 80);
			rect(x, y, rect_w, rect_h);
		}
	}

	skip = (skip + 1) % 2;
	if (skip != 0)
		t -= 72 * 2;


	if (t >= rickroll_frames.bytes.length)
		t = 0;

	//draw_qrcode("qrs", rect_w/2, 1080 - rect_h/2);

	push();
	translate(1920 - rect_w/2 + 64, 1080 - rect_h/2 - 64);
	scale(-1,1);
	image(authors["rickroll"], 0, 0, 128, 128);
	pop();
}
});
