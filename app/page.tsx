import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import ServicesSection from '@/components/sections/ServicesSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import ContactSection from '@/components/sections/ContactSection';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />

        {/* Calculators preview */}
        <section className={styles.calcPreview}>
          <div className="container">
            <div className={styles.calcInner}>
              <div>
                <span className="label text-green">Financial Tools</span>
                <h2 className="heading-2" style={{ color: 'var(--dark-800)', marginTop: '0.5rem' }}>
                  Plan Your Future with Our Calculators
                </h2>
                <p className="body-lg text-muted" style={{ maxWidth: 480, marginTop: '0.75rem' }}>
                  Use our interactive calculators to estimate SIPs, EMIs, insurance premiums, retirement corpus, and more — instantly, without any sign-up.
                </p>
                <Link href="/calculators" className="btn btn-primary" style={{ marginTop: '1.5rem' }} id="calc-preview-cta">
                  Explore Calculators
                </Link>
              </div>
              <div className={styles.calcCards}>
                {['SIP Calculator', 'Lumpsum Calculator', 'FD / RD Calculator', 'EMI / Loan Calculator', 'Term Insurance Estimator', 'Retirement Planner'].map((c) => (
                  <Link href="/calculators" key={c} className={styles.calcCard}>
                    <span className={styles.calcCardDot} />
                    {c}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
