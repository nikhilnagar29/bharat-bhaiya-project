'use client';
import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import styles from '../admin.module.css';

interface Service {
  _id: string;
  title: string;
  description: string;
  subDescription?: string;
  buttonText: string;
  order: number;
  isActive: boolean;
  slug?: string;
}

const empty = { title: '', description: '', subDescription: '', buttonText: 'Inquire Now', order: 0, isActive: true, slug: '' };

export default function ServicesAdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [editing, setEditing] = useState<Partial<Service> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const load = () => fetch('/api/admin/services').then((r) => r.json()).then(setServices);
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing({ ...empty }); setIsNew(true); setMsg(''); };
  const openEdit = (s: Service) => { setEditing({ ...s }); setIsNew(false); setMsg(''); };
  const cancel = () => { setEditing(null); setMsg(''); };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      if (isNew) {
        await fetch('/api/admin/services', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editing) });
      } else {
        await fetch(`/api/admin/services/${editing._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editing) });
      }
      setMsg('Saved successfully.');
      load();
      setEditing(null);
    } catch { setMsg('Error saving. Please try again.'); }
    finally { setSaving(false); }
  };

  const deleteService = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
    load();
  };

  const change = (k: string, v: string | boolean | number) => setEditing((e) => e ? { ...e, [k]: v } : e);

  return (
    <AdminShell>
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <div>
            <h2 className={styles.pageTitle}>Services</h2>
            <p className={styles.pageSub}>Add, edit, or remove financial service cards shown on the website.</p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={openNew} id="add-service-btn">
            Add Service
          </button>
        </div>

        {/* Form */}
        {editing && (
          <div className={styles.formCard}>
            <h3 className={styles.formTitle}>{isNew ? 'New Service' : 'Edit Service'}</h3>
            {msg && <div className={`alert ${msg.includes('Error') ? 'alert-error' : 'alert-success'}`} style={{ marginBottom: '1rem' }}>{msg}</div>}
            <div className={styles.formGrid}>
              <div className="form-group">
                <label className="form-label">Service Title *</label>
                <input className="form-control" value={editing.title || ''} onChange={(e) => change('title', e.target.value)} placeholder="e.g. Term Insurance" />
              </div>
              <div className="form-group">
                <label className="form-label">Button Text *</label>
                <input className="form-control" value={editing.buttonText || ''} onChange={(e) => change('buttonText', e.target.value)} placeholder="e.g. Inquire Now" />
              </div>
              <div className={`form-group ${styles.formFull}`}>
                <label className="form-label">Main Description *</label>
                <textarea className="form-control" rows={3} value={editing.description || ''} onChange={(e) => change('description', e.target.value)} />
              </div>
              <div className={`form-group ${styles.formFull}`}>
                <label className="form-label">Sub Description (shown as tag)</label>
                <input className="form-control" value={editing.subDescription || ''} onChange={(e) => change('subDescription', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Display Order</label>
                <input type="number" className="form-control" value={editing.order || 0} onChange={(e) => change('order', Number(e.target.value))} />
              </div>
              <div className="form-group">
                <label className="form-label">Slug (URL identifier)</label>
                <input className="form-control" value={editing.slug || ''} onChange={(e) => change('slug', e.target.value)} placeholder="e.g. term-insurance" />
              </div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <input type="checkbox" checked={!!editing.isActive} onChange={(e) => change('isActive', e.target.checked)} />
              <span className="form-label" style={{ margin: 0 }}>Active (visible on website)</span>
            </label>
            <div className={styles.formActions}>
              <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save Service'}</button>
              <button className="btn btn-outline" onClick={cancel}>Cancel</button>
            </div>
          </div>
        )}

        {/* List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {services.map((s) => (
            <div key={s._id} className={styles.listItem}>
              <div className={styles.listItemInfo}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.3rem' }}>
                  <p className={styles.listItemTitle}>{s.title}</p>
                  <span className={`badge ${s.isActive ? 'badge-green' : 'badge-navy'}`}>
                    {s.isActive ? 'Active' : 'Hidden'}
                  </span>
                </div>
                <p className={styles.listItemDesc}>{s.description}</p>
              </div>
              <div className={styles.listItemActions}>
                <button className={styles.editBtn} onClick={() => openEdit(s)}>Edit</button>
                <button className={styles.deleteBtn} onClick={() => deleteService(s._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
