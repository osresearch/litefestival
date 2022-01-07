//by Matt Pinner
//using https://osresearch.github.io/p5.projection/

sketches.push(function(){
    let xSteps = width / 150 / 2 + 1;
    let ySteps = height / 150 / 2 + 1;
    let offset1 = 0;

    // setup code goes here
    function makeCross() {
        fill(255, 168, 25);

        noStroke();

        push();

        rectMode(CENTER);
        rect(0, 0, 150, 40);
        rect(0, 0, 40, 150);
        
        fill(0);
        rect(45, 0, 7, 50);
        fill(0);
        offset2 = random(-3,3)
        rect(-45, 0, 7, 50);
        offset3 = random(-2,2)
        rect(-63 + offset3, 0, 7, 50);

        pop();
    }

    // drawing code goes here
    return function(){
        background(2)
        for (let i = xSteps*-1; i < xSteps; i++) {
            for (let j = ySteps*-1; j < ySteps; j++) {
              push();
              translate(width/2+i*150, height/2+j*150);
              rotate(radians(90*i*j));
             
              if (1 == ((i+j) % 2)) {
                rotate(radians(frameCount));
              } else {
             rotate(radians(-1 * frameCount));
              }
        
              makeCross();
              pop();
            }
        }
        draw_qrcode("mpinner");
    }
    });