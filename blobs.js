sketches.push(function(){

// setup code goes here
ArrayList<Square> squares = new ArrayList<Square>();

int num = 200;
int min = 5;
int max = 150;

/* Our object */
Square s = new Square(new PVector(random(width, width), random(height/2-num, height/2+num)), (int)random(min, max));

void setup() {
  size(640, 640);
  stroke(5);
  squares.add(s);
  frameRate (60);
}

// drawing code goes here
void draw() {
  background(0);
  for(int i = 0; i < squares.size(); i++){
      Square s = (Square) squares.get(i);
      s.draw();
  }
  
  PVector newLoc = new PVector(random(width/2-num, width/2+num), random(height/2-num, height/2+num));
  int newD = (int) random(min, max);

  if(squares.size() < 800){
    s = new Square(newLoc, newD);
    squares.add(s);
  }
}

class Square {
  PVector location;
  int d;

  Square(PVector loc, int d) {
    this.location = loc;
    this.d = d;
  } 

  void draw() {
    float r = dist(location.x, location.y, width/2, height/2);
    fill(255, random(255), random(55));
    float angle = cos(radians(r+frameCount)) * d/3;
    rect(location.x, location.y, d/3+angle, d/4+angle,7);
  }
}
};
