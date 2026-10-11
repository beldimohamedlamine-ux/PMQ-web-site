/**
 * PMQ Services - Main Entry Point
 * Orchestrates navigation, i18n, simulation, telemetry, and animations.
 */

import { initI18n } from './i18n.js';
import { initHeatMapSimulator } from './simulator.js';
import { initAnimations } from './animations.js';

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Initialize Internationalization & RTL
  await initI18n();

  // 2. Initialize Interactive Heat-Map Simulator
  initHeatMapSimulator();

  // 3. Initialize Animations & Thermometer Ruler
  initAnimations();

  // 4. Header Scroll State
  const header = document.querySelector('.site-header');
  function handleHeaderScroll() {
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // 5. Mobile Navigation Drawer
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');

  function toggleDrawer() {
    if (!mobileToggle || !mobileDrawer) return;
    const isOpen = mobileDrawer.classList.contains('open');
    if (isOpen) {
      mobileDrawer.classList.remove('open');
      mobileToggle.classList.remove('active');
      mobileToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    } else {
      mobileDrawer.classList.add('open');
      mobileToggle.classList.add('active');
      mobileToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', toggleDrawer);
  }

  // Close drawer on link click
  document.querySelectorAll('.mobile-drawer .nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      if (mobileDrawer && mobileDrawer.classList.contains('open')) {
        toggleDrawer();
      }
    });
  });

  // Close drawer on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('open')) {
      toggleDrawer();
    }
  });

  // 6. Live Telemetry Readout Micro-Fluctuation Ticker
  const tempValEl = document.getElementById('heroTempVal');
  const humValEl = document.getElementById('heroHumVal');

  if (tempValEl && humValEl) {
    let currentTemp = 5.2;
    let currentHum = 42.8;

    setInterval(() => {
      // Small micro-walk within nominal lab calibration tolerances
      const tempDelta = (Math.random() - 0.5) * 0.2; // +/- 0.1°C
      const humDelta = (Math.random() - 0.5) * 0.4;  // +/- 0.2%

      currentTemp = Math.max(5.1, Math.min(5.4, currentTemp + tempDelta));
      currentHum = Math.max(42.4, Math.min(43.2, currentHum + humDelta));

      tempValEl.textContent = currentTemp.toFixed(1);
      humValEl.textContent = currentHum.toFixed(1);
    }, 3200);
  }

  // 7. Active Navigation Link Spy
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-desktop .nav-link');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 120;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });
});
