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

export default function GoalSettingCalculator({ onAdvisor }: CalcProps) {
  const [target, setTarget] = useState(10000000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const [result, setResult] = useState({ monthlySIP: 0, totalInvested: 0, estimatedReturns: 0 });

  useEffect(() => {
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    
    // Future Value of SIP formula: FV = P * [ (1+r)^n - 1 ] * (1+r) / r
    // We need to find P (monthlySIP)
    const monthlySIP = target / ((((Math.pow(1 + monthlyRate, months) - 1) * (1 + monthlyRate)) / monthlyRate));
    
    const totalInvested = monthlySIP * months;
    const estimatedReturns = target - totalInvested;

    setResult({ monthlySIP, totalInvested, estimatedReturns });
  }, [target, rate, years]);

  const investedPct = (result.totalInvested / target) * 100 || 50;
  const returnsPct = 100 - investedPct;

  return (
    <div className={styles.calc}>
      <div className={styles.header}>
        <h2 className="heading-3" style={{ color: 'var(--navy-800)' }}>Goal Setting Calculator</h2>
        <p className="body-sm text-muted">
          Calculate the required monthly investment (SIP) to reach your financial goals.
        </p>
      </div>

      <div className={styles.body}>
        <div className={styles.inputs}>
          <div className={styles.inputGroup}>
            <div className={styles.inputHeader}>
              <label className="form-label">Target Amount</label>
              <span className={styles.inputValue}>Rs. {target.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min={100000}
              max={100000000}
              step={100000}
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
              className={styles.slider}
            />
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputHeader}>
              <label className="form-label">Time Period to Goal</label>
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
                strokeDasharray={`${investedPct * 3.016} ${returnsPct * 3.016}`}
                strokeDashoffset="75.4"
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 0.5s ease' }}
              />
              <circle
                cx="60" cy="60" r="48"
                fill="none"
                stroke="var(--green-500)"
                strokeWidth="16"
                strokeDasharray={`${returnsPct * 3.016} ${investedPct * 3.016}`}
                strokeDashoffset={75.4 - investedPct * 3.016}
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 0.5s ease' }}
              />
              <text x="60" y="55" textAnchor="middle" className={styles.donutLabel}>Required SIP</text>
              <text x="60" y="72" textAnchor="middle" className={styles.donutValue}>{formatINR(result.monthlySIP).replace('Rs. ', '')}</text>
            </svg>
            <div className={styles.legend}>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: 'var(--navy-700)' }} />
                Total Invested
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: 'var(--green-500)' }} />
                Estimated Returns
              </div>
            </div>
          </div>

          <div className={styles.resultCards}>
            <div className={styles.resultCard}>
              <p className={styles.resultLabel}>Total Invested</p>
              <p className={styles.resultAmt} style={{ color: 'var(--navy-700)' }}>
                {formatINR(result.totalInvested)}
              </p>
            </div>
            <div className={styles.resultCard}>
              <p className={styles.resultLabel}>Estimated Returns</p>
              <p className={styles.resultAmt} style={{ color: 'var(--green-500)' }}>
                {formatINR(result.estimatedReturns)}
              </p>
            </div>
            <div className={`${styles.resultCard} ${styles.resultCardMain}`}>
              <p className={styles.resultLabel}>Monthly SIP Required</p>
              <p className={styles.resultAmtMain}>{formatINR(result.monthlySIP)}</p>
            </div>

            <button className="btn btn-primary w-full" onClick={onAdvisor}>
              Talk to an Advisor
            </button>
            <p className={styles.disclaimer}>Estimated required SIP assuming {rate}% p.a. returns. Not a guaranteed return.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
