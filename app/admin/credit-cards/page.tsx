'use client';
import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import styles from '../admin.module.css';

interface CreditCard {
  _id: string;
  name: string;
  bank: string;
  imageUrl?: string;
  features: string[];
  annualFee: string;
  eligibility: string;
  isActive: boolean;
  order: number;
}

const emptyCard = { name: '', bank: '', imageUrl: '', features: [], annualFee: '', eligibility: '', isActive: true, order: 0 };

export default function CreditCardsAdminPage() {
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [editing, setEditing] = useState<Partial<CreditCard> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [featuresText, setFeaturesText] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const load = () => fetch('/api/admin/credit-cards').then((r) => r.json()).then(setCards);
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing({ ...emptyCard }); setIsNew(true); setFeaturesText(''); setMsg(''); };
  const openEdit = (c: CreditCard) => { setEditing({ ...c }); setIsNew(false); setFeaturesText(c.features.join('\n')); setMsg(''); };
  const cancel = () => { setEditing(null); setMsg(''); };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const payload = { ...editing, features: featuresText.split('\n').map((f) => f.trim()).filter(Boolean) };
    try {
      if (isNew) {
        await fetch('/api/admin/credit-cards', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      } else {
        await fetch(`/api/admin/credit-cards/${editing._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      }
      setMsg('Saved successfully.');
      load();
      setEditing(null);
    } catch { setMsg('Error saving.'); }
    finally { setSaving(false); }
  };

  const del = async (id: string) => {
    if (!confirm('Delete this credit card?')) return;
    await fetch(`/api/admin/credit-cards/${id}`, { method: 'DELETE' });
    load();
  };

  const change = (k: string, v: string | boolean | number) => setEditing((e) => e ? { ...e, [k]: v } : e);

  return (
    <AdminShell>
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <div>
            <h2 className={styles.pageTitle}>Credit Cards</h2>
            <p className={styles.pageSub}>Manage available credit cards shown on the Credit Cards page.</p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={openNew} id="add-cc-btn">Add Card</button>
        </div>

        {editing && (
          <div className={styles.formCard}>
            <h3 className={styles.formTitle}>{isNew ? 'New Credit Card' : 'Edit Credit Card'}</h3>
            {msg && <div className={`alert ${msg.includes('Error') ? 'alert-error' : 'alert-success'}`} style={{ marginBottom: '1rem' }}>{msg}</div>}
            <div className={styles.formGrid}>
              <div className="form-group">
                <label className="form-label">Card Name *</label>
                <input className="form-control" value={editing.name || ''} onChange={(e) => change('name', e.target.value)} placeholder="e.g. HDFC Regalia" />
              </div>
              <div className="form-group">
                <label className="form-label">Bank Name *</label>
                <input className="form-control" value={editing.bank || ''} onChange={(e) => change('bank', e.target.value)} placeholder="e.g. HDFC Bank" />
              </div>
              <div className="form-group">
                <label className="form-label">Annual Fee *</label>
                <input className="form-control" value={editing.annualFee || ''} onChange={(e) => change('annualFee', e.target.value)} placeholder="e.g. Rs. 2,500 + GST" />
              </div>
              <div className="form-group">
                <label className="form-label">Display Order</label>
                <input type="number" className="form-control" value={editing.order || 0} onChange={(e) => change('order', Number(e.target.value))} />
              </div>
              <div className={`form-group ${styles.formFull}`}>
                <label className="form-label">Card Image URL</label>
                <input className="form-control" value={editing.imageUrl || ''} onChange={(e) => change('imageUrl', e.target.value)} placeholder="https://..." />
              </div>
              <div className={`form-group ${styles.formFull}`}>
                <label className="form-label">Eligibility *</label>
                <input className="form-control" value={editing.eligibility || ''} onChange={(e) => change('eligibility', e.target.value)} placeholder="e.g. Min. annual income Rs. 3 lakh" />
              </div>
              <div className={`form-group ${styles.formFull}`}>
                <label className="form-label">Features (one per line) *</label>
                <textarea className="form-control" rows={6} value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} placeholder={'5% cashback on bill payments\n2% cashback on all spends\nFuel surcharge waiver'} />
              </div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <input type="checkbox" checked={!!editing.isActive} onChange={(e) => change('isActive', e.target.checked)} />
              <span className="form-label" style={{ margin: 0 }}>Active (show on website)</span>
            </label>
            <div className={styles.formActions}>
              <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save Card'}</button>
              <button className="btn btn-outline" onClick={cancel}>Cancel</button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {cards.map((c) => (
            <div key={c._id} className={styles.listItem}>
              <div className={styles.listItemInfo}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem' }}>
                  <p className={styles.listItemTitle}>{c.name}</p>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{c.bank}</span>
                  <span className={`badge ${c.isActive ? 'badge-green' : 'badge-navy'}`}>{c.isActive ? 'Active' : 'Hidden'}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Annual Fee: {c.annualFee}</p>
                <p className={styles.listItemDesc}>{c.features.slice(0, 2).join(' | ')}</p>
              </div>
              <div className={styles.listItemActions}>
                <button className={styles.editBtn} onClick={() => openEdit(c)}>Edit</button>
                <button className={styles.deleteBtn} onClick={() => del(c._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
