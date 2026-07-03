'use client';
import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import styles from '../admin.module.css';

interface Application {
  _id: string;
  fullName: string;
  mobile: string;
  email: string;
  pincode: string;
  cardName: string;
  status: 'New' | 'Contacted' | 'Closed';
  createdAt: string;
}

const STATUS_COLORS = { New: 'badge-new', Contacted: 'badge-contacted', Closed: 'badge-closed' };

export default function ApplicationsAdminPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [filter, setFilter] = useState('All');
  const [detail, setDetail] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch('/api/admin/applications').then((r) => r.json()).then((d) => { setApps(d); setLoading(false); });
  };
  useEffect(load, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/applications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    load();
    if (detail?._id === id) setDetail((d) => d ? { ...d, status: status as Application['status'] } : d);
  };

  const filtered = filter === 'All' ? apps : apps.filter((a) => a.status === filter);

  return (
    <AdminShell>
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <div>
            <h2 className={styles.pageTitle}>Credit Card Applications</h2>
            <p className={styles.pageSub}>All credit card application submissions.</p>
          </div>
          <div className={styles.filters}>
            {['All', 'New', 'Contacted', 'Closed'].map((f) => (
              <button key={f} className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`} onClick={() => setFilter(f)}>
                {f}
                {f !== 'All' && <span className={styles.filterCount}>{apps.filter((a) => a.status === f).length}</span>}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.tableCard}>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Mobile</th>
                  <th>Email</th>
                  <th>Pincode</th>
                  <th>Card Selected</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} className={styles.emptyCell}>Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={8} className={styles.emptyCell}>No applications found.</td></tr>
                ) : filtered.map((app) => (
                  <tr key={app._id}>
                    <td className={styles.nameCell}>{app.fullName}</td>
                    <td>{app.mobile}</td>
                    <td className={styles.emailCell}>{app.email}</td>
                    <td>{app.pincode}</td>
                    <td className={styles.serviceCell}>{app.cardName}</td>
                    <td><span className={`badge ${STATUS_COLORS[app.status]}`}>{app.status}</span></td>
                    <td className={styles.dateCell}>
                      {new Date(app.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.detailBtn} onClick={() => setDetail(app)}>View</button>
                        <select className={styles.statusSelect} value={app.status} onChange={(e) => updateStatus(app._id, e.target.value)}>
                          <option>New</option>
                          <option>Contacted</option>
                          <option>Closed</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {detail && (
          <div className="modal-overlay" onClick={() => setDetail(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="heading-4">Application Detail</h3>
                <button className="modal-close" onClick={() => setDetail(null)}>&#x2715;</button>
              </div>
              <div className="modal-body">
                <div className={styles.detailGrid}>
                  {[
                    ['Full Name', detail.fullName],
                    ['Mobile', detail.mobile],
                    ['Email', detail.email],
                    ['Pincode', detail.pincode],
                    ['Card Selected', detail.cardName],
                    ['Status', detail.status],
                    ['Submitted', new Date(detail.createdAt).toLocaleString('en-IN')],
                  ].map(([label, val]) => (
                    <div key={label} className={styles.detailRow}>
                      <span className={styles.detailLabel}>{label}</span>
                      <span className={styles.detailVal}>{val}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '1.25rem' }}>
                  <p className="form-label" style={{ marginBottom: '0.5rem' }}>Update Status</p>
                  <div style={{ display: 'flex', gap: '0.625rem' }}>
                    {(['New', 'Contacted', 'Closed'] as const).map((s) => (
                      <button key={s} className={`btn btn-sm ${detail.status === s ? 'btn-navy' : 'btn-outline'}`} onClick={() => updateStatus(detail._id, s)}>{s}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
