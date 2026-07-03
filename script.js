document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky navbar background ---------- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.classList.toggle('is-active', isOpen);
  });

  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Active link highlight on scroll ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active-link', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-50% 0px -45% 0px' });

  sections.forEach(section => sectionObserver.observe(section));

  /* ---------- Scroll reveal ---------- */
  const revealTargets = document.querySelectorAll(
    '.feature-card, .gallery-item, .blog-card, .testimonial-card, .about-media, .about-copy, .contact-form, .contact-info'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(el => revealObserver.observe(el));

  /* ---------- Animated stat counters ---------- */
  const counters = document.querySelectorAll('.stat-number');

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  counters.forEach(counter => counterObserver.observe(counter));

  /* ---------- Contact form validation ---------- */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  const validators = {
    name: (v) => v.trim().length >= 2 || 'Please enter your name.',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Please enter a valid email address.',
    subject: (v) => v.trim().length >= 3 || 'Please enter a subject.',
    message: (v) => v.trim().length >= 10 || 'Message should be at least 10 characters.'
  };

  const validateField = (field) => {
    const input = form[field];
    const row = input.closest('.form-row');
    const errorEl = document.getElementById(`${field}Error`);
    const result = validators[field](input.value);

    if (result === true) {
      row.classList.remove('invalid');
      errorEl.textContent = '';
      return true;
    } else {
      row.classList.add('invalid');
      errorEl.textContent = result;
      return false;
    }
  };

  Object.keys(validators).forEach(field => {
    form[field].addEventListener('blur', () => validateField(field));
    form[field].addEventListener('input', () => {
      if (form[field].closest('.form-row').classList.contains('invalid')) {
        validateField(field);
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const results = Object.keys(validators).map(validateField);
    const allValid = results.every(Boolean);

    if (!allValid) {
      status.textContent = 'Please fix the highlighted fields.';
      status.style.color = '#C0392B';
      return;
    }

    // Simulated submission (no backend attached in this sample project)
    status.style.color = '';
    status.textContent = 'Sending…';
    setTimeout(() => {
      status.textContent = `Thanks, ${form.name.value.trim()}! Your message has been sent.`;
      form.reset();
    }, 700);
  });

});
