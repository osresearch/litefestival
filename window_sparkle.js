//by Adelle Lin @adellelin
//using https://osresearch.github.io/p5.projection/

sketches.push(function(){

    // setup code goes here
    let maxParticleSize = 15;
    let particleSize_2 = 10;
    let particles = [];
    let particlesWithTrails = [];
    var pos_startMillis;
    var pos_life = 10000;
    var minLife = 3000;
    var maxLife = 15000;
    var buffferMin = 5;
    var bufferMax = 80;
    let x_coords= [0, 204, 504, 708, 1047, 1249, 1550, 1752];
    let y_coords = [0, 372, 745];
    let pane_x_id = 0
    let pane_y_id = 0
    let rect_w = 175;
    let rect_h = 336;
    var radius = 80;
    update_circle_position()
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
          // keep track of which pane each particle is in
          this.pane_id = [pane_x_id, pane_y_id];
        }
      
        move() {
          this.position = this.position.map((a, i) => a + this.speed[i])
          if (this.position[0] <= 0) this.speed[0] *= -1;
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
          let particleSize = random(2, maxParticleSize)
          push();
          // random particle sizes
          ellipse(this.position[0], this.position[1], particleSize)
          pop();
      }
      
      displayTrail() {
        let trails_bound_l = x_coords[this.pane_id[0]]
        let trails_bound_b = y_coords[this.pane_id[1]]
        let trails_bound_w = trails_bound_l + rect_w 
        let trails_bound_h = trails_bound_b + rect_h
        this.position = this.position.map((a, i) => a + this.speed[i])
        if (this.position[0] <= trails_bound_l) this.speed[0] *= -1;
        if (this.position[0] >= trails_bound_w) this.speed[0] *= -1;
        if (this.position[1] <= trails_bound_b) this.speed[1] *= -1;
        if (this.position[1] >= trails_bound_h) this.speed[1] *= -1;
        
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
          var angle = Math.PI * random(0,2)
          var theta = Math.PI * random(0,2)
          this.position = [(Math.cos(angle) * Math.sin(theta) * radius * 0.1) + circle_trails_w,  
                           (Math.sin(angle) * Math.sin(theta) * radius * 0.1) + circle_trails_h]
        }
      
        randomPosition() {
          this.position = [Math.floor(Math.random() * width), 
                           Math.floor(Math.random() * height)];  
        }
      }
      
    function update_circle_position() {
      // sets the pane for which the splashes are generated and contained
      pane_x_id = Math.floor(random(0, x_coords.length)) // % x_coords.length
      pane_y_id = Math.floor(random(0, y_coords.length)) // % y_coords.length
      circle_trails_w = x_coords[pane_x_id] + rect_w / 2
      circle_trails_h = y_coords[pane_y_id] + rect_h / 2
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
        // blendMode(BLEND);
        var st = millis()
        //Move and display particles
        particles.forEach((particle) => {
          particle.move();
          particle.display();
        });
      
        particlesWithTrails.forEach((particle) => {
          if (particle.displayTrailbool) {
            particle.fillBuffer();
            particle.displayTrail()
          }
      
          var t = particle.timer()
          // if we have passed t=1 then particle dies
          if (t > 1) {
              particle.pane_id = [pane_x_id, pane_y_id]
              particle.circlePosition();
              particle.startMillis = null;
            }
        });
      
        // cicle where emission begins
        push();
        stroke(255, 72, 155, 200);
        strokeWeight(5);        
        ellipse(x_coords[pane_x_id] + rect_w /2, y_coords[pane_y_id] + rect_h /2, radius);
        pop();
        
        // move position of circle trails based on timer
        circle_timer();

        draw_qrcode("adelle");

      }
    });
