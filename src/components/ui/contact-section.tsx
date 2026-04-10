import { useEffect, useRef } from 'react';
import { GlobeInteractive } from './cobe-globe-interactive';

export default function ContactSection() {
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = logoRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('contact-logo--visible');
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="contact-section" id="contact">
      <div className="contact-section__inner">
        {/* Left – copy */}
        <div className="contact-section__left">
          <span className="contact-section__pill">✦ Contact</span>

          <h2 className="contact-section__heading">
            Let's build something<br />great together
          </h2>

          <p className="contact-section__desc">
            Have questions or need assistance? Reach out to us! Our team is here
            to help with your digital marketing needs. Let's connect and explore
            how we can work together!
          </p>

          <div className="contact-section__grid">
            <div className="contact-section__block">
              <h4 className="contact-section__label">Head Office</h4>
              <p className="contact-section__value">West Yorkshire</p>
            </div>

            <div className="contact-section__block">
              <h4 className="contact-section__label">Email Support</h4>
              <a
                href="mailto:cosmodigi24@gmail.com"
                className="contact-section__value contact-section__link"
              >
                cosmodigi24@gmail.com
              </a>
            </div>

            <div className="contact-section__block">
              <h4 className="contact-section__label">Let's Talk</h4>
              <a
                href="tel:+447384157785"
                className="contact-section__value contact-section__link"
              >
                +44 7384 157785
              </a>
            </div>

            <div className="contact-section__block">
              <h4 className="contact-section__label">Working Hours</h4>
              <p className="contact-section__value">
                Monday – Friday<br />09 am – 05 pm
              </p>
            </div>
          </div>
        </div>

        {/* Right – globe */}
        <div className="contact-section__right">
          <GlobeInteractive className="w-full max-w-[520px]" />
        </div>
      </div>

      {/* Bottom logo stamp */}
      <div className="contact-logo" ref={logoRef}>
        <img src="/Cosmodigi.png" alt="Cosmodigi" className="contact-logo__img" />
      </div>
    </section>
  );
}
