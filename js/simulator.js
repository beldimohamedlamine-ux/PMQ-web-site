/**
 * PMQ Services - Interactive Heat-Map Simulator Engine
 * Realistic temperature distribution model for pharmaceutical warehouse mapping.
 */

export function initHeatMapSimulator() {
  const container = document.getElementById('simulatorContainer');
  const probeValueEl = document.getElementById('simProbeValue');
  const probeStatusEl = document.getElementById('simProbeStatus');
  const probeCursor = document.getElementById('simProbeCursor');
  const probeText = document.getElementById('simProbeText');
  const crosshairH = document.getElementById('simCrosshairH');
  const crosshairV = document.getElementById('simCrosshairV');

  if (!container || !probeValueEl) return;

  // Cold spot: top-left near cooling blower (x=160, y=70) -> 2.1 °C
  // Hot spot: bottom-right near entry door (x=680, y=280) -> 8.4 °C
  // Nominal center: 5.2 °C

  function calculateTemperature(normX, normY) {
    // 2D thermal interpolation model
    const coldDist = Math.hypot(normX - 0.2, normY - 0.25);
    const hotDist = Math.hypot(normX - 0.85, normY - 0.75);

    // Baseline temperature gradient
    let temp = 2.1 + (normX * 4.2) + (normY * 2.2);

    // Pull towards cold evaporator spot
    if (coldDist < 0.35) {
      temp = 2.1 + (coldDist / 0.35) * 2.2;
    }
    // Pull towards warm doorway spot
    if (hotDist < 0.4) {
      temp = 8.4 - (hotDist / 0.4) * 2.5;
    }

    // Clamp between realistic 1.8°C and 8.9°C
    return Math.max(1.8, Math.min(8.9, temp));
  }

  function updateProbe(clientX, clientY) {
    const rect = container.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, clientY - rect.top));

    const normX = x / rect.width;
    const normY = y / rect.height;

    const temp = calculateTemperature(normX, normY);
    const formatted = temp.toFixed(1);

    // Update Topbar Readout
    probeValueEl.textContent = `${formatted} °C`;

    if (probeStatusEl) {
      if (temp < 2.5) {
        probeStatusEl.textContent = 'ZONE FROIDE / CRITIQUE BASSE';
        probeStatusEl.style.color = '#25C2D6';
      } else if (temp > 7.5) {
        probeStatusEl.textContent = 'ZONE CHAUDE / CRITIQUE HAUTE';
        probeStatusEl.style.color = '#F28C28';
      } else {
        probeStatusEl.textContent = 'ZONE NOMINALE (2°C - 8°C)';
        probeStatusEl.style.color = '#4CC66B';
      }
    }

    // Update SVG Crosshairs & Probe Tag if SVG coordinates available
    if (probeCursor && crosshairH && crosshairV) {
      // Map to SVG viewBox (0 0 840 380)
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

  // Pointer & Touch Events
  container.addEventListener('mousemove', (e) => {
    updateProbe(e.clientX, e.clientY);
  });

  container.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      e.preventDefault(); // Prevent accidental scroll during simulator test
      updateProbe(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: false });

  container.addEventListener('mouseleave', () => {
    // Return gracefully to nominal center
    probeValueEl.textContent = '5.2 °C';
    if (probeStatusEl) {
      probeStatusEl.textContent = 'ZONE NOMINALE (2°C - 8°C)';
      probeStatusEl.style.color = '#4CC66B';
    }
    if (probeCursor && crosshairH && crosshairV) {
      probeCursor.setAttribute('transform', 'translate(420, 190)');
      if (probeText) probeText.textContent = '5.2 °C';
      crosshairH.setAttribute('y1', '190');
      crosshairH.setAttribute('y2', '190');
      crosshairV.setAttribute('x1', '420');
      crosshairV.setAttribute('x2', '420');
    }
  });
}
