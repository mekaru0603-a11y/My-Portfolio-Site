/* =============================================
   Portfolio — main.js
   縦スクロール対応版
   ============================================= */
(function () {
  'use strict';

  /* ── DOM refs ─────────────────────────────── */
  const header   = document.getElementById('header');
  const menuBtn  = document.querySelector('.menu-btn');
  const drawer   = document.getElementById('drawer');
  const navLinks = document.querySelectorAll('.hnav-link');
  const sections = document.querySelectorAll('section[id]');

  /* ── Header scroll shadow ─────────────────── */
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 10);
    updateActiveNav();
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Active nav highlight on scroll ──────── */
  function updateActiveNav() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top <= 96) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.target === current);
    });
  }

  /* ── Smooth scroll for nav links ─────────── */
  function smoothScrollTo(id) {
    const target = document.getElementById(id);
    if (!target) return;
    const offset = parseInt(getComputedStyle(document.documentElement)
                   .getPropertyValue('--header-h'), 10) || 64;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      smoothScrollTo(link.dataset.target);
      // close drawer on mobile
      closeDrawer();
    });
  });

  document.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      smoothScrollTo(link.dataset.target);
      closeDrawer();
    });
  });

  const heroCtaLink = document.querySelector('.hero-cta');
  if (heroCtaLink) {
    heroCtaLink.addEventListener('click', e => {
      e.preventDefault();
      smoothScrollTo('works');
    });
  }

  /* ── Mobile menu ──────────────────────────── */
  function closeDrawer() {
    menuBtn.classList.remove('open');
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    menuBtn.setAttribute('aria-expanded', 'false');
  }

  menuBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('open');
    menuBtn.classList.toggle('open', isOpen);
    drawer.setAttribute('aria-hidden', String(!isOpen));
    menuBtn.setAttribute('aria-expanded', String(isOpen));
  });

  /* ── Intersection Observer — scroll reveal ── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      // stagger for process steps
      const delay = el.classList.contains('process-step')
        ? Array.from(el.parentElement.children).indexOf(el) * 120
        : 0;
      setTimeout(() => el.classList.add('revealed'), delay);
      revealObserver.unobserve(el);
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.js-reveal, .process-step').forEach(el => {
    revealObserver.observe(el);
  });

  /* ── Skill bar animation ─────────────────── */
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.skill-fill').forEach(fill => {
        const w = fill.dataset.width;
        // slight delay so transition plays visibly
        requestAnimationFrame(() => {
          fill.style.width = w + '%';
        });
      });
      skillObserver.unobserve(entry.target);
    });
  }, { threshold: 0.3 });

  const aboutSection = document.getElementById('about');
  if (aboutSection) skillObserver.observe(aboutSection);

  /* ── Work item micro-interaction ─────────── */
  document.querySelectorAll('.work-item').forEach(item => {
    item.addEventListener('click', () => {
      const title = item.querySelector('.work-title').textContent;
      console.info('Work selected:', title);
      // TODO: open project detail / lightbox
    });
  });

  /* ── Init ────────────────────────────────── */
  onScroll(); // set initial state

})();