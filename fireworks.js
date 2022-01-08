sketches.push(function () {
  const width = 1920;
  const height = 1280;
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
  const arrowStartTimings = [0, 1000, 2000, 5000, 500, 300, 350, 550 ];
  let positionBuckets = new Array(arrowStartTimings.length).fill(false);

  const randomColor = (a) => a[Math.floor(Math.random() * a.length)];
  class Firework {
    constructor(positionBucket) {
      this.positionBucket = positionBucket;
      const bucketCenter =
        960 / arrowStartTimings.length +
        (positionBucket * 1920) / arrowStartTimings.length;
      const bucketPosNoise =
        (960 / positionBuckets.length) * (Math.random() - 0.5);
      this.pos = {
        y: 1280,
        x: bucketCenter + bucketPosNoise,
        y_final: 900 * Math.random(),
      };
      this.timing = {
        explode: 5,
        explosionFadeOut: 25,
        pauseBeforeBurst: 0,
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
      rect(this.pos.x, this.pos.y, this.size, this.size * 10);
      this.pos.y = this.pos.y - 15;
    }
    explode() {
      fill(this.colors.base);
      circle(
        this.pos.x + 5,
        this.pos.y + 5,
        20 - (this.timing.explode - 5) * 40
      );
    }
    explosionFadeOut() {
      fill(this.colors.base);
      circle(
        this.pos.x + 5,
        this.pos.y + 5,
        20 + this.timing.explosionFadeOut * 8
      );
    }
    burst() {
      if (this.timing.burst % 2 === 0) {
        fill(this.colors.afterBurst);
        circle(
          this.pos.x + 5 + 350 * (Math.random() - 0.5),
          this.pos.y + 5 + 350 * (Math.random() - 0.5),
          Math.floor(this.timing.burst / 2)
        );
      }
    }
    draw() {
      if (this.pos.y > this.pos.y_final) {
        this.shootUp();
      } else if (this.timing.explode > 0) {
        this.timing.explode--;
        this.explode();
      } else if (this.timing.explosionFadeOut > 0) {
        this.timing.explosionFadeOut--;
        this.explosionFadeOut();
      }

      if (this.timing.explosionFadeOut < 5) {
        if (this.timing.burst > 0) {
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
  }

  // some starting fireworks
  arrowStartTimings.forEach((x, i) => {
    setTimeout(() => {
      fireworks.push(new Firework(i));
    }, x);
  });

  return function () {
    //blendMode(DIFFERENCE);
    background(0, 25);
    blendMode(BLEND);
    fireworks.forEach((firework, index) => {
      firework.draw();

      if (firework.finished) {
        const positionBucket = fireworks[index].positionBucket;
        positionBuckets[positionBucket] = false;
        delete fireworks[index];
        fireworks.push(new Firework(positionBucket));
      }
    });

    draw_qrcode("jimmylightbulb", rect_w / 2, 1080 - 80);
  };
});
