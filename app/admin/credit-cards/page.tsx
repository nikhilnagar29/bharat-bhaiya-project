'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import AdminShell from '@/components/admin/AdminShell';
import styles from '../admin.module.css';
import ccStyles from './CreditCardsAdmin.module.css';

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

const emptyCard = {
  name: '', bank: '', imageUrl: '', features: [],
  annualFee: '', eligibility: '', isActive: true, order: 0,
};

export default function CreditCardsAdminPage() {
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [editing, setEditing] = useState<Partial<CreditCard> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [featuresText, setFeaturesText] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = () => fetch('/api/admin/credit-cards').then((r) => r.json()).then(setCards);
  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing({ ...emptyCard }); setIsNew(true); setFeaturesText(''); setMsg('');
  };
  const openEdit = (c: CreditCard) => {
    setEditing({ ...c }); setIsNew(false); setFeaturesText(c.features.join('\n')); setMsg('');
  };
  const cancel = () => { setEditing(null); setMsg(''); };

  /* ── Image upload ── */
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMsg('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) { setMsg(`Image error: ${data.error}`); return; }
      setEditing((e) => e ? { ...e, imageUrl: data.url } : e);
    } catch {
      setMsg('Image upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = () => setEditing((e) => e ? { ...e, imageUrl: '' } : e);

  /* ── Save ── */
  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const payload = {
      ...editing,
      features: featuresText.split('\n').map((f) => f.trim()).filter(Boolean),
    };
    try {
      if (isNew) {
        await fetch('/api/admin/credit-cards', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
        });
      } else {
        await fetch(`/api/admin/credit-cards/${editing._id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
        });
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

  const change = (k: string, v: string | boolean | number) =>
    setEditing((e) => e ? { ...e, [k]: v } : e);

  return (
    <AdminShell>
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <div>
            <h2 className={styles.pageTitle}>Credit Cards</h2>
            <p className={styles.pageSub}>Manage available credit cards shown on the Credit Cards page.</p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={openNew} id="add-cc-btn">
            Add Card
          </button>
        </div>

        {editing && (
          <div className={styles.formCard}>
            <h3 className={styles.formTitle}>{isNew ? 'New Credit Card' : 'Edit Credit Card'}</h3>
            {msg && (
              <div className={`alert ${msg.includes('Error') || msg.includes('error') ? 'alert-error' : 'alert-success'}`}
                style={{ marginBottom: '1rem' }}>
                {msg}
              </div>
            )}

            {/* ── Card Image Upload ── */}
            <div className={ccStyles.imageSection}>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Card Image <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional — upload from gallery)</span>
              </label>

              <div className={ccStyles.uploadRow}>
                {/* Preview or placeholder */}
                <div className={ccStyles.cardPreviewWrap}>
                  {editing.imageUrl ? (
                    <Image
                      src={editing.imageUrl}
                      alt="Card preview"
                      width={280}
                      height={176}
                      className={ccStyles.cardPreviewImg}
                      unoptimized
                    />
                  ) : (
                    <div className={ccStyles.cardPreviewPlaceholder}>
                      <div className={ccStyles.placeholderChip} />
                      <div className={ccStyles.placeholderLines}>
                        <div className={ccStyles.placeholderLine} style={{ width: '60%' }} />
                        <div className={ccStyles.placeholderLine} style={{ width: '40%' }} />
                      </div>
                      <span className={ccStyles.placeholderText}>No image uploaded</span>
                    </div>
                  )}
                </div>

                {/* Upload controls */}
                <div className={ccStyles.uploadControls}>
                  <button
                    type="button"
                    className={ccStyles.uploadBtn}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <span className={ccStyles.spinner} />
                        Uploading…
                      </>
                    ) : (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        {editing.imageUrl ? 'Change Image' : 'Upload from Gallery'}
                      </>
                    )}
                  </button>

                  {editing.imageUrl && (
                    <button type="button" className={ccStyles.removeBtn} onClick={removeImage}>
                      ✕ Remove Image
                    </button>
                  )}

                  <p className={ccStyles.uploadHint}>
                    JPEG, PNG, WebP · Max 2MB<br />
                    Recommended: 4:3 ratio (e.g. 400×250px)
                  </p>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
                id="cc-image-input"
              />
            </div>

            {/* ── Form fields ── */}
            <div className={styles.formGrid}>
              <div className="form-group">
                <label className="form-label">Card Name *</label>
                <input className="form-control" value={editing.name || ''}
                  onChange={(e) => change('name', e.target.value)} placeholder="e.g. HDFC Regalia" />
              </div>
              <div className="form-group">
                <label className="form-label">Bank Name *</label>
                <input className="form-control" value={editing.bank || ''}
                  onChange={(e) => change('bank', e.target.value)} placeholder="e.g. HDFC Bank" />
              </div>
              <div className="form-group">
                <label className="form-label">Annual Fee *</label>
                <input className="form-control" value={editing.annualFee || ''}
                  onChange={(e) => change('annualFee', e.target.value)} placeholder="e.g. Rs. 2,500 + GST" />
              </div>
              <div className="form-group">
                <label className="form-label">Display Order</label>
                <input type="number" className="form-control" value={editing.order || 0}
                  onChange={(e) => change('order', Number(e.target.value))} />
              </div>
              <div className={`form-group ${styles.formFull}`}>
                <label className="form-label">Eligibility *</label>
                <input className="form-control" value={editing.eligibility || ''}
                  onChange={(e) => change('eligibility', e.target.value)}
                  placeholder="e.g. Min. annual income Rs. 3 lakh" />
              </div>
              <div className={`form-group ${styles.formFull}`}>
                <label className="form-label">Features (one per line) *</label>
                <textarea className="form-control" rows={6} value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  placeholder={'5% cashback on bill payments\n2% cashback on all spends\nFuel surcharge waiver'} />
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <input type="checkbox" checked={!!editing.isActive}
                onChange={(e) => change('isActive', e.target.checked)} />
              <span className="form-label" style={{ margin: 0 }}>Active (show on website)</span>
            </label>

            <div className={styles.formActions}>
              <button className="btn btn-primary" onClick={save} disabled={saving || uploading}>
                {saving ? 'Saving…' : 'Save Card'}
              </button>
              <button className="btn btn-outline" onClick={cancel}>Cancel</button>
            </div>
          </div>
        )}

        {/* ── Cards list ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {cards.map((c) => (
            <div key={c._id} className={styles.listItem}>
              {/* Thumbnail */}
              <div className={ccStyles.listThumb}>
                {c.imageUrl ? (
                  <Image
                    src={c.imageUrl}
                    alt={c.name}
                    width={72}
                    height={45}
                    className={ccStyles.listThumbImg}
                    unoptimized
                  />
                ) : (
                  <div className={ccStyles.listThumbPlaceholder}>
                    <span>💳</span>
                  </div>
                )}
              </div>

              <div className={styles.listItemInfo}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem' }}>
                  <p className={styles.listItemTitle}>{c.name}</p>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{c.bank}</span>
                  <span className={`badge ${c.isActive ? 'badge-green' : 'badge-dark'}`}>
                    {c.isActive ? 'Active' : 'Hidden'}
                  </span>
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
