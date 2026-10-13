/**
 * PMQ Services - Interactive Heat-Map Simulator Engine
 * Realistic temperature distribution model for professional warehouse & storage facility mapping.
 * Ambient Controlled Room Temperature (CRT): +15°C to +25°C specification range.
 * Optimized with smooth continuous thermal gradient, rAF throttling, and zero-jitter pointer tracking.
 */

const STATUS_TEXTS = {
  fr: {
    cold: 'ZONE FROIDE / CRITIQUE BASSE (< 15°C)',
    hot: 'ZONE CHAUDE / CRITIQUE HAUTE (> 25°C)',
    nominal: 'ZONE NOMINALE (15°C - 25°C)',
    conform: 'CONFORME AUX SPÉCIFICATIONS'
  },
  en: {
    cold: 'COLD ZONE / LOW CRITICAL (< 15°C)',
    hot: 'HOT ZONE / HIGH CRITICAL (> 25°C)',
    nominal: 'NOMINAL ZONE (15°C - 25°C)',
    conform: 'COMPLIANT WITH SPECIFICATIONS'
  },
  ar: {
    cold: 'منطقة باردة / حرجة دنيا (< 15°C)',
    hot: 'منطقة ساخنة / حرجة قصوى (> 25°C)',
    nominal: 'منطقة نموذجية (15°C - 25°C)',
    conform: 'مطابق للمواصفات المعيارية'
  }
};

export function initHeatMapSimulator() {
  const container = document.getElementById('simulatorContainer');
  const probeValueEl = document.getElementById('simProbeValue');
  const probeStatusEl = document.getElementById('simProbeStatus');
  const probeCursor = document.getElementById('simProbeCursor');
  const probeText = document.getElementById('simProbeText');
  const crosshairH = document.getElementById('simCrosshairH');
  const crosshairV = document.getElementById('simCrosshairV');

  if (!container || !probeValueEl) return;

  function getTexts() {
    const lang = document.documentElement.getAttribute('lang') || 'fr';
    return STATUS_TEXTS[lang] || STATUS_TEXTS.fr;
  }

  // Smooth continuous thermal interpolation model for +15°C to +25°C warehouse
  // Cold spot: top-left near cooling / HVAC unit (x=160, y=70 in 840x380 SVG -> normX=0.1905, normY=0.1842) -> 15.8 °C
  // Hot spot: bottom-right near entry dock door (x=680, y=280 in 840x380 SVG -> normX=0.8095, normY=0.7368) -> 24.8 °C
  // Nominal center: (x=420, y=190 -> normX=0.5, normY=0.5) -> 20.5 °C
  function calculateTemperature(normX, normY) {
    // Continuous baseline gradient from HVAC side (left) to dock door side (right)
    const base = 18.1 + (normX * 4.0) + (normY * 0.7);

    // Cold HVAC inflow pull
    const coldDistSq = (normX - 0.1905) ** 2 + (normY - 0.1842) ** 2;
    const coldPull = 3.19 * Math.exp(-coldDistSq / 0.035);

    // Hot loading dock inflow pull
    const hotDistSq = (normX - 0.8095) ** 2 + (normY - 0.7368) ** 2;
    const hotPull = 2.95 * Math.exp(-hotDistSq / 0.045);

    // Continuous, differentiable thermal field
    const temp = base - coldPull + hotPull;
    return Math.max(14.2, Math.min(26.8, temp));
  }

  let rafId = null;
  let targetX = 0;
  let targetY = 0;
  let isPointerInside = false;

  function renderProbe() {
    rafId = null;
    if (!isPointerInside) return;

    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const x = Math.max(0, Math.min(rect.width, targetX - rect.left));
    const y = Math.max(0, Math.min(rect.height, targetY - rect.top));

    const normX = x / rect.width;
    const normY = y / rect.height;

    const temp = calculateTemperature(normX, normY);
    const formatted = temp.toFixed(1);

    // Update Topbar Readout
    probeValueEl.textContent = `${formatted} °C`;

    if (probeStatusEl) {
      const texts = getTexts();
      if (temp < 15.0) {
        probeStatusEl.textContent = texts.cold;
        probeStatusEl.style.color = '#25C2D6';
      } else if (temp > 25.0) {
        probeStatusEl.textContent = texts.hot;
        probeStatusEl.style.color = '#F28C28';
      } else {
        probeStatusEl.textContent = texts.nominal;
        probeStatusEl.style.color = '#4CC66B';
      }
    }

    // Update SVG Crosshairs & Probe Tag
    if (probeCursor && crosshairH && crosshairV) {
      const svgX = normX * 840;
      const svgY = normY * 380;

      probeCursor.setAttribute('transform', `translate(${svgX}, ${svgY})`);
      if (probeText) probeText.textContent = `${formatted} °C`;

      crosshairH.setAttribute('y1', svgY);
      crosshairH.setAttribute('y2', svgY);
      crosshairV.setAttribute('x1', svgX);
      crosshairV.setAttribute('x2', svgX);
    }
  }

  function queueUpdate(clientX, clientY) {
    targetX = clientX;
    targetY = clientY;
    isPointerInside = true;
    if (!rafId) {
      rafId = requestAnimationFrame(renderProbe);
    }
  }

  function resetToNominal() {
    isPointerInside = false;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }

    const texts = getTexts();
    probeValueEl.textContent = '20.5 °C';
    if (probeStatusEl) {
      probeStatusEl.textContent = texts.conform;
      probeStatusEl.style.color = '#4CC66B';
    }
    if (probeCursor && crosshairH && crosshairV) {
      probeCursor.setAttribute('transform', 'translate(420, 190)');
      if (probeText) probeText.textContent = '20.5 °C';
      crosshairH.setAttribute('y1', '190');
      crosshairH.setAttribute('y2', '190');
      crosshairV.setAttribute('x1', '420');
      crosshairV.setAttribute('x2', '420');
    }
  }

  // Pointer & Touch Events
  container.addEventListener('pointerenter', (e) => {
    queueUpdate(e.clientX, e.clientY);
  });

  container.addEventListener('pointermove', (e) => {
    queueUpdate(e.clientX, e.clientY);
  });

  container.addEventListener('pointerleave', resetToNominal);
  container.addEventListener('pointercancel', resetToNominal);

  // Touch Support (Optimized for Mobile/Phone)
  let touchResetTimer = null;

  container.addEventListener('touchstart', (e) => {
    if (touchResetTimer) {
      clearTimeout(touchResetTimer);
      touchResetTimer = null;
    }
    if (e.touches && e.touches[0]) {
      queueUpdate(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  container.addEventListener('touchmove', (e) => {
    if (touchResetTimer) {
      clearTimeout(touchResetTimer);
      touchResetTimer = null;
    }
    if (e.touches && e.touches[0]) {
      queueUpdate(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  container.addEventListener('touchend', () => {
    if (touchResetTimer) clearTimeout(touchResetTimer);
    touchResetTimer = setTimeout(() => {
      resetToNominal();
    }, 2200);
  }, { passive: true });

  // Update text dynamically on language change
  window.addEventListener('pmq-lang-changed', () => {
    if (!isPointerInside) {
      resetToNominal();
    }
  });
}
