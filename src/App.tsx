import { useRef, useEffect, useCallback, useState, Suspense } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import InfiniteGallery from './components/ui/gallery-3d';
import ServicesSection from './components/ui/services-section';
import WorkSection, { WorkSectionHeader } from './components/ui/work-section';
import SplineSection from './components/ui/spline-section';

gsap.registerPlugin(ScrollTrigger);

const galleryImages = [
  { src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=60', alt: 'Landscape' },
  { src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&auto=format&fit=crop&q=60', alt: 'Mountains' },
  { src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&fit=crop&q=60', alt: 'Forest' },
  { src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&auto=format&fit=crop&q=60', alt: 'Trees' },
  { src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&auto=format&fit=crop&q=60', alt: 'Field' },
  { src: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&auto=format&fit=crop&q=60', alt: 'Lake' },
  { src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&auto=format&fit=crop&q=60', alt: 'Valley' },
  { src: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&auto=format&fit=crop&q=60', alt: 'Space' },
];

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroPinRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const maskLayerRef = useRef<HTMLDivElement>(null);
  const tunnelLayerRef = useRef<HTMLDivElement>(null);
  const behindRef = useRef<HTMLDivElement>(null);
  const behindTextRef = useRef<HTMLDivElement>(null);
  const behindPhotosRef = useRef<(HTMLDivElement | null)[]>([]);
  const textImgRef = useRef<HTMLImageElement | null>(null);
  const [galleryProgress, setGalleryProgress] = useState(0);
  const preloaderRef = useRef<HTMLDivElement>(null);
  const serviceListRef = useRef<HTMLDivElement>(null);
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;

  const SERVICES = ['SEO', 'Social Media', 'Web Design', 'AI'];
  const LINE_H = 36; // matches CSS .preloader__service-item height

  const behindImages = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=60',
  ];

  // ── Preloader animation ───────────────────────────────
  useEffect(() => {
    const preloader = preloaderRef.current;
    const serviceList = serviceListRef.current;
    if (!preloader || !serviceList) return;

    document.body.style.overflow = 'hidden';

    const brand = preloader.querySelector('.preloader__brand');
    const divider = preloader.querySelector('.preloader__divider');
    const firstItem = serviceList.children[0] as HTMLElement;

    const tl = gsap.timeline({
      onComplete: () => {
        preloader.style.pointerEvents = 'none';
        document.body.style.overflow = '';
      },
    });

    // Entrance: brand + divider slide in, first service clips up
    tl.fromTo(brand, { x: -24, opacity: 0 }, { x: 0, opacity: 1, duration: 0.55, ease: 'power2.out' }, 0);
    tl.fromTo(divider, { scaleY: 0 }, { scaleY: 1, duration: 0.4, ease: 'power2.out' }, 0.15);
    tl.fromTo(firstItem, { y: LINE_H, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, 0.25);

    // Roll up through each service
    SERVICES.slice(1).forEach((_, i) => {
      tl.to(serviceList, {
        y: -LINE_H * (i + 1),
        duration: 0.45,
        ease: 'power2.inOut',
      }, 0.9 + i * 0.65);
    });

    // Slide entire preloader up to reveal page
    tl.to(preloader, {
      yPercent: -100,
      duration: 0.85,
      ease: 'power3.inOut',
    }, '+=0.45');

    return () => {
      tl.kill();
      document.body.style.overflow = '';
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Draw canvas mask ──────────────────────────────────
  const drawMask = useCallback(() => {
    const canvas = canvasRef.current;
    const textImg = textImgRef.current;
    if (!canvas || !textImg || !textImg.complete || !textImg.naturalWidth) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.fillStyle = '#f2f0ed';
    ctx.fillRect(0, 0, w, h);

    const imgAspect = textImg.naturalWidth / textImg.naturalHeight;
    const imgW = w * 0.78;
    const imgH = imgW / imgAspect;
    const imgX = (w - imgW) / 2;
    const imgY = h - imgH - h * 0.03;

    // Strip white bg, keep only dark text
    const tmp = document.createElement('canvas');
    tmp.width = Math.round(imgW * dpr);
    tmp.height = Math.round(imgH * dpr);
    const tCtx = tmp.getContext('2d')!;
    tCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    tCtx.drawImage(textImg, 0, 0, imgW, imgH);

    const id = tCtx.getImageData(0, 0, tmp.width, tmp.height);
    const d = id.data;
    for (let i = 0; i < d.length; i += 4) {
      const lum = d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114;
      d[i] = 0;
      d[i + 1] = 0;
      d[i + 2] = 0;
      d[i + 3] = Math.round(255 - lum);
    }
    tCtx.putImageData(id, 0, 0);

    ctx.drawImage(tmp, 0, 0, tmp.width, tmp.height, imgX, imgY, imgW, imgH);

    // Punch out the "o" counter
    const oCenterX = imgX + imgW * 0.2033;
    const oCenterY = imgY + imgH * 0.527;
    const oRadX = imgW * 0.045;
    const oRadY = imgH * 0.22;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.ellipse(oCenterX, oCenterY, oRadX, oRadY, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    // Set transform-origins
    const originX = `${(oCenterX / w) * 100}%`;
    const originY = `${(oCenterY / h) * 100}%`;
    if (maskLayerRef.current) {
      maskLayerRef.current.style.transformOrigin = `${originX} ${originY}`;
    }
  }, []);

  // ── Load text image ───────────────────────────────────
  useEffect(() => {
    const img = new Image();
    img.src = '/Cosmodigi.png';
    img.onload = () => {
      textImgRef.current = img;
      drawMask();
      ScrollTrigger.refresh();
    };
    if (img.complete) {
      textImgRef.current = img;
      drawMask();
    }
  }, [drawMask]);

  // ── Resize handler ────────────────────────────────────
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        drawMask();
        ScrollTrigger.refresh();
      }, 200);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [drawMask]);

  // ── GSAP scroll animation (desktop only) ──────────────
  useEffect(() => {
    if (isMobile) return;

    const hero = heroRef.current;
    const heroPin = heroPinRef.current;
    const heroContent = heroContentRef.current;
    const maskLayer = maskLayerRef.current;
    const tunnelLayer = tunnelLayerRef.current;
    const behind = behindRef.current;
    if (!hero || !heroPin || !heroContent || !maskLayer || !tunnelLayer || !behind) return;

    const navItems = document.querySelectorAll('.corner-nav__item');

    gsap.set(behind, { yPercent: 100 });
    gsap.set(tunnelLayer, { opacity: 0 });

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
          const light = self.progress > 0.10;
          navItems.forEach((el) => el.classList.toggle('is-light', light));
          // Map gallery phase (0.18→0.74) to 0→1 for the gallery
          const p = self.progress;
          const galleryP = Math.max(0, Math.min(1, (p - 0.18) / (0.74 - 0.18)));
          setGalleryProgress(galleryP);
        },
      },
    });

    /* ── PHASE 1 (0 → 0.20): Zoom into the "o" ── */
    tl.to(heroContent, {
      opacity: 0,
      y: -40,
      duration: 0.08,
      ease: 'none',
    }, 0);

    tl.to(maskLayer, {
      scale: 50,
      duration: 0.20,
      ease: 'power2.in',
      force3D: true,
    }, 0);

    tl.to(maskLayer, {
      opacity: 0,
      duration: 0.05,
      ease: 'none',
    }, 0.15);

    /* ── PHASE 2 (0.18 → 0.78): 3D Gallery tunnel ── */
    tl.to(tunnelLayer, {
      opacity: 1,
      duration: 0.04,
      ease: 'none',
    }, 0.17);

    // Hold tunnel visible...
    tl.to(tunnelLayer, {
      opacity: 1,
      duration: 0.56,
    }, 0.18);

    // Fade tunnel out
    tl.to(tunnelLayer, {
      opacity: 0,
      duration: 0.06,
      ease: 'none',
    }, 0.74);

    /* ── PHASE 3 (0.76 → 1.0): Reveal work section from bottom ── */
    const behindText = behindTextRef.current;
    const photos = behindPhotosRef.current.filter(Boolean) as HTMLDivElement[];

    // Section slides up from bottom
    gsap.set(behind, { yPercent: 100, opacity: 1 });
    tl.to(behind, {
      yPercent: 0,
      duration: 0.12,
      ease: 'power2.out',
    }, 0.76);

    // 4 photos start stacked at center, spread outward
    // Final positions: top-left, top-right, bottom-left, bottom-right
    const photoTargets = [
      { x: '-250%', y: '-140%', rotation: -8 },   // top-left
      { x: '250%', y: '-130%', rotation: 6 },     // top-right
      { x: '-240%', y: '150%', rotation: 5 },     // bottom-left
      { x: '260%', y: '140%', rotation: -4 },     // bottom-right
    ];

    photos.forEach((photo, i) => {
      gsap.set(photo, { x: '0%', y: '0%', rotation: 0, scale: 0.6, opacity: 0 });

      tl.to(photo, {
        opacity: 1,
        scale: 1,
        duration: 0.06,
        ease: 'none',
      }, 0.80);

      tl.to(photo, {
        x: photoTargets[i].x,
        y: photoTargets[i].y,
        rotation: photoTargets[i].rotation,
        duration: 0.16,
        ease: 'power2.out',
        force3D: true,
      }, 0.80);
    });

    // Text fades in
    if (behindText) {
      gsap.set(behindText, { y: 40, opacity: 0 });
      tl.to(behindText, {
        y: 0,
        opacity: 1,
        duration: 0.10,
        ease: 'power2.out',
      }, 0.82);
    }

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [isMobile]);

  return (
    <>
      {/* Preloader */}
      <div className="preloader" ref={preloaderRef}>
        <div className="preloader__inner">
          <span className="preloader__brand">Cosmodigi</span>
          <div className="preloader__divider" />
          <div className="preloader__service-wrap">
            <div className="preloader__service-list" ref={serviceListRef}>
              {SERVICES.map((s) => (
                <span key={s} className="preloader__service-item">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Corner Navigation */}
      <nav className="corner-nav">
        <a href="#welcome" className="corner-nav__item corner-nav__tl">
          <span className="corner-nav__dot" /> WELCOME
        </a>
        <a href="#innovation" className="corner-nav__item corner-nav__tr">INNOVATION</a>
        <a href="#who" className="corner-nav__item corner-nav__bl">WHO</a>
        <a href="#contact" className="corner-nav__item corner-nav__br">CONTACT</a>
      </nav>

      <main>
        <section className="hero" id="welcome" ref={heroRef}>
          <div className="hero__pin" ref={heroPinRef}>

            {/* Layer 1: Work section (behind) */}
            <div className="hero__behind" id="work" ref={behindRef}>
              {/* 4 floating photos */}
              {behindImages.map((src, i) => (
                <div
                  key={i}
                  className="behind-photo"
                  ref={(el) => { behindPhotosRef.current[i] = el; }}
                >
                  <img src={src} alt="" />
                </div>
              ))}
              {/* Center text */}
              <div className="behind-text" ref={behindTextRef}>
                <p className="behind-text__body">
                  At <span className="behind-text__brand">Cosmodigi©</span> simplicity
                  meets strategy to craft
                  bold, intuitive websites
                  that bring your vision
                  <span className="behind-text__fade"> to life.</span>
                </p>
                <div className="behind-text__cta">
                  <a href="#contact" className="behind-cta-btn">
                    contact me <span className="behind-cta-arrow">↗</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Layer 2: Canvas mask */}
            <div className="hero__mask-layer" ref={maskLayerRef}>
              <canvas ref={canvasRef} className="hero__mask-canvas" />
              <img src="/Cosmodigi.png" alt="Cosmodigi" className="hero__mask-img-mobile" />
            </div>

            {/* Layer 2b: 3D Gallery Tunnel — always mounted so textures preload */}
            <div
              className="tunnel-layer"
              ref={tunnelLayerRef}
            >
              <Suspense fallback={<div className="w-full h-full bg-black" />}>
                <InfiniteGallery
                  images={galleryImages}
                  speed={1.2}
                  visibleCount={12}
                  className="h-full w-full"
                  scrollProgress={galleryProgress}
                />
                {/* Overlay text */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center mix-blend-exclusion">
                  <h1 className="font-serif text-4xl md:text-7xl tracking-tight text-white italic">
                    Cosmodigi
                  </h1>
                </div>
              </Suspense>
            </div>

            {/* Layer 3: Welcome copy */}
            <div className="hero__content" ref={heroContentRef}>
              <p className="hero__label">WELCOME</p>
              <p className="hero__desc">
                We are a group of design companies that amplify creativity, craft
                &amp; innovation&nbsp;—&nbsp;helping brands reshape our world.
              </p>
            </div>

          </div>
        </section>

        {/* Mobile work section */}
        <section className="work-section-mobile" id="work-mobile">
          <div className="work-section-mobile__content">
            <p className="behind-text__body" style={{ fontSize: '1.5rem' }}>
              At <span className="behind-text__brand">Cosmodigi&copy;</span> simplicity
              meets strategy to craft
              bold, intuitive websites
              that bring your vision
              <span className="behind-text__fade"> to life.</span>
            </p>
            <div className="behind-text__cta" style={{ marginTop: '1.5rem' }}>
              <a href="#contact" className="behind-cta-btn">
                contact me <span className="behind-cta-arrow">&nearr;</span>
              </a>
            </div>
          </div>
        </section>

        <ServicesSection />

        <WorkSectionHeader />

        <SplineSection />

        <WorkSection />

        <section style={{ height: '100vh', background: '#0d0d0d' }} />
      </main>
    </>
  );
}
