//by Andy Wallace
//using https://osresearch.github.io/p5.projection/

time_per_mode = 30 * 1000	//millis
speed = 0.01;



t=0;
let mat = new ProjectionMatrix();

cell_w = 177
cell_h = 364

num_cols = 8
num_rows = 3

num_mini_cols = 3;
num_mini_rows = 4;

mini_w = cell_w / num_mini_cols;
mini_h = cell_h / num_mini_rows;

col_pos = [0, 204, 504, 708, 1047, 1249, 1550, 1752]
row_pos = [0, 372, 765]

mode = 0

next_mode_switch = time_per_mode;

function setup(){
	createCanvas(w=1920,h=1080, WEBGL);
	mat.edit = true;

	bgCol=color(213, 209, 200)
	blackCol=color(45, 45, 45)
}

function draw(){

	t+=speed 
	s=50
	noStroke()
	background(bgCol)

	mat.apply();

	if (millis() > next_mode_switch){
		mode++;
		if (mode>1)	mode =0
		next_mode_switch = millis() + time_per_mode
	}
	

	for (c=0; c<num_cols; c++){
		for (r=0; r<num_rows; r++){
			for(c2=0; c2<num_mini_cols; c2++){
				for (r2=0; r2<num_mini_rows; r2++){
					x = col_pos[c] + c2 * mini_w
					y = row_pos[r] + r2 * mini_h

					p=(t + (x+y)*.0025)%2-1

					//p = t%2 - 1
					//p = 0.55

					offset = p * 8;

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
					    		x1 = map(p, -1, -0.5, 0, mini_w, true)
					    		y1 = 0

					    		x2 = 0
					    		y2 = map(p, -1, -0.5, 0, mini_h, true)

					    		vertex(x1,y1)
					    		vertex(x2,y2);
					    	}
					    	else{
					    		vertex(mini_w, 0)

					    		x1 = mini_w
					    		y1 = map(p, -0.5, 0, 0, mini_h, true)

					    		x2 = map(p, -0.5, 0, 0, mini_w, true)
					    		y2 = mini_h

					    		vertex(x1,y1)
					    		vertex(x2,y2);

					    		vertex(0, mini_h)
					    	}
					    }
					    else{
					    	vertex(mini_w, 0)

					    	if (p < 0.5){
					    		vertex(0, 0)

					    		x1 = 0
					    		y1 = map(p, 0, 0.5, mini_h, 0, true)

					    		x2 = map(p, 0, 0.5, 0, mini_w, true)
					    		y2 = mini_h

					    		vertex(x1,y1)
					    		vertex(x2, y2)

					    		vertex(mini_w, mini_h)
					    	}

					    	else{
					    		x1 = map(p, 0.5, 1, 0, mini_w, true)
					    		y1 = 0

					    		x2 = mini_w
					    		y2 = map(p, 0.5, 1, mini_h, 0, true)

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
