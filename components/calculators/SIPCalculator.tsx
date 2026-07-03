'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './Calculator.module.css';

interface CalcProps {
  onAdvisor: () => void;
}

function formatINR(n: number): string {
  if (n >= 10000000) return `Rs. ${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `Rs. ${(n / 100000).toFixed(2)} L`;
  return `Rs. ${Math.round(n).toLocaleString('en-IN')}`;
}

export default function SIPCalculator({ onAdvisor }: CalcProps) {
  const [monthly, setMonthly] = useState(10000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const [result, setResult] = useState({ maturity: 0, invested: 0, returns: 0 });

  useEffect(() => {
    const r = rate / 100 / 12;
    const n = years * 12;
    const maturity = monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const invested = monthly * n;
    const returns = maturity - invested;
    setResult({ maturity, invested, returns });
  }, [monthly, rate, years]);

  const investedPct = result.maturity > 0 ? (result.invested / result.maturity) * 100 : 50;
  const returnsPct = 100 - investedPct;

  return (
    <div className={styles.calc}>
      <div className={styles.header}>
        <h2 className="heading-3" style={{ color: 'var(--navy-800)' }}>SIP Calculator</h2>
        <p className="body-sm text-muted">
          Estimate the maturity value of your Systematic Investment Plan.
        </p>
      </div>

      <div className={styles.body}>
        {/* Inputs */}
        <div className={styles.inputs}>
          <div className={styles.inputGroup}>
            <div className={styles.inputHeader}>
              <label className="form-label">Monthly Investment</label>
              <span className={styles.inputValue}>Rs. {monthly.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min={500}
              max={200000}
              step={500}
              value={monthly}
              onChange={(e) => setMonthly(Number(e.target.value))}
              className={styles.slider}
              aria-label="Monthly investment amount"
            />
            <div className={styles.sliderLabels}>
              <span>Rs. 500</span><span>Rs. 2 L</span>
            </div>
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
              aria-label="Expected return rate"
            />
            <div className={styles.sliderLabels}>
              <span>1%</span><span>30%</span>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputHeader}>
              <label className="form-label">Investment Duration</label>
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
              aria-label="Investment duration in years"
            />
            <div className={styles.sliderLabels}>
              <span>1 yr</span><span>40 yrs</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className={styles.results}>
          {/* Donut Chart */}
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
              <text x="60" y="55" textAnchor="middle" className={styles.donutLabel}>Maturity</text>
              <text x="60" y="72" textAnchor="middle" className={styles.donutValue}>{formatINR(result.maturity).replace('Rs. ', '')}</text>
            </svg>
            <div className={styles.legend}>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: 'var(--navy-700)' }} />
                Invested
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: 'var(--green-500)' }} />
                Returns
              </div>
            </div>
          </div>

          <div className={styles.resultCards}>
            <div className={styles.resultCard}>
              <p className={styles.resultLabel}>Total Invested</p>
              <p className={styles.resultAmt} style={{ color: 'var(--navy-700)' }}>
                {formatINR(result.invested)}
              </p>
            </div>
            <div className={styles.resultCard}>
              <p className={styles.resultLabel}>Estimated Returns</p>
              <p className={styles.resultAmt} style={{ color: 'var(--green-600)' }}>
                {formatINR(result.returns)}
              </p>
            </div>
            <div className={`${styles.resultCard} ${styles.resultCardMain}`}>
              <p className={styles.resultLabel}>Total Maturity Value</p>
              <p className={styles.resultAmtMain}>{formatINR(result.maturity)}</p>
            </div>

            <button className="btn btn-primary w-full" onClick={onAdvisor} id="sip-advisor-cta">
              Talk to an Advisor
            </button>
            <p className={styles.disclaimer}>Estimated value assuming {rate}% p.a. compounded monthly. Not a guaranteed return.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
