'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import InquiryModal from '@/components/ui/InquiryModal';
import styles from './ServicesSection.module.css';

interface Service {
  _id: string;
  title: string;
  description: string;
  subDescription?: string;
  buttonText: string;
  slug?: string;
}

const serviceIcons: Record<string, string> = {
  'Term Insurance': 'shield',
  'Health Insurance': 'heart',
  'Emergency Fund & Secure Investment': 'bank',
  'Financial Products': 'card',
  'Mutual Funds Investment': 'chart',
  'HNI Investments': 'crown',
};

function ServiceIcon({ name }: { name: string }) {
  const icon = serviceIcons[name] || 'chart';
  const icons: Record<string, React.ReactNode> = {
    shield: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    heart: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    bank: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 10v11M12 10v11M16 10v11" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    card: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
    chart: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    crown: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 20h20M5 20l2-8 5 4 5-4 2 8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="8" r="2" />
      </svg>
    ),
  };
  return <div className={styles.iconSvg}>{icons[icon]}</div>;
}

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');

  useEffect(() => {
    fetch('/api/services')
      .then((r) => r.json())
      .then(setServices)
      .catch(console.error);
  }, []);

  const handleServiceCTA = (service: Service) => {
    if (service.slug === 'financial-products') {
      window.location.href = '/credit-cards';
      return;
    }
    setSelectedService(service.title);
    setModalOpen(true);
  };

  return (
    <>
      <section className={styles.section} id="services">
        <div className="container">
          <div className="section-header">
            <span className="overline">Our Services</span>
            <h2 className="heading-2">Comprehensive Financial Solutions</h2>
            <p className="body-lg text-muted">
              From protection to wealth creation — we offer tailored financial services to help you achieve every goal.
            </p>
          </div>

          <div className={styles.grid}>
            {services.length === 0
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className={styles.skeleton}>
                    <div className="skeleton" style={{ height: 48, width: 48, borderRadius: 12, marginBottom: '1rem' }} />
                    <div className="skeleton" style={{ height: 20, width: '60%', marginBottom: '0.75rem' }} />
                    <div className="skeleton" style={{ height: 14, width: '100%', marginBottom: '0.5rem' }} />
                    <div className="skeleton" style={{ height: 14, width: '80%' }} />
                  </div>
                ))
              : services.map((service, i) => {
                  // Show ⓘ button whenever a slug is set — the detail page handles empty state
                  const hasDetailPage = !!service.slug;
                  return (
                    <div key={service._id} className={styles.card}>
                      {/* ⓘ Info button — top right corner */}
                      {hasDetailPage && (
                        <Link
                          href={`/services/${service.slug}`}
                          className={styles.infoBtn}
                          aria-label={`More info about ${service.title}`}
                          title={`Learn more about ${service.title}`}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                          </svg>
                        </Link>
                      )}

                      <div className={styles.cardIcon}>
                        <ServiceIcon name={service.title} />
                      </div>
                      <h3 className={styles.cardTitle}>{service.title}</h3>
                      <p className={styles.cardDesc}>{service.description}</p>
                      {service.subDescription && (
                        <p className={styles.cardSub}>{service.subDescription}</p>
                      )}

                      {/* Actions */}
                      {service.slug === 'financial-products' ? (
                        <div className={styles.cardActions}>
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => { setSelectedService(service.title); setModalOpen(true); }}
                            id={`service-inq-${i}`}
                          >
                            {service.buttonText}
                          </button>
                          <Link href="/credit-cards" className="btn btn-primary btn-sm" id={`service-cc-${i}`}>
                            Credit Cards
                          </Link>
                        </div>
                      ) : (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleServiceCTA(service)}
                          id={`service-cta-${i}`}
                          style={{ marginTop: 'auto' }}
                        >
                          {service.buttonText}
                        </button>
                      )}
                    </div>
                  );
                })}
          </div>
        </div>
      </section>

      <InquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultService={selectedService}
      />
    </>
  );
}
