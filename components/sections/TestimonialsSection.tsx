'use client';
import { useState, useEffect } from 'react';
import styles from './TestimonialsSection.module.css';

interface Testimonial {
  _id: string;
  clientName: string;
  designation?: string;
  city?: string;
  text: string;
  rating?: number;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className="star"
          viewBox="0 0 24 24"
          fill={i < rating ? '#f59e0b' : 'none'}
          stroke="#f59e0b"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetch('/api/testimonials')
      .then((r) => r.json())
      .then(setTestimonials)
      .catch(console.error);
  }, []);

  if (testimonials.length === 0) return null;

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  return (
    <section className={styles.section} id="testimonials">
      <div className={`container ${styles.inner}`}>
        <div className="section-header">
          <span className="overline">Client Stories</span>
          <h2 className="heading-2">What Our Clients Say</h2>
          <p className="body-lg text-muted">
            Real experiences from clients who trusted GrowNsure with their financial journey.
          </p>
        </div>

        {/* Carousel */}
        <div className={styles.carousel}>
          <div className={styles.track} style={{ transform: `translateX(-${current * 100}%)` }}>
            {testimonials.map((t) => (
              <div key={t._id} className={styles.slide}>
                <div className={styles.card}>
                  <div className={styles.quote}>&ldquo;</div>
                  {t.rating && <StarRating rating={t.rating} />}
                  <p className={styles.text}>{t.text}</p>
                  <div className={styles.client}>
                    <div className={styles.avatar}>
                      {t.clientName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className={styles.name}>{t.clientName}</p>
                      {(t.designation || t.city) && (
                        <p className={styles.meta}>
                          {[t.designation, t.city].filter(Boolean).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          {testimonials.length > 1 && (
            <div className={styles.controls}>
              <button className={styles.btn} onClick={prev} aria-label="Previous testimonial">
                &#8592;
              </button>
              <div className={styles.dots}>
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
                    onClick={() => setCurrent(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
              <button className={styles.btn} onClick={next} aria-label="Next testimonial">
                &#8594;
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
