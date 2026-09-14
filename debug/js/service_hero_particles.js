/* Shared Hero Particle Animation for Service Pages
   Auto-initializes on <canvas class="service-hero-particles">
   Customizable via data attributes:
     data-count    — number of particles (default 80)
     data-speed    — drift speed multiplier (default 0.25)
     data-color    — particle color (default "56, 189, 248")
     data-connect  — max connection distance (default 110)
*/
(function() {
  'use strict';

  // Respect reduced-motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function initParticles(canvas) {
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Read configuration from data attributes
    var maxCount  = parseInt(canvas.getAttribute('data-count')) || 80;
    var speed     = parseFloat(canvas.getAttribute('data-speed')) || 0.25;
    var colorRGB  = canvas.getAttribute('data-color') || '56, 189, 248';
    var connectDist = parseInt(canvas.getAttribute('data-connect')) || 110;

    var particles = [];
    var w, h;
    var mouse = { x: null, y: null, radius: 120 };

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
      createParticles();
    }

    function createParticles() {
      particles = [];
      var count = Math.min(maxCount, Math.floor((w * h) / 12000));
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: Math.random() * 2 + 1,
          vx: (Math.random() - 0.5) * speed * 2,
          vy: (Math.random() - 0.5) * speed * 2
        });
      }
    }

    function animate() {
      ctx.clearRect(0, 0, w, h);

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        // Mouse repulsion
        if (mouse.x !== null && mouse.y !== null) {
          var dx = mouse.x - p.x;
          var dy = mouse.y - p.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            var force = (mouse.radius - dist) / mouse.radius;
            p.x -= (dx / dist) * force * 1.5;
            p.y -= (dy / dist) * force * 1.5;
          }
        }

        // Draw particle
        ctx.fillStyle = 'rgba(' + colorRGB + ', 0.45)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Connect nearby particles
      for (var a = 0; a < particles.length; a++) {
        for (var b = a + 1; b < particles.length; b++) {
          var dx2 = particles[a].x - particles[b].x;
          var dy2 = particles[a].y - particles[b].y;
          var dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
          if (dist2 < connectDist) {
            var alpha = ((connectDist - dist2) / connectDist) * 0.15;
            ctx.strokeStyle = 'rgba(' + colorRGB + ', ' + alpha + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }

    // Event listeners
    window.addEventListener('resize', resize);

    canvas.parentElement.addEventListener('mousemove', function(e) {
      var rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    canvas.parentElement.addEventListener('mouseleave', function() {
      mouse.x = null;
      mouse.y = null;
    });

    resize();
    animate();
  }

  // Auto-init all matching canvases once DOM is ready
  function init() {
    var canvases = document.querySelectorAll('canvas.service-hero-particles');
    for (var i = 0; i < canvases.length; i++) {
      initParticles(canvases[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
