sketches.push(function() {
	let rects = [];
    let rect_w = 175;
    let rect_h = 336;

    let x_coords = [0, 204, 504, 708, 1047, 1249, 1550, 1752];
    let y_coords = [0, 372, 745];
    // let x_coords = [0];
    // let y_coords = [0];

	let margin = 15;
	let amountOfStellarBodies = 5;

	let images = [
		{
			imageUrl: 'whale.svg',
			width: 391,
			height: 520,
		},
		{
			imageUrl: 'star2.svg',
			width: 40,
			height: 40,
		},
		{
			imageUrl: 'star1.svg',
			width: 40,
			height: 45,
		},
		{
			imageUrl: 'planet8.svg',
			width: 498,
			height: 392,
		},
		{
			imageUrl: 'planet7.svg',
			width: 141,
			height: 144,
		},
		{
			imageUrl: 'planet6.svg',
			width: 169,
			height: 163,
		},
		{
			imageUrl: 'planet5.svg',
			width: 229,
			height: 210,
		},
		{
			imageUrl: 'planet4.svg',
			width: 248,
			height: 212,
		},
		{
			imageUrl: 'planet3.svg',
			width: 140,
			height: 138,
		},
		{
			imageUrl: 'planet2.svg',
			width: 258,
			height: 248
		},
		{
			imageUrl: 'planet1.svg',
			width: 381,
			height: 354,
		},
		{
			imageUrl: 'comet3.svg',
			width: 88,
			height: 102,
		},
		{
			imageUrl: 'comet2.svg',
			width: 83,
			height: 76,
		},
		{
			imageUrl: 'comet1.svg',
			width: 287,
			height: 172,
		}
	];

	images.forEach(function(image) {
		image.image = loadImage(`http://lights.plusx.black.s3-website.eu-central-1.amazonaws.com/images/${image.imageUrl}`);

		let ratio = ((image.width / image.height) > (rect_w / rect_h))
			? rect_w / (image.width + (2 * margin))
			: rect_h / (image.height + (2 * margin));

		if (ratio > 1) {
			ratio = 1;
		}

		image.actualWidth = image.width * ratio;
		image.actualHeight = image.height * ratio;
	});

	class StellarBody {
		constructor(image, width, height, rect) {
			this.image = image;
			this.width = width;
			this.height = height;
			this.rect = rect;

			this.isFading = false;
			this.alpha = 255;
			this.speed = random(0.5, 1.4);
		}

		draw() {
			image(this.image, this.rect.x + (rect_w - this.width) / 2, this.rect.y + (rect_h - this.height) / 2, this.width, this.height);
			
			if(this.isFading) {
				this.alpha += this.speed;
			} else {
				this.alpha -= this.speed;
			}

			if (this.alpha < 0) {
				this.isFading = true;
			}
		}
	}

    class Rect {
        constructor(x, y, w, h) {
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
			this.stellarBody = null;
        }

		drawbg(color1, color2) {
			push();

            translate(this.x, this.y);

			noStroke();

			for(let y = 0 ; y < this.h ; y += 2)
			{
				let d = y / this.h;
				if (d > 1)
					fill(lerpColor(color2, color1, d - 1));
				else if (d > 0)
					fill(lerpColor(color1, color2, d));
				else
					fill(lerpColor(color2, color1, d + 1));
				
				rect(0, y, this.w, 2);
			}

            pop();
		}

        draw() {
			let color1 = color(248, 185, 148);
			let color2 = color(241, 141, 142);

			this.drawbg(color1, color2);

			if (!this.stellarBody) {
				return;
			}

			this.stellarBody.draw();

			color1 = color(248, 185, 148, this.stellarBody.alpha);
			color2 = color(241, 141, 142, this.stellarBody.alpha);

			this.drawbg(color1, color2);
        }
    }

    for (let x of x_coords) {
        for (let y of y_coords)
            rects.push(new Rect(x, y, rect_w, rect_h));
    }

    return function() {
        background(0);

		let stellarBodyCandidates = [];

        for (let r of rects) {
            r.draw();

			// stellar body has become fully opaque and fully faded again
			if (r.stellarBody) {
				if(r.stellarBody.alpha > 255) {
					r.stellarBody = null;
					stellarBodyCandidates.push(r);
				}
			} else {
				stellarBodyCandidates.push(r);
			}
		}

		// check whether there are currently 5 stellar bodies in place
		var toBePlacedStellarBodies = stellarBodyCandidates.length - rects.length + amountOfStellarBodies;
		for (var i = 0; i < toBePlacedStellarBodies; i++) {
			let image = images[int(random(0, images.length - 1))];
			let candidate = stellarBodyCandidates[int(random(0, stellarBodyCandidates.length - 1))];
			candidate.stellarBody
				= new StellarBody(image.image, image.actualWidth, image.actualHeight, candidate);

			stellarBodyCandidates.splice(i, 1);
		}
    }
});