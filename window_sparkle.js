//by Adelle Lin @adellelin
//using https://osresearch.github.io/p5.projection/

sketches.push(function(){

    // setup code goes here
    let particleSize = 9;
    let particleSize_2 = 6;
    let particles = [];
    let particlesWithTrails = [];
    var pos_startMillis;
    var pos_life = 8000;
    var minLife = 3000;
    var maxLife = 7000;
    var buffferMin = 5;
    var bufferMax = 200;
    let x_coords= [0, 204, 504, 708, 1047, 1249, 1550, 1752];
    let y_coords = [0, 372, 745];
    let circle_x = 0
    let circle_y = 0
    let rect_w = 175;
    let rect_h = 336;
    circle_tr_h = y_coords[circle_y] + rect_h / 2
    circle_tr_w = x_coords[circle_x] + rect_w / 2
    width = 1920
    height = 1080

    class Particle {

        constructor(geometry, speed, trailsPercentage) {
          
          if (geometry === "random") {
            this.randomPosition();
            } else if (geometry === "circle") {
            this.circlePosition();
          }
          this.speed = [random(-1, 1) * speed, random(-1, 1) * speed];
          // set whether to draw trails
          this.displayTrailbool = random(0, 1) > 1 - trailsPercentage
          this.bufferMaxLength = random(buffferMin, bufferMax);
          this.particleBufffer = new Array();
          this.life = random(minLife, maxLife)
          this.startMillis = null;
        }
      
        move() {
          this.position = this.position.map((a, i) => a + this.speed[i])
          if (this.position[0] <= 0) {
            this.speed[0] *= -1;
          }
          if (this.position[0] > width) this.speed[0] *= -1;
          if (this.position[1] <= 0) this.speed[1] *= -1;
          if (this.position[1] > height) this.speed[1] *= -1;
        }
      
        fillBuffer() {
          // remove last position in buffer
          if (this.particleBufffer.length >= this.bufferMaxLength) {
            this.particleBufffer.shift()}
      
          // push current position in buffer start
          this.particleBufffer.push(this.position)
        }
      
        display() {
          noStroke();
          fill(255, 72, 155, 255);
          particleSize = random(2, 6)
          push();
          // random particle sizes
          ellipse(this.position[0], this.position[1], particleSize)
          pop();
      }
      
      displayTrail() {
          for (let i = 0; i < this.bufferMaxLength; i++) {
  
          fill(255, 165, 0, 255 * (1-i/this.bufferMaxLength));
          if (this.particleBufffer[i] === undefined) 
              continue;
          
          push();
          ellipse(this.particleBufffer[i][0], this.particleBufffer[i][1], particleSize_2 * i/this.bufferMaxLength);
          pop();
      
          }
      }
      
        timer() {
          if (this.startMillis == null) {
            this.startMillis = millis();
          }
      
          // duration in milliseconds
          var duration = this.life;
      
          // compute how far we are through the animation as a value 
          // between 0 and 1.
          var elapsed = millis() - this.startMillis;
          var t = map(elapsed, 0, duration, 0, 1);
          return t
          
        }
      
        circlePosition() {
          var radius = 50
          var angle = Math.PI * random(0,2)
          var theta = Math.PI * random(0,2)
          this.position = [(Math.cos(angle) * Math.sin(theta) * radius) + circle_tr_w,  
                           (Math.sin(angle) * Math.sin(theta) * radius) + circle_tr_h]
        }
      
        randomPosition() {
          this.position = [Math.floor(Math.random() * width), 
                           Math.floor(Math.random() * height)];  
        }
      }
      
    function update_circle_position() {
      circle_x = (circle_x + 1) % x_coords.length
      circle_y = (circle_y + 1) % y_coords.length
      circle_tr_h = y_coords[circle_y] + rect_h / 2
      circle_tr_w = x_coords[circle_x] + rect_w / 2
    }
      
      
    function circle_timer() {
      if (pos_startMillis == null) {
        pos_startMillis = millis();
      }
    
      // duration in milliseconds
      var duration = pos_life;
    
      // compute how far we are through the animation as a value 
      // between 0 and 1.
      var elapsed = millis() - pos_startMillis;
      var t = map(elapsed, 0, duration, 0, 1);
      if (t > 1) {
        update_circle_position()
        pos_startMillis = null
      }
      
    }

    for (let i = 0; i < 500; i++) {
        particles.push(new Particle('random', 0.3, 0));
    }
    for (let i = 0; i < 100; i++) {
        particlesWithTrails.push(new Particle('circle', 1, 0.6));
    }
    
    // drawing code goes here
    return function(){
        background(2);
        blendMode(BLEND);
        var st = millis()
        //Move and display particles
        particles.forEach((particle, index) => {
          particle.move();
          particle.display();
        });
      
        particlesWithTrails.forEach((particle, index) => {
          particle.move();
          if (random(0, 1) >= 0) { //sparkle
            if (particle.displayTrailbool) {
              particle.fillBuffer();
              particle.displayTrail()
            }
        
            var t = particle.timer()
            // if we have passed t=1 then particle dies
            if (t > 1) {
                particle.circlePosition();
                particle.startMillis = null;
              }
            }
        });
      
        // cicle where emission begins
        push();
        stroke(255, 72, 155, 255);
        strokeWeight(5);        
        ellipse(x_coords[circle_x] + rect_w /2, y_coords[circle_y] + rect_h /2, 80);
        pop();
        
        // move position of circle trails based on timer
        circle_timer();

        draw_qrcode("adelle");

      }
    });