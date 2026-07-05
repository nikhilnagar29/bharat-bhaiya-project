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

export default function SWPCalculator({ onAdvisor }: CalcProps) {
  const [lumpsum, setLumpsum] = useState(5000000);
  const [swp, setSwp] = useState(25000);
  const [rate, setRate] = useState(10);
  const [years, setYears] = useState(10);
  const [result, setResult] = useState({ finalBalance: 0, totalWithdrawn: 0 });

  useEffect(() => {
    let balance = lumpsum;
    let withdrawn = 0;
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;

    for (let i = 0; i < months; i++) {
      balance = balance * (1 + monthlyRate) - swp;
      withdrawn += swp;
      if (balance < 0) {
        balance = 0;
        break;
      }
    }

    setResult({ finalBalance: balance, totalWithdrawn: withdrawn });
  }, [lumpsum, swp, rate, years]);

  const withdrawnPct = result.totalWithdrawn / (result.totalWithdrawn + result.finalBalance) * 100 || 50;
  const balancePct = 100 - withdrawnPct;

  return (
    <div className={styles.calc}>
      <div className={styles.header}>
        <h2 className="heading-3" style={{ color: 'var(--navy-800)' }}>SWP Calculator</h2>
        <p className="body-sm text-muted">
          Plan your systematic withdrawals from your existing investments.
        </p>
      </div>

      <div className={styles.body}>
        <div className={styles.inputs}>
          <div className={styles.inputGroup}>
            <div className={styles.inputHeader}>
              <label className="form-label">Total Investment</label>
              <span className={styles.inputValue}>Rs. {lumpsum.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min={100000}
              max={100000000}
              step={100000}
              value={lumpsum}
              onChange={(e) => setLumpsum(Number(e.target.value))}
              className={styles.slider}
            />
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputHeader}>
              <label className="form-label">Monthly Withdrawal (SWP)</label>
              <span className={styles.inputValue}>Rs. {swp.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min={1000}
              max={1000000}
              step={1000}
              value={swp}
              onChange={(e) => setSwp(Number(e.target.value))}
              className={styles.slider}
            />
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputHeader}>
              <label className="form-label">Expected Annual Return</label>
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
                strokeDasharray={`${withdrawnPct * 3.016} ${balancePct * 3.016}`}
                strokeDashoffset="75.4"
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 0.5s ease' }}
              />
              <circle
                cx="60" cy="60" r="48"
                fill="none"
                stroke="var(--green-500)"
                strokeWidth="16"
                strokeDasharray={`${balancePct * 3.016} ${withdrawnPct * 3.016}`}
                strokeDashoffset={75.4 - withdrawnPct * 3.016}
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 0.5s ease' }}
              />
              <text x="60" y="55" textAnchor="middle" className={styles.donutLabel}>Balance</text>
              <text x="60" y="72" textAnchor="middle" className={styles.donutValue}>{formatINR(result.finalBalance).replace('Rs. ', '')}</text>
            </svg>
            <div className={styles.legend}>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: 'var(--navy-700)' }} />
                Withdrawn
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: 'var(--green-500)' }} />
                Final Balance
              </div>
            </div>
          </div>

          <div className={styles.resultCards}>
            <div className={styles.resultCard}>
              <p className={styles.resultLabel}>Total Withdrawn</p>
              <p className={styles.resultAmt} style={{ color: 'var(--navy-700)' }}>
                {formatINR(result.totalWithdrawn)}
              </p>
            </div>
            <div className={`${styles.resultCard} ${styles.resultCardMain}`}>
              <p className={styles.resultLabel}>Final Balance</p>
              <p className={styles.resultAmtMain}>{formatINR(result.finalBalance)}</p>
            </div>

            <button className="btn btn-primary w-full" onClick={onAdvisor}>
              Talk to an Advisor
            </button>
            <p className={styles.disclaimer}>Estimated value assuming {rate}% p.a. returns. Not a guaranteed return.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
