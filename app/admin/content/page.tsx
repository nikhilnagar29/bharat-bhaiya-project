'use client';
import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import styles from '../admin.module.css';

interface ContentItem {
  key: string;
  label: string;
  multiline: boolean;
}

const CONTENT_FIELDS: ContentItem[] = [
  { key: 'hero_title', label: 'Hero Brand Name', multiline: false },
  { key: 'hero_tagline', label: 'Hero Tagline', multiline: false },
  { key: 'hero_subtagline', label: 'Hero Sub-Tagline', multiline: false },
  { key: 'about_content', label: 'About Section Content', multiline: true },
  { key: 'about_quote', label: 'About Closing Quote', multiline: false },
  { key: 'disclaimer', label: 'Disclaimer Text', multiline: true },
];

export default function ContentAdminPage() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/admin/content').then((r) => r.json()).then(setContent);
  }, []);

  const handleChange = (key: string, value: string) => {
    setContent((c) => ({ ...c, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      if (!res.ok) throw new Error();
      setMsg('Content saved successfully. Changes will reflect on the website.');
    } catch {
      setMsg('Error saving content. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell>
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <div>
            <h2 className={styles.pageTitle}>Website Content</h2>
            <p className={styles.pageSub}>Edit website text content — changes reflect immediately after saving.</p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving} id="save-content-btn">
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>

        {msg && (
          <div className={`alert ${msg.includes('Error') ? 'alert-error' : 'alert-success'}`}>
            {msg}
          </div>
        )}

        <div className={styles.contentGrid}>
          {CONTENT_FIELDS.map((field) => (
            <div key={field.key} className={styles.contentCard}>
              <p className={styles.contentLabel}>{field.label}</p>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.625rem', fontFamily: 'monospace' }}>
                key: {field.key}
              </p>
              {field.multiline ? (
                <textarea
                  className="form-control"
                  rows={field.key === 'about_content' ? 10 : 4}
                  value={content[field.key] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                />
              ) : (
                <input
                  type="text"
                  className="form-control"
                  value={content[field.key] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving} id="save-content-btn-bottom">
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>
    </AdminShell>
  );
}
