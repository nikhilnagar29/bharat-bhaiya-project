'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import AdminShell from '@/components/admin/AdminShell';
import styles from '../admin.module.css';
import uploadStyles from './TestimonialsAdmin.module.css';

interface Testimonial {
  _id: string;
  clientName: string;
  designation?: string;
  city?: string;
  text: string;
  rating?: number;
  imageUrl?: string;
  isActive: boolean;
}

const empty = { clientName: '', designation: '', city: '', text: '', rating: 5, imageUrl: '', isActive: true };

export default function TestimonialsAdminPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = () => fetch('/api/admin/testimonials').then((r) => r.json()).then(setItems);
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing({ ...empty }); setIsNew(true); setMsg(''); };
  const openEdit = (t: Testimonial) => { setEditing({ ...t }); setIsNew(false); setMsg(''); };
  const cancel = () => { setEditing(null); setMsg(''); };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMsg('');
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setMsg(`Image error: ${data.error}`);
        return;
      }

      setEditing((e) => e ? { ...e, imageUrl: data.url } : e);
    } catch {
      setMsg('Image upload failed. Please try again.');
    } finally {
      setUploading(false);
      // Reset file input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = () => {
    setEditing((e) => e ? { ...e, imageUrl: '' } : e);
  };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      if (isNew) {
        await fetch('/api/admin/testimonials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editing),
        });
      } else {
        await fetch(`/api/admin/testimonials/${editing._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editing),
        });
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

  const change = (k: string, v: string | boolean | number) =>
    setEditing((e) => e ? { ...e, [k]: v } : e);

  return (
    <AdminShell>
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <div>
            <h2 className={styles.pageTitle}>Testimonials</h2>
            <p className={styles.pageSub}>Manage client testimonials displayed on the homepage.</p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={openNew} id="add-testimonial-btn">
            Add Testimonial
          </button>
        </div>

        {editing && (
          <div className={styles.formCard}>
            <h3 className={styles.formTitle}>{isNew ? 'New Testimonial' : 'Edit Testimonial'}</h3>
            {msg && (
              <div className={`alert ${msg.includes('Error') || msg.includes('error') ? 'alert-error' : 'alert-success'}`}
                style={{ marginBottom: '1rem' }}>
                {msg}
              </div>
            )}

            {/* ── Image Upload ── */}
            <div className={uploadStyles.imageSection}>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Client Photo <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span>
              </label>
              <div className={uploadStyles.imageUploadArea}>
                {editing.imageUrl ? (
                  <div className={uploadStyles.imagePreview}>
                    <Image
                      src={editing.imageUrl}
                      alt="Client photo preview"
                      width={96}
                      height={96}
                      className={uploadStyles.previewImg}
                      unoptimized
                    />
                    <div className={uploadStyles.imageActions}>
                      <button
                        type="button"
                        className={uploadStyles.changeBtn}
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                      >
                        {uploading ? 'Uploading…' : '↑ Change Photo'}
                      </button>
                      <button
                        type="button"
                        className={uploadStyles.removeBtn}
                        onClick={removeImage}
                      >
                        ✕ Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    className={uploadStyles.uploadBtn}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <span className={uploadStyles.uploadBtnText}>
                        <span className={uploadStyles.spinner} />
                        Uploading…
                      </span>
                    ) : (
                      <span className={uploadStyles.uploadBtnText}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                        Upload Client Photo
                      </span>
                    )}
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  style={{ display: 'none' }}
                  onChange={handleImageUpload}
                  id="testimonial-image-input"
                />
              </div>
              <p className={uploadStyles.imageHint}>
                Supports JPEG, PNG, WebP · Max 2MB · Recommended: square photo (1:1 ratio)
              </p>
            </div>

            {/* ── Form fields ── */}
            <div className={styles.formGrid}>
              <div className="form-group">
                <label className="form-label">Client Name *</label>
                <input
                  className="form-control"
                  value={editing.clientName || ''}
                  onChange={(e) => change('clientName', e.target.value)}
                  placeholder="e.g. Rajesh Sharma"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Rating (1–5)</label>
                <select
                  className="form-control"
                  value={editing.rating || 5}
                  onChange={(e) => change('rating', Number(e.target.value))}
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>{r} Stars</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Designation</label>
                <input
                  className="form-control"
                  value={editing.designation || ''}
                  onChange={(e) => change('designation', e.target.value)}
                  placeholder="e.g. Business Owner"
                />
              </div>
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  className="form-control"
                  value={editing.city || ''}
                  onChange={(e) => change('city', e.target.value)}
                  placeholder="e.g. Mumbai"
                />
              </div>
              <div className={`form-group ${styles.formFull}`}>
                <label className="form-label">Testimonial Text *</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={editing.text || ''}
                  onChange={(e) => change('text', e.target.value)}
                  placeholder="Client's testimonial…"
                />
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <input
                type="checkbox"
                checked={!!editing.isActive}
                onChange={(e) => change('isActive', e.target.checked)}
              />
              <span className="form-label" style={{ margin: 0 }}>Active (show on website)</span>
            </label>

            <div className={styles.formActions}>
              <button className="btn btn-primary" onClick={save} disabled={saving || uploading}>
                {saving ? 'Saving…' : 'Save Testimonial'}
              </button>
              <button className="btn btn-outline" onClick={cancel}>Cancel</button>
            </div>
          </div>
        )}

        {/* ── Testimonials list ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {items.map((t) => (
            <div key={t._id} className={styles.listItem}>
              {/* Photo thumbnail in list */}
              <div className={uploadStyles.listAvatar}>
                {t.imageUrl ? (
                  <Image
                    src={t.imageUrl}
                    alt={t.clientName}
                    width={44}
                    height={44}
                    className={uploadStyles.listAvatarImg}
                    unoptimized
                  />
                ) : (
                  <div className={uploadStyles.listAvatarInitials}>
                    {t.clientName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className={styles.listItemInfo}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem' }}>
                  <p className={styles.listItemTitle}>{t.clientName}</p>
                  {t.rating && <span style={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: 600 }}>{t.rating}/5 ⭐</span>}
                  <span className={`badge ${t.isActive ? 'badge-green' : 'badge-dark'}`}>
                    {t.isActive ? 'Active' : 'Hidden'}
                  </span>
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
