'use client';
import { useState, useEffect } from 'react';
import styles from './Calculator.module.css';

interface CalcProps {
  onAdvisor: () => void;
}

function formatINR(n: number): string {
  if (n >= 10000000) return `Rs. ${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `Rs. ${(n / 100000).toFixed(2)} L`;
  return `Rs. ${Math.round(n).toLocaleString('en-IN')}`;
}

export default function CompoundInterestCalculator({ onAdvisor }: CalcProps) {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(10);
  const [years, setYears] = useState(10);
  const [result, setResult] = useState({ maturity: 0, interest: 0 });

  useEffect(() => {
    // A = P(1 + r/n)^(nt)
    // Assuming annual compounding for simplicity, n = 1
    const maturity = principal * Math.pow(1 + rate / 100, years);
    const interest = maturity - principal;

    setResult({ maturity, interest });
  }, [principal, rate, years]);

  const principalPct = result.maturity > 0 ? (principal / result.maturity) * 100 : 50;
  const interestPct = 100 - principalPct;

  return (
    <div className={styles.calc}>
      <div className={styles.header}>
        <h2 className="heading-3" style={{ color: 'var(--navy-800)' }}>Compound Interest Calculator</h2>
        <p className="body-sm text-muted">
          Calculate the power of compounding on your investments over time.
        </p>
      </div>

      <div className={styles.body}>
        <div className={styles.inputs}>
          <div className={styles.inputGroup}>
            <div className={styles.inputHeader}>
              <label className="form-label">Principal Amount</label>
              <span className={styles.inputValue}>Rs. {principal.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min={1000}
              max={10000000}
              step={1000}
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className={styles.slider}
            />
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputHeader}>
              <label className="form-label">Annual Interest Rate</label>
              <span className={styles.inputValue}>{rate}% p.a.</span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              step={0.5}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className={styles.slider}
            />
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputHeader}>
              <label className="form-label">Time Period</label>
              <span className={styles.inputValue}>{years} years</span>
            </div>
            <input
              type="range"
              min={1}
              max={40}
              step={1}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className={styles.slider}
            />
          </div>
        </div>

        <div className={styles.results}>
          <div className={styles.chartWrap}>
            <svg viewBox="0 0 120 120" className={styles.donut}>
              <circle cx="60" cy="60" r="48" fill="none" stroke="var(--gray-100)" strokeWidth="16" />
              <circle
                cx="60" cy="60" r="48"
                fill="none"
                stroke="var(--navy-700)"
                strokeWidth="16"
                strokeDasharray={`${principalPct * 3.016} ${interestPct * 3.016}`}
                strokeDashoffset="75.4"
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 0.5s ease' }}
              />
              <circle
                cx="60" cy="60" r="48"
                fill="none"
                stroke="var(--green-500)"
                strokeWidth="16"
                strokeDasharray={`${interestPct * 3.016} ${principalPct * 3.016}`}
                strokeDashoffset={75.4 - principalPct * 3.016}
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 0.5s ease' }}
              />
              <text x="60" y="55" textAnchor="middle" className={styles.donutLabel}>Maturity</text>
              <text x="60" y="72" textAnchor="middle" className={styles.donutValue}>{formatINR(result.maturity).replace('Rs. ', '')}</text>
            </svg>
            <div className={styles.legend}>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: 'var(--navy-700)' }} />
                Principal
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: 'var(--green-500)' }} />
                Interest Earned
              </div>
            </div>
          </div>

          <div className={styles.resultCards}>
            <div className={styles.resultCard}>
              <p className={styles.resultLabel}>Principal Amount</p>
              <p className={styles.resultAmt} style={{ color: 'var(--navy-700)' }}>
                {formatINR(principal)}
              </p>
            </div>
            <div className={styles.resultCard}>
              <p className={styles.resultLabel}>Total Interest</p>
              <p className={styles.resultAmt} style={{ color: 'var(--green-500)' }}>
                {formatINR(result.interest)}
              </p>
            </div>
            <div className={`${styles.resultCard} ${styles.resultCardMain}`}>
              <p className={styles.resultLabel}>Total Amount</p>
              <p className={styles.resultAmtMain}>{formatINR(result.maturity)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
