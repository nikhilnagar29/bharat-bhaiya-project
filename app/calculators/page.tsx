'use client';
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import InquiryModal from '@/components/ui/InquiryModal';
import SIPCalculator from '@/components/calculators/SIPCalculator';
import LumpsumCalculator from '@/components/calculators/LumpsumCalculator';
import FDRDCalculator from '@/components/calculators/FDRDCalculator';
import EMICalculator from '@/components/calculators/EMICalculator';
import RegularIncomeCalculator from '@/components/calculators/RegularIncomeCalculator';
import SWPCalculator from '@/components/calculators/SWPCalculator';
import GoalSettingCalculator from '@/components/calculators/GoalSettingCalculator';
import EducationCalculator from '@/components/calculators/EducationCalculator';
import CompoundInterestCalculator from '@/components/calculators/CompoundInterestCalculator';
import InflationCalculator from '@/components/calculators/InflationCalculator';
import RetirementCalculator from '@/components/calculators/RetirementCalculator';
import styles from './page.module.css';

const tabs = [
  { id: 'lumpsum', label: 'Lumpsum' },
  { id: 'regular-income', label: 'Regular Income' },
  { id: 'sip', label: 'SIP Returns' },
  { id: 'swp', label: 'SWP' },
  { id: 'goal-setting', label: 'Goal Setting' },
  { id: 'retirement', label: 'Retirement Fund' },
  { id: 'education', label: 'Education' },
  { id: 'emi', label: 'EMI' },
  { id: 'compound-interest', label: 'Compound Interest' },
  { id: 'inflation', label: 'Inflation' },
];

export default function CalculatorsPage() {
  const [active, setActive] = useState('lumpsum');
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Navbar />
      <main>
        {/* Page Header */}
        <div className={styles.header}>
          <div className="container">
            <span className="label" style={{ color: 'var(--green-400)' }}>Financial Tools</span>
            <h1 className="heading-1" style={{ color: 'white', marginTop: '0.5rem' }}>
              Financial Calculators
            </h1>
            <p className="body-lg" style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 540, marginTop: '0.75rem' }}>
              Plan your investments and financial goals with our interactive calculators. All calculations are instant and client-side.
            </p>
          </div>
        </div>

        {/* Calculator content */}
        <div className={styles.body}>
          <div className="container">
            {/* Tabs */}
            <div className={styles.tabs} role="tablist">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={active === t.id}
                  className={`${styles.tab} ${active === t.id ? styles.tabActive : ''}`}
                  onClick={() => setActive(t.id)}
                  id={`calc-tab-${t.id}`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Calculator panel */}
            <div className={styles.panel}>
              {active === 'lumpsum' && <LumpsumCalculator onAdvisor={() => setModalOpen(true)} />}
              {active === 'regular-income' && <RegularIncomeCalculator onAdvisor={() => setModalOpen(true)} />}
              {active === 'sip' && <SIPCalculator onAdvisor={() => setModalOpen(true)} />}
              {active === 'swp' && <SWPCalculator onAdvisor={() => setModalOpen(true)} />}
              {active === 'goal-setting' && <GoalSettingCalculator onAdvisor={() => setModalOpen(true)} />}
              {active === 'retirement' && <RetirementCalculator onAdvisor={() => setModalOpen(true)} />}
              {active === 'education' && <EducationCalculator onAdvisor={() => setModalOpen(true)} />}
              {active === 'emi' && <EMICalculator onAdvisor={() => setModalOpen(true)} />}
              {active === 'compound-interest' && <CompoundInterestCalculator onAdvisor={() => setModalOpen(true)} />}
              {active === 'inflation' && <InflationCalculator onAdvisor={() => setModalOpen(true)} />}
            </div>

            {/* Estimate note */}
            <div className={styles.note}>
              All calculator results are approximate estimates for financial planning purposes only. Actual figures may vary based on market conditions, applicable taxes, and other factors. Please consult a qualified financial advisor before making investment decisions.
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <InquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultService="General Inquiry"
      />
    </>
  );
}
