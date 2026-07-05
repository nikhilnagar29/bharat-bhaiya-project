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

export default function EducationCalculator({ onAdvisor }: CalcProps) {
  const [currentCost, setCurrentCost] = useState(1000000);
  const [inflation, setInflation] = useState(8);
  const [years, setYears] = useState(15);
  const [rate, setRate] = useState(12);
  const [result, setResult] = useState({ futureCost: 0, monthlySIP: 0 });

  useEffect(() => {
    // Calculate future cost with inflation
    const futureCost = currentCost * Math.pow(1 + inflation / 100, years);
    
    // Calculate required SIP to reach future cost
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    
    const monthlySIP = futureCost / ((((Math.pow(1 + monthlyRate, months) - 1) * (1 + monthlyRate)) / monthlyRate));

    setResult({ futureCost, monthlySIP });
  }, [currentCost, inflation, years, rate]);

  const totalInvested = result.monthlySIP * years * 12;
  const estimatedReturns = result.futureCost - totalInvested;
  
  const investedPct = (totalInvested / result.futureCost) * 100 || 50;
  const returnsPct = 100 - investedPct;

  return (
    <div className={styles.calc}>
      <div className={styles.header}>
        <h2 className="heading-3" style={{ color: 'var(--navy-800)' }}>Education Calculator</h2>
        <p className="body-sm text-muted">
          Plan your child's higher education by estimating future costs and required investments.
        </p>
      </div>

      <div className={styles.body}>
        <div className={styles.inputs}>
          <div className={styles.inputGroup}>
            <div className={styles.inputHeader}>
              <label className="form-label">Current Cost of Education</label>
              <span className={styles.inputValue}>Rs. {currentCost.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min={100000}
              max={10000000}
              step={100000}
              value={currentCost}
              onChange={(e) => setCurrentCost(Number(e.target.value))}
              className={styles.slider}
            />
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputHeader}>
              <label className="form-label">Years Remaining</label>
              <span className={styles.inputValue}>{years} years</span>
            </div>
            <input
              type="range"
              min={1}
              max={25}
              step={1}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className={styles.slider}
            />
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputHeader}>
              <label className="form-label">Expected Inflation Rate</label>
              <span className={styles.inputValue}>{inflation}% p.a.</span>
            </div>
            <input
              type="range"
              min={1}
              max={20}
              step={0.5}
              value={inflation}
              onChange={(e) => setInflation(Number(e.target.value))}
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
              <text x="60" y="55" textAnchor="middle" className={styles.donutLabel}>Future Cost</text>
              <text x="60" y="72" textAnchor="middle" className={styles.donutValue}>{formatINR(result.futureCost).replace('Rs. ', '')}</text>
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
              <p className={styles.resultLabel}>Future Cost of Education</p>
              <p className={styles.resultAmt} style={{ color: 'var(--navy-700)' }}>
                {formatINR(result.futureCost)}
              </p>
            </div>
            <div className={`${styles.resultCard} ${styles.resultCardMain}`}>
              <p className={styles.resultLabel}>Required Monthly SIP</p>
              <p className={styles.resultAmtMain}>{formatINR(result.monthlySIP)}</p>
            </div>

            <button className="btn btn-primary w-full" onClick={onAdvisor}>
              Talk to an Advisor
            </button>
            <p className={styles.disclaimer}>Estimated assuming {inflation}% inflation and {rate}% p.a. returns.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
