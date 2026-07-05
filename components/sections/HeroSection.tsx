'use client';
import { useState } from 'react';
import Link from 'next/link';
import InquiryModal from '@/components/ui/InquiryModal';
import styles from './HeroSection.module.css';

const highlights = [
  {
    title: 'Goal-Based Financial Planning',
    desc: 'Strategies designed around your specific financial milestones.',
  },
  {
    title: 'Investment Solutions Aligned with Your Risk Profile',
    desc: 'Personalized portfolios that match your risk appetite and time horizon.',
  },
  {
    title: 'Personalized Strategies for Every Financial Goal',
    desc: 'From wealth creation to family protection — we cover it all.',
  },
];

export default function HeroSection() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section className={styles.hero} id="home">
        {/* Animated background */}
        <div className={styles.bg}>
          <div className={styles.bgGrad1} />
          <div className={styles.bgGrad2} />
          <div className={styles.bgGrid} />
        </div>

        <div className={`container ${styles.content}`}>
          <div className={styles.textCol}>
            <div className={styles.overline}>
              <span className={styles.dot} />
              Trusted Financial Advisory
            </div>

            <h1 className={styles.title}>
              <span className={styles.brand}>GrowNsure</span>
              <br />
              <span className={styles.tagline}>Financial Solutions</span>
              <br />
              <span className={styles.taglineAccent}>For A Secure Future</span>
            </h1>

            <p className={styles.sub}>
              Helping Families Achieve Short-Term Financial Security &amp; Long-Term Wealth Creation
            </p>

            <div className={styles.ctas}>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => setModalOpen(true)}
                id="hero-cta-inquiry"
              >
                Get in Touch
              </button>
              <Link href="/calculators" className="btn btn-ghost btn-lg" id="hero-cta-calculators">
                Try Calculators →
              </Link>
            </div>

            {/* Trust badges */}
            <div className={styles.badges}>
              <span className={styles.badge}>SEBI Registered Advisor</span>
              <span className={styles.badge}>AMFI Registered</span>
              <span className={styles.badge}>Client-First Approach</span>
            </div>
          </div>

          {/* Highlights */}
          <div className={styles.highlights}>
            {highlights.map((h, i) => (
              <div key={i} className={styles.highlight}>
                <div className={styles.highlightNum}>{String(i + 1).padStart(2, '0')}</div>
                <div>
                  <h3 className={styles.highlightTitle}>{h.title}</h3>
                  <p className={styles.highlightDesc}>{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className={styles.scrollIndicator}>
          <div className={styles.scrollLine} />
          <span>Scroll to explore</span>
          <div className={styles.scrollLine} />
        </div>
      </section>

      <InquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultService="General Inquiry"
      />
    </>
  );
}
