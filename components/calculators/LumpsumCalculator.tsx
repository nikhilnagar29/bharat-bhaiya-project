'use client';
import { useState, useEffect } from 'react';
import styles from './Calculator.module.css';

interface CalcProps { onAdvisor: () => void; }

function formatINR(n: number): string {
  if (n >= 10000000) return `Rs. ${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `Rs. ${(n / 100000).toFixed(2)} L`;
  return `Rs. ${Math.round(n).toLocaleString('en-IN')}`;
}

export default function LumpsumCalculator({ onAdvisor }: CalcProps) {
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const [result, setResult] = useState({ maturity: 0, invested: 0, returns: 0 });

  useEffect(() => {
    const maturity = amount * Math.pow(1 + rate / 100, years);
    setResult({ maturity, invested: amount, returns: maturity - amount });
  }, [amount, rate, years]);

  const investedPct = result.maturity > 0 ? (result.invested / result.maturity) * 100 : 50;
  const returnsPct = 100 - investedPct;

  return (
    <div className={styles.calc}>
      <div className={styles.header}>
        <h2 className="heading-3" style={{ color: 'var(--navy-800)' }}>Lumpsum Calculator</h2>
        <p className="body-sm text-muted">Estimate the growth of a one-time investment over time.</p>
      </div>
      <div className={styles.body}>
        <div className={styles.inputs}>
          {[
            { label: 'One-Time Investment', value: amount, min: 1000, max: 10000000, step: 1000, display: `Rs. ${amount.toLocaleString('en-IN')}`, set: setAmount, lo: 'Rs. 1,000', hi: 'Rs. 1 Cr' },
            { label: 'Expected Annual Return', value: rate, min: 1, max: 30, step: 0.5, display: `${rate}% p.a.`, set: setRate, lo: '1%', hi: '30%' },
            { label: 'Investment Duration', value: years, min: 1, max: 40, step: 1, display: `${years} years`, set: setYears, lo: '1 yr', hi: '40 yrs' },
          ].map((f) => (
            <div key={f.label} className={styles.inputGroup}>
              <div className={styles.inputHeader}>
                <label className="form-label">{f.label}</label>
                <span className={styles.inputValue}>{f.display}</span>
              </div>
              <input type="range" min={f.min} max={f.max} step={f.step} value={f.value} onChange={(e) => f.set(Number(e.target.value))} className={styles.slider} />
              <div className={styles.sliderLabels}><span>{f.lo}</span><span>{f.hi}</span></div>
            </div>
          ))}
        </div>

        <div className={styles.results}>
          <div className={styles.chartWrap}>
            <svg viewBox="0 0 120 120" className={styles.donut}>
              <circle cx="60" cy="60" r="48" fill="none" stroke="var(--gray-100)" strokeWidth="16" />
              <circle cx="60" cy="60" r="48" fill="none" stroke="var(--navy-700)" strokeWidth="16" strokeDasharray={`${investedPct * 3.016} 301.6`} strokeDashoffset="75.4" strokeLinecap="round" />
              <circle cx="60" cy="60" r="48" fill="none" stroke="var(--green-500)" strokeWidth="16" strokeDasharray={`${returnsPct * 3.016} 301.6`} strokeDashoffset={75.4 - investedPct * 3.016} strokeLinecap="round" />
              <text x="60" y="55" textAnchor="middle" className={styles.donutLabel}>Maturity</text>
              <text x="60" y="72" textAnchor="middle" className={styles.donutValue}>{formatINR(result.maturity).replace('Rs. ', '')}</text>
            </svg>
            <div className={styles.legend}>
              <div className={styles.legendItem}><span className={styles.legendDot} style={{ background: 'var(--navy-700)' }} />Invested</div>
              <div className={styles.legendItem}><span className={styles.legendDot} style={{ background: 'var(--green-500)' }} />Returns</div>
            </div>
          </div>

          <div className={styles.resultCards}>
            <div className={styles.resultCard}><p className={styles.resultLabel}>Amount Invested</p><p className={styles.resultAmt} style={{ color: 'var(--navy-700)' }}>{formatINR(result.invested)}</p></div>
            <div className={styles.resultCard}><p className={styles.resultLabel}>Estimated Returns</p><p className={styles.resultAmt} style={{ color: 'var(--green-600)' }}>{formatINR(result.returns)}</p></div>
            <div className={`${styles.resultCard} ${styles.resultCardMain}`}>
              <p className={styles.resultLabel}>Total Maturity Value</p>
              <p className={styles.resultAmtMain}>{formatINR(result.maturity)}</p>
            </div>
            <button className="btn btn-primary w-full" onClick={onAdvisor} id="lumpsum-advisor-cta">Talk to an Advisor</button>
            <p className={styles.disclaimer}>Assumes {rate}% p.a. compounded annually. This is an approximate estimate only.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
