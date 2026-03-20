'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import './contact.css';
import HeaderFooter from '../components/headerfooter';
import PagesList from '../pageslist';
import { useRouter } from 'next/navigation';

/* ── Floating label components (dark theme) ── */
function Field({ id, label, type = 'text', required, value, onChange }) {
  const [focused, setFocused] = useState(false);
  const up = focused || !!value;
  return (
    <div className="cu-field">
      <input
        id={id} type={type} required={required}
        value={value} onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="cu-input"
        autoComplete="off"
      />
      <label htmlFor={id} className={`cu-label cu-label--field${up ? ' cu-label--up' : ''}`}>{label}</label>
    </div>
  );
}

const TOPIC_OPTIONS = [
  { value: 'media',    label: 'Media Inquiry' },
  { value: 'feedback', label: 'Customer Feedback' },
  { value: 'partner',  label: 'Partnership Proposal' },
  { value: 'press',    label: 'Press Release Request' },
  { value: 'other',    label: 'General Question' },
];

function ComboboxField({ id, value, onChange }) {
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState('');
  const wrapRef = useRef(null);

  /* close on outside click */
  useEffect(() => {
    const fn = e => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const filtered = query
    ? TOPIC_OPTIONS.filter(t => t.label.toLowerCase().includes(query.toLowerCase()))
    : TOPIC_OPTIONS;

  const select = t => {
    setQuery(t.label);
    onChange({ target: { value: t.value } });
    setOpen(false);
  };

  const clear = () => {
    setQuery('');
    onChange({ target: { value: '' } });
    setOpen(false);
  };

  const handleInput = e => {
    setQuery(e.target.value);
    onChange({ target: { value: e.target.value } });
    setOpen(true);
  };

  const up = open || !!query;

  return (
    <div className="cu-field cu-combobox" ref={wrapRef}>
      <input
        id={id} type="text" autoComplete="off"
        value={query}
        onChange={handleInput}
        onFocus={() => setOpen(true)}
        className="cu-input cu-combobox-input"
      />
      <label htmlFor={id} className={`cu-label cu-label--field${up ? ' cu-label--up' : ''}`}>Topic (select or type your own)</label>

      {query && (
        <button type="button" className="cu-cb-clear" onClick={clear} tabIndex={-1} aria-label="Clear">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      )}

      <button type="button" className={`cu-cb-arrow${open ? ' cu-cb-arrow--open' : ''}`} onClick={() => setOpen(o => !o)} tabIndex={-1} aria-label="Toggle options">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </button>

      {open && (
        <div className="cu-dropdown" role="listbox">
          <button type="button" className="cu-dropdown-none" onClick={clear} role="option">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            None / Clear selection
          </button>
          {filtered.length > 0 && <div className="cu-dropdown-divider" />}
          {filtered.map(t => (
            <button
              key={t.value} type="button" role="option"
              className={`cu-dropdown-item${value === t.value ? ' cu-dropdown-item--active' : ''}`}
              onClick={() => select(t)}
            >
              {t.label}
              {value === t.value && (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              )}
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="cu-dropdown-empty">Press Enter to use "{query}"</div>
          )}
        </div>
      )}
    </div>
  );
}

function Textarea({ id, label, required, value, onChange }) {
  const [focused, setFocused] = useState(false);
  const up = focused || !!value;
  return (
    <div className="cu-field">
      <textarea
        id={id} required={required} value={value} onChange={onChange}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        className="cu-textarea" maxLength={500}
      />
      <label htmlFor={id} className={`cu-label cu-label--textarea${up ? ' cu-label--up' : ''}`}>{label}</label>
      <div className="cu-char" style={{ color: value.length > 480 ? '#C0392B' : undefined }}>{value.length}/500</div>
    </div>
  );
}

function Toast({ message, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="cu-toast">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      {message}
    </div>
  );
}

const METHODS = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
    title: 'Media Hotline',
    desc: 'For urgent press inquiries, speak directly with our communications team.',
    badge: 'Mon – Fri · 8am – 6pm PT',
    href: '#form',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    title: 'Press Inquiries',
    desc: 'Send your story idea, interview request, or media inquiry by email.',
    badge: 'Response within 1 business day',
    href: '#form',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    title: 'Customer Service',
    desc: 'Questions about orders, rewards, or your account? Our support team is ready.',
    badge: 'Available 24/7',
    href: '/customerservice',
  },
];

export default function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', topic: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [toast, setToast] = useState(null);
  const formRef = useRef(null);
  const router = useRouter();

  const update = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (sending || sent) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 1200));
    setSending(false);
    setSent(true);
  };

  const handleMethod = href => {
    if (href === '#form') {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      router.push(href);
    }
  };

  const triggerToast = useCallback(msg => {
    setToast(null);
    requestAnimationFrame(() => setToast(msg));
  }, []);

  return (
    <HeaderFooter hideIcons>
      {toast && <Toast key={toast + Date.now()} message={toast} onDone={() => setToast(null)} />}
      <div className="cu-root">

        {/* Animated background */}
        <div className="cu-bg">
          <div className="cu-orb cu-orb--1" />
          <div className="cu-orb cu-orb--2" />
          <div className="cu-orb cu-orb--3" />
        </div>

        {/* Header */}
        <div className="cu-header">
          <span className="cu-eyebrow">Starbucks News</span>
          <h1 className="cu-title">Contact Us</h1>
          <p className="cu-subtitle">
            Whether it's a media inquiry, partnership proposal, or customer question — we're here.
          </p>
        </div>

        {/* Body grid: left methods + right form */}
        <div className="cu-body">

          {/* Left column */}
          <div>
            <div className="cu-methods">
              {METHODS.map(m => (
                <div key={m.title} className="cu-method-card" onClick={() => handleMethod(m.href)}>
                  <div className="cu-method-icon">{m.icon}</div>
                  <div className="cu-method-name">{m.title}</div>
                  <p className="cu-method-desc">{m.desc}</p>
                  <span className="cu-method-pill">{m.badge}</span>
                </div>
              ))}
            </div>

            <div className="cu-info-stack">
              <div className="cu-info-card">
                <div className="cu-info-heading">Office Hours</div>
                <p className="cu-info-body">
                  Our communications team is available <strong>Monday – Friday, 8am – 6pm PT</strong>. For urgent matters, please use our media hotline.
                </p>
              </div>
              <div className="cu-info-card">
                <div className="cu-info-heading">Response Time</div>
                <p className="cu-info-body">
                  Media and press inquiries are typically answered within <strong>one business day</strong>. Customer service questions within 24 hours.
                </p>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div ref={formRef} id="form">
            <div className="cu-panel">
              <div className="cu-panel-title">Send Us a Message</div>

              {sent ? (
                <div className="cu-success">
                  <div className="cu-success-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3>Message Sent!</h3>
                  <p>Our team will get back to you within one business day. Thank you for reaching out.</p>
                  <button
                    className="cu-success-btn"
                    onClick={() => { setSent(false); setForm({ name: '', email: '', topic: '', message: '' }); }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <Field id="cu-name" label="Full Name" required value={form.name} onChange={update('name')} />
                  <Field id="cu-email" label="Email Address" type="email" required value={form.email} onChange={update('email')} />
                  <ComboboxField id="cu-topic" value={form.topic} onChange={update('topic')} />
                  <Textarea id="cu-msg" label="Your Message" required value={form.message} onChange={update('message')} />
                  <button type="submit" className="cu-submit" disabled={sending}>
                    <span className="cu-submit-inner">
                      {sending && (
                        <svg className="cu-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                        </svg>
                      )}
                      {sending ? 'Sending…' : 'Send Message'}
                    </span>
                  </button>
                </form>
              )}
            </div>

            {/* Press Center card */}
            <div className="cu-press-card">
              <div className="cu-press-label">Press Center</div>
              <div className="cu-press-title">Latest Starbucks News</div>
              <p className="cu-press-desc">Access press releases, executive bios, brand imagery, and story tips in one place.</p>
              <div className="cu-press-links">
                <a href="/pressreleases" className="cu-press-btn-gold">Press Releases</a>
                <a href="/medialibrary" className="cu-press-btn-ghost">Media Library</a>
              </div>
            </div>
          </div>
        </div>

        {/* CTA strip */}
        <div className="cu-cta-strip">
          <div>
            <h3>Stay Connected</h3>
            <p>Follow the latest Starbucks news, stories, and announcements on our blog.</p>
          </div>
          <a href="/newsblog" className="cu-cta-link">
            Read the News Blog
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </a>
        </div>

      </div>
      <PagesList />
    </HeaderFooter>
  );
}
