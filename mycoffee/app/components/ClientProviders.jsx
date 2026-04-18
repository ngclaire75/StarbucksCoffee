'use client';

import { useEffect, useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';
import { LanguageProvider } from '../contexts/LanguageContext';

const SESSION_TIMEOUT = 5 * 60 * 1000;

async function logoutIfExpired() {
  const hiddenAt = localStorage.getItem('hiddenAt');
  if (hiddenAt && Date.now() - parseInt(hiddenAt) > SESSION_TIMEOUT) {
    localStorage.removeItem('hiddenAt');
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
  }
}

export default function ClientProviders({ children }) {
  const pathname = usePathname();

  // Instant scroll-to-top on every route change.
  // body { scroll-behavior: smooth } makes Next.js's scrollTo(0,0) animate slowly,
  // so new pages briefly appear at the old scroll position — this overrides that.
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  useEffect(() => {
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
