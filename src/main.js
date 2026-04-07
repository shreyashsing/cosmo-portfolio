import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './style.css';

gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════════════════════
   Canvas mask: load Cosmodigi.png, isolate the dark text
   pixels, and punch them out of a solid #f2f0ed fill.
   Drawn ONCE — GSAP animates via CSS transform only.
   ══════════════════════════════════════════════════════════ */
const canvas = document.getElementById('maskCanvas');
const ctx = canvas.getContext('2d');
const textImg = new Image();
textImg.src = '/Cosmodigi.png';

function drawMask() {
  if (!textImg.complete || !textImg.naturalWidth) return;

  const dpr = window.devicePixelRatio || 1;
  const w = window.innerWidth;
  const h = window.innerHeight;

  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // 1. Fill entire canvas with hero bg color (opaque wall)
  ctx.fillStyle = '#f2f0ed';
  ctx.fillRect(0, 0, w, h);

  // 2. Size & position the text image
  const imgAspect = textImg.naturalWidth / textImg.naturalHeight;
  const imgW = w * 0.78;
  const imgH = imgW / imgAspect;
  const imgX = (w - imgW) / 2;
  const imgY = h - imgH - h * 0.03;

  // 3. Draw text image on temp canvas, strip white bg, keep only dark text
  const tmp = document.createElement('canvas');
  tmp.width = Math.round(imgW * dpr);
  tmp.height = Math.round(imgH * dpr);
  const tCtx = tmp.getContext('2d');
  tCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  tCtx.drawImage(textImg, 0, 0, imgW, imgH);

  const id = tCtx.getImageData(0, 0, tmp.width, tmp.height);
  const d = id.data;
  for (let i = 0; i < d.length; i += 4) {
    const lum = d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114;
    // Dark pixels = text (keep opaque black), light pixels = bg (make transparent)
    const alpha = 255 - lum;
    d[i] = 0;
    d[i + 1] = 0;
    d[i + 2] = 0;
    d[i + 3] = Math.round(alpha);
  }
  tCtx.putImageData(id, 0, 0);

  // 4. Draw only the black text onto the hero bg (white is now transparent)
  ctx.drawImage(tmp, 0, 0, tmp.width, tmp.height, imgX, imgY, imgW, imgH);

  // 5. Punch out the counter (hole) of the first "o" in "Cosmodigi"
  //    Pixel-scanned center: (406, 277) in 1998x528 → ratios (0.2033, 0.5251)
  //    Counter bounds 152x209 → 85% inset radii for clean edge
  const oCenterX = imgX + imgW * 0.2033;
  const oCenterY = imgY + imgH * 0.527;
  const oRadX = imgW * 0.045;
  const oRadY = imgH * 0.22;

  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.ellipse(oCenterX, oCenterY, oRadX, oRadY, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = 'source-over';

  // Set transform-origin to center of the "o" counter
  const originX = `${(oCenterX / w) * 100}%`;
  const originY = `${(oCenterY / h) * 100}%`;
  const maskLayer = document.querySelector('.hero__mask-layer');
  if (maskLayer) {
    maskLayer.style.transformOrigin = `${originX} ${originY}`;
  }
  // Also set the behind section's transform-origin to the same point
  // so it can counter-scale from the "o" center
  const behind = document.querySelector('.hero__behind');
  if (behind) {
    behind.style.transformOrigin = `${originX} ${originY}`;
  }
}

textImg.onload = () => {
  drawMask();
  ScrollTrigger.refresh();
};
if (textImg.complete) drawMask();

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    drawMask();
    ScrollTrigger.refresh();
  }, 200);
});

/* ══════════════════════════════════════════════════════════
   Scroll animation — desktop only
   3 phases: (1) zoom into "o" → (2) tunnel journey → (3) reveal work
   ══════════════════════════════════════════════════════════ */
const isMobile = window.matchMedia('(max-width: 768px)').matches;

