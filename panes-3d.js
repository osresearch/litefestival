//by Adelle Lin @adellelin
//using https://osresearch.github.io/p5.projection/

sketches.push(function(){

    let x_coords= [0, 204, 504, 708, 1047, 1249, 1550, 1752];
    let y_coords = [0, 372, 745];
    let rect_w = 162;
    let rect_h = 330;
    let stroke_weight = 4;
    let offset  = 0;
    let direction = true;
    let dice = [];
    let xSteps = width / 150 / 2 + 1;
    let ySteps = height / 150 / 2 + 1;

    function draw_pane(offset) {
        colorMode(HSB);
        for (let i = 0; i < x_coords.length; i++) {
            for (let j = 0; j < y_coords.length; j++) {
                let hue = map(i+j, -xSteps-ySteps, xSteps+ySteps, 105, 300); 
                if (hue > 360) hue -= 360;
                const c = color(
                    hue,
                    100,
                    100,
                );
                stroke(c);
                new_offset = (dice[i*j] + offset) 
                rect(x_coords[i], y_coords[j], rect_w, rect_h)
                fill(c)
                rect(x_coords[i] + new_offset, y_coords[j] + new_offset, rect_w - 2 * new_offset, rect_h - 2 * new_offset)
                line(x_coords[i], y_coords[j], x_coords[i] + new_offset, y_coords[j] + new_offset)
                line(x_coords[i] + rect_w, y_coords[j], x_coords[i] + rect_w - new_offset, y_coords[j] + new_offset)
                line(x_coords[i], y_coords[j] + rect_h, x_coords[i] + new_offset, y_coords[j] + rect_h - new_offset)
                line(x_coords[i] + rect_w, y_coords[j] + rect_h, x_coords[i] +rect_w - new_offset, y_coords[j] + rect_h - new_offset)
                noFill()
            }
        }
    }

    function roll_dice(){
        dice = []
        for (let i = 0; i < x_coords.length * y_coords.length; i++) {
            dice.push(random(-10, 20))
        }
    }

    
    // drawing code goes here
    return function(){
        background(2)

        strokeWeight(stroke_weight)
        noFill()
        
        
        draw_pane(offset)
        if (offset <= 10) {
            direction = false;
            roll_dice();
        }
        if (offset >=60){
            direction = true;
            
        }
        if (direction == true) {
            offset -= 0.2
        } else {offset += 0.2}
        draw_qrcode("adelle2");    
    }
    

});