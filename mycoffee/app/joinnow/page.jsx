'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import WhiteNav from '../whitenav';
import './joinnow.css';
import '../home.css';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,25}$/;

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

function EyeOpen() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function EyeClosed() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

export default function JoinNowPage() {
  const router = useRouter();
  const [dark, setDark] = useState(false);

  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setError('All fields are required.');
      return;
    }
    if (!PASSWORD_REGEX.test(form.password)) {
      setError('Password must be 8–25 characters and include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.');
      return;
    }
    if (!termsAccepted) {
      setError('You must agree to the Terms of Use to create an account.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed.');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`jn-page${dark ? ' dark' : ''}`}>
      <WhiteNav activePage="joinnow" />

      <button
        className="jn-theme-toggle"
        onClick={() => setDark((v) => !v)}
        aria-label="Toggle dark mode"
        title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {dark ? <SunIcon /> : <MoonIcon />}
      </button>

      <div className="jn-body">
        <img src="/images/starbucks_logo.png" alt="Starbucks" className="jn-logo" />

        <div className="jn-card">
          <p className="jn-required-note">* indicates required field</p>

          {error && <p className="jn-error">{error}</p>}

          <form onSubmit={handleSubmit} noValidate>
            {/* Personal Information */}
            <h2 className="jn-section-title">Personal Information</h2>

            <div className="jn-field">
              <input id="jn-firstName" name="firstName" type="text"
                value={form.firstName} onChange={handleChange} placeholder=" " required />
              <label htmlFor="jn-firstName">* First name</label>
            </div>

            <div className="jn-field">
              <input id="jn-lastName" name="lastName" type="text"
                value={form.lastName} onChange={handleChange} placeholder=" " required />
              <label htmlFor="jn-lastName">* Last name</label>
            </div>

            <div className="jn-divider" />

            {/* Account Security */}
            <h2 className="jn-section-title">Account Security</h2>

            <div className="jn-field">
              <input id="jn-email" name="email" type="email"
                value={form.email} onChange={handleChange} placeholder=" " required />
              <label htmlFor="jn-email">* Email address</label>
            </div>
            <p className="jn-username-hint">This will be your username</p>

            <div className="jn-field jn-pw-wrap">
              <input id="jn-password" name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password} onChange={handleChange} placeholder=" " required />
              <label htmlFor="jn-password">* Password</label>
              <button type="button" className="jn-pw-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeClosed /> : <EyeOpen />}
              </button>
            </div>
            <p className="jn-pw-hint">
              Create a password 8 to 25 characters long that includes at least 1 uppercase and
              1 lowercase letter, 1 number and 1 special character like an exclamation point or asterisk.
            </p>

            <div className="jn-divider" />

            {/* Terms of Use */}
            <h2 className="jn-section-title" style={{ textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1.2px' }}>
              Terms of Use
            </h2>

            <div className="jn-terms">
              <input id="jn-terms" type="checkbox"
                checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} />
              <label htmlFor="jn-terms" className="jn-terms-label">
                * I agree to the{' '}
                <a href="#" onClick={(e) => e.preventDefault()}>Starbucks® Rewards Terms</a>
                {' '}and the{' '}
                <a href="#" onClick={(e) => e.preventDefault()}>Starbucks Card Terms</a>
                {' '}and have read the{' '}
                <a href="#" onClick={(e) => e.preventDefault()}>Starbucks Privacy Statement</a>.
              </label>
            </div>

            <button type="submit" className="jn-btn" disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>

        <div className="jn-signin-row">
          Already have an account?
          <button onClick={() => router.push('/signin')}>Sign in</button>
        </div>
      </div>
    </div>
  );
}
