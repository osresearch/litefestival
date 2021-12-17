sketches.push(function(){

const squareLife = 200;

const oSquares = [];

let width = 1920;
let height = 1080;
let squareWidth = width * .1;   // the squares
let squareHeight = height * .1; // the squares
let spacing = width * .2;       // spacing between the squares
  
let redColor = color(255, 0, 0);
let yellowColor = color(255, 255, 0);
  
let stars = createGraphics(width, height);
stars.background(0, 0, 0);


class FireSquare {
  constructor(x, y){
    this.x = x;
    this.y = y;  
    this.speed = map(abs(width / 4 - this.x), 150, 0, 1, 3);
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

return function() {
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

draw_qrcode("sophi", rect_w/2, 80);
}

});
