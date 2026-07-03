'use client';
import { useState } from 'react';
import styles from './InquiryModal.module.css';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
}

const services = [
  'Term Insurance',
  'Health Insurance',
  'Emergency Fund & Secure Investment',
  'Financial Products',
  'Mutual Funds Investment',
  'HNI Investments',
  'General Inquiry',
];

export default function InquiryModal({ isOpen, onClose, defaultService = '' }: InquiryModalProps) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    service: defaultService,
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to submit');
      setSuccess(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setError('');
    setForm({ name: '', phone: '', email: '', service: defaultService, message: '' });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="heading-4" style={{ color: 'var(--navy-800)' }}>
              {success ? 'Inquiry Submitted' : 'Submit Your Inquiry'}
            </h3>
            {!success && (
              <p className="body-sm text-muted" style={{ marginTop: '0.25rem' }}>
                We will get back to you within one business day.
              </p>
            )}
          </div>
          <button className="modal-close" onClick={handleClose} aria-label="Close">
            &#x2715;
          </button>
        </div>

        <div className="modal-body">
          {success ? (
            <div className={styles.successState}>
              <div className={styles.successIcon}>&#10003;</div>
              <h4 className="heading-4" style={{ color: 'var(--navy-800)', marginBottom: '0.5rem' }}>
                Thank you for reaching out
              </h4>
              <p className="body-md text-muted">
                We have received your inquiry and will get in touch with you shortly.
              </p>
              <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={handleClose}>
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}

              <div className="form-group">
                <label className="form-label" htmlFor="inq-name">Full Name *</label>
                <input
                  id="inq-name"
                  name="name"
                  type="text"
                  className="form-control"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="inq-phone">Phone Number *</label>
                <input
                  id="inq-phone"
                  name="phone"
                  type="tel"
                  className="form-control"
                  placeholder="10-digit mobile number"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="inq-email">Email Address *</label>
                <input
                  id="inq-email"
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="inq-service">Service Interested In *</label>
                <select
                  id="inq-service"
                  name="service"
                  className="form-control"
                  value={form.service}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a service</option>
                  {services.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="inq-message">Message (Optional)</label>
                <textarea
                  id="inq-message"
                  name="message"
                  className="form-control"
                  placeholder="Any specific questions or requirements..."
                  value={form.message}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
                style={{ marginTop: '0.5rem' }}
              >
                {loading ? 'Submitting...' : 'Submit Inquiry'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
