sketches.push(function() {
  const [w, h] = [1920, 1080]; // px
  const space = 120; // px
  const [min_size_aoe, max_size_aoe] = [0, 400]; // px
  const [min_size, max_size] = [10, 600]; // px
  const [min_repel, max_repel] = [0, 200]; // px
  const [min_repel_aoe, max_repel_aoe] = [350, 700]; // px
  const color_cycle_sec = 12;
  const [min_ripples, max_ripples] = [0, 2];
  const ripple_period = 17;
  const camera_movement_factor = 0.5; // [0, 1]
  const blob_movement_factor = [0.82, 0.8]; // [0, 1]

  function h2rgb(hue) {
    const h = hue / 360;
    const kr = (5+h*6) % 6;
    const kg = (3+h*6) % 6;
    const kb = (1+h*6) % 6;
    const fr = 1 - max(min(kr, 4-kr, 1), 0);
    const fg = 1 - max(min(kg, 4-kg, 1), 0);
    const fb = 1 - max(min(kb, 4-kb, 1), 0);
    return [fr * 256, fg * 256, fb * 256];
  }

  function repel(dx, dy, focus_dist) {
    if (focus_dist > max_repel_aoe) {
      return [0, 0];
    };
    const angle = atan2(dy, -dx);
    const into_cos = (
      focus_dist < max_repel_aoe
        ? map(focus_dist, 0, min_repel_aoe, -PI, 0)
        : map(focus_dist, min_repel_aoe, max_repel_aoe, 0, PI)
    );
    const scale = map(cos(into_cos), -1, 1, 0, 1);
    const amount = map(scale, 0, 1, min_repel, max_repel);
    const x_dist = amount * sin(angle);
    const y_dist = amount * cos(angle);
    return [x_dist, y_dist];
  }

  return function() {
    blendMode(REPLACE);
    background(3);
    blendMode(ADD);

    const t = millis() / 1000;
    const ripples = floor(map(
      t % ripple_period,
      0, ripple_period,
      min_ripples, max_ripples + 1,
    ));
    const [cw, ch] = [w / space + 1, h / space + 1];
    const ts = t / 10;
    let focus_x_factor = sin(ts * 7);
    let focus_x = map(
      focus_x_factor,
      -1, 1,
      (1 - blob_movement_factor[0]) * w, blob_movement_factor[0] * w,
     );
    let focus_y_factor = cos(ts * 5);
    let focus_y = map(
      focus_y_factor,
      -1, 1,
      (1 - blob_movement_factor[1]) * h, blob_movement_factor[1] * h,
    );

    /*
    // uncomment for the focal point to follow your mouse
    focus_x = mouseX;
    focus_x_factor = map(mouseX, 0, w, -1, 1);
    focus_y = mouseY;
    focus_y_factor = map(mouseY, 0, w, -1, 1);
    */

    push();
    translate(-focus_x_factor * w * camera_movement_factor / 4, -focus_y_factor * h * camera_movement_factor / 4);

    for (let i = 0; i < cw; i++) {
      for (let j = 0; j < ch; j++) {

        const x = (i + 0.5 * (j % 2)) * space;
        const y = j * space;
        const dx = focus_x - x;
        const dy = focus_y - y;
        const focus_dist = sqrt(dx * dx + dy * dy);
        const size_factor = map(focus_dist, max_size_aoe, min_size_aoe, 0, 1, true);
        const size = map(size_factor, 0, 1, min_size, max_size, true);
        const [dist_x, dist_y] = repel(dx, dy, focus_dist);

        const hue = (
          (t % color_cycle_sec) * 360 / 12
          + (
            120 * ((i + j) % 3)
          )
        ) % 360;
        const [r, g, b] = h2rgb(hue);

        if (size_factor > 0) {
          for (let i = 0; i < ripples; i++) {
            noFill();
            strokeWeight(1);
            stroke(r, g, b);
            circle(
              x + dist_x,
              y + dist_y,
              size * (3 + i * 2)/4,
            );
          }
        }

        if (size_factor == 0 || floor(ripples) != max_ripples) {
          noStroke();
          fill(r, g, b);
          circle(
            x + dist_x,
            y + dist_y,
            size / 2,
          );
        }
      }
    }

    /*
    // uncomment to show the focal point
    blendMode(DIFFERENCE);
    noFill();
    strokeWeight(5);
    stroke(255);
    line(
        focus_x - 10, focus_y - 10,
        focus_x + 10, focus_y + 10,
    );
    line(
        focus_x - 10, focus_y + 10,
        focus_x + 10, focus_y - 10,
    );
    blendMode(BLEND);
    */
    pop();

    draw_qrcode("qguv");
  }
});
