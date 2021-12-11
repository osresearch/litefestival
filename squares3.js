sketches.push(function(){

let squareWidth;
let squareHeight;
let spacing;
const squareLife = 100;

const oSquares = [];

let redColor;
let yellowColor;
let stars;

function setup() {
  createCanvas(500, 500);
  
  squareWidth = width * .1;   // the squares
  squareHeight = height * .1; // the squares
  spacing = width * .2;       // spacing between the squares
  
  redColor = color(255, 0, 0);
  yellowColor = color(255, 255, 0);
  
  stars = createGraphics(width, height);
  stars.background(0, 0, 0);
}

function draw() {
  image(stars, 0, 0);
  

  if(random(1) < .75){
    const x = randomGaussian(width / 2, spacing);
    oSquares.push(new FireSquare(x, height * .75));
  }
  
  for(let i = oSquares.length - 1; i >= 0; i--) {
    const fireSquare = oSquares[i];
    fireSquare.draw();
    
    if(fireSquare.y < squareHeight || fireSquare.life < 0){
      oSquares.splice(i, 1);
    }
  }
}


class FireSquare {
  constructor(x, y){
    this.x = x;
    this.y = y;  
    this.speed = map(abs(width / 2 - this.x), 150, 0, 1, 3);
    this.color = lerpColor(redColor, yellowColor, random(1)); //lerpColor(c1, c2, amt)
    this.life = squareLife;
    this.sinOffset = random(1000);
  }
  
  draw(){

    this.x += sin(this.sinOffset + frameCount * .05);
    this.y -= this.speed;
    this.life--;

    const alpha = map(this.life, 0, squareLife * .5, 0, 255);
    fill(red(this.color),
         green(this.color),
         blue(this.color),
         alpha);
    stroke(0, alpha); 
    rect(this.x, this.y, squareWidth, squareHeight, 5);
  }
}
 } 
