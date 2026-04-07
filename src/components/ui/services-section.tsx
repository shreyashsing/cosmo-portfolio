import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';

interface Service {
  num: string;
  title: string;
  desc: string;
  tags?: string[];
  image: string;
}

const SERVICES: Service[] = [
  {
    num: '01',
    title: 'SEO',
    desc: 'Smart, sustainable search strategies that grow your visibility organically and bring the right audience to your door.',
    tags: ['# On-page SEO', '# Technical SEO', '# Content strategy'],
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=420&auto=format&fit=crop&q=70',
  },
  {
    num: '02',
    title: 'AI Solutions',
    desc: 'Integrating AI tools and automations into your workflow — smarter systems, faster results, less manual work.',
    tags: ['# AI chatbots', '# Automation', '# Smart integrations'],
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=420&auto=format&fit=crop&q=70',
  },
  {
    num: '03',
    title: 'Web Design',
    desc: 'From landing pages to full websites — I craft sleek, high-converting web designs that capture attention and drive results.',
    tags: ['# Websites', '# Landing pages', '# Portfolio & personal sites'],
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=420&auto=format&fit=crop&q=70',
  },
  {
    num: '04',
    title: 'Social Media',
    desc: 'Thumb-stopping content and consistent strategy that builds real communities and turns followers into loyal clients.',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=420&auto=format&fit=crop&q=70',
  },
  {
    num: '05',
    title: 'Graphic Design',
    desc: 'I design user-first interfaces for mobile apps, SaaS platforms, and dashboards — balancing usability with aesthetics. Every screen is purposeful, every flow frictionless.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=420&auto=format&fit=crop&q=70',
  },
];

export default function ServicesSection() {
  const [active, setActive] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const imgSlots = useRef<(HTMLImageElement | null)[]>([null, null]);
  const frontSlot = useRef(0);
  const prevActive = useRef<number | null>(null);
  const moveX = useRef<((v: number) => void) | null>(null);
  const moveY = useRef<((v: number) => void) | null>(null);

  // Pre-position slots + set up quickTo mouse followers
  useEffect(() => {
    const imgs = imgSlots.current;
    if (imgs[0]) gsap.set(imgs[0], { y: 0, opacity: 1 });
    if (imgs[1]) gsap.set(imgs[1], { y: '100%', opacity: 0 });

    const wrap = imgWrapRef.current;
    if (wrap) {
      // quickTo gives buttery lag-follow
      moveX.current = gsap.quickTo(wrap, 'x', { duration: 0.55, ease: 'power3.out' });
      moveY.current = gsap.quickTo(wrap, 'y', { duration: 0.55, ease: 'power3.out' });
    }
  }, []);

  // Track mouse over the body and move the image relative to it
  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;

    const onMove = (e: MouseEvent) => {
      const rect = body.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      moveX.current?.(x);
      moveY.current?.(y);
    };

    body.addEventListener('mousemove', onMove);
    return () => body.removeEventListener('mousemove', onMove);
  }, []);

  const transitionImage = (nextIdx: number) => {
    const imgs = imgSlots.current;
    const front = frontSlot.current;
    const back = front === 0 ? 1 : 0;

    const frontImg = imgs[front];
    const backImg = imgs[back];
    if (!frontImg || !backImg) return;

    backImg.src = SERVICES[nextIdx].image;
    gsap.set(backImg, { y: '100%', opacity: 1 });

    const tl = gsap.timeline({
      onComplete: () => { frontSlot.current = back; },
    });
    tl.to(backImg, { y: '0%', duration: 0.55, ease: 'power3.out' }, 0);
    tl.to(frontImg, { y: '-100%', opacity: 0, duration: 0.55, ease: 'power3.out' }, 0);
  };

  const handleEnter = (i: number) => {
    setActive(i);
    // Show image wrap
    gsap.to(imgWrapRef.current, { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' });
    if (prevActive.current !== i) {
      transitionImage(i);
      prevActive.current = i;
    }
  };

  const handleLeave = () => {
    setActive(null);
    gsap.to(imgWrapRef.current, { opacity: 0, scale: 0.92, duration: 0.25, ease: 'power2.in' });
  };

  return (
    <section className="svc" id="services" ref={sectionRef}>
      {/* Header */}
      <div className="svc__header">
        <div className="svc__header-pill">
          <span className="svc__header-icon">✦</span>
          <span>SERVICES</span>
        </div>
        <p className="svc__header-sub">
          Explore a range of creative services made<br />
          to grow your brand and reach more people
        </p>
      </div>

      {/* List + cursor-following image */}
      <div className="svc__body" ref={bodyRef}>
        {/* Image follows mouse — position is absolute inside section */}
        <div className="svc__img-wrap" ref={imgWrapRef}>
          {[0, 1].map((slot) => (
            <img
              key={slot}
              ref={(el) => { imgSlots.current[slot] = el; }}
              src=""
              alt=""
              className="svc__img-slot"
            />
          ))}
        </div>

        {/* Rows */}
        <ul className="svc__list">
          {SERVICES.map((s, i) => (
            <li
              key={s.num}
              className={`svc__row${active === i ? ' is-active' : ''}${active !== null && active !== i ? ' is-dim' : ''}`}
              onMouseEnter={() => handleEnter(i)}
              onMouseLeave={handleLeave}
            >
              <div className="svc__row-left">
                <span className="svc__row-title">
                  {s.title}
                  <sup className="svc__row-num">{s.num}</sup>
                </span>
              </div>
              <div className="svc__row-right">
                <p className="svc__row-desc">{s.desc}</p>
                {s.tags && (
                  <div className="svc__row-tags">
                    {s.tags.map((t) => (
                      <span key={t} className="svc__tag">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
