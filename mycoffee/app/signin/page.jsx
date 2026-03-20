'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import WhiteNav from '../whitenav';
import './signin.css';
import '../home.css';

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

export default function SignInPage() {
  const router = useRouter();
  const [dark, setDark] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [showForgotUsername, setShowForgotUsername] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const [resetEmail, setResetEmail] = useState('');
  const [resetNew, setResetNew] = useState('');
  const [resetConfirm, setResetConfirm] = useState('');
  const [showResetNew, setShowResetNew] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  async function handleSignIn(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/email-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Sign in failed.');
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

  async function handleResetPassword(e) {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');
    if (resetNew !== resetConfirm) { setResetError('Passwords do not match.'); return; }
    setResetLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, newPassword: resetNew, confirmPassword: resetConfirm }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResetError(data.error || 'Failed to reset password.');
      } else {
        setResetSuccess('Password updated! You can now sign in with your new password.');
        setShowForgotPassword(false);
        setResetEmail(''); setResetNew(''); setResetConfirm('');
      }
    } catch {
      setResetError('Something went wrong. Please try again.');
    } finally {
      setResetLoading(false);
    }
  }

  function toggleForgotUsername() {
    setShowForgotUsername((v) => !v);
    setShowForgotPassword(false);
    setResetError(''); setResetSuccess('');
  }

  function toggleForgotPassword() {
    setShowForgotPassword((v) => !v);
    setShowForgotUsername(false);
    setResetError(''); setResetSuccess('');
  }

  return (
    <div className={`signin-page${dark ? ' dark' : ''}`}>
      <WhiteNav activePage="signin" />

      <button
        className="signin-theme-toggle"
        onClick={() => setDark((v) => !v)}
        aria-label="Toggle dark mode"
        title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {dark ? <SunIcon /> : <MoonIcon />}
      </button>

      <div className="signin-body">
        <img src="/images/starbucks_logo.png" alt="Starbucks" className="signin-logo" />

        <div className="signin-card">
          <h2>Sign in</h2>

          {error && <p className="signin-error">{error}</p>}
          {resetSuccess && <p className="signin-success">{resetSuccess}</p>}

          <button
            type="button"
            className="signin-google-btn"
            onClick={() => signIn('google', { callbackUrl: '/' })}
          >
            <svg width="18" height="18" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google
          </button>

          <div className="signin-or"><span>or</span></div>

          <form onSubmit={handleSignIn} noValidate>
            <div className="signin-field">
              <input
                id="si-email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder=" "
                required
                className={error.toLowerCase().includes('email') ? 'error' : ''}
              />
              <label htmlFor="si-email">* Email address</label>
            </div>

            <div className="signin-field signin-pw-wrap">
              <input
                id="si-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder=" "
                required
                className={error.toLowerCase().includes('password') ? 'error' : ''}
              />
              <label htmlFor="si-password">* Password</label>
              <button type="button" className="signin-pw-toggle" onClick={() => setShowPassword((v) => !v)}>
                {showPassword ? <EyeClosed /> : <EyeOpen />}
              </button>
            </div>

            <label className="signin-remember">
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
              Keep me signed in
            </label>

            <div className="signin-divider" />

            <div className="signin-forgot-row">
              <button type="button" onClick={toggleForgotUsername}>Forgot username?</button>
              <button type="button" onClick={toggleForgotPassword}>Forgot password?</button>
            </div>

            {showForgotUsername && (
              <div className="signin-info-box">
                You can now sign in using your <strong>email address</strong> instead of a username.
              </div>
            )}

            {showForgotPassword && (
              <div className="signin-reset-form">
                <h3>Reset your password</h3>
                {resetError && <p className="signin-error">{resetError}</p>}
                <form onSubmit={handleResetPassword} noValidate>
                  <div className="signin-field">
                    <input id="rp-email" type="email" value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)} placeholder=" " required />
                    <label htmlFor="rp-email">* Email address</label>
                  </div>
                  <div className="signin-field signin-pw-wrap">
                    <input id="rp-new" type={showResetNew ? 'text' : 'password'} value={resetNew}
                      onChange={(e) => setResetNew(e.target.value)} placeholder=" " required />
                    <label htmlFor="rp-new">* New password</label>
                    <button type="button" className="signin-pw-toggle" onClick={() => setShowResetNew(v => !v)}>
                      {showResetNew ? <EyeClosed /> : <EyeOpen />}
                    </button>
                  </div>
                  <div className="signin-field signin-pw-wrap" style={{ marginBottom: '16px' }}>
                    <input id="rp-confirm" type={showResetConfirm ? 'text' : 'password'} value={resetConfirm}
                      onChange={(e) => setResetConfirm(e.target.value)} placeholder=" " required />
                    <label htmlFor="rp-confirm">* Confirm new password</label>
                    <button type="button" className="signin-pw-toggle" onClick={() => setShowResetConfirm(v => !v)}>
                      {showResetConfirm ? <EyeClosed /> : <EyeOpen />}
                    </button>
                  </div>
                  <button type="submit" className="signin-btn" disabled={resetLoading}>
                    {resetLoading ? 'Updating…' : 'Update password'}
                  </button>
                </form>
              </div>
            )}

            <button type="submit" className="signin-btn" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <div className="signin-joinnow">
          <p>New to Starbucks Rewards?</p>
          <button className="signin-joinnow-btn" onClick={() => router.push('/joinnow')}>
            Join now
          </button>
        </div>
      </div>
    </div>
  );
}
