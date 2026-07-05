'use client';
import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import styles from '../admin.module.css';
import editorStyles from './ServicesAdmin.module.css';

interface Service {
  _id: string;
  title: string;
  description: string;
  subDescription?: string;
  buttonText: string;
  order: number;
  isActive: boolean;
  slug?: string;
  detailHtml?: string;
  detailCss?: string;
}

const empty: Partial<Service> = {
  title: '', description: '', subDescription: '', buttonText: 'Inquire Now',
  order: 0, isActive: true, slug: '', detailHtml: '', detailCss: '',
};

export default function ServicesAdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [editing, setEditing] = useState<Partial<Service> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'basic' | 'html'>('basic');
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const load = () => fetch('/api/admin/services').then((r) => r.json()).then(setServices);
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing({ ...empty }); setIsNew(true); setMsg(''); setActiveTab('basic'); };
  const openEdit = (s: Service) => { setEditing({ ...s }); setIsNew(false); setMsg(''); setActiveTab('basic'); };
  const cancel = () => { setEditing(null); setMsg(''); };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      if (isNew) {
        await fetch('/api/admin/services', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editing),
        });
      } else {
        await fetch(`/api/admin/services/${editing._id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editing),
        });
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

  const change = (k: string, v: string | boolean | number) =>
    setEditing((e) => e ? { ...e, [k]: v } : e);

  // Preview in new tab
  const previewHtml = () => {
    if (!editing?.detailHtml) return;
    const css = editing.detailCss || '';
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Preview: ${editing.title || 'Service'}</title><style>body{font-family:sans-serif;margin:0;padding:1rem}${css}</style></head><body>${editing.detailHtml}</body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    window.open(URL.createObjectURL(blob), '_blank');
  };

  const copyAIPrompt = () => {
    const prompt = `I am creating a service detail page for my financial advisory website.
Please write ONLY the HTML content for this page (no <html>, <head>, or <body> tags, just the inner content).
The content should be about: ${editing?.title || 'Financial Services'}

Follow these styling rules exactly:
- Use <h1> for the main title, <h2> for major sections, and <h3> for sub-sections.
- Do NOT use inline styles (no style="...").
- Use <ul> or <ol> for lists.
- If you use a table, use standard <table>, <tr>, <th>, and <td> tags.
- For important callouts or quotes, use <blockquote>.
- Wrap the content in simple semantic tags. The website's CSS will automatically style them perfectly (e.g., h2 will have a green underline, blockquotes will have a green left-border).
- Make the content professional, trustworthy, and easy to read.
`;
    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

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
            {msg && (
              <div className={`alert ${msg.includes('Error') ? 'alert-error' : 'alert-success'}`}
                style={{ marginBottom: '1rem' }}>
                {msg}
              </div>
            )}

            {/* Tab switcher */}
            <div className={editorStyles.tabs}>
              <button
                type="button"
                className={`${editorStyles.tab} ${activeTab === 'basic' ? editorStyles.tabActive : ''}`}
                onClick={() => setActiveTab('basic')}
              >
                Basic Info
              </button>
              <button
                type="button"
                className={`${editorStyles.tab} ${activeTab === 'html' ? editorStyles.tabActive : ''}`}
                onClick={() => setActiveTab('html')}
              >
                Detail Page (HTML/CSS)
              </button>
            </div>

            {/* ── Basic Info Tab ── */}
            {activeTab === 'basic' && (
              <>
                <div className={styles.formGrid}>
                  <div className="form-group">
                    <label className="form-label">Service Title *</label>
                    <input className="form-control" value={editing.title || ''}
                      onChange={(e) => change('title', e.target.value)} placeholder="e.g. Term Insurance" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Button Text *</label>
                    <input className="form-control" value={editing.buttonText || ''}
                      onChange={(e) => change('buttonText', e.target.value)} placeholder="e.g. Inquire Now" />
                  </div>
                  <div className={`form-group ${styles.formFull}`}>
                    <label className="form-label">Main Description *</label>
                    <textarea className="form-control" rows={3} value={editing.description || ''}
                      onChange={(e) => change('description', e.target.value)} />
                  </div>
                  <div className={`form-group ${styles.formFull}`}>
                    <label className="form-label">Sub Description (shown as tag)</label>
                    <input className="form-control" value={editing.subDescription || ''}
                      onChange={(e) => change('subDescription', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Display Order</label>
                    <input type="number" className="form-control" value={editing.order || 0}
                      onChange={(e) => change('order', Number(e.target.value))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Slug <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(required for ⓘ button)</span>
                    </label>
                    <input className="form-control" value={editing.slug || ''}
                      onChange={(e) => change('slug', e.target.value)} placeholder="e.g. term-insurance" />
                  </div>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <input type="checkbox" checked={!!editing.isActive}
                    onChange={(e) => change('isActive', e.target.checked)} />
                  <span className="form-label" style={{ margin: 0 }}>Active (visible on website)</span>
                </label>
              </>
            )}

            {/* ── HTML/CSS Editor Tab ── */}
            {activeTab === 'html' && (
              <div className={editorStyles.editorSection}>
                <div className={editorStyles.editorInfo}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>
                    This HTML will be shown when users click the <strong>ⓘ</strong> button on the service card.
                    Requires a <strong>Slug</strong> to be set on the Basic Info tab.
                    Use the <strong>Preview</strong> button to test before saving.
                  </span>
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <label className="form-label" style={{ margin: 0 }}>Detail HTML</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button type="button" className={editorStyles.aiPromptBtn} onClick={copyAIPrompt}>
                        {copiedPrompt ? '✓ Copied!' : '✨ Copy AI Prompt'}
                      </button>
                      <button type="button" className={editorStyles.previewBtn} onClick={previewHtml}
                        disabled={!editing.detailHtml}>
                        ▶ Preview in new tab
                      </button>
                    </div>
                  </div>
                  <textarea
                    className={`form-control ${editorStyles.codeEditor}`}
                    rows={16}
                    value={editing.detailHtml || ''}
                    onChange={(e) => change('detailHtml', e.target.value)}
                    spellCheck={false}
                    placeholder={`<h1>Term Insurance</h1>\n<p>Everything you need to know about term insurance...</p>\n\n<h2>Key Benefits</h2>\n<ul>\n  <li>High coverage at low premium</li>\n  <li>Tax benefits under Section 80C</li>\n</ul>`}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Custom CSS <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span></label>
                  <textarea
                    className={`form-control ${editorStyles.codeEditor}`}
                    rows={8}
                    value={editing.detailCss || ''}
                    onChange={(e) => change('detailCss', e.target.value)}
                    spellCheck={false}
                    placeholder={`h1 { color: #15803d; font-size: 2rem; }\nh2 { margin-top: 1.5rem; color: #111; }\nul { padding-left: 1.5rem; line-height: 2; }`}
                  />
                </div>
              </div>
            )}

            <div className={styles.formActions}>
              <button className="btn btn-primary" onClick={save} disabled={saving}>
                {saving ? 'Saving…' : 'Save Service'}
              </button>
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
                  <span className={`badge ${s.isActive ? 'badge-green' : 'badge-dark'}`}>
                    {s.isActive ? 'Active' : 'Hidden'}
                  </span>
                  {s.detailHtml && (
                    <span className="badge badge-green" style={{ background: 'rgba(22,163,74,0.1)', color: 'var(--green-700)', border: '1px solid rgba(22,163,74,0.2)' }}>
                      Has Detail Page
                    </span>
                  )}
                </div>
                <p className={styles.listItemDesc}>{s.description}</p>
                {s.slug && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Slug: <code style={{ background: 'var(--gray-100)', padding: '0 0.3rem', borderRadius: '4px' }}>{s.slug}</code>
                  </p>
                )}
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
