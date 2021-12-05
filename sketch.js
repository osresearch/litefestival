//by Andy Wallace
//using https://osresearch.github.io/p5.projection/

let Andy1 = function() {
let time_per_mode = 30 * 1000	//millis
let speed = 0.01;



let t=0;

let cell_w = 177
let cell_h = 364

let num_cols = 8
let num_rows = 3

let num_mini_cols = 3;
let num_mini_rows = 4;

let mini_w = cell_w / num_mini_cols;
let mini_h = cell_h / num_mini_rows;

let col_pos = [0, 204, 504, 708, 1047, 1249, 1550, 1752]
let row_pos = [0, 372, 765]

let mode = 0

let next_mode_switch = time_per_mode;

let bgCol;
let blackCol;

return class {
constructor(){
	bgCol=color(213, 209, 200)
	blackCol=color(45, 45, 45)
}

draw(){

	t+=speed 
	let s=50
	noStroke()
	background(bgCol)

	if (millis() > next_mode_switch){
		mode++;
		if (mode>1)	mode =0
		next_mode_switch = millis() + time_per_mode
	}
	

	for (let c=0; c<num_cols; c++){
		for (let r=0; r<num_rows; r++){
			for(let c2=0; c2<num_mini_cols; c2++){
				for (let r2=0; r2<num_mini_rows; r2++){
					let x = col_pos[c] + c2 * mini_w
					let y = row_pos[r] + r2 * mini_h

					let p=(t + (x+y)*.0025)%2-1

					//p = t%2 - 1
					//p = 0.55

					let offset = p * 8;

					//circles
					if (mode == 0){
						if (p<0){
					      fill(bgCol);
					    }else{
					      fill(blackCol);
					    }
						rect(x,y, mini_w, mini_h)


						let circSize = p * (mini_w *0.8);
					    if (p<0){
					      fill(blackCol);
					    }else{
					      fill(bgCol);
					    }
					    push()
					    translate(0,0,5)
					    circle(x+mini_w/2, y+mini_h/2, circSize);
					    pop()
				    }

				    //triangles
				    if (mode == 1){
					    push();
	    				translate(x, y);

					    //triangles
					    noStroke();
					    fill(blackCol);
					    beginShape();

					    if (p<0){
					    	vertex(0,0)

					    	if (p< -0.5){
					    		let x1 = map(p, -1, -0.5, 0, mini_w, true)
					    		let y1 = 0

					    		let x2 = 0
					    		let y2 = map(p, -1, -0.5, 0, mini_h, true)

					    		vertex(x1,y1)
					    		vertex(x2,y2);
					    	}
					    	else{
					    		vertex(mini_w, 0)

					    		let x1 = mini_w
					    		let y1 = map(p, -0.5, 0, 0, mini_h, true)

					    		let x2 = map(p, -0.5, 0, 0, mini_w, true)
					    		let y2 = mini_h

					    		vertex(x1,y1)
					    		vertex(x2,y2);

					    		vertex(0, mini_h)
					    	}
					    }
					    else{
					    	vertex(mini_w, 0)

					    	if (p < 0.5){
					    		vertex(0, 0)

					    		let x1 = 0
					    		let y1 = map(p, 0, 0.5, mini_h, 0, true)

					    		let x2 = map(p, 0, 0.5, 0, mini_w, true)
					    		let y2 = mini_h

					    		vertex(x1,y1)
					    		vertex(x2, y2)

					    		vertex(mini_w, mini_h)
					    	}

					    	else{
					    		let x1 = map(p, 0.5, 1, 0, mini_w, true)
					    		let y1 = 0

					    		let x2 = mini_w
					    		let y2 = map(p, 0.5, 1, mini_h, 0, true)

					    		vertex(x1,y1)
					    		vertex(x2,y2)
					    	}
					    }

					    endShape(CLOSE);

				    	pop()
					}
				    
				    
				    
				}
			}
			

		}
	}

	
	// for(x=-s;x<w;x+=s){
	// 	for(y=-s;y<w;y+=s){
	// 		p=(t+(x+y)*.0025)%2-1
	// 		o=(.5+p*.5)*s*.5
	// 		fill(p>0?s:c)
	// 		rect(x+o,y+o,s,s)
	// 		fill(p>0?c:s)
	// 		circle(x+s/2,y+s/2,p*s*.9)
	// 	}
	// }
	

	
}



// t=0
// draw=_=>{
// 	createCanvas(w=500,w)
// t+=.01
// s=50
// c=color(213,209,200)
// noStroke()
// background(102,99,91)
// for(x=-s;x<w;x+=s)
// for(y=-s;y<w;y+=s){p=(t+(x+y)*.0025)%2-1
// o=(.5+p*.5)*s*.5
// fill(p>0?s:c)
// rect(x+o,y+o,s,s)
// fill(p>0?c:s)
// circle(x+s/2,y+s/2,p*s*.9)}}
// //#p5js #つぶやきProcessing
}
}();
