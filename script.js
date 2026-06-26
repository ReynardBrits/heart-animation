const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let particles = [];
let heartPoints = [];
let time = 0;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  heartPoints = [];
  createHeartPath();
}

window.addEventListener("resize", resizeCanvas);

function createHeartPath() {
  const scale = Math.min(canvas.width, canvas.height) * 0.018;
  const steps = 700;

  for (let i = 0; i < steps; i++) {
    const t = (i / steps) * Math.PI * 2;

    const x = 16 * Math.pow(Math.sin(t), 3);
    const y =
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t);

    heartPoints.push({
      x: canvas.width / 2 + x * scale,
      y: canvas.height / 2 - y * scale
    });
  }
}

class Particle {
  constructor(index) {
    this.index = index;
    this.reset();
  }

  reset() {
    const point = heartPoints[this.index % heartPoints.length];

    this.x = point.x;
    this.y = point.y;
    this.oldX = this.x;
    this.oldY = this.y;

    this.offset = Math.random() * Math.PI * 2;
    this.speed = 0.8 + Math.random() * 1.2;
    this.size = 1 + Math.random() * 1.8;
    this.life = 120 + Math.random() * 120;
  }

  update() {
    this.oldX = this.x;
    this.oldY = this.y;

    const nextIndex =
      (this.index + Math.floor(this.speed)) % heartPoints.length;

    const target = heartPoints[nextIndex];

    const waveX = Math.sin(time * 0.04 + this.offset) * 2.5;
    const waveY = Math.cos(time * 0.04 + this.offset) * 2.5;

    this.x += (target.x + waveX - this.x) * 0.12;
    this.y += (target.y + waveY - this.y) * 0.12;

    this.index = nextIndex;
    this.life--;

    if (this.life <= 0) {
      this.reset();
    }
  }

  draw() {
    ctx.beginPath();
    ctx.moveTo(this.oldX, this.oldY);
    ctx.lineTo(this.x, this.y);

    ctx.strokeStyle = "rgba(255, 20, 80, 0.85)";
    ctx.lineWidth = this.size;

    ctx.shadowBlur = 28;
    ctx.shadowColor = "rgba(255, 0, 70, 1)";

    ctx.stroke();
  }
}

function createParticles() {
  particles = [];

  for (let i = 0; i < 950; i++) {
    particles.push(new Particle(i));
  }
}

function drawHeartPulse() {
  const pulse = 1 + Math.sin(time * 0.05) * 0.035;

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(pulse, pulse);
  ctx.translate(-canvas.width / 2, -canvas.height / 2);

  particles.forEach(particle => {
    particle.update();
    particle.draw();
  });

  ctx.restore();
}

function animate() {
  time++;

  ctx.shadowBlur = 0;
  ctx.shadowColor = "transparent";
  ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawHeartPulse();

  requestAnimationFrame(animate);
}

resizeCanvas();
createParticles();
animate();