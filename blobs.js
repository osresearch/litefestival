sketches.push(function(){

// setup code goes here
let squares = [];

let num = 200;
let min = 5;
let max = 150;
let width = 1920;
let height = 1080;


class Square {
constructor(x,y,d) {
  this.x = x;
  this.y = y;
  this.d = d;
}

draw() {
    const r = dist(this.x, this.y, width/2, height/2);
    fill(255, random(255), random(55));
    const angle = cos(radians(r+frameCount)) * this.d/3;
    rect(this.x, this.y, this.d/3+angle, this.d/4+angle,7);
  }
}

// drawing code goes here
return function() {
  background(0);
  stroke(5);

  for(let s of squares)
    s.draw();
  
  let newD = int(random(min, max));
  let newX = random(width/2-num, width/2+num);
  let newY = random(height/2-num, height/2+num);

  if(squares.length < 800)
    squares.push(new Square(newX, newY, newD));
}
});
