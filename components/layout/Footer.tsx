import Link from 'next/link';
import styles from './Footer.module.css';

const quickLinks = [
  { label: 'Services', href: '/#services' },
  { label: 'Calculators', href: '/calculators' },
  { label: 'Credit Cards', href: '/credit-cards' },
  { label: 'Testimonials', href: '/#testimonials' },
  { label: 'About', href: '/about' },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          {/* Brand */}
          <div className={styles.brand}>
            <div className={styles.logo}>
              <span className={styles.logoMark}>G</span>
              <span className={styles.logoText}>
                Grow<span className={styles.accent}>Nsure</span>
              </span>
            </div>
            <p className={styles.tagline}>Financial Solutions For A Secure Future</p>
            <p className={styles.sub}>
              Helping Families Achieve Short-Term Financial Security &amp; Long-Term Wealth Creation
            </p>
          </div>

          {/* Quick Links */}
          <div className={styles.col}>
            <h4 className={styles.colHeading}>Quick Links</h4>
            <ul className={styles.colLinks}>
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={styles.colLink}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact CTA */}
          <div className={styles.col}>
            <h4 className={styles.colHeading}>Get in Touch</h4>
            <p className={styles.ctaText}>
              Ready to start your financial journey? Our advisor is here to guide you.
            </p>
            <Link href="/#contact" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
              Book a Consultation
            </Link>
          </div>
        </div>

        {/* Disclaimer */}
        <div className={styles.disclaimer}>
          <p className={styles.disclaimerText}>
            <strong>Disclaimer:</strong> All investments are subject to market, credit, liquidity, and other associated risks. Returns are not guaranteed, and past performance is not indicative of future results. Before making any investment decision, please assess your financial goals, risk appetite, and investment objectives carefully. Investors are advised to consult a qualified financial advisor and read all relevant documents, terms, and conditions before investing.
          </p>
        </div>

        {/* Bottom bar */}
        <div className={styles.bottom}>
          <p className={styles.copy}>
            &copy; {new Date().getFullYear()} GrowNsure. All rights reserved.
          </p>
          <p className={styles.copy}>
            <Link href="/admin" className={styles.adminLink}>
              Admin
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
