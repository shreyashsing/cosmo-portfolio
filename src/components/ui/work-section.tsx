
import { useEffect, useRef, useState } from 'react';
import ThreeDMarquee from './3d-marquee';
import { ZoomParallax } from './zoom-parallax';

// ── Animated stat count-up ────────────────────────────
function parseMetricValue(raw: string) {
  // Extract optional prefix (+), numeric part, and suffix (%,★, etc.)
  const match = raw.match(/^([+\-]?)([0-9,]+\.?[0-9]*)(.*)$/);
  if (!match) return { prefix: '', num: 0, decimals: 0, suffix: raw };
  const prefix = match[1];
  const numStr = match[2].replace(/,/g, '');
  const suffix = match[3];
  const num = parseFloat(numStr);
  const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0;
  return { prefix, num, decimals, suffix };
}

function AnimatedStat({ value }: { value: string }) {
  const { prefix, num, decimals, suffix } = parseMetricValue(value);
  const [display, setDisplay] = useState('0');
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        observer.disconnect();

        const duration = 1400;
        const steps = 50;
        const interval = duration / steps;
        let step = 0;

        // ease-out quad
        const ease = (t: number) => 1 - (1 - t) * (1 - t);

        const timer = setInterval(() => {
          step++;
          const progress = ease(step / steps);
          const current = num * progress;
          const formatted = decimals > 0
            ? current.toFixed(decimals)
            : Math.round(current).toLocaleString();
          setDisplay(formatted);
          if (step >= steps) {
            clearInterval(timer);
            setDisplay(
              decimals > 0 ? num.toFixed(decimals) : num.toLocaleString()
            );
          }
        }, interval);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [num, decimals]);

  return <span ref={ref}>{prefix}{display}{suffix}</span>;
}

const PARALLAX_IMAGES = [
  {
    video: '/julios.mp4',
    alt: 'Julio\'s Italian Restaurant',
  },
  {
    src: 'https://images.unsplash.com/photo-1512314889357-e157c22f938d?w=1280&h=720&fit=crop&auto=format&q=80',
    alt: 'Digital marketing',
  },
  {
    video:'video1.mp4',
    alt: 'Team collaboration',
  },
  {
    src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1280&h=720&fit=crop&auto=format&q=80',
    alt: 'Analytics dashboard',
  },
  {
    src: 'image1.png',
    alt: 'SEO growth',
  },
  {
    src: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1280&h=720&fit=crop&auto=format&q=80',
    alt: 'Data analysis',
  },
  {
    video: 'video2.mp4',
    alt: 'Business results',
  },
];

const MARQUEE_IMAGES = [
  'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=600&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&h=600&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=600&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1512314889357-e157c22f938d?w=800&h=600&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop&auto=format&q=80',
];

const PROJECTS = [
  {
    num: '01',
    service: 'LOCAL SEO',
    client: "Julio's Italian Restaurant",
    location: 'Halifax, UK',
    period: 'Oct 2025 – Mar 2026',
    headline: '#1 on Google for 9+ keywords',
    body: "Full local SEO overhaul for Julio's — optimising their Google Business Profile, building a Halifax-specific keyword strategy, and managing their online reputation. The result: top positions for every major Italian restaurant search in Halifax.",
    metrics: [
      { value: '955', label: 'Calls generated' },
      { value: '+60%', label: 'Call growth' },
      { value: '4.6★', label: '807 Google reviews' },
    ],
  },
  {
    num: '02',
    service: 'LOCAL SEO',
    client: 'Spice Delight Restaurant & Bar',
    location: 'Halifax, UK',
    period: 'Oct 2025 – Mar 2026',
    headline: '18+ keywords in Top 2 positions',
    body: 'End-to-end local SEO for Spice Delight — targeting high-intent "near me" and Halifax-specific searches, competitor positioning, and review management. Spice Delight now dominates the local Indian restaurant category on Google Maps and Search.',
    metrics: [
      { value: '1,844', label: 'Calls generated' },
      { value: '+60%', label: 'Call growth' },
      { value: '4.9★', label: '1,103 Google reviews' },
    ],
  },
];

