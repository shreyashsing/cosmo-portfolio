import { useEffect, useRef } from 'react';
import { SplineScene } from '@/components/ui/splite';
import { Spotlight } from '@/components/ui/spotlight';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CARDS = [
  {
    eyebrow: 'AI AUTOMATION',
    title: 'Meet Aria',
    titleAccent: 'Your AI Receptionist',
    body: 'We built an intelligent voice & chat agent that handles inbound calls, books appointments, answers FAQs, and escalates complex queries — 24 hours a day, 7 days a week. No hold music. No missed leads.',
    tag: null,
    demo: true,
    cta: false,
  },
  {
    eyebrow: 'CLIENT — 01',
    title: 'SpiceDelight',
    titleAccent: 'Restaurant Chain',
    body: 'SpiceDelight deployed Aria across 4 locations. The agent now handles 300+ daily reservation calls autonomously, reduced no-shows by 34%, and freed their front-of-house staff to focus on in-person guests.',
    tag: { metric: '300+ calls / day', metricLabel: 'handled autonomously' },
    cta: false,
  },
  {
    eyebrow: 'CLIENT — 02',
    title: "Julio's",
    titleAccent: 'Fine Dining',
    body: "Julio's white-glove clientele demanded a seamless booking experience. Aria was trained on their menu, private events offering, and brand voice — guests can't tell the difference from a human concierge.",
    tag: { metric: '4.9 / 5', metricLabel: 'average post-call rating' },
    cta: false,
  },
  {
    eyebrow: 'READY TO AUTOMATE?',
    title: 'AI that works',
    titleAccent: 'for your business',
    body: `From intelligent receptionists and booking agents to workflow automations and smart integrations — we build custom AI solutions that cut costs, save time, and scale with you. Whatever the industry, we'll find the automation that fits.`,
    tag: null,
    cta: true,
  },
];

export default function SplineSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    if (!section || !sticky) return;

    const cards = gsap.utils.toArray<HTMLElement>('.ai-card');
    const total = cards.length;

    // Keep one visible card at a time: every next card slides up and covers the previous card.
    cards.forEach((card, i) => {
      gsap.set(card, { zIndex: i + 1, y: '110%', opacity: 1 });
    });
    gsap.set(cards[0], { y: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        pin: sticky,
        pinSpacing: false,
      },
    });

    // Each incoming card slides up to the exact same position, stacking on top.
    for (let i = 1; i < total; i++) {
      tl.to(cards[i], {
        y: 0,
        duration: 1,
        ease: 'power3.out',
      }, i - 1);
    }

    return () => {
      const scrollTrigger = tl.scrollTrigger;
      tl.kill();
      scrollTrigger?.kill();
    };
  }, []);

  return (
    <div className="ai-section" ref={sectionRef} id="ai">
      <div className="ai-sticky" ref={stickyRef}>
        <Spotlight className="-top-40 -left-20 opacity-50" fill="rgba(255,255,255,0.32)" />

        {/* Left: card stack */}
        <div className="ai-left">
          <div className="ai-stack-area">
            <div className="ai-stack">
              {CARDS.map((c, i) => (
                <div key={i} className="ai-card">
                  <span className="ai-panel__eyebrow">{c.eyebrow}</span>
                  <h2 className="ai-panel__title">
                    {c.title}<br />
                    <span className="ai-panel__title--accent">{c.titleAccent}</span>
                  </h2>
                  <p className="ai-panel__body">{c.body}</p>

                  {c.demo && (
                    <a href="#contact" className="spline-section__cta" style={{ marginTop: '1.25rem' }}>
                      Book a Demo <span>↗</span>
                    </a>
                  )}

                  {c.tag && (
                    <div className="ai-panel__metric">
                      <span className="ai-panel__metric-num">{c.tag.metric}</span>
                      <span className="ai-panel__metric-label">{c.tag.metricLabel}</span>
                    </div>
                  )}

                  {c.cta && (
                    <a href="#contact" className="spline-section__cta" style={{ marginTop: '1.75rem' }}>
                      Talk to us <span>↗</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="ai-clients">
            <span className="ai-clients__label">TRUSTED BY</span>
            <div className="ai-clients__list">
              <span className="ai-clients__name">SpiceDelight</span>
              <span className="ai-clients__sep">·</span>
              <span className="ai-clients__name">Julio's</span>
            </div>
          </div>
        </div>

        {/* Right: robot */}
        <div className="ai-right">
          <div className="ai-scene">
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </div>
          <div className="ai-glow" />
        </div>
      </div>
    </div>
  );
}

