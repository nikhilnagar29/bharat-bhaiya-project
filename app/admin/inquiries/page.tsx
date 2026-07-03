'use client';
import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import styles from '../admin.module.css';

interface Inquiry {
  _id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  message?: string;
  status: 'New' | 'Contacted' | 'Closed';
  createdAt: string;
}

const STATUS_COLORS = {
  New: 'badge-new',
  Contacted: 'badge-contacted',
  Closed: 'badge-closed',
};

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filter, setFilter] = useState<string>('All');
  const [detail, setDetail] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch('/api/admin/inquiries')
      .then((r) => r.json())
      .then((d) => { setInquiries(d); setLoading(false); });
  };

  useEffect(load, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/inquiries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    load();
    if (detail?._id === id) setDetail((d) => d ? { ...d, status: status as Inquiry['status'] } : d);
  };

  const filtered = filter === 'All' ? inquiries : inquiries.filter((i) => i.status === filter);

  return (
    <AdminShell>
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <div>
            <h2 className={styles.pageTitle}>Inquiries</h2>
            <p className={styles.pageSub}>All inquiry form submissions from the website.</p>
          </div>
          <div className={styles.filters}>
            {['All', 'New', 'Contacted', 'Closed'].map((f) => (
              <button
                key={f}
                className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
                onClick={() => setFilter(f)}
              >
                {f}
                {f !== 'All' && (
                  <span className={styles.filterCount}>
                    {inquiries.filter((i) => i.status === f).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.tableCard}>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Service</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className={styles.emptyCell}>Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={7} className={styles.emptyCell}>No inquiries found.</td></tr>
                ) : (
                  filtered.map((inq) => (
                    <tr key={inq._id}>
                      <td className={styles.nameCell}>{inq.name}</td>
                      <td>{inq.phone}</td>
                      <td className={styles.emailCell}>{inq.email}</td>
                      <td className={styles.serviceCell}>{inq.service}</td>
                      <td>
                        <span className={`badge ${STATUS_COLORS[inq.status]}`}>{inq.status}</span>
                      </td>
                      <td className={styles.dateCell}>
                        {new Date(inq.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <button className={styles.detailBtn} onClick={() => setDetail(inq)}>View</button>
                          <select
                            className={styles.statusSelect}
                            value={inq.status}
                            onChange={(e) => updateStatus(inq._id, e.target.value)}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail modal */}
        {detail && (
          <div className="modal-overlay" onClick={() => setDetail(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="heading-4">Inquiry Detail</h3>
                <button className="modal-close" onClick={() => setDetail(null)}>&#x2715;</button>
              </div>
              <div className="modal-body">
                <div className={styles.detailGrid}>
                  {[
                    ['Name', detail.name],
                    ['Phone', detail.phone],
                    ['Email', detail.email],
                    ['Service', detail.service],
                    ['Status', detail.status],
                    ['Submitted', new Date(detail.createdAt).toLocaleString('en-IN')],
                  ].map(([label, val]) => (
                    <div key={label} className={styles.detailRow}>
                      <span className={styles.detailLabel}>{label}</span>
                      <span className={styles.detailVal}>{val}</span>
                    </div>
                  ))}
                  {detail.message && (
                    <div className={styles.detailMessage}>
                      <span className={styles.detailLabel}>Message</span>
                      <p className={styles.messageText}>{detail.message}</p>
                    </div>
                  )}
                </div>
                <div style={{ marginTop: '1.25rem' }}>
                  <p className="form-label" style={{ marginBottom: '0.5rem' }}>Update Status</p>
                  <div style={{ display: 'flex', gap: '0.625rem' }}>
                    {(['New', 'Contacted', 'Closed'] as const).map((s) => (
                      <button
                        key={s}
                        className={`btn btn-sm ${detail.status === s ? 'btn-navy' : 'btn-outline'}`}
                        onClick={() => updateStatus(detail._id, s)}
                      >
                        {s}
                      </button>
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