if (!isMobile) {
  const hero        = document.querySelector('.hero');
  const heroPin     = document.querySelector('.hero__pin');
  const heroContent = document.querySelector('.hero__content');
  const maskLayer   = document.querySelector('.hero__mask-layer');
  const behind      = document.querySelector('.hero__behind');
  const tunnel      = document.getElementById('tunnel');
  const tunnelBg    = document.querySelector('.tunnel__bg');
  const rings       = document.querySelectorAll('.tunnel__ring');
  const cards       = document.querySelectorAll('.tunnel__card');
  const navItems    = document.querySelectorAll('.corner-nav__item');

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.8,
      pin: heroPin,
      pinSpacing: false,
      anticipatePin: 1,
      onUpdate(self) {
        const light = self.progress > 0.12;
        navItems.forEach(el => el.classList.toggle('is-light', light));
      },
    },
  });

  // Initial states
  gsap.set(behind, { opacity: 0 });
  gsap.set(tunnel, { opacity: 0, zIndex: 1 });

  /* ── PHASE 1 (0 → 0.22): Zoom into the "o" ──────────── */
  // Fade welcome copy
  tl.to(heroContent, {
    opacity: 0,
    y: -40,
    duration: 0.08,
    ease: 'none',
  }, 0);

  // Scale the canvas mask — zoom into the "o" hole
  tl.to(maskLayer, {
    scale: 50,
    duration: 0.22,
    ease: 'power2.in',
    force3D: true,
  }, 0);

  // Fade mask out as it fully zooms
  tl.to(maskLayer, {
    opacity: 0,
    duration: 0.06,
    ease: 'none',
  }, 0.16);

  /* ── PHASE 2 (0.20 → 0.75): Tunnel journey ──────────── */
  // Show tunnel
  tl.to(tunnel, {
    opacity: 1,
    zIndex: 5,
    duration: 0.04,
    ease: 'none',
  }, 0.18);

  // Animate gradient bg — color shift via overlay opacity
  // (GSAP can't interpolate gradient strings, so we use backgroundColor)
  tl.fromTo(tunnelBg, {
    backgroundColor: '#0a0a12',
  }, {
    backgroundColor: '#1a3a4a',
    duration: 0.55,
    ease: 'none',
  }, 0.20);

  // Animate rings — they rush towards the viewer (scale up & fade out)
  rings.forEach((ring, i) => {
    const delay = 0.20 + i * 0.08;
    tl.fromTo(ring, {
      scale: 0.3,
      opacity: 0,
    }, {
      scale: 3 + i * 0.5,
      opacity: 0.6,
      duration: 0.25,
      ease: 'power1.in',
    }, delay);
    tl.to(ring, {
      scale: 6 + i,
      opacity: 0,
      duration: 0.15,
      ease: 'none',
    }, delay + 0.20);
  });

  // Fly cards towards the viewer — each from a slightly offset angle
  const cardOffsets = [
    { x: -15, y: -10, rot: -8 },
    { x: 20, y: -15, rot: 6 },
    { x: -25, y: 12, rot: -5 },
    { x: 18, y: 10, rot: 9 },
    { x: 0, y: -5, rot: -3 },
  ];

  cards.forEach((card, i) => {
    const off = cardOffsets[i];
    const start = 0.25 + i * 0.07;

    // Start small in the center (far away in the tunnel), fly towards viewer
    tl.fromTo(card, {
      x: '-50%',
      y: '-50%',
      scale: 0.1,
      opacity: 0,
      rotateX: 15,
      rotateY: off.rot,
      z: -600,
    }, {
      scale: 1,
      opacity: 1,
      rotateX: 0,
      rotateY: 0,
      z: 0,
      x: `calc(-50% + ${off.x}vw)`,
      y: `calc(-50% + ${off.y}vh)`,
      duration: 0.14,
      ease: 'power2.out',
    }, start);

    // Then fly past the viewer (scale up huge, fade)
    tl.to(card, {
      scale: 3,
      opacity: 0,
      z: 500,
      duration: 0.10,
      ease: 'power1.in',
    }, start + 0.12);
  });

  /* ── PHASE 3 (0.72 → 1.0): Reveal work section ─────── */
  // Fade tunnel out
  tl.to(tunnel, {
    opacity: 0,
    duration: 0.08,
    ease: 'none',
  }, 0.72);

  // Fade in the work (behind) section
  tl.to(behind, {
    opacity: 1,
    duration: 0.10,
    ease: 'none',
  }, 0.72);

  // Slight scale punch on the work section for impact
  gsap.set(behind, { scale: 1.1 });
  tl.to(behind, {
    scale: 1,
    duration: 0.18,
    ease: 'power2.out',
    force3D: true,
  }, 0.72);
}
