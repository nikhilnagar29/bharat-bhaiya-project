'use client';
import { useState } from 'react';
import InquiryModal from '@/components/ui/InquiryModal';
import styles from './ContactSection.module.css';

export default function ContactSection() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section className={styles.section} id="contact">
        <div className="container">
          <div className={styles.inner}>
            <div className={styles.text}>
              <span className={styles.overline}>Get Started Today</span>
              <h2 className="heading-2" style={{ color: 'white' }}>
                Ready to Secure Your Financial Future?
              </h2>
              <p className="body-lg" style={{ color: 'rgba(255,255,255,0.7)', marginTop: '1rem' }}>
                Connect with Bharat Rathore for a personalized financial consultation — no obligations, just expert guidance tailored to your goals.
              </p>
            </div>
            <div className={styles.actions}>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => setModalOpen(true)}
                id="contact-section-cta"
              >
                Book a Free Consultation
              </button>
              <p className={styles.note}>
                No spam. No obligations. Just honest financial advice.
              </p>
            </div>
          </div>
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
