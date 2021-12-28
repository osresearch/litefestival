sketches.push(function() {
	let rects = [];
    let rect_w = 175;
    let rect_h = 336;

    let x_coords = [0, 204, 504, 708, 1047, 1249, 1550, 1752];
    let y_coords = [0, 372, 745];

	let total_w = 1920;
	let total_h = 1080;

	let segment_size = 60; // must be a denominator of 1920, 1080
	let segment_grid_margin = 2;
	let directionChangeChance = 0.15;

	let lastUnrolling = millis();
	let allUnrolledTimer = null;

	let colors = {
		'yellow': color(255, 216, 6),
		'red': color(211, 53, 28),
		'blue': color(42, 89, 157),
		'white': color(242, 239, 222),
	};

	let colorMixes = {
		'yellow-yellow': 'white',
		'yellow-red': 'blue',
		'yellow-blue': 'red',
		'yellow-white': 'yellow',
		'red-blue': 'yellow',
		'red-yellow': 'blue',
		'red-white': 'yellow',
		'red-red': 'red',
		'blue-yellow': 'red',
		'blue-red': 'yellow',
		'blue-white': 'yellow',
		'blue-blue': 'blue',
		'white-yellow': 'yellow',
		'white-red': 'yellow',
		'white-blue': 'yellow',
		'white-white': 'yellow',
	};

	class Grid {
		constructor(size_x, size_y) {
			this.size_x = size_x;
			this.size_y = size_y;

			this.sideSegments = [];
			for(var i = segment_grid_margin; i < size_x - segment_grid_margin; i++) {
				this.sideSegments.push([i, 0]);
				this.sideSegments.push([i, this.size_y - 1]);
			}
			for(var i = segment_grid_margin + 1; i < size_y - segment_grid_margin - 1; i++) {
				this.sideSegments.push([0, i]);
				this.sideSegments.push([this.size_x - 1, i]);
			}
		}

		getRandomSideSegment() {
			return this.sideSegments[int(random(0, this.sideSegments.length - 1))];
		}

		draw() {
			for (var i = 0; i < this.size_x; i++) {
				for (var j = 0; j < this.size_y; j++) {
					push();

					translate(i * segment_size, j * segment_size);
		
					noFill();
					stroke(255, 216, 6);
		
					rect(0, 0, segment_size, segment_size);
					pop();

				}
			}
		}
	}

	class MetroLine {
		constructor(start_x, start_y, color) {
			this.color = color;
			this.visible = false;
			this.fullyUnrolled = false;

			let previousDirection = null;
			if(start_x == 0) {
				previousDirection = 'E';
			} else if(start_x == grid.size_x - 1) {
				previousDirection = 'W'
			} else if(start_y == 0) {
				previousDirection = 'S';
			} else if(start_y == grid.size_y - 1) {
				previousDirection = 'N';
			}

			this.segments = [
				new MetroSegment(start_x, start_y, previousDirection)
			];

			for (var i = 0; i < 100; i++) {
				let previousSegment = this.segments[this.segments.length - 1];
				if(previousSegment.x >= 0 && previousSegment.x <= grid.size_x && previousSegment.y >= 0 && previousSegment.y <= grid.size_y) {
					let candidateSegment = null;

					switch(previousSegment.direction) {
						case 'E':
							candidateSegment = new MetroSegment(previousSegment.x + 1, previousSegment.y, previousSegment.direction);
							break;
							
						case 'W':
							candidateSegment = new MetroSegment(previousSegment.x - 1, previousSegment.y, previousSegment.direction);
							break;
							
						case 'S':
							candidateSegment = new MetroSegment(previousSegment.x, previousSegment.y + 1, previousSegment.direction);
							break;
							
						case 'N':
							candidateSegment = new MetroSegment(previousSegment.x, previousSegment.y - 1, previousSegment.direction);
							break;
					}

					var overlapsAny = false;
					this.segments.forEach(function(segment) {
						if(segment.x == candidateSegment.x && segment.y == candidateSegment.y) {
							overlapsAny = true;
						}
					});

					if(overlapsAny) {
						break;
					}

					this.segments.push(candidateSegment);
				} else {
					break;
				}
			}
		}

		unroll() {
			this.visible = true;

			var hasInstructedUnrollingSegment = false;
			this.segments.forEach(function(segment) {
				if(!segment.visible && !hasInstructedUnrollingSegment) {
					hasInstructedUnrollingSegment = true;
					segment.visible = true;
				}
			});

			if(!hasInstructedUnrollingSegment) {
				this.fullyUnrolled = true;
			}
		}

		draw() {
			let _this = this;
			this.segments.forEach(function(segment) {
				segment.draw(_this.color);
			});
		}
	}

	class MetroSegment {
		constructor(x, y, previousDirection) {
			this.x = x;
			this.y = y;
			this.visible = false;

			if (random(0, 1) < directionChangeChance) {
				switch(previousDirection) {
					case 'E':
						this.direction = random(0, 1) < 0.5 ? 'N' : 'S';
						break;
						
					case 'W':
						this.direction = random(0, 1) < 0.5 ? 'N' : 'S';
						break;
						
					case 'S':
						this.direction = random(0, 1) < 0.5 ? 'E' : 'W';
						break;
						
					case 'N':
						this.direction = random(0, 1) < 0.5 ? 'E' : 'W';
						break;
				}
			} else {
				this.direction = previousDirection;
			}
		}

		draw(color) {
			if(!this.visible) {
				return;
			}

			push();

			translate(this.x * segment_size, this.y * segment_size);

			noStroke();

			var colorStack = [];
			for(var i = 0; i < metroLines.length; i++) {
				if(!metroLines[0].visible) {
					continue;
				}

				for(var j = 0; j < metroLines[i].segments.length; j++) {
					var segment = metroLines[i].segments[j];
					if(!segment.visible) {
						continue;
					}

					if(segment.x == this.x && segment.y == this.y) {
						colorStack.push(metroLines[i].color);
					}
				}
			}

			if(colorStack.length > 1) {
				color = colorMixes[`${colorStack[0]}-${colorStack[1]}`];
			}
			fill(colors[color]);

			rect(0, 0, segment_size, segment_size);
			pop();
		}
	}

    class Rect {
        constructor(x, y, w, h) {
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
        }

        draw() {
            push();

            translate(this.x, this.y);

			noFill();
			stroke(211, 53, 28);

			rect(0, 0, this.w, this.h);

            pop();
        }
    }

    for (let x of x_coords) {
        for (let y of y_coords)
            rects.push(new Rect(x, y, rect_w, rect_h));
    }

	let grid = new Grid(total_w / segment_size, total_h / segment_size);

	let metroLines = []

	function seed() {
		var start = [
			grid.getRandomSideSegment(),
			grid.getRandomSideSegment(),
			grid.getRandomSideSegment(),
			grid.getRandomSideSegment(),
			grid.getRandomSideSegment(),
			grid.getRandomSideSegment()
		];

		metroLines = [
			new MetroLine(start[0][0], start[0][1], 'yellow'),
			new MetroLine(start[1][0], start[1][1], 'yellow'),
			new MetroLine(start[2][0], start[2][1], 'yellow'),
			new MetroLine(start[3][0], start[3][1], 'red'),
			new MetroLine(start[4][0], start[4][1], 'blue'),
			new MetroLine(start[5][0], start[5][1], 'white'),
		];
	}

	seed();

    return function() {
        background(0);

		var shouldInstructUnrollingMetroline = (millis() - lastUnrolling) > 50;
		var allUnrolled = true;
		metroLines.forEach(function(metroLine) {
			if(!metroLine.fullyUnrolled && shouldInstructUnrollingMetroline) {
				shouldInstructUnrollingMetroline = false;
				lastUnrolling = millis();
				metroLine.unroll();
			}

			if(!metroLine.fullyUnrolled) {
				allUnrolled = false;
			}

			metroLine.draw();
		});

		if(allUnrolled && !allUnrolledTimer) {
			allUnrolledTimer = millis();
		} else if(allUnrolled && (millis() - allUnrolledTimer) > 5000) {
			allUnrolledTimer = null;
			seed();
		}
	draw_qrcode("");
    }

});
