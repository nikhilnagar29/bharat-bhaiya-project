'use client';
import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import styles from '../admin.module.css';

interface Testimonial {
  _id: string;
  clientName: string;
  designation?: string;
  city?: string;
  text: string;
  rating?: number;
  isActive: boolean;
}

const empty = { clientName: '', designation: '', city: '', text: '', rating: 5, isActive: true };

export default function TestimonialsAdminPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const load = () => fetch('/api/admin/testimonials').then((r) => r.json()).then(setItems);
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing({ ...empty }); setIsNew(true); setMsg(''); };
  const openEdit = (t: Testimonial) => { setEditing({ ...t }); setIsNew(false); setMsg(''); };
  const cancel = () => { setEditing(null); setMsg(''); };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      if (isNew) {
        await fetch('/api/admin/testimonials', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editing) });
      } else {
        await fetch(`/api/admin/testimonials/${editing._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editing) });
      }
      setMsg('Saved successfully.');
      load();
      setEditing(null);
    } catch { setMsg('Error saving.'); }
    finally { setSaving(false); }
  };

  const del = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
    load();
  };

  const change = (k: string, v: string | boolean | number) => setEditing((e) => e ? { ...e, [k]: v } : e);

  return (
    <AdminShell>
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <div>
            <h2 className={styles.pageTitle}>Testimonials</h2>
            <p className={styles.pageSub}>Manage client testimonials displayed on the homepage.</p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={openNew} id="add-testimonial-btn">Add Testimonial</button>
        </div>

        {editing && (
          <div className={styles.formCard}>
            <h3 className={styles.formTitle}>{isNew ? 'New Testimonial' : 'Edit Testimonial'}</h3>
            {msg && <div className={`alert ${msg.includes('Error') ? 'alert-error' : 'alert-success'}`} style={{ marginBottom: '1rem' }}>{msg}</div>}
            <div className={styles.formGrid}>
              <div className="form-group">
                <label className="form-label">Client Name *</label>
                <input className="form-control" value={editing.clientName || ''} onChange={(e) => change('clientName', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Rating (1–5)</label>
                <select className="form-control" value={editing.rating || 5} onChange={(e) => change('rating', Number(e.target.value))}>
                  {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Stars</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Designation</label>
                <input className="form-control" value={editing.designation || ''} onChange={(e) => change('designation', e.target.value)} placeholder="e.g. Business Owner" />
              </div>
              <div className="form-group">
                <label className="form-label">City</label>
                <input className="form-control" value={editing.city || ''} onChange={(e) => change('city', e.target.value)} placeholder="e.g. Mumbai" />
              </div>
              <div className={`form-group ${styles.formFull}`}>
                <label className="form-label">Testimonial Text *</label>
                <textarea className="form-control" rows={4} value={editing.text || ''} onChange={(e) => change('text', e.target.value)} placeholder="Client's testimonial..." />
              </div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <input type="checkbox" checked={!!editing.isActive} onChange={(e) => change('isActive', e.target.checked)} />
              <span className="form-label" style={{ margin: 0 }}>Active (show on website)</span>
            </label>
            <div className={styles.formActions}>
              <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save Testimonial'}</button>
              <button className="btn btn-outline" onClick={cancel}>Cancel</button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {items.map((t) => (
            <div key={t._id} className={styles.listItem}>
              <div className={styles.listItemInfo}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem' }}>
                  <p className={styles.listItemTitle}>{t.clientName}</p>
                  {t.rating && <span style={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: 600 }}>{t.rating}/5</span>}
                  <span className={`badge ${t.isActive ? 'badge-green' : 'badge-navy'}`}>{t.isActive ? 'Active' : 'Hidden'}</span>
                </div>
                {(t.designation || t.city) && (
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    {[t.designation, t.city].filter(Boolean).join(', ')}
                  </p>
                )}
                <p className={styles.listItemDesc}>{t.text}</p>
              </div>
              <div className={styles.listItemActions}>
                <button className={styles.editBtn} onClick={() => openEdit(t)}>Edit</button>
                <button className={styles.deleteBtn} onClick={() => del(t._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
