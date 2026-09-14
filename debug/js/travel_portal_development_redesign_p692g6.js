/* Custom JS for Travel Web Portal redesign animations */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Accessibility check: reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    console.log('Reduced motion preferred. Bypassing animations.');
    return;
  }

  // 2. Interactive Canvas Particle Background
  const canvas = document.getElementById('hero-particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let w = (canvas.width = canvas.offsetWidth);
    let h = (canvas.height = canvas.offsetHeight);

    window.addEventListener('resize', () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
      init();
    });

    const mouse = { x: null, y: null, radius: 120 };
    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.4 - 0.2;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > w) this.speedX *= -1;
        if (this.y < 0 || this.y > h) this.speedY *= -1;

        // Interaction with mouse cursor
        if (mouse.x && mouse.y) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            let force = (mouse.radius - distance) / mouse.radius;
            let directionX = dx / distance;
            let directionY = dy / distance;
            this.x -= directionX * force * 1.5;
            this.y -= directionY * force * 1.5;
          }
        }
      }
      draw() {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function init() {
      particlesArray = [];
      const num = Math.min(80, Math.floor((w * h) / 13000));
      for (let i = 0; i < num; i++) {
        particlesArray.push(new Particle());
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      connect();
      requestAnimationFrame(animateParticles);
    }

    function connect() {
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a + 1; b < particlesArray.length; b++) {
          let dx = particlesArray[a].x - particlesArray[b].x;
          let dy = particlesArray[a].y - particlesArray[b].y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 110) {
            let alpha = ((110 - distance) / 110) * 0.15;
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }

    init();
    animateParticles();
  }

  // 3. Scroll Progress bar tracker
  const progressBar = document.querySelector('.scroll-progress-bar');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      progressBar.style.width = scrolled + '%';
    });
  }

  // 4. GSAP Animations Setup
  const initGSAPAnimations = () => {
    if (typeof gsap === 'undefined') {
      console.warn('GSAP is not loaded. Retrying...');
      setTimeout(initGSAPAnimations, 100);
      return;
    }

    // Register ScrollTrigger if available
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Hero timeline
    const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });
    heroTimeline
      .fromTo('.hero-main-title', { y: 30, opacity: 0 }, { y: 0, opacity: 1, delay: 0.2 })
      .fromTo('.hero-subtitle', { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, '-=0.6')
      .fromTo('.hero-ctas .btn-primary-revamp, .hero-ctas .btn-secondary-revamp', { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, stagger: 0.15 }, '-=0.5')
      .fromTo('.ufaqtech-hero-svg', { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2 }, '-=0.8');

    // SVG elements reveal
    const svgTimeline = gsap.timeline({ defaults: { ease: 'power2.out' } });
    svgTimeline
      .from('.dashboard-screen', { opacity: 0, scale: 0.95, y: 20, duration: 1, delay: 0.5 })
      .from('.metric-bar', { scaleY: 0, transformOrigin: 'bottom', stagger: 0.1, duration: 0.8 }, '-=0.3')
      .from('.badge-overlay', { opacity: 0, scale: 0.8, y: 10, stagger: 0.15, duration: 0.6 }, '-=0.4');

    // Scroll trigger animations
    if (typeof ScrollTrigger !== 'undefined') {
      // Intro section paragraphs
      gsap.from('.intro-reveal', {
        scrollTrigger: {
          trigger: '.intro-section',
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2
      });

      // Cards staggered reveal
      gsap.from('.usp-reveal', {
        scrollTrigger: {
          trigger: '.usp-section',
          start: 'top 75%',
          toggleActions: 'play none none none'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2
      });

      // Timeline and CTA rows reveal
      gsap.utils.toArray('.picks-reveal').forEach(el => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          y: 40,
          opacity: 0,
          duration: 0.8
        });
      });
    }
  };

  // Run GSAP setup
  initGSAPAnimations();
});
