'use client';
import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import styles from './page.module.css';

interface Stats {
  inquiries: number;
  applications: number;
  services: number;
  testimonials: number;
  creditCards: number;
  newInquiries: number;
  newApplications: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/inquiries').then((r) => r.json()),
      fetch('/api/admin/applications').then((r) => r.json()),
      fetch('/api/admin/services').then((r) => r.json()),
      fetch('/api/admin/testimonials').then((r) => r.json()),
      fetch('/api/admin/credit-cards').then((r) => r.json()),
    ]).then(([inq, apps, srv, test, cards]) => {
      setStats({
        inquiries: inq.length,
        applications: apps.length,
        services: srv.length,
        testimonials: test.length,
        creditCards: cards.length,
        newInquiries: inq.filter((i: { status: string }) => i.status === 'New').length,
        newApplications: apps.filter((a: { status: string }) => a.status === 'New').length,
      });
    });
  }, []);

  const cards = [
    { label: 'Total Inquiries', value: stats?.inquiries ?? '—', sub: `${stats?.newInquiries ?? 0} new`, color: '#0ea5e9' },
    { label: 'CC Applications', value: stats?.applications ?? '—', sub: `${stats?.newApplications ?? 0} new`, color: 'var(--green-500)' },
    { label: 'Services Listed', value: stats?.services ?? '—', sub: 'Active services', color: 'var(--navy-600)' },
    { label: 'Testimonials', value: stats?.testimonials ?? '—', sub: 'Published', color: '#8b5cf6' },
    { label: 'Credit Cards', value: stats?.creditCards ?? '—', sub: 'Available cards', color: '#f59e0b' },
  ];

  return (
    <AdminShell>
      <div className={styles.page}>
        <div className={styles.welcomeBanner}>
          <div>
            <h2 className={styles.welcomeTitle}>Welcome back, Admin</h2>
            <p className={styles.welcomeSub}>Here is an overview of GrowNsure activity.</p>
          </div>
          <a href="/" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
            View Live Site
          </a>
        </div>

        <div className={styles.statsGrid}>
          {cards.map((c) => (
            <div key={c.label} className={styles.statCard}>
              <div className={styles.statAccent} style={{ background: c.color }} />
              <p className={styles.statLabel}>{c.label}</p>
              <p className={styles.statValue}>{c.value}</p>
              <p className={styles.statSub}>{c.sub}</p>
            </div>
          ))}
        </div>

        <div className={styles.quickNav}>
          <h3 className={styles.quickNavTitle}>Quick Actions</h3>
          <div className={styles.quickGrid}>
            {[
              { label: 'Manage Inquiries', href: '/admin/inquiries', desc: 'View and respond to contact inquiries' },
              { label: 'Manage Services', href: '/admin/services', desc: 'Add, edit, or remove financial services' },
              { label: 'Manage Testimonials', href: '/admin/testimonials', desc: 'Add client testimonials to the website' },
              { label: 'Manage Credit Cards', href: '/admin/credit-cards', desc: 'Add or update available credit cards' },
              { label: 'CC Applications', href: '/admin/applications', desc: 'Review credit card applications' },
              { label: 'Edit Content', href: '/admin/content', desc: 'Update hero text, about section, disclaimer' },
            ].map((item) => (
              <a key={item.href} href={item.href} className={styles.quickCard}>
                <p className={styles.quickLabel}>{item.label}</p>
                <p className={styles.quickDesc}>{item.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
