//by Andy Wallace
//using https://osresearch.github.io/p5.projection/

sketches.push(function() {
let t=0;
let mid_sin=n=>map(sin(n),-.5,.5,-1,1,1)

return function (){
	t+=.003

	center_x=1300
	center_y=550

	b1r = 181
	b1g = 0
	b1b = 91

	b2r = 128
	b2g = 238
	b2b = 255
	

	bg_prc = min(1, max(0, 0.5 + sin(t*0.3) * 0.65));
	br = (1.0-bg_prc)*b1r + bg_prc*b2r;
	bg = (1.0-bg_prc)*b1g + bg_prc*b2g;
	bb = (1.0-bg_prc)*b1b + bg_prc*b2b;
	
	background(br, bg, bb);
	for(d=15;d<width*.8;d*=1.1){
		for(i=0;i<99;i++){
			a=t+TAU/99*i+d/(900+sin(t*1.5)*400) 
			x=mid_sin(a)*d
			y=mid_sin(a+PI/2)*d/2
			s=d/20+(abs(y)-abs(x))/20
			fill(0)
			rect(center_x+x-s/2,center_y+y-s/2,s,s)
		}
	}


	// t+=.003
	
	// background(181,0,91);

	// for(let d=15;d<width*.8;d*=1.1){
	// 	for(let i=0;i<99;i++){
	// 		let a=t+TAU/99*i+d/(900+sin(t*4)*300) 
	// 		let x=mid_sin(a)*d
	// 		let y=mid_sin(a+PI/2)*d/2
	// 		let s=d/20+(abs(y)-abs(x))/20
	// 		fill(0)
	// 		rect(1300+x-s/2,550+y-s/2,s,s)
	// 	}
	// }

	draw_qrcode("andy");
}
});
