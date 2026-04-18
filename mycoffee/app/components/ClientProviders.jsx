'use client';

import { useEffect } from 'react';
import { LanguageProvider } from '../contexts/LanguageContext';

const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes

async function logoutIfExpired() {
  const hiddenAt = localStorage.getItem('hiddenAt');
  if (hiddenAt && Date.now() - parseInt(hiddenAt) > SESSION_TIMEOUT) {
    localStorage.removeItem('hiddenAt');
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
  }
}

export default function ClientProviders({ children }) {
  useEffect(() => {
    // Check on fresh page load (covers reopening after closing)
    logoutIfExpired();

    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        localStorage.setItem('hiddenAt', Date.now().toString());
      } else {
        logoutIfExpired();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  return <LanguageProvider>{children}</LanguageProvider>;
}
