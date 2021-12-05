//by Andy Wallace
//using https://osresearch.github.io/p5.projection/

t=0;
let mat = new ProjectionMatrix();

function setup(){
	createCanvas(w=1920,h=1080, WEBGL);
	mat.edit = true;
}

function draw(){
	t+=.003
	
	background(181,0,91);
	mat.apply();

	for(d=15;d<w*.6;d*=1.1){
		for(i=0;i<99;i++){
			a=t+TAU/99*i+d/(900+sin(t*4)*300) 
			x=mid_sin(a)*d
			y=mid_sin(a+PI/2)*d/2
			s=d/20+(abs(y)-abs(x))/20
			fill(0)
			rect(w/2+x-s/2,h/2+y-s/2,s,s)
		}
	}
}

mid_sin=n=>map(sin(n),-.5,.5,-1,1,1)

