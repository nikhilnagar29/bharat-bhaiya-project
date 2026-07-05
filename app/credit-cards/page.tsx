'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import styles from './page.module.css';

interface CreditCard {
  _id: string;
  name: string;
  bank: string;
  imageUrl?: string;
  features: string[];
  annualFee: string;
  eligibility: string;
}

interface AppForm {
  fullName: string;
  mobile: string;
  email: string;
  pincode: string;
}

export default function CreditCardsPage() {
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [selected, setSelected] = useState<CreditCard | null>(null);
  const [form, setForm] = useState<AppForm>({ fullName: '', mobile: '', email: '', pincode: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/credit-cards')
      .then((r) => r.json())
      .then(setCards)
      .catch(console.error);
  }, []);

  const handleApply = (card: CreditCard) => {
    setSelected(card);
    setSuccess(false);
    setError('');
    setForm({ fullName: '', mobile: '', email: '', pincode: '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/credit-card-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, cardId: selected._id, cardName: selected.name }),
      });
      if (!res.ok) throw new Error('Failed');
      setSuccess(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main>
        {/* Header */}
        <div className={styles.header}>
          <div className="container">
            <span className="label" style={{ color: 'var(--green-400)' }}>Financial Products</span>
            <h1 className="heading-1" style={{ color: 'white', marginTop: '0.5rem' }}>Credit Cards</h1>
            <p className="body-lg" style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 500, marginTop: '0.75rem' }}>
              Compare top credit cards and apply instantly. We help you find the card that fits your lifestyle and spending pattern.
            </p>
          </div>
        </div>

        {/* Application form (shown when a card is selected) */}
        {selected && (
          <section className={styles.applySection}>
            <div className="container">
              <div className={styles.applyLayout}>
                {/* Selected card preview */}
                <div className={styles.selectedCard}>
                  <div className={styles.cardVisual}>
                    {selected.imageUrl ? (
                      <Image
                        src={selected.imageUrl}
                        alt={selected.name}
                        width={400}
                        height={250}
                        className={styles.cardImg}
                        unoptimized
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }}
                      />
                    ) : (
                      <div className={styles.cardPlaceholder}>
                        <div className={styles.cardChip} />
                        <p className={styles.cardPlaceholderName}>{selected.name}</p>
                        <p className={styles.cardPlaceholderBank}>{selected.bank}</p>
                        <div className={styles.cardStripe} />
                      </div>
                    )}
                  </div>
                  <div className={styles.selectedInfo}>
                    <h3 className="heading-4" style={{ color: 'var(--dark-800)' }}>{selected.name}</h3>
                    <p className="body-sm text-muted">{selected.bank}</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                      <strong>Annual Fee:</strong> {selected.annualFee}
                    </p>
                  </div>
                </div>

                {/* Form */}
                <div className={styles.applyForm}>
                  {success ? (
                    <div className={styles.successBox}>
                      <div className={styles.successIcon}>&#10003;</div>
                      <h3 className="heading-4" style={{ color: 'var(--dark-800)', margin: '1rem 0 0.5rem' }}>
                        Application Submitted
                      </h3>
                      <p className="body-md text-muted">
                        Thank you. We will get in touch with you shortly regarding your selected card.
                      </p>
                      <button
                        className="btn btn-outline"
                        style={{ marginTop: '1.5rem' }}
                        onClick={() => setSelected(null)}
                      >
                        Browse More Cards
                      </button>
                    </div>
                  ) : (
                    <>
                      <h3 className="heading-4" style={{ color: 'var(--dark-800)', marginBottom: '1.25rem' }}>
                        Apply for {selected.name}
                      </h3>
                      {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}
                      <form onSubmit={handleSubmit} noValidate>
                        <div className="form-group">
                          <label className="form-label" htmlFor="cc-name">Full Name *</label>
                          <input id="cc-name" name="fullName" type="text" className="form-control"
                            placeholder="As per PAN card" value={form.fullName} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="cc-mobile">Mobile Number *</label>
                          <input id="cc-mobile" name="mobile" type="tel" className="form-control"
                            placeholder="10-digit mobile number" value={form.mobile} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="cc-email">Email Address *</label>
                          <input id="cc-email" name="email" type="email" className="form-control"
                            placeholder="your@email.com" value={form.email} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="cc-pincode">Pincode *</label>
                          <input id="cc-pincode" name="pincode" type="text" className="form-control"
                            placeholder="6-digit pincode" value={form.pincode} onChange={handleChange} required maxLength={6} />
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                          <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit Application'}
                          </button>
                          <button type="button" className="btn btn-outline" onClick={() => setSelected(null)}>
                            Cancel
                          </button>
                        </div>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Cards grid */}
        <section className={styles.grid_section}>
          <div className="container">
            {!selected && (
              <div className="section-header" style={{ textAlign: 'left', marginBottom: '2rem' }}>
                <h2 className="heading-2" style={{ color: 'var(--dark-800)' }}>
                  Available Credit Cards
                </h2>
                <p className="body-md text-muted" style={{ marginTop: '0.5rem' }}>
                  Select a card to view details and apply.
                </p>
              </div>
            )}

            <div className={styles.cardsGrid}>
              {cards.length === 0
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className={styles.cardSkeleton}>
                      <div className="skeleton" style={{ height: 160, borderRadius: 12, marginBottom: '1rem' }} />
                      <div className="skeleton" style={{ height: 18, width: '70%', marginBottom: '0.5rem' }} />
                      <div className="skeleton" style={{ height: 14, width: '40%' }} />
                    </div>
                  ))
                : cards.map((card) => (
                    <div
                      key={card._id}
                      className={`${styles.cardTile} ${selected?._id === card._id ? styles.cardTileActive : ''}`}
                    >
                      {/* Card visual */}
                      <div className={styles.tileVisual}>
                        {card.imageUrl ? (
                          <Image
                            src={card.imageUrl}
                            alt={card.name}
                            width={400}
                            height={250}
                            unoptimized
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }}
                          />
                        ) : (
                          <div className={styles.tilePlaceholder}>
                            <div className={styles.tileChip} />
                            <div>
                              <p className={styles.tileName}>{card.name}</p>
                              <p className={styles.tileBank}>{card.bank}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className={styles.tileBody}>
                        <div>
                          <h3 className={styles.tileTitle}>{card.name}</h3>
                          <p className={styles.tileBankLabel}>{card.bank}</p>
                        </div>

                        {/* Features */}
                        <ul className={styles.features}>
                          {card.features.slice(0, 4).map((f, i) => (
                            <li key={i} className={styles.feature}>
                              <span className={styles.featureDot} />
                              {f}
                            </li>
                          ))}
                        </ul>

                        <div className={styles.tileMeta}>
                          <div>
                            <p className={styles.metaLabel}>Annual Fee</p>
                            <p className={styles.metaValue}>{card.annualFee}</p>
                          </div>
                          <div>
                            <p className={styles.metaLabel}>Eligibility</p>
                            <p className={styles.metaValue}>{card.eligibility}</p>
                          </div>
                        </div>

                        <button
                          className="btn btn-primary w-full"
                          onClick={() => handleApply(card)}
                          id={`cc-apply-${card._id}`}
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
