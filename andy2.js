//by Andy Wallace
//using https://osresearch.github.io/p5.projection/

sketches.push(function() {
let t=0;
let mid_sin=n=>map(sin(n),-.5,.5,-1,1,1)

return function (){
	t+=.003
	
	background(181,0,91);

	for(let d=15;d<width*.6;d*=1.1){
		for(let i=0;i<99;i++){
			let a=t+TAU/99*i+d/(900+sin(t*4)*300) 
			let x=mid_sin(a)*d
			let y=mid_sin(a+PI/2)*d/2
			let s=d/20+(abs(y)-abs(x))/20
			fill(0)
			rect(width/2+x-s/2,height/2+y-s/2,s,s)
		}
	}
}
});
