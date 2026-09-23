/* ============================================
   TIENDA ONLINE — SLIDER.JS
   Hero Slider — Autoplay, Touch, Keyboard
   ============================================ */

'use strict';

(function() {

  let currentSlide = 0;
  let totalSlides  = 0;
  let autoPlayTimer = null;
  let isTransitioning = false;
  const AUTOPLAY_DELAY = 5500;

  // ============================================
  // INIT
  // ============================================
  function initSlider() {
    const slider = document.getElementById('hero-slider');
    if (!slider) return;

    const slides = slider.querySelectorAll('.hero-slide');
    const dots   = document.querySelectorAll('.slider-dot');
    totalSlides  = slides.length;

    if (totalSlides === 0) return;

    // Show first slide
    goToSlide(0);

    // Dots
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => goToSlide(i));
    });

    // Arrow buttons
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Keyboard
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    });

    // Touch / swipe
    let touchStartX = 0;
    let touchEndX   = 0;

    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide(); else prevSlide();
      }
    }, { passive: true });

    // Pause on hover
    slider.addEventListener('mouseenter', pauseAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);

    startAutoPlay();
  }

  // ============================================
  // NAVIGATION
  // ============================================
  function goToSlide(index) {
    if (isTransitioning) return;
    isTransitioning = true;

    const slides = document.querySelectorAll('.hero-slide');
    const dots   = document.querySelectorAll('.slider-dot');

    // Remove active from all
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    // Set new current
    currentSlide = (index + totalSlides) % totalSlides;

    // Activate
    if (slides[currentSlide]) slides[currentSlide].classList.add('active');
    if (dots[currentSlide])   dots[currentSlide].classList.add('active');

    setTimeout(() => { isTransitioning = false; }, 900);
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
    resetAutoPlay();
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
    resetAutoPlay();
  }

  // ============================================
  // AUTOPLAY
  // ============================================
  function startAutoPlay() {
    pauseAutoPlay();
    autoPlayTimer = setInterval(nextSlide, AUTOPLAY_DELAY);
  }

  function pauseAutoPlay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  }

  function resetAutoPlay() {
    startAutoPlay();
  }

  // ============================================
  // RUN
  // ============================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSlider);
  } else {
    initSlider();
  }

})();
