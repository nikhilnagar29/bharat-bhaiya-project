'use client';
import { useState } from 'react';
import styles from './Calculator.module.css';

interface CalcProps { onAdvisor: () => void; }

function formatINR(n: number): string {
  if (n >= 10000000) return `Rs. ${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `Rs. ${(n / 100000).toFixed(2)} L`;
  return `Rs. ${Math.round(n).toLocaleString('en-IN')}`;
}

export default function TermInsuranceCalculator({ onAdvisor }: CalcProps) {
  const [age, setAge] = useState(30);
  const [coverage, setCoverage] = useState(10000000);
  const [term, setTerm] = useState(20);
  const [smoker, setSmoker] = useState(false);
  const [calculated, setCalculated] = useState(false);

  const estimate = () => {
    // Base rate per lakh per year (approximate industry heuristic)
    let baseRate = 0.035; // 0.035% of coverage per year = Rs. 350 per lakh for 30yr non-smoker
    if (age >= 40) baseRate *= 1.6;
    else if (age >= 35) baseRate *= 1.2;
    if (smoker) baseRate *= 2.5;
    if (term >= 30) baseRate *= 1.1;
    const annual = coverage * (baseRate / 100) * (term / 20);
    return {
      low: Math.round(annual * 0.8),
      high: Math.round(annual * 1.3),
    };
  };

  const { low, high } = calculate();
  function calculate() { return estimate(); }

  return (
    <div className={styles.calc}>
      <div className={styles.header}>
        <h2 className="heading-3" style={{ color: 'var(--navy-800)' }}>Term Insurance Premium Estimator</h2>
        <p className="body-sm text-muted">Get an approximate annual premium range for a term life insurance plan. This is an estimate only — not a final quote.</p>
      </div>

      <div className={styles.body}>
        <div className={styles.inputs}>
          {[
            { label: 'Your Age', value: age, min: 18, max: 65, step: 1, display: `${age} years`, set: setAge, lo: '18', hi: '65' },
            { label: 'Coverage Amount', value: coverage, min: 2500000, max: 100000000, step: 500000, display: formatINR(coverage), set: setCoverage, lo: '25 L', hi: '10 Cr' },
            { label: 'Policy Term', value: term, min: 5, max: 40, step: 1, display: `${term} years`, set: setTerm, lo: '5 yrs', hi: '40 yrs' },
          ].map((f) => (
            <div key={f.label} className={styles.inputGroup}>
              <div className={styles.inputHeader}>
                <label className="form-label">{f.label}</label>
                <span className={styles.inputValue}>{f.display}</span>
              </div>
              <input type="range" min={f.min} max={f.max} step={f.step} value={f.value}
                onChange={(e) => { f.set(Number(e.target.value)); setCalculated(true); }}
                className={styles.slider} />
              <div className={styles.sliderLabels}><span>{f.lo}</span><span>{f.hi}</span></div>
            </div>
          ))}

          <div className={styles.inputGroup}>
            <label className="form-label">Smoking Status</label>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {[false, true].map((s) => (
                <button
                  key={String(s)}
                  className={`btn btn-sm ${smoker === s ? 'btn-navy' : 'btn-outline'}`}
                  onClick={() => { setSmoker(s); setCalculated(true); }}
                  id={`term-smoker-${s ? 'yes' : 'no'}`}
                >
                  {s ? 'Smoker' : 'Non-Smoker'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.results}>
          <div style={{ background: 'linear-gradient(135deg, var(--navy-900), var(--navy-800))', borderRadius: 'var(--radius-xl)', padding: '2rem', textAlign: 'center', marginBottom: '1rem' }}>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Estimated Annual Premium Range</p>
            <p style={{ color: 'var(--green-400)', fontSize: '1.5rem', fontWeight: 800 }}>
              {formatINR(low)} — {formatINR(high)}
            </p>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem', marginTop: '0.75rem' }}>
              For {formatINR(coverage)} coverage | {term}-year term | Age {age} | {smoker ? 'Smoker' : 'Non-smoker'}
            </p>
          </div>

          <div className={styles.resultCards}>
            <div className={styles.resultCard}><p className={styles.resultLabel}>Approximate Monthly Premium</p><p className={styles.resultAmt} style={{ color: 'var(--green-600)' }}>{formatINR(low / 12)} — {formatINR(high / 12)}</p></div>
            <div className={styles.resultCard}><p className={styles.resultLabel}>Coverage Sum Assured</p><p className={styles.resultAmt} style={{ color: 'var(--navy-800)' }}>{formatINR(coverage)}</p></div>
          </div>

          <div style={{ padding: '1rem', background: '#fef9c3', borderRadius: 'var(--radius-md)', border: '1px solid #fde68a', marginTop: '0.5rem' }}>
            <p style={{ fontSize: '0.78rem', color: '#92400e', lineHeight: 1.6 }}>
              <strong>Important:</strong> This is an approximate estimate based on simplified actuarial assumptions. Actual premiums depend on your health history, lifestyle, insurer, and specific plan features. Please get an official quote from a licensed insurance provider.
            </p>
          </div>

          <button className="btn btn-primary w-full" onClick={onAdvisor} id="term-advisor-cta" style={{ marginTop: '0.75rem' }}>
            Get an Accurate Quote
          </button>
        </div>
      </div>
    </div>
  );
}
