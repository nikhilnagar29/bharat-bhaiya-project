'use client';
import { useState, useEffect } from 'react';
import styles from './Calculator.module.css';

interface CalcProps { onAdvisor: () => void; }

function formatINR(n: number): string {
  if (n >= 10000000) return `Rs. ${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `Rs. ${(n / 100000).toFixed(2)} L`;
  return `Rs. ${Math.round(n).toLocaleString('en-IN')}`;
}

export default function EMICalculator({ onAdvisor }: CalcProps) {
  const [loan, setLoan] = useState(1000000);
  const [rate, setRate] = useState(10);
  const [years, setYears] = useState(5);
  const [result, setResult] = useState({ emi: 0, totalInterest: 0, totalPayment: 0 });

  useEffect(() => {
    const r = rate / 100 / 12;
    const n = years * 12;
    if (r === 0) {
      const emi = loan / n;
      setResult({ emi, totalInterest: 0, totalPayment: loan });
    } else {
      const emi = loan * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
      const totalPayment = emi * n;
      setResult({ emi, totalInterest: totalPayment - loan, totalPayment });
    }
  }, [loan, rate, years]);

  const loanPct = result.totalPayment > 0 ? (loan / result.totalPayment) * 100 : 50;
  const interestPct = 100 - loanPct;

  return (
    <div className={styles.calc}>
      <div className={styles.header}>
        <h2 className="heading-3" style={{ color: 'var(--navy-800)' }}>EMI / Loan Calculator</h2>
        <p className="body-sm text-muted">Calculate your monthly EMI for home, car, or personal loans.</p>
      </div>

      <div className={styles.body}>
        <div className={styles.inputs}>
          {[
            { label: 'Loan Amount', value: loan, min: 10000, max: 20000000, step: 10000, display: `Rs. ${loan.toLocaleString('en-IN')}`, set: setLoan, lo: 'Rs. 10,000', hi: 'Rs. 2 Cr' },
            { label: 'Annual Interest Rate', value: rate, min: 1, max: 25, step: 0.25, display: `${rate}% p.a.`, set: setRate, lo: '1%', hi: '25%' },
            { label: 'Loan Tenure', value: years, min: 1, max: 30, step: 1, display: `${years} years`, set: setYears, lo: '1 yr', hi: '30 yrs' },
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
          {/* EMI highlight */}
          <div style={{ background: 'linear-gradient(135deg, var(--navy-900), var(--navy-800))', borderRadius: 'var(--radius-lg)', padding: '1.5rem', textAlign: 'center', marginBottom: '0.25rem' }}>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem' }}>Monthly EMI</p>
            <p style={{ color: 'var(--green-400)', fontSize: '2rem', fontWeight: 800 }}>{formatINR(result.emi)}</p>
          </div>

          <div className={styles.chartWrap}>
            <svg viewBox="0 0 120 120" className={styles.donut}>
              <circle cx="60" cy="60" r="48" fill="none" stroke="var(--gray-100)" strokeWidth="16" />
              <circle cx="60" cy="60" r="48" fill="none" stroke="var(--navy-700)" strokeWidth="16" strokeDasharray={`${loanPct * 3.016} ${interestPct * 3.016}`} strokeDashoffset="75.4" strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.5s ease' }} />
              <circle cx="60" cy="60" r="48" fill="none" stroke="#ef4444" strokeWidth="16" strokeDasharray={`${interestPct * 3.016} ${loanPct * 3.016}`} strokeDashoffset={75.4 - loanPct * 3.016} strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.5s ease' }} />
              <text x="60" y="55" textAnchor="middle" className={styles.donutLabel}>Total</text>
              <text x="60" y="72" textAnchor="middle" className={styles.donutValue}>{formatINR(result.totalPayment).replace('Rs. ', '')}</text>
            </svg>
            <div className={styles.legend}>
              <div className={styles.legendItem}><span className={styles.legendDot} style={{ background: 'var(--navy-700)' }} />Principal</div>
              <div className={styles.legendItem}><span className={styles.legendDot} style={{ background: '#ef4444' }} />Interest</div>
            </div>
          </div>

          <div className={styles.resultCards}>
            <div className={styles.resultCard}><p className={styles.resultLabel}>Principal Amount</p><p className={styles.resultAmt} style={{ color: 'var(--navy-700)' }}>{formatINR(loan)}</p></div>
            <div className={styles.resultCard}><p className={styles.resultLabel}>Total Interest Payable</p><p className={styles.resultAmt} style={{ color: '#dc2626' }}>{formatINR(result.totalInterest)}</p></div>
            <div className={`${styles.resultCard} ${styles.resultCardMain}`}><p className={styles.resultLabel}>Total Payment</p><p className={styles.resultAmtMain}>{formatINR(result.totalPayment)}</p></div>
            <button className="btn btn-primary w-full" onClick={onAdvisor} id="emi-advisor-cta">Talk to an Advisor</button>
          </div>
        </div>
      </div>
    </div>
  );
}
