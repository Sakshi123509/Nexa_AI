// export const initNeuralBackground = (canvas) => {
//   const ctx = canvas.getContext('2d');
//   let particles = [];
//   const particleCount = 80;
//   const connectionDistance = 150;
//   const mouse = { x: null, y: null };

//   const resize = () => {
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
//   };

//   class Particle {
//     constructor() {
//       this.reset();
//     }

//     reset() {
//       this.x = Math.random() * canvas.width;
//       this.y = Math.random() * canvas.height;
//       this.vx = (Math.random() - 0.5) * 0.4;
//       this.vy = (Math.random() - 0.5) * 0.4;
//       this.radius = Math.random() * 1.5 + 1;
//     }

//     update() {
//       this.x += this.vx;
//       this.y += this.vy;

//       // Bounce off walls
//       if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
//       if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
//     }

//     draw() {
//       ctx.beginPath();
//       ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
//       ctx.fillStyle = 'rgba(0, 242, 255, 0.5)'; // Electric Cyan
//       ctx.fill();
//     }
//   }

//   const init = () => {
//     resize();
//     particles = Array.from({ length: particleCount }, () => new Particle());
//   };

//   const draw = () => {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     particles.forEach((p, i) => {
//       p.update();
//       p.draw();

//       // Draw connections
//       for (let j = i + 1; j < particles.length; j++) {
//         const p2 = particles[j];
//         const dist = Math.hypot(p.x - p2.x, p.y - p2.y);

//         if (dist < connectionDistance) {
//           // Opacity fades as they move apart
//           const opacity = 1 - dist / connectionDistance;
//           ctx.strokeStyle = `rgba(57, 255, 20, ${opacity * 0.2})`; // Neon Lime connections
//           ctx.lineWidth = 0.8;
//           ctx.beginPath();
//           ctx.moveTo(p.x, p.y);
//           ctx.lineTo(p2.x, p2.y);
//           ctx.stroke();
//         }
//       }
//     });

//     requestAnimationFrame(draw);
//   };

//   const handleMouseMove = (e) => {
//     mouse.x = e.clientX;
//     mouse.y = e.clientY;
//   };

//   window.addEventListener('resize', resize);
//   window.addEventListener('mousemove', handleMouseMove);
  
//   init();
//   draw();

//   return () => {
//     window.removeEventListener('resize', resize);
//     window.removeEventListener('mousemove', handleMouseMove);
//   };
// };
export const initNeuralBackground = (canvas) => {
  const ctx = canvas.getContext("2d");
  let particles = [];
  const particleCount = 90;
  const connectionDistance = 140;

  const mouse = { x: null, y: null };

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.baseX = this.x;
      this.baseY = this.y;

      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;

      this.radius = Math.random() * 1.5 + 1;

      this.pulse = Math.random() * Math.PI * 2;
    }

    update() {
      // base movement
      this.x += this.vx;
      this.y += this.vy;

      // wave motion (AI feel)
      this.pulse += 0.03;
      this.y += Math.sin(this.pulse) * 0.2;

      // mouse attraction
      if (mouse.x && mouse.y) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          this.x += dx * 0.01;
          this.y += dy * 0.01;
        }
      }

      // bounce
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
      const glow = 2 + Math.sin(this.pulse) * 2;

      ctx.save();
      ctx.shadowColor = "#00f2ff";
      ctx.shadowBlur = glow * 4;

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius + glow * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 242, 255, 0.7)";
      ctx.fill();

      ctx.restore();
    }
  }

  const init = () => {
    resize();
    particles = Array.from({ length: particleCount }, () => new Particle());
  };

  const draw = () => {
    ctx.fillStyle = "rgba(5, 10, 25, 0.4)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      p.update();
      p.draw();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          const opacity = 1 - dist / connectionDistance;

          // gradient line
          const grad = ctx.createLinearGradient(
            p.x,
            p.y,
            p2.x,
            p2.y
          );
          grad.addColorStop(0, `rgba(0, 242, 255, ${opacity * 0.4})`);
          grad.addColorStop(1, `rgba(57, 255, 20, ${opacity * 0.2})`);

          ctx.strokeStyle = grad;
          ctx.lineWidth = 1;

          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(draw);
  };

  const handleMouseMove = (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  };

  const handleMouseLeave = () => {
    mouse.x = null;
    mouse.y = null;
  };

  window.addEventListener("resize", resize);
  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("mouseleave", handleMouseLeave);

  init();
  draw();

  return () => {
    window.removeEventListener("resize", resize);
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseleave", handleMouseLeave);
  };
};