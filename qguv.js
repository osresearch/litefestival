sketches.push(function() {
/* canvas background */

const resolution = 512;
const separation = 64;
const sprite_border = 7;
const echoes = 4;
const sprite_size = 180;
const alpha_fade = 0.4;
const initial_scale = 1;
const fallback_amount = 0.87;
const rainbow_pixel_diff = 0.001;
const framerate = 24;
const frame_time_ms = 1000 / framerate;
const rainbow_speed_ms = 10000;
const fallback_speed_ms = 5000;
const fade_in_fraction = 0.3;
const x_cheat = -25;
const y_cheat = 0;
const redness = 3;
const greenness = 1;
const blueness = 1;

let x_coords = [0, 204, 504, 708, 1047, 1249, 1550, 1752];
let y_coords = [0, 372, 745];

let frame = 0;
let last_time = 0;

let canvas;
let sprite = createImage(sprite_size, sprite_size);


function min(x, y) {
    return y < x ? y : x;
}

function max(x, y) {
    return y > x ? y : x;
}

function frac(x) {
    return x - Math.trunc(x);
}

function psin(offset) {
    const radians = offset * 2 * Math.PI;
    return Math.sin(radians);
}

function rgb(hue_period) {
    return [
        min(Math.floor((psin(hue_period) + 1) * (redness * 128)), 255),
        min(Math.floor((psin(hue_period + (1/3)) + 1) * (greenness * 128)), 255),
        min(Math.floor((psin(hue_period + (2/3)) + 1) * (blueness * 128)), 255),
    ];
}

function draw_sprite(now) {
    sprite.loadPixels();

    let period = now / rainbow_speed_ms;
    for (let x = 0; x < sprite_size; x++) {
        for (let y = 0; y < sprite_size; y++) {
            let [r, g, b] = rgb(period + (rainbow_pixel_diff * x) + (rainbow_pixel_diff * y));

            if (x < sprite_border || y < sprite_border || sprite_size - x <= sprite_border || sprite_size - y <= sprite_border) {
                b = min(b + 64, 255);
            }

            const i = (y * sprite_size + x) * 4;
            sprite.pixels[i + 0] = r;
            sprite.pixels[i + 1] = g;
            sprite.pixels[i + 2] = b;
            sprite.pixels[i + 3] = 255;
        }
    }

    sprite.updatePixels();
}

function sprite_alpha(alpha) {
    sprite.loadPixels();

    for (let i = 3 ; i < sprite_size * sprite_size * 4 ; i += 4)
            sprite.pixels[i] = alpha;
    sprite.updatePixels();
}


return function (now) {
    const [w, h] = [1920,1080];
    //const ctx = drawingContext;

    //ctx.globalCompositeOperation = 'lighter';

    draw_sprite(now);

    background(0, 10);
    //background(0);
    //blendMode(LIGHTEST);

    for (let i = echoes; i >= 0; i--) {
        push();

        const anim = frac(now / fallback_speed_ms);
        const fade_in = anim / fade_in_fraction;

        let alpha = Math.pow(alpha_fade, i + anim);

        if (i == 0 && fade_in < 1) {
            alpha *= fade_in;
        }

        tint(255, alpha * 255);
	//sprite_alpha(alpha*512);

        const fallback = Math.pow(fallback_amount, i + anim) * initial_scale;
        scale(fallback, fallback);
        translate(
            Math.floor(w * (1 - fallback) / 2),
            Math.floor(h * (1 - fallback) / 2),
        );

        //for (let x = x_cheat; x < w; x += sprite_size + separation) {
            //for (let y = y_cheat; y < h; y += sprite_size + separation) {
		//console.log(x,y);


	for(let x of x_coords)
	{
		for(let y of y_coords)
		{
			image(sprite, x-20, y + 50);
		}
        }

        pop();
    }
}
});
