/**
 * PMQ Services - Animation & Scroll Dynamics
 * Integrates Thermometer Scroll Ruler & GSAP ScrollTrigger reveals.
 */

export function initAnimations() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Thermometer Scroll Ruler (Mercury/Alcohol fill indicator)
  const rulerFill = document.querySelector('.ruler-fill');
  const rulerBadge = document.querySelector('.ruler-badge');

  function updateThermometerRuler() {
    if (!rulerFill) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;

    rulerFill.style.height = `${scrollPercent}%`;

    // Map scroll percentage to simulated temperature 0°C -> 40°C
    const tempDeg = Math.round((scrollPercent / 100) * 40);
    if (rulerBadge) {
      rulerBadge.textContent = `${tempDeg}°`;
    }
  }

  window.addEventListener('scroll', updateThermometerRuler, { passive: true });
  updateThermometerRuler();

  // 2. GSAP Animations (if library is loaded and reduced motion is false)
  if (!prefersReduced && window.gsap) {
    const { gsap } = window;
    if (window.ScrollTrigger) {
      gsap.registerPlugin(window.ScrollTrigger);
    }

    // Hero Staged Entry with guaranteed visibility
    gsap.fromTo('.hero-badge', 
      { y: -10 }, 
      { y: 0, duration: 0.4, ease: 'power2.out' }
    );
    gsap.fromTo('.hero-title', 
      { y: 12 }, 
      { y: 0, duration: 0.5, ease: 'power2.out' }
    );
    gsap.fromTo('.hero-subtitle', 
      { y: 10 }, 
      { y: 0, duration: 0.4, ease: 'power2.out' }
    );
    gsap.fromTo('.hero-standards-card', 
      { y: 10 }, 
      { y: 0, duration: 0.4, ease: 'power2.out' }
    );
    gsap.fromTo('.hero-actions', 
      { y: 10 }, 
      { y: 0, duration: 0.4, ease: 'power2.out' }
    );
    gsap.fromTo('.telemetry-card', 
      { scale: 0.97 }, 
      { scale: 1, duration: 0.5, ease: 'power2.out' }
    );
  }
}
