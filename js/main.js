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

  // 5. Mobile Navigation Drawer & Backdrop
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const mobileBackdrop = document.querySelector('.mobile-backdrop');

  function openDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('open');
    if (mobileToggle) {
      mobileToggle.classList.add('active');
      mobileToggle.setAttribute('aria-expanded', 'true');
    }
    if (mobileBackdrop) {
      mobileBackdrop.classList.add('open');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('open');
    if (mobileToggle) {
      mobileToggle.classList.remove('active');
      mobileToggle.setAttribute('aria-expanded', 'false');
    }
    if (mobileBackdrop) {
      mobileBackdrop.classList.remove('open');
    }
    document.body.style.overflow = '';
  }

  function toggleDrawer() {
    if (!mobileDrawer) return;
    if (mobileDrawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', toggleDrawer);
  }

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', closeDrawer);
  }

  // Close drawer on any link or button click inside the drawer
  document.querySelectorAll('.mobile-drawer a').forEach((link) => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Close drawer on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  // 6. Calibrated Nominal Lab Reference
  const tempValEl = document.getElementById('heroTempVal');
  const humValEl = document.getElementById('heroHumVal');
  if (tempValEl && humValEl) {
    tempValEl.textContent = '20.4';
    humValEl.textContent = '42.5';
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
