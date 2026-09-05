import React, { useEffect, useRef } from 'react';

const Background3D = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle class for 3D depth simulation
    const numParticles = Math.min(Math.floor(window.innerWidth / 25), 55);
    const particles = [];

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.z = Math.random() * 800 + 100; // Depth factor
        this.radius = (1 - this.z / 1000) * 3 + 1;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.color = ['#6366f1', '#a855f7', '#06b6d4', '#ec4899'][
          Math.floor(Math.random() * 4)
        ];
        this.alpha = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha * (1 - this.z / 1000);
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < numParticles; i++) {
      particles.push(new Particle());
    }

    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Gradient mesh background
      angle += 0.002;
      const gx1 = width / 2 + Math.cos(angle) * (width * 0.3);
      const gy1 = height / 2 + Math.sin(angle) * (height * 0.3);
      const gx2 = width / 2 - Math.cos(angle * 0.8) * (width * 0.4);
      const gy2 = height / 2 - Math.sin(angle * 0.8) * (height * 0.4);

      const radGrad = ctx.createRadialGradient(gx1, gy1, 50, gx1, gy1, width * 0.7);
      radGrad.addColorStop(0, 'rgba(99, 102, 241, 0.15)');
      radGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.08)');
      radGrad.addColorStop(1, 'rgba(8, 11, 20, 0)');

      const radGrad2 = ctx.createRadialGradient(gx2, gy2, 30, gx2, gy2, width * 0.6);
      radGrad2.addColorStop(0, 'rgba(6, 182, 212, 0.12)');
      radGrad2.addColorStop(1, 'rgba(8, 11, 20, 0)');

      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = radGrad2;
      ctx.fillRect(0, 0, width, height);

      // Draw particle mesh connections
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = '#6366f1';
            ctx.globalAlpha = (1 - dist / 130) * 0.15;
            ctx.lineWidth = 0.8;
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    />
  );
};

export default Background3D;
