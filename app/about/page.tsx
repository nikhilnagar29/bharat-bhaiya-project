import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'About Bharat Rathore',
  description:
    'Learn about Bharat Rathore, a committed financial advisor helping individuals and families make informed decisions across Mutual Funds, Insurance, PMS, AIFs, and wealth management.',
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Page header */}
        <div className={styles.header}>
          <div className="container">
            <span className="label" style={{ color: 'var(--green-400)' }}>Our Story</span>
            <h1 className="heading-1" style={{ color: 'white', marginTop: '0.5rem' }}>About Me</h1>
          </div>
        </div>

        {/* Main content */}
        <section className={styles.section}>
          <div className="container">
            <div className={styles.layout}>
              {/* Left — avatar & credentials */}
              <aside className={styles.aside}>
                <div className={styles.avatar}>
                  <span className={styles.avatarInitial}>B</span>
                </div>
                <div className={styles.asideCard}>
                  <p className={styles.advisorName}>Bharat Rathore</p>
                  <p className={styles.advisorTitle}>Financial Advisor &amp; Wealth Management Consultant</p>
                  <div className={styles.credentials}>
                    {[
                      'AMFI Registered Mutual Fund Distributor',
                      'Life &amp; Health Insurance Advisor',
                      'Wealth Management Specialist',
                      'PMS &amp; AIF Distribution Expert',
                    ].map((c) => (
                      <div key={c} className={styles.credential}>
                        <span className={styles.credDot} />
                        <span dangerouslySetInnerHTML={{ __html: c }} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key philosophy cards */}
                <div className={styles.philosophy}>
                  {[
                    { label: 'Transparency', desc: 'Clear, honest advice with no hidden agenda.' },
                    { label: 'Trust', desc: 'Building lasting client relationships over time.' },
                    { label: 'Results', desc: 'Goal-aligned strategies that deliver outcomes.' },
                  ].map((p) => (
                    <div key={p.label} className={styles.philosophyCard}>
                      <span className={styles.philosophyLabel}>{p.label}</span>
                      <p className={styles.philosophyDesc}>{p.desc}</p>
                    </div>
                  ))}
                </div>
              </aside>

              {/* Right — bio content */}
              <div className={styles.content}>
                <div className={styles.intro}>
                  <h2 className="heading-2" style={{ color: 'var(--navy-800)', marginBottom: '1rem' }}>
                    Hello, I&apos;m Bharat Rathore
                  </h2>
                  <p className="body-lg text-muted">
                    I am committed to helping individuals, families, and businesses make informed financial decisions through suitable investment and protection solutions. My focus is on creating long-term value by offering guidance across Mutual Funds, Fixed Deposits, Bonds, Insurance, PMS, AIFs, GIFT City Investments, and other wealth management solutions.
                  </p>
                </div>

                <div className={styles.divider} />

                <div className={styles.block}>
                  <p className="body-lg text-muted">
                    I believe that financial planning is not just about investing money — it is about building security, achieving goals, and creating a better future. My approach is based on transparency, trust, and client-centric advice tailored to individual needs and objectives.
                  </p>
                </div>

                {/* Vision block */}
                <div className={styles.visionBlock}>
                  <div className={styles.visionLabel}>My Vision</div>
                  <p className={styles.visionText}>
                    To empower people with the right financial knowledge and solutions so they can invest with confidence, protect their families, and achieve long-term financial freedom. My goal is to build lasting relationships based on trust while helping clients grow, preserve, and transfer wealth effectively across generations.
                  </p>
                </div>

                {/* Services offered */}
                <div className={styles.servicesGrid}>
                  <h3 className="heading-4" style={{ color: 'var(--navy-800)', gridColumn: '1/-1', marginBottom: '0.25rem' }}>
                    Areas of Expertise
                  </h3>
                  {[
                    'Mutual Funds (SIP / STP / SWP / Lumpsum)',
                    'Term & Health Insurance',
                    'Fixed Deposits & Bonds',
                    'Portfolio Management Services (PMS)',
                    'Alternative Investment Funds (AIFs)',
                    'GIFT City Investments',
                    'HNI Wealth Management',
                    'Retirement & Goal Planning',
                  ].map((s) => (
                    <div key={s} className={styles.expertiseItem}>
                      <span className={styles.expertiseDot} />
                      {s}
                    </div>
                  ))}
                </div>

                {/* Closing quote */}
                <blockquote className={styles.quote}>
                  <span className={styles.quoteBar} />
                  <p>Growing Wealth. Protecting Futures. Building Trust.</p>
                </blockquote>
              </div>
            </div>
          </div>
        </section>

        {/* CTA band */}
        <section className={styles.cta}>
          <div className="container">
            <div className={styles.ctaInner}>
              <div>
                <h2 className="heading-3" style={{ color: 'white' }}>
                  Ready to Start Your Financial Journey?
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: '0.5rem' }}>
                  Connect with Bharat Rathore for a personalized consultation at no obligation.
                </p>
              </div>
              <a href="/#contact" className="btn btn-primary btn-lg" id="about-cta">
                Book a Consultation
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
