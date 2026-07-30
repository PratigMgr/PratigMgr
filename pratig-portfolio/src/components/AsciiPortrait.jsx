import React, { useEffect, useRef } from 'react';

// A cutout portrait (transparent background) sampled onto a dense grid and
// redrawn as loose ASCII characters floating in negative space — no card,
// no bounding box, just a silhouette built out of type. Each character is
// a lightweight spring-physics particle: it rests on its "home" pixel, the
// cursor passing nearby shoves it away, and released it eases back home.
// Only pixels with real alpha (i.e. the subject, not the background) get a
// particle, which is what makes this read as a floating figure rather than
// a filled-in rectangle. Approach follows the same pixel-sampling idea as
// gazijarin.com's portrait effect, reimplemented from scratch for this
// build's own theme and physics.
const RAMP = ' .....,,,,:;+*#';

function AsciiPortrait({ src, alt = '', cols = 90, start = true }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const rafRef = useRef(null);
  const sizeRef = useRef({ w: 0, h: 0 });
  const entranceStartRef = useRef(0);
  const hasEnteredRef = useRef(false);
  const cursorEnergyRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return undefined;
    const ctx = canvas.getContext('2d');

    let cancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    // Image loads immediately in the background, but the particle grid
    // (which is what kicks off the fall-in + jelly entrance) only builds
    // once `start` flips true — i.e. once the loader has finished. Until
    // then particlesRef stays empty and the canvas simply draws nothing.
    img.onload = () => { if (!cancelled && start) build(img); };

    function build(img) {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = rect.width;
      const h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { w, h };

      const rows = Math.round(cols * (h / w));

      // Sample the (transparent-background) source image onto a grid
      // matching character density; cover-fit so it fills the frame.
      const sample = document.createElement('canvas');
      sample.width = cols;
      sample.height = rows;
      const sctx = sample.getContext('2d');
      const srcRatio = img.width / img.height;
      const dstRatio = cols / rows;
      let sw = img.width, sh = img.height, sx = 0, sy = 0;
      if (srcRatio > dstRatio) {
        sw = img.height * dstRatio;
        sx = (img.width - sw) / 2;
      } else {
        sh = img.width / dstRatio;
        sy = (img.height - sh) / 2;
      }
      sctx.drawImage(img, sx, sy, sw, sh, 0, 0, cols, rows);
      const data = sctx.getImageData(0, 0, cols, rows).data;

      const cellW = w / cols;
      const cellH = h / rows;
      const particles = [];
      for (let ry = 0; ry < rows; ry += 1) {
        for (let cx = 0; cx < cols; cx += 1) {
          if ((cx + ry) % 2 !== 0) continue; // checkerboard thinning — roughly half density, lighter/airier silhouette
          const i = (ry * cols + cx) * 4;
          const alpha = data[i + 3];
          if (alpha < 90) continue; // skip transparent background pixels
          const r = data[i], g = data[i + 1], b = data[i + 2];
          const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          const ox = cx * cellW + cellW / 2;
          const oy = ry * cellH + cellH / 2;
          const rampIdx = Math.min(RAMP.length - 1, Math.floor(brightness * RAMP.length));
          // Particles start scattered above their resting spot and fall/spring
          // into place — this replays every time the portrait first mounts,
          // i.e. on every page load/refresh, in step with the headline typing
          // in. A later rebuild (e.g. a window resize) just re-grids in place.
          const startY = hasEnteredRef.current ? oy : oy - (h * 0.3 + Math.random() * h * 0.25);
          const startX = hasEnteredRef.current ? ox : ox + (Math.random() - 0.5) * cellW * 3;
          particles.push({
            ox, oy, x: startX, y: startY, vx: 0, vy: 0,
            char: RAMP[rampIdx], brightness,
          });
        }
      }
      particlesRef.current = particles;
      entranceStartRef.current = performance.now();
      hasEnteredRef.current = true;
    }

    function onResize() { if (img.complete) build(img); }

    const handlePointerMove = (e) => {
      const rect = wrap.getBoundingClientRect();
      const nx = e.clientX - rect.left;
      const ny = e.clientY - rect.top;
      const prev = mouseRef.current;
      if (prev.active) {
        // How far the cursor moved since the last sample — fast swipes pump
        // more energy into the whole-image wobble than a slow drift does.
        const speed = Math.hypot(nx - prev.x, ny - prev.y);
        cursorEnergyRef.current = Math.min(50, cursorEnergyRef.current + speed * 0.6);
      }
      mouseRef.current = { x: nx, y: ny, active: true };
    };
    const handlePointerLeave = () => { mouseRef.current.active = false; };
    const handleTouchMove = (e) => {
      const t = e.touches[0];
      if (t) handlePointerMove({ clientX: t.clientX, clientY: t.clientY });
    };

    wrap.addEventListener('mousemove', handlePointerMove);
    wrap.addEventListener('mouseleave', handlePointerLeave);
    wrap.addEventListener('touchmove', handleTouchMove, { passive: true });
    wrap.addEventListener('touchend', handlePointerLeave);
    window.addEventListener('resize', onResize);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const REPEL_RADIUS = 22;
    const REPEL_STRENGTH = 1000;
    const SPRING = 0.07;
    const DAMPING = 0.8;
    const rootStyles = getComputedStyle(document.documentElement);

    function frame() {
      const { w, h } = sizeRef.current;
      if (!w || !h) { rafRef.current = requestAnimationFrame(frame); return; }
      ctx.clearRect(0, 0, w, h);

      const asciiColor = rootStyles.getPropertyValue('--ascii-ink').trim()
        || rootStyles.getPropertyValue('--accent').trim()
        || '#ffb454';
      const alphaMin = parseFloat(rootStyles.getPropertyValue('--ascii-alpha-min')) || 0.18;
      const alphaMax = parseFloat(rootStyles.getPropertyValue('--ascii-alpha-max')) || 0.88;
      const weight = rootStyles.getPropertyValue('--ascii-weight').trim() || '400';
      const fontScale = parseFloat(rootStyles.getPropertyValue('--ascii-font-scale')) || 1;
      const strokeRatio = parseFloat(rootStyles.getPropertyValue('--ascii-stroke')) || 0;
      const mouse = mouseRef.current;
      const cellFont = Math.max(4, (w / cols) * 1.15) * fontScale;
      ctx.font = `${weight} ${cellFont}px "JetBrains Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const entranceElapsed = performance.now() - entranceStartRef.current;
      const entranceFade = reduceMotion ? 1 : Math.min(1, Math.max(0, entranceElapsed / 1000));
      // Jelly wobble: a traveling sine wave through the grid, keyed off each
      // particle's distance from center so it reads as a ripple sweeping
      // outward rather than every char bouncing in lockstep. Amplitude
      // decays to zero over ~2.6s (slower settle) and the wave itself moves
      // at a gentler pace than before.
      const jellyEnvelope = reduceMotion ? 0 : Math.max(0, 1 - entranceElapsed / 2600);
      const jellyAmp = 5 * jellyEnvelope;
      const centerX = w / 2;
      const centerY = h / 2;

      // Whole-image jelly: cursor movement pumps "energy" (set in
      // handlePointerMove) that decays a little each frame and drives a
      // sine wave through every particle — the whole silhouette wobbles as
      // one soft body in response to the cursor, not just the characters
      // right under it.
      if (!reduceMotion) cursorEnergyRef.current *= 0.93;
      const cursorAmp = cursorEnergyRef.current * 0.12;
      const nowSec = performance.now() / 1000;

      const particles = particlesRef.current;
      for (let idx = 0; idx < particles.length; idx += 1) {
        const p = particles[idx];
        if (!reduceMotion) {
          if (mouse.active) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            if (dist < REPEL_RADIUS) {
              const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH;
              p.vx += (dx / dist) * force * 0.016;
              p.vy += (dy / dist) * force * 0.016;
            }
          }
          p.vx += (p.ox - p.x) * SPRING;
          p.vy += (p.oy - p.y) * SPRING;
          p.vx *= DAMPING;
          p.vy *= DAMPING;
          p.x += p.vx;
          p.y += p.vy;
        } else {
          p.x = p.ox;
          p.y = p.oy;
        }
        let drawX = p.x;
        let drawY = p.y;
        const distFromCenter = Math.hypot(p.ox - centerX, p.oy - centerY);
        if (jellyEnvelope > 0) {
          const phase = (entranceElapsed / 1000) * 5 - distFromCenter * 0.045;
          drawX += Math.sin(phase) * jellyAmp;
          drawY += Math.cos(phase * 0.85) * jellyAmp * 0.7;
        }
        if (cursorAmp > 0.05) {
          const cursorPhase = nowSec * 11 - distFromCenter * 0.05;
          drawX += Math.sin(cursorPhase) * cursorAmp;
          drawY += Math.cos(cursorPhase * 0.85) * cursorAmp * 0.7;
        }
        const t = p.brightness;
        const a = (alphaMin + t * (alphaMax - alphaMin)) * entranceFade;
        ctx.globalAlpha = a;
        if (strokeRatio > 0) {
          ctx.strokeStyle = asciiColor;
          ctx.lineWidth = cellFont * strokeRatio;
          ctx.strokeText(p.char, drawX, drawY);
        }
        ctx.fillStyle = asciiColor;
        ctx.fillText(p.char, drawX, drawY);
      }
      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
      wrap.removeEventListener('mousemove', handlePointerMove);
      wrap.removeEventListener('mouseleave', handlePointerLeave);
      wrap.removeEventListener('touchmove', handleTouchMove);
      wrap.removeEventListener('touchend', handlePointerLeave);
    };
  }, [src, cols, start]);

  return (
    <div className="ascii-portrait" ref={wrapRef} role="img" aria-label={alt}>
      <canvas ref={canvasRef} />
    </div>
  );
}

export default AsciiPortrait;
