'use client';
import { useState, useEffect } from 'react';
import styles from './Calculator.module.css';

interface CalcProps { onAdvisor: () => void; }

function formatINR(n: number): string {
  if (n >= 10000000) return `Rs. ${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `Rs. ${(n / 100000).toFixed(2)} L`;
  return `Rs. ${Math.round(n).toLocaleString('en-IN')}`;
}

export default function FDRDCalculator({ onAdvisor }: CalcProps) {
  const [type, setType] = useState<'FD' | 'RD'>('FD');
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(3);
  const [result, setResult] = useState({ maturity: 0, interest: 0, invested: 0 });

  useEffect(() => {
    if (type === 'FD') {
      // Compounded quarterly
      const maturity = amount * Math.pow(1 + rate / 100 / 4, 4 * years);
      setResult({ maturity, interest: maturity - amount, invested: amount });
    } else {
      // RD: monthly compounding
      const r = rate / 100 / 12;
      const n = years * 12;
      const maturity = amount * (Math.pow(1 + r, n) - 1) * (1 + r) / r;
      const invested = amount * n;
      setResult({ maturity, interest: maturity - invested, invested });
    }
  }, [type, amount, rate, years]);

  const investedPct = result.maturity > 0 ? (result.invested / result.maturity) * 100 : 50;
  const returnsPct = 100 - investedPct;

  return (
    <div className={styles.calc}>
      <div className={styles.header}>
        <h2 className="heading-3" style={{ color: 'var(--navy-800)' }}>FD / RD Calculator</h2>
        <p className="body-sm text-muted">Calculate maturity value for Fixed Deposits and Recurring Deposits.</p>
      </div>

      {/* Type toggle */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
        {(['FD', 'RD'] as const).map((t) => (
          <button
            key={t}
            className={`btn btn-sm ${type === t ? 'btn-navy' : 'btn-outline'}`}
            onClick={() => setType(t)}
            id={`fdrd-type-${t.toLowerCase()}`}
          >
            {t === 'FD' ? 'Fixed Deposit' : 'Recurring Deposit'}
          </button>
        ))}
      </div>

      <div className={styles.body}>
        <div className={styles.inputs}>
          {[
            { label: type === 'FD' ? 'Deposit Amount' : 'Monthly Deposit', value: amount, min: 1000, max: type === 'FD' ? 10000000 : 200000, step: 1000, display: `Rs. ${amount.toLocaleString('en-IN')}`, set: setAmount, lo: 'Rs. 1,000', hi: type === 'FD' ? 'Rs. 1 Cr' : 'Rs. 2 L' },
            { label: 'Interest Rate (p.a.)', value: rate, min: 1, max: 15, step: 0.25, display: `${rate}%`, set: setRate, lo: '1%', hi: '15%' },
            { label: 'Tenure', value: years, min: 1, max: 20, step: 1, display: `${years} years`, set: setYears, lo: '1 yr', hi: '20 yrs' },
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
              <circle cx="60" cy="60" r="48" fill="none" stroke="var(--navy-700)" strokeWidth="16" strokeDasharray={`${investedPct * 3.016} ${returnsPct * 3.016}`} strokeDashoffset="75.4" strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.5s ease' }} />
              <circle cx="60" cy="60" r="48" fill="none" stroke="var(--green-500)" strokeWidth="16" strokeDasharray={`${returnsPct * 3.016} ${investedPct * 3.016}`} strokeDashoffset={75.4 - investedPct * 3.016} strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.5s ease' }} />
              <text x="60" y="55" textAnchor="middle" className={styles.donutLabel}>Maturity</text>
              <text x="60" y="72" textAnchor="middle" className={styles.donutValue}>{formatINR(result.maturity).replace('Rs. ', '')}</text>
            </svg>
            <div className={styles.legend}>
              <div className={styles.legendItem}><span className={styles.legendDot} style={{ background: 'var(--navy-700)' }} />Principal</div>
              <div className={styles.legendItem}><span className={styles.legendDot} style={{ background: 'var(--green-500)' }} />Interest</div>
            </div>
          </div>

          <div className={styles.resultCards}>
            <div className={styles.resultCard}><p className={styles.resultLabel}>{type === 'FD' ? 'Principal Amount' : 'Total Invested'}</p><p className={styles.resultAmt} style={{ color: 'var(--navy-700)' }}>{formatINR(result.invested)}</p></div>
            <div className={styles.resultCard}><p className={styles.resultLabel}>Total Interest Earned</p><p className={styles.resultAmt} style={{ color: 'var(--green-600)' }}>{formatINR(result.interest)}</p></div>
            <div className={`${styles.resultCard} ${styles.resultCardMain}`}><p className={styles.resultLabel}>Maturity Value</p><p className={styles.resultAmtMain}>{formatINR(result.maturity)}</p></div>
            <button className="btn btn-primary w-full" onClick={onAdvisor} id="fdrd-advisor-cta">Talk to an Advisor</button>
            <p className={styles.disclaimer}>{type === 'FD' ? 'Compounded quarterly.' : 'Compounded monthly.'} Estimate only. Actual rates may vary.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
