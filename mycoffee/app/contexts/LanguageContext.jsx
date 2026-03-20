'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations, defaults } from '../translations/index.js';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState('en');

  // Load persisted language on mount
  useEffect(() => {
    const saved = localStorage.getItem('sbx-lang');
    if (saved && translations[saved]) setLangState(saved);
  }, []);

  const setLang = useCallback((code) => {
    setLangState(code);
    localStorage.setItem('sbx-lang', code);
    // Update <html lang> attribute for accessibility
    document.documentElement.lang = code;
  }, []);

  // Translation function: t('key') → translated string or English default
  const t = useCallback((key) => {
    if (lang !== 'en' && translations[lang]?.[key]) return translations[lang][key];
    return defaults[key] ?? key;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return ctx;
}
