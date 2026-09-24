/* ============================================
   TIENDA ONLINE — ANIMATIONS.JS
   Scroll Reveal, Header Scroll Effect,
   Scroll Progress Bar, Mobile Menu
   ============================================ */

'use strict';

(function() {

  // ============================================
  // SCROLL REVEAL — Intersection Observer
  // ============================================
  function initScrollReveal() {
    const revealEls = document.querySelectorAll('[data-reveal]');
    if (!revealEls.length) return;

    // Reveal immediately anything in or close to the viewport
    revealEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 300) {
        el.classList.add('revealed');
      }
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.01,
      rootMargin: '250px 0px 150px 0px'
    });

    revealEls.forEach(el => {
      if (!el.classList.contains('revealed')) {
        observer.observe(el);
      }
    });
  }

  // ============================================
  // HEADER SCROLL EFFECT
  // ============================================
  function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let lastScroll = 0;

    function onScroll() {
      const scrollY = window.scrollY;

      if (scrollY > 80) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      lastScroll = scrollY;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Run on init
  }

  // ============================================
  // SCROLL PROGRESS BAR
  // ============================================
  function initScrollProgress() {
    const bar = document.querySelector('.scroll-progress');
    if (!bar) return;

    function updateProgress() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress  = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = Math.min(progress, 100) + '%';
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // ============================================
  // MOBILE MENU
  // ============================================
  function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    if (!hamburger || !mobileNav) return;

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('active');
      document.body.style.overflow = mobileNav.classList.contains('active')
        ? 'hidden' : '';
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // ============================================
  // IMAGE REVEAL EFFECT
  // ============================================
  function initImageReveal() {
    const revealWraps = document.querySelectorAll('.img-reveal-wrap');
    if (!revealWraps.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    revealWraps.forEach(el => observer.observe(el));
  }

  // ============================================
  // PAGE ENTER ANIMATION
  // ============================================
  function initPageEnter() {
    document.body.classList.add('page-enter');
  }

  // ============================================
  // INITIALIZE ALL
  // ============================================
  function init() {
    initScrollReveal();
    initHeaderScroll();
    initScrollProgress();
    initMobileMenu();
    initImageReveal();
    initPageEnter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
