'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import '../ourcoffeepage/ourcoffee.css';
import { useRouter } from "next/navigation";
import { useLanguage } from '../contexts/LanguageContext';

const LANG_OPTIONS = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
  { code: 'pt', label: 'Português' },
  { code: 'ja', label: '日本語' },
];

const HeaderFooter = ({ children }) => {
  const { t, lang, setLang } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const coffeeDropdownRef = useRef(null);
  const peopleDropdownRef = useRef(null);
  const newsDropdownRef = useRef(null);
  const overlayRef = useRef(null);
  const greenBarRef = useRef(null);
  const navLinksRef = useRef([]);
  const router = useRouter();

  const getScrollbarWidth = () => {
    return window.innerWidth - document.documentElement.clientWidth;
  };

  const lockScroll = useCallback(() => {
    const sw = getScrollbarWidth();
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = sw + 'px';
    if (greenBarRef.current) greenBarRef.current.style.paddingRight = sw + 'px';
  }, []);

  const unlockScroll = useCallback(() => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    if (greenBarRef.current) greenBarRef.current.style.paddingRight = '';
  }, []);

  const closeDropdown = useCallback(() => {
    navLinksRef.current.forEach(l => l?.classList.remove('active'));
    if (coffeeDropdownRef.current) coffeeDropdownRef.current.classList.remove('active');
    if (peopleDropdownRef.current) peopleDropdownRef.current.classList.remove('active');
    if (newsDropdownRef.current) newsDropdownRef.current.classList.remove('active');
    if (overlayRef.current) overlayRef.current.classList.remove('active');
    unlockScroll();
  }, [unlockScroll]);

  useEffect(() => {
    const overlay = overlayRef.current;

    const handleNavClick = function (e) {
      e.preventDefault();
      const dropdownType = this.getAttribute('data-dropdown');

      if (this.classList.contains('active')) {
        closeDropdown();
      } else {
        closeDropdown();
        this.classList.add('active');
        if (overlay) overlay.classList.add('active');
        lockScroll();

        if (dropdownType === 'coffee' && coffeeDropdownRef.current) {
          coffeeDropdownRef.current.classList.add('active');
        } else if (dropdownType === 'people' && peopleDropdownRef.current) {
          peopleDropdownRef.current.classList.add('active');
        } else if (dropdownType === 'news' && newsDropdownRef.current) {
          newsDropdownRef.current.classList.add('active');
        }
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeDropdown();
    };

    navLinksRef.current.forEach(link => {
      if (link) link.addEventListener('click', handleNavClick);
    });

    if (overlay) overlay.addEventListener('click', closeDropdown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      navLinksRef.current.forEach(link => {
        if (link) link.removeEventListener('click', handleNavClick);
      });
      if (overlay) overlay.removeEventListener('click', closeDropdown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeDropdown, lockScroll]);

  return (
    <>
      <header className="top-green-bar" ref={greenBarRef}>
        <div className="bar-content">
<div className="logo-small">
  <img
    src="/images/starbuckslogov2.png"
    alt="Starbucks"
    style={{ cursor: "pointer" }}
    onClick={() => router.push("/ourcoffeepage")}
  />
</div>
          <nav className="green-nav-links">
            <a
              href="#"
              className="nav-link has-arrow"
              data-dropdown="coffee"
              ref={el => (navLinksRef.current[0] = el)}
            >
              {t('nav.coffee')}
            </a>
            <a
              href="#"
              className="nav-link has-arrow"
              data-dropdown="people"
              ref={el => (navLinksRef.current[1] = el)}
            >
              {t('nav.people')}
            </a>
            <a
              href="#"
              className="nav-link has-arrow"
              data-dropdown="news"
              ref={el => (navLinksRef.current[2] = el)}
            >
              {t('nav.news')}
            </a>
            <a href="/storiessubpage" className="nav-link">{t('nav.stories')}</a>
          </nav>
          <div className="right-icons">
            <div className="nav-icon" id="searchBtn">
              <img src="/images/searchicon.png" alt="Search Icon" />
            </div>
            <div
              className={`nav-icon nav-icon-globe${langOpen ? ' globe-active' : ''}`}
              id="globeBtn"
              onClick={() => setLangOpen(v => !v)}
              style={{ position: 'relative', cursor: 'pointer' }}
            >
              <img src="/images/globalicon.png" alt="Globe Icon" />
              {langOpen && (
                <div className="lang-dropdown" onClick={e => e.stopPropagation()}>
                  {LANG_OPTIONS.map(({ code, label }) => (
                    <button
                      key={code}
                      className={`lang-drop-btn${lang === code ? ' lang-drop-active' : ''}`}
                      onClick={() => { setLang(code); setLangOpen(false); }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Hamburger — mobile only */}
            <button
              className="hf-hamburger"
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Open menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>

        {/* DROPDOWN MENUS */}
        <div className="dropdown-menu" id="coffeeDropdown" ref={coffeeDropdownRef}>
          <div className="dropdown-content">
            <div className="empty-grid-left"></div>
            <div className="dropdown-item">
              <div className="dropdown-icon"><img src="/images/black.png" alt="Coffee" /></div>
              <div className="dropdown-label">{t('drop.coffee')}</div>
            </div>
            <div className="dropdown-item">
              <div className="dropdown-icon"><img src="/images/coffeehouse.png" alt="Coffeehouse" /></div>
              <div className="dropdown-label">{t('drop.coffeehouse')}</div>
            </div>
            <div className="dropdown-item">
              <div className="dropdown-icon"><img src="/images/wintermerch.png" alt="Cups" /></div>
              <div className="dropdown-label">{t('drop.cups')}</div>
            </div>
            <div className="empty-grid-right"></div>
            <div className="dropdown-item">
              <div className="dropdown-icon"><img src="/images/roastery.png" alt="Drinks" /></div>
              <div className="dropdown-label">{t('drop.drinks')}</div>
            </div>
          </div>
        </div>

        <div className="dropdown-menu" id="peopleDropdown" ref={peopleDropdownRef}>
          <div className="dropdown-content">
            <div className="empty-grid-left"></div>
            <div className="dropdown-item">
              <div className="dropdown-icon"><img src="/images/esg.png" alt="Annual Report" /></div>
              <div className="dropdown-label">{t('drop.esg')}</div>
            </div>
            <div className="dropdown-item">
              <div className="dropdown-icon"><img src="/images/belong.png" alt="Belonging" /></div>
              <div className="dropdown-label">{t('drop.belonging')}</div>
            </div>
            <div className="dropdown-item">
              <div className="dropdown-icon"><img src="/images/communities.png" alt="Communities" /></div>
              <div className="dropdown-label">{t('drop.communities')}</div>
            </div>
            <div className="empty-grid-right"></div>
            <div className="dropdown-item">
              <div className="dropdown-icon"><img src="/images/farmers.png" alt="Farmers" /></div>
              <div className="dropdown-label">{t('drop.farmers')}</div>
            </div>
            <div className="dropdown-item">
              <div className="dropdown-icon"><img src="/images/employees.png" alt="Partners" /></div>
              <div className="dropdown-label">{t('drop.partners')}</div>
            </div>
            <div className="dropdown-item">
              <div className="dropdown-icon"><img src="/images/tsf.png" alt="Foundation" /></div>
              <div className="dropdown-label">{t('drop.foundation')}</div>
            </div>
            <div className="dropdown-item">
              <div className="dropdown-icon"><img src="/images/sustainability.png" alt="Sustainability" /></div>
              <div className="dropdown-label">{t('drop.sustainability')}</div>
            </div>
          </div>
        </div>

        <div className="dropdown-menu" id="newsDropdown" ref={newsDropdownRef}>
          <div className="dropdown-content news-layout">
            <div className="news-item"><span>{t('drop.contact')}</span></div>
            <div className="news-item"><span>{t('drop.media')}</span></div>
            <div className="news-item"><span>{t('drop.blog')}</span></div>
            <div className="news-item"><span>{t('drop.releases')}</span></div>
            <div className="news-item"><span>{t('drop.record')}</span></div>
          </div>
        </div>
      </header>

      {/* Blur Overlay */}
      <div className="dropdown-overlay" id="dropdownOverlay" ref={overlayRef}></div>

      {/* Mobile menu — green header */}
      {mobileOpen && (
        <div className="hf-mobile-menu">
          <div className="hf-mobile-item" onClick={() => { router.push('/ourcoffeepage'); setMobileOpen(false); }}>{t('nav.coffee')}</div>
          <div className="hf-mobile-item" onClick={() => setMobileOpen(false)}>{t('nav.people')}</div>
          <div className="hf-mobile-item" onClick={() => setMobileOpen(false)}>{t('nav.news')}</div>
          <div className="hf-mobile-item" onClick={() => { router.push('/storiessubpage'); setMobileOpen(false); }}>{t('nav.stories')}</div>
        </div>
      )}

      {/* --- FIX: render children so pages inside HeaderFooter appear --- */}
      <main>{children}</main>
    </>
  );
};

export default HeaderFooter;