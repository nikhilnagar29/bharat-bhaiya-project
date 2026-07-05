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

export default function InflationCalculator({ onAdvisor }: CalcProps) {
  const [expense, setExpense] = useState(50000);
  const [rate, setRate] = useState(6);
  const [years, setYears] = useState(10);
  const [result, setResult] = useState({ futureExpense: 0, difference: 0 });

  useEffect(() => {
    const futureExpense = expense * Math.pow(1 + rate / 100, years);
    const difference = futureExpense - expense;

    setResult({ futureExpense, difference });
  }, [expense, rate, years]);

  const expensePct = result.futureExpense > 0 ? (expense / result.futureExpense) * 100 : 50;
  const differencePct = 100 - expensePct;

  return (
    <div className={styles.calc}>
      <div className={styles.header}>
        <h2 className="heading-3" style={{ color: 'var(--navy-800)' }}>Inflation Calculator</h2>
        <p className="body-sm text-muted">
          Calculate the impact of inflation on your purchasing power over time.
        </p>
      </div>

      <div className={styles.body}>
        <div className={styles.inputs}>
          <div className={styles.inputGroup}>
            <div className={styles.inputHeader}>
              <label className="form-label">Current Monthly Expense</label>
              <span className={styles.inputValue}>Rs. {expense.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min={10000}
              max={1000000}
              step={5000}
              value={expense}
              onChange={(e) => setExpense(Number(e.target.value))}
              className={styles.slider}
            />
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputHeader}>
              <label className="form-label">Expected Inflation Rate</label>
              <span className={styles.inputValue}>{rate}% p.a.</span>
            </div>
            <input
              type="range"
              min={1}
              max={15}
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
                strokeDasharray={`${expensePct * 3.016} ${differencePct * 3.016}`}
                strokeDashoffset="75.4"
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 0.5s ease' }}
              />
              <circle
                cx="60" cy="60" r="48"
                fill="none"
                stroke="var(--green-500)"
                strokeWidth="16"
                strokeDasharray={`${differencePct * 3.016} ${expensePct * 3.016}`}
                strokeDashoffset={75.4 - expensePct * 3.016}
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 0.5s ease' }}
              />
              <text x="60" y="55" textAnchor="middle" className={styles.donutLabel}>Future Cost</text>
              <text x="60" y="72" textAnchor="middle" className={styles.donutValue}>{formatINR(result.futureExpense).replace('Rs. ', '')}</text>
            </svg>
            <div className={styles.legend}>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: 'var(--navy-700)' }} />
                Current Value
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: 'var(--green-500)' }} />
                Inflation Cost
              </div>
            </div>
          </div>

          <div className={styles.resultCards}>
            <div className={styles.resultCard}>
              <p className={styles.resultLabel}>Current Expense</p>
              <p className={styles.resultAmt} style={{ color: 'var(--navy-700)' }}>
                {formatINR(expense)}
              </p>
            </div>
            <div className={styles.resultCard}>
              <p className={styles.resultLabel}>Loss of Value</p>
              <p className={styles.resultAmt} style={{ color: 'var(--green-500)' }}>
                {formatINR(result.difference)}
              </p>
            </div>
            <div className={`${styles.resultCard} ${styles.resultCardMain}`}>
              <p className={styles.resultLabel}>Future Expense</p>
              <p className={styles.resultAmtMain}>{formatINR(result.futureExpense)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
