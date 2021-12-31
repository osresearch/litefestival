sketches.push(function () {
  let fireworks = [];

  const fireworkBaseColors = [
    color(206, 32, 41),
    color(255, 252, 175),
    color(255, 225, 124),
    color(255, 102, 75),
    color(144, 56, 67),
  ];

  const fireworkColors = [
    color(206, 32, 41),
    color(255, 252, 175),
    color(255, 225, 124),
    color(255, 102, 75),
    color(144, 56, 67),
    color(23, 56, 183),
    color(51, 64, 219),
    color(80, 77, 244),
    color(222, 91, 248),
    color(239, 232, 255),
    color(167, 107, 254),
    color(247, 37, 133),
    color(181, 23, 158),
    color(114, 9, 183),
    color(86, 11, 173),
    color(72, 12, 168),
    color(58, 12, 163),
    color(63, 55, 201),
    color(67, 97, 238),
    color(72, 149, 239),
    color(76, 201, 240),
  ];

  const randomColor = (a) => a[Math.floor(Math.random() * a.length)];

  class Firework {
    constructor() {
      this.pos = {
        x: 1280,
        y: 1920 * Math.random(),
        x_final: 600 * Math.random(),
      };
      this.timing = {
        explode: 5,
        explosionFadeOut: 40,
        pauseBeforeBurst: 10,
        burst: 70,
        final: 30,
      };
      this.colors = {
        base: randomColor(fireworkBaseColors),
        afterBurst: randomColor(fireworkColors),
      };
      this.finished = false;
      this.size = 10;
      this.afterBurstSize = 70;
    }

    shootUp() {
      fill(this.colors.base);
      rect(this.pos.y, this.pos.x, this.size, this.size * 10);
      this.pos.x = this.pos.x - 20;
    }
    explode() {
      fill(this.colors.base);
      circle(
        this.pos.y + 5,
        this.pos.x + 5,
        20 - (this.timing.explode - 5) * 40
      );
    }
    explosionFadeOut() {
      fill(this.colors.base);
      circle(
        this.pos.y + 5,
        this.pos.x + 5,
        20 + this.timing.explosionFadeOut * 5
      );
    }
    burst() {
      if (this.timing.burst % 3 === 0) {
        fill(this.colors.afterBurst);
        circle(
          this.pos.y + 5 + 200 * (Math.random() - 0.5),
          this.pos.x + 5 + 200 * (Math.random() - 0.5),
          this.timing.burst
        );
      }
    }
    draw() {
      if (this.pos.x > this.pos.x_final) {
        this.shootUp();
      } else if (this.timing.explode > 0) {
        this.timing.explode--;
        this.explode();
      } else if (this.timing.explosionFadeOut > 0) {
        this.timing.explosionFadeOut--;
        this.explosionFadeOut();
      } else if (this.timing.pauseBeforeBurst > 0) {
        this.timing.pauseBeforeBurst--;
      } else if (this.timing.burst > 0) {
        this.timing.burst--;
        this.burst();
      } else {
        if (this.timing.final === 0) {
          this.finished = true;
        }
        this.timing.final--;
      }
    }
  }

  // some starting fireworks
  [0, 500, 1000, 1200, 1800].forEach((x) => {
    setTimeout(() => {
      fireworks.push(new Firework());
    }, x);
  });

  return function () {
    blendMode(DIFFERENCE);
    background(10);
    blendMode(BLEND);
    fireworks.forEach((firework, index) => {
      firework.draw();

      if (firework.finished) {
        delete fireworks[index];
        fireworks.push(new Firework());
      }
    });

    draw_qrcode("jimmylightbulb", rect_w / 2, 1080 - 80);
  };
});
