'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.css';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/#services' },
  { label: 'Calculators', href: '/calculators' },
  { label: 'Credit Cards', href: '/credit-cards' },
  { label: 'About', href: '/about' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`} role="navigation" aria-label="Main navigation">
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <Link href="/" className={styles.logo} aria-label="GrowNsure Home" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Image src="/logo.png" alt="GrowNsure Logo" width={32} height={32} style={{ objectFit: 'contain' }} />
          <Image src="/name.png" alt="GrowNsure" width={140} height={28} style={{ objectFit: 'contain' }} />
        </Link>

        {/* Desktop nav */}
        <ul className={styles.links} role="list">
          {navLinks.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={styles.link}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link href="/#contact" className={`btn btn-dark btn-sm ${styles.cta}`}>
          Get in Touch
        </Link>

        {/* Hamburger */}
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
        >
          <span className={`${styles.bar} ${menuOpen ? styles.bar1Open : ''}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.bar2Open : ''}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.bar3Open : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}>
        <ul role="list">
          {navLinks.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/#contact"
              className={`btn btn-primary w-full ${styles.mobileCta}`}
              onClick={() => setMenuOpen(false)}
            >
              Get in Touch
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
