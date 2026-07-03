'use client';
import { useState, useEffect } from 'react';
import styles from './Calculator.module.css';

interface CalcProps { onAdvisor: () => void; }

function formatINR(n: number): string {
  if (n >= 10000000) return `Rs. ${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `Rs. ${(n / 100000).toFixed(2)} L`;
  return `Rs. ${Math.round(n).toLocaleString('en-IN')}`;
}

export default function RetirementCalculator({ onAdvisor }: CalcProps) {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [monthlyExpenses, setMonthlyExpenses] = useState(50000);
  const [inflation, setInflation] = useState(6);
  const [returnRate, setReturnRate] = useState(12);
  const [result, setResult] = useState({ corpus: 0, monthlySIP: 0, yearsLeft: 0, inflatedExpenses: 0 });

  useEffect(() => {
    const yearsLeft = retirementAge - currentAge;
    if (yearsLeft <= 0) { setResult({ corpus: 0, monthlySIP: 0, yearsLeft: 0, inflatedExpenses: 0 }); return; }

    // Annual expenses at retirement (inflation-adjusted)
    const annualExpensesAtRetirement = monthlyExpenses * 12 * Math.pow(1 + inflation / 100, yearsLeft);
    // Corpus needed: 25x annual expenses (safe withdrawal rate ~4%)
    const corpus = annualExpensesAtRetirement * 25;

    // Monthly SIP required to accumulate corpus
    const r = returnRate / 100 / 12;
    const n = yearsLeft * 12;
    const monthlySIP = corpus * r / (Math.pow(1 + r, n) - 1);

    setResult({ corpus, monthlySIP, yearsLeft, inflatedExpenses: annualExpensesAtRetirement / 12 });
  }, [currentAge, retirementAge, monthlyExpenses, inflation, returnRate]);

  return (
    <div className={styles.calc}>
      <div className={styles.header}>
        <h2 className="heading-3" style={{ color: 'var(--navy-800)' }}>Retirement Planner</h2>
        <p className="body-sm text-muted">Estimate the retirement corpus you need and the monthly SIP to achieve it.</p>
      </div>

      <div className={styles.body}>
        <div className={styles.inputs}>
          {[
            { label: 'Current Age', value: currentAge, min: 20, max: 60, step: 1, display: `${currentAge} years`, set: setCurrentAge, lo: '20', hi: '60' },
            { label: 'Retirement Age', value: retirementAge, min: 45, max: 80, step: 1, display: `${retirementAge} years`, set: setRetirementAge, lo: '45', hi: '80' },
            { label: 'Current Monthly Expenses', value: monthlyExpenses, min: 5000, max: 500000, step: 1000, display: `Rs. ${monthlyExpenses.toLocaleString('en-IN')}`, set: setMonthlyExpenses, lo: 'Rs. 5K', hi: 'Rs. 5 L' },
            { label: 'Expected Inflation Rate', value: inflation, min: 2, max: 12, step: 0.5, display: `${inflation}% p.a.`, set: setInflation, lo: '2%', hi: '12%' },
            { label: 'Expected Investment Return', value: returnRate, min: 4, max: 20, step: 0.5, display: `${returnRate}% p.a.`, set: setReturnRate, lo: '4%', hi: '20%' },
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
          {result.yearsLeft <= 0 ? (
            <div className={styles.resultCards}>
              <p className="text-muted body-sm">Please ensure retirement age is greater than current age.</p>
            </div>
          ) : (
            <div className={styles.resultCards}>
              <div style={{ background: 'linear-gradient(135deg, var(--navy-900), var(--navy-800))', borderRadius: 'var(--radius-xl)', padding: '1.75rem', textAlign: 'center', marginBottom: '0.25rem' }}>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>Retirement Corpus Required</p>
                <p style={{ color: 'var(--green-400)', fontSize: '1.75rem', fontWeight: 800 }}>{formatINR(result.corpus)}</p>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem', marginTop: '0.5rem' }}>In {result.yearsLeft} years at {retirementAge}</p>
              </div>

              <div style={{ background: 'linear-gradient(135deg, var(--green-700), var(--green-600))', borderRadius: 'var(--radius-xl)', padding: '1.75rem', textAlign: 'center', marginBottom: '0.25rem' }}>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>Monthly SIP Required</p>
                <p style={{ color: 'white', fontSize: '1.75rem', fontWeight: 800 }}>{formatINR(result.monthlySIP)}</p>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', marginTop: '0.5rem' }}>At {returnRate}% p.a. for {result.yearsLeft} years</p>
              </div>

              <div className={styles.resultCard}><p className={styles.resultLabel}>Monthly Expenses at Retirement</p><p className={styles.resultAmt} style={{ color: 'var(--navy-700)' }}>{formatINR(result.inflatedExpenses)}</p></div>
              <div className={styles.resultCard}><p className={styles.resultLabel}>Years to Retirement</p><p className={styles.resultAmt} style={{ color: 'var(--navy-700)' }}>{result.yearsLeft} years</p></div>

              <button className="btn btn-primary w-full" onClick={onAdvisor} id="retirement-advisor-cta">Talk to an Advisor</button>
              <p className={styles.disclaimer}>Uses 25x annual expense rule (4% withdrawal rate). Assumes constant inflation and returns. This is an approximation — actual corpus needs may vary.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