const WEB_PROJECTS = [
  {
    client: 'CW Limited',
    tag: '[Web App & UI]',
    image: '',
    video: '/cwlimited.webm',
    span: 'wide',
  },
  {
    client: "Matewise Startup",
    tag: '[Software]',
    image: '/matewise.jpg',
  },
  {
    client: 'Sleepify',
    tag: '[Website & SEO]',
    image: '/sleepify.jpeg',
    span: 'narrow',
  },
  {
    client: 'UK immigration Experts',
    tag: '[Website]',
    image: '/UKimmiration.png',
    span: 'wide',
  },
];

export function WorkSectionHeader() {
  return (
    <div className="wrk wrk--header-only" id="work-section">
      <div className="wrk__header">
        <div className="wrk__header-pill">
          <span className="wrk__header-icon">✦</span>
          <span>WORK</span>
        </div>
        <p className="wrk__header-sub">
          A selection of projects built to solve real<br />
          problems and push creative boundaries
        </p>
      </div>
    </div>
  );
}

export default function WorkSection() {
  return (
    <section className="wrk wrk--content">
      {/* SEO section label */}
      <div className="wrk__section-label">
        <span className="wrk__header-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="wrk__header-icon">✦</span>
          <span>SEO</span>
        </span>
      </div>

      {/* SEO explainer video */}
      
      <div className="wrk__video-block">
        <div className="wrk__video-label">
          <span className="wrk__video-tag">WHAT IS SEO?</span>
          <p className="wrk__video-desc">
            Search Engine Optimisation puts your business at the top of Google — so the right customers find you first, every time.
          </p>
        </div>
        <div className="wrk__video-frame">
          <iframe
            src="https://www.youtube.com/embed/hF515-0Tduk"
            title="What is SEO? Search Engine Optimization Explained"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>

      <div className="wrk__grid">
        {PROJECTS.map((p) => (
          <article key={p.num} className="wrk-card">
            <div className="wrk-card__top">
              <span className="wrk-card__service">{p.service}</span>
              <span className="wrk-card__num">{p.num}</span>
            </div>

            <h3 className="wrk-card__client">{p.client}</h3>
            <p className="wrk-card__meta">{p.location} · {p.period}</p>

            <p className="wrk-card__headline">{p.headline}</p>
            <p className="wrk-card__body">{p.body}</p>

            <div className="wrk-card__metrics">
              {p.metrics.map((m) => (
                <div key={m.label} className="wrk-card__metric">
                  <span className="wrk-card__metric-value">
                    <AnimatedStat value={m.value} />
                  </span>
                  <span className="wrk-card__metric-label">{m.label}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>

      {/* Web Design portfolio */}
      <div className="wrk__section-label">
        <span className="wrk__header-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="wrk__header-icon">✦</span>
          <span>WEB DESIGN</span>
        </span>
      </div>
      <div className="wrk__portfolio-grid">
        {WEB_PROJECTS.map((p, i) => (
          <div key={i} className={`wrk__portfolio-card${p.span === 'wide' ? ' wrk__portfolio-card--wide' : ''}`}>
            {'video' in p && p.video ? (
              <video
                src={p.video}
                autoPlay
                muted
                loop
                playsInline
                className="wrk__portfolio-img"
              />
            ) : (
              <img src={p.image} alt={p.client} className="wrk__portfolio-img" />
            )}
            <div className="wrk__portfolio-overlay">
              <span className="wrk__portfolio-client">{p.client}</span>
              <span className="wrk__portfolio-tag">{p.tag}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Zoom parallax showcase */}
      <div className="wrk__parallax-wrap">
        <ZoomParallax images={PARALLAX_IMAGES} />
      </div>

      {/* 3D marquee */}
      <div className="wrk__marquee-wrap">
        <ThreeDMarquee className="rounded-none" />
      </div>
    </section>
  );
}
