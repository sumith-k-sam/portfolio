/**
 * DevOps Portfolio - Animations & Visual Effects
 * Author: Sumith K Sam
 */

(function () {
  'use strict';

  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --------------------------------------------------------------------------
     1. Cyber Grid & Particle Canvas Effect
     -------------------------------------------------------------------------- */
  function initCyberCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas || prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let animationFrameId;
    const particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 22000), 55);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 1,
        color: Math.random() > 0.45 ? 'rgba(255, 42, 75, ' : 'rgba(255, 123, 0, ',
        alpha: Math.random() * 0.5 + 0.15,
      });
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
      ctx.lineWidth = 1;
      const gridSize = 60;

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update & draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.strokeStyle = `rgba(255, 42, 75, ${0.12 * (1 - dist / 120)})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    }

    draw();

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });
  }

  /* --------------------------------------------------------------------------
     2. Custom Desktop Cursor
     -------------------------------------------------------------------------- */
  function initCustomCursor() {
    if (window.innerWidth <= 768 || prefersReducedMotion) return;

    const dot = document.querySelector('.custom-cursor-dot');
    const ring = document.querySelector('.custom-cursor-ring');
    if (!dot || !ring) return;

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover effect on links and buttons
    const interactives = document.querySelectorAll('a, button, input, textarea, select, .topo-node, .doc-card, .sim-option-btn');
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  /* --------------------------------------------------------------------------
     3. Hero Terminal Auto-Typing Simulation
     -------------------------------------------------------------------------- */
  function initHeroTyping() {
    const cmd1Text = 'whoami';
    const cmd2Text = 'cat introduction.txt';
    const cmd3Text = 'systemctl status devops-workload.service';

    const cmd1El = document.getElementById('hero-cmd-1');
    const output1El = document.getElementById('hero-output-1');
    const cmd2LineEl = document.getElementById('hero-line-2');
    const cmd2El = document.getElementById('hero-cmd-2');
    const output2El = document.getElementById('hero-output-2');
    const cmd3LineEl = document.getElementById('hero-line-3');
    const cmd3El = document.getElementById('hero-cmd-3');
    const output3El = document.getElementById('hero-output-3');

    if (!cmd1El) return;

    function typeString(targetEl, text, speed, callback) {
      let index = 0;
      targetEl.textContent = '';
      const timer = setInterval(() => {
        if (index < text.length) {
          targetEl.textContent += text.charAt(index);
          index++;
        } else {
          clearInterval(timer);
          if (callback) setTimeout(callback, 250);
        }
      }, speed);
    }

    // Sequence
    setTimeout(() => {
      typeString(cmd1El, cmd1Text, 70, () => {
        if (output1El) output1El.style.display = 'block';
        if (cmd2LineEl) cmd2LineEl.style.display = 'block';

        setTimeout(() => {
          typeString(cmd2El, cmd2Text, 60, () => {
            if (output2El) output2El.style.display = 'block';
            if (cmd3LineEl) cmd3LineEl.style.display = 'block';

            setTimeout(() => {
              typeString(cmd3El, cmd3Text, 45, () => {
                if (output3El) output3El.style.display = 'block';
              });
            }, 300);
          });
        }, 300);
      });
    }, 400);
  }

  /* --------------------------------------------------------------------------
     4. Scroll Reveal via Intersection Observer
     -------------------------------------------------------------------------- */
  function initScrollReveal() {
    const elements = document.querySelectorAll('.fade-in-up');
    if (!elements.length) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );

      elements.forEach((el) => observer.observe(el));
    } else {
      elements.forEach((el) => el.classList.add('revealed'));
    }
  }

  // Expose to window
  window.DevOpsAnimations = {
    init: function () {
      initCyberCanvas();
      initCustomCursor();
      initHeroTyping();
      initScrollReveal();
    },
    triggerHeroTyping: initHeroTyping,
  };
})();

