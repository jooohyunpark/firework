import { useRef, useEffect } from "react";
import p5 from "p5";

function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const sketch = (p) => {
      const noise = 0.1;
      const minRadius = 5;
      const maxRadius = 15;
      const color = 60;
      const velocityLimit = 5;

      const particleArray = [];

      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.colorMode(p.HSB);
        p.frameRate(60);
        p.pixelDensity(3);
        p.describe(
          "Blue circles appear on a white background and move from the center to the edge when the mouse is pressed."
        );
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };

      p.draw = () => {
        p.background(0, 0, 0);

        recordParticles();
        drawParticles();
        killParticles();
      };

      function recordParticles() {
        if (p.mouseIsPressed) {
          for (var i = 0; i < 5; i++) {
            particleArray.push(new Particle(p.mouseX, p.mouseY));
          }
        }
      }

      function drawParticles() {
        particleArray.forEach(function (i) {
          const noiseForce = p.createVector(
            p.random(-noise, noise),
            p.random(-noise, noise)
          );
          i.applyForce(noiseForce);
          let friction = i.vel.copy();
          friction.mult(-0.015);
          i.applyForce(friction);
          i.update();
          i.show();
        });
      }

      function killParticles() {
        for (let i = particleArray.length - 1; i >= 0; i--) {
          if (particleArray[i].r === 0) {
            particleArray.splice(i, 1);
          }
        }
      }

      function Particle(x, y) {
        this.x = x;
        this.y = y;
        this.r = 1;
        this.maxR = p.random(minRadius, maxRadius);
        this.color = color;
        this.alpha = 1;
        this.switch = false;
        this.killSpeed = p.random(0.1, 0.2);
        this.pos = p.createVector(this.x, this.y);
        this.vel = p
          .createVector(
            p.pmouseX + p.random(-5, 5),
            p.pmouseY + p.random(-5, 5)
          )
          .sub(p.createVector(p.mouseX, p.mouseY));
        this.acc = p.createVector();

        this.show = function () {
          p.noStroke();
          p.fill(this.color, 0, 100, this.alpha);
          p.ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
        };

        this.update = function () {
          this.vel.add(this.acc);
          this.vel.limit(velocityLimit);
          this.pos.add(this.vel);
          this.acc.mult(0);
          if (this.switch == false) {
            if (this.r < this.maxR) {
              this.r += 1;
            } else {
              this.switch = true;
            }
          } else {
            if (this.r > 0) {
              this.r -= this.killSpeed;
            } else {
              this.r = 0;
            }
          }
        };

        this.applyForce = function (f) {
          this.acc.add(f);
        };
      }
    };

    const p5Instance = new p5(sketch, canvasRef.current);

    return () => {
      p5Instance.remove();
    };
  }, []);

  return <main ref={canvasRef}></main>;
}

export default App;
