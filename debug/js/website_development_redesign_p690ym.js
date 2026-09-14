/* Custom JS for Website Development redesign animations */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Accessibility check: reduced motion
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
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
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
        ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function init() {
      particlesArray = [];
      const num = Math.min(80, Math.floor((w * h) / 12000));
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

    // Hero Text & Controls timeline
    const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });
    heroTimeline
      .fromTo('.hero-main-title', { y: 30, opacity: 0 }, { y: 0, opacity: 1, delay: 0.2 })
      .fromTo('.hero-subtitle', { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, '-=0.6')
      .fromTo('.hero-ctas .btn-primary-revamp, .hero-ctas .btn-secondary-revamp', { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, stagger: 0.15 }, '-=0.5')
      .fromTo('.hero-highlights', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.45')
      .fromTo('.ufaqtech-hero-svg', { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2 }, '-=0.8');

    // SVG Code Editor typing and elements reveal animation
    const svgTimeline = gsap.timeline({ defaults: { ease: 'power2.out' } });
    svgTimeline
      .from('.editor-window', { opacity: 0, scale: 0.95, y: 20, duration: 1, delay: 0.5 })
      .from('.editor-code-line', { opacity: 0, x: -15, stagger: 0.15, duration: 0.5 }, '-=0.5')
      .from('.terminal-overlay', { opacity: 0, scale: 0.9, y: 15, duration: 0.7 }, '-=0.3')
      .from('.terminal-overlay text', { opacity: 0, x: -10, stagger: 0.2, duration: 0.4 }, '-=0.3')
      .from('.tech-badge', { opacity: 0, scale: 0.8, y: 10, stagger: 0.15, duration: 0.6 }, '-=0.4');

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

      // Vertical timeline progress line fill animation
      const stepper = document.querySelector('.process-timeline-stepper');
      if (stepper) {
        gsap.fromTo('.process-timeline-fill', 
          { height: '0%' },
          {
            scrollTrigger: {
              trigger: '.process-timeline-stepper',
              start: 'top 30%',
              end: 'bottom 50%',
              scrub: true
            },
            height: '100%',
            ease: 'none'
          }
        );
      }

      // Timeline Step activation and sticky side panel switcher
      const steps = document.querySelectorAll('.process-timeline-step');
      steps.forEach((step) => {
        const stepName = step.getAttribute('data-step');
        
        ScrollTrigger.create({
          trigger: step,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => activateStep(step, stepName),
          onEnterBack: () => activateStep(step, stepName)
        });
      });

      function activateStep(stepElement, stepName) {
        // Deactivate all steps
        steps.forEach(s => s.classList.remove('active'));
        // Activate current step
        stepElement.classList.add('active');
        
        // Deactivate all panels
        const panels = document.querySelectorAll('.process-state-panel');
        panels.forEach(p => p.classList.remove('active'));
        
        // Activate current panel
        const targetPanel = document.getElementById(`state-${stepName}`);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      }

      // Star picks list reveal
      gsap.from('.picks-reveal, .feature-minimal-reveal', {
        scrollTrigger: {
          trigger: '.star-picks-section',
          start: 'top 75%',
          toggleActions: 'play none none none'
        },
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15
      });

      // Contact form section reveal - clear transform to avoid fixed position container bugs
      gsap.from('.contact-reveal', {
        scrollTrigger: {
          trigger: '.contact-section',
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        y: 50,
        opacity: 0,
        duration: 1,
        clearProps: 'transform'
      });
    }
  };

  // Run GSAP setup
  initGSAPAnimations();
});
