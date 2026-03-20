"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// ── External SVG icons ──
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

// ── Helper: scrollbar width ──
const getScrollbarWidth = () => window.innerWidth - document.documentElement.clientWidth;


// ── Globe Panel ──
export function GlobePanel({ isOpen, onClose, globeBtnRef }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const regions = [
    { name: "Canada", langs: [{ label: "English", slug: "canada-en" }, { label: "Français", slug: "canada-fr" }] },
    { name: "USA", langs: [{ label: "English", slug: "usa-en" }] },
    { name: "EMEA", langs: [{ label: "English", slug: "emea-en" }] },
    {
      name: "Latin America",
      langs: [
        { label: "English", slug: "latam-en" },
        { label: "Español", slug: "latam-es" },
        { label: "Português", slug: "latam-pt" },
      ],
    },
    { name: "Asia", langs: [{ label: "English", slug: "asia-en" }] },
    { name: "Japan", langs: [{ label: "日本語", slug: "japan-ja" }] },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className={`globe-overlay ${isOpen ? "active" : ""}`}
        id="globeOverlay"
        onClick={onClose}
      />

      {/* Panel */}
      <div className={`globe-panel${isOpen ? " active" : ""}`} id="globePanel">
        <button className="globe-close" id="globeClose" aria-label="Close region selector" onClick={onClose}>
          <span>&#x2715;</span>
        </button>

        {regions.map((region) => (
          <div className="globe-region" key={region.name}>
            <p className="globe-region-title">
              <span className="title-text">{region.name}</span>
            </p>
            <div className="globe-lang-group">
              {region.langs.map((lang) => (
                <a
                  key={lang.label}
                  href={`/region?r=${lang.slug}`}
                  className="globe-lang-link"
                  onClick={onClose}
                >
                  <span className="link-text">{lang.label}</span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ── Search Panel ──
export function SearchPanel({ isOpen, onClose, searchBtnRef }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | results | no-results
  const [inputClicked, setInputClicked] = useState(false);

  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const pagesRef = useRef([]);
  const pagesLoadedRef = useRef(false);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 400);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Escape key closes panel
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Build index from DOM links (same logic as vanilla JS)
  const buildIndex = useCallback(() => {
    if (pagesLoadedRef.current) return;
    const seen = {};
    const currentPath = window.location.pathname;

    document.querySelectorAll("a[href]").forEach((a) => {
      if (a.closest("header, footer, nav, [role='navigation'], [role='banner'], [role='contentinfo']")) return;
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      if (href.startsWith("http") && !href.includes(window.location.hostname)) return;

      let path;
      try { path = new URL(href, window.location.origin).pathname; } catch { return; }
      if (path === currentPath) return;
      if (/\.(png|jpg|jpeg|gif|svg|css|js|ico|pdf|webp)$/i.test(path)) return;
      if (seen[path]) return;
      seen[path] = true;

      let label = "";
      const heading =
        a.querySelector("h1,h2,h3,h4") ||
        a.closest("h1,h2,h3,h4") ||
        a.parentElement?.querySelector("h1,h2,h3,h4");

      if (heading) label = heading.textContent.replace(/[›>»«]/g, "").trim();
      if (!label) label = a.textContent.replace(/[›>»«]/g, "").trim();
      if (!label || label.length < 2)
        label = path.replace(/^\//, "").replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
      if (!label) return;

      let meta = "";
      let container = a.parentElement;
      for (let i = 0; i < 5; i++) {
        if (!container) break;
        const match = container.textContent.match(/(\d+)\s*MIN\s*READ/i);
        if (match) { meta = match[1] + " MIN READ"; break; }
        container = container.parentElement;
      }

      pagesRef.current.push({ title: label, meta, href: path });
    });

    pagesLoadedRef.current = true;
  }, []);

  // Pre-build index on mount
  useEffect(() => { buildIndex(); }, [buildIndex]);

  const normalise = (str) => str.toLowerCase().replace(/\s+/g, " ").trim();

  const triggerSearch = useCallback((q) => {
    const trimmed = q.trim();
    if (!trimmed) {
      setStatus("idle");
      setResults([]);
      clearTimeout(timerRef.current);
      return;
    }

    clearTimeout(timerRef.current);
    setStatus("loading");

    timerRef.current = setTimeout(() => {
      buildIndex();
      const normalQ = normalise(trimmed);
      const seen = {};
      const filtered = pagesRef.current
        .filter((p) => {
          const k = normalise(p.title);
          if (!p.title.toLowerCase().includes(normalQ)) return false;
          if (seen[k]) return false;
          seen[k] = true;
          return true;
        })
        .slice(0, 6);

      setResults(filtered);
      setStatus(filtered.length === 0 ? "no-results" : "results");
    }, 500);
  }, [buildIndex]);

  const handleInput = (e) => {
    const val = e.target.value;
    setQuery(val);
    triggerSearch(val);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      clearTimeout(timerRef.current);
      triggerSearch(query);
    }
  };

  const handleClose = () => {
    setQuery("");
    setResults([]);
    setStatus("idle");
    onClose();
  };

  const panelStyle = {
    transform: isOpen ? "translateX(0)" : "translateX(100%)",
  };

  return (
    <div className={`search-overlay${isOpen ? " open" : ""}`} id="searchOverlay">
      {/* Blur backdrop */}
      <div className="search-bg" id="searchBg" onClick={handleClose} />

      {/* Slide-in panel */}
      <div
        className="search-panel"
        id="searchPanel"
        role="dialog"
        aria-label="Search"
        style={panelStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="search-close" id="searchClose" aria-label="Close search" onClick={handleClose}>
          <span>&#x2715;</span>
        </button>

        <div className="search-input-row">
          <input
            ref={inputRef}
            type="text"
            id="searchInput"
            placeholder="Search"
            aria-label="Search"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            name="search-no-autofill"
            value={query}
            className={inputClicked ? "clicked" : ""}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            onClick={(e) => { e.stopPropagation(); setInputClicked(true); }}
          />
          <button id="searchSubmit" aria-label="Submit search" onClick={() => triggerSearch(query)}>
            <SearchIcon />
          </button>
        </div>

        {/* Results */}
        <div className="search-results-wrapper">
          {status === "results" && (
            <>
              <div className="search-results visible" id="searchResults">
                {results.map((item, i) => (
                  <div
                    key={i}
                    className="result-item"
                    onClick={() => { if (item.href) window.location.href = item.href; }}
                  >
                    <div className="result-title">
                      {item.title} <span className="arrow">›</span>
                    </div>
                    {item.meta && <div className="result-meta">{item.meta}</div>}
                  </div>
                ))}
              </div>
              <div className="view-all-wrap visible" id="viewAllWrap">
                <button className="view-all-btn">
                  <span>View all results</span>
                </button>
              </div>
            </>
          )}
        </div>

        {status === "no-results" && (
          <div className="search-no-results visible" id="searchNoResults">
            No results found
          </div>
        )}

        {status === "loading" && (
          <div className="search-loading visible" id="searchLoading">
            Loading...
          </div>
        )}

        {/* Did You Know card — shown when idle */}
        {status === "idle" && (
          <div className="search-did-wrap" id="searchDidWrap">
            <div className="search-circle-card">
              <img src="images/lightbulb.png" alt="lightbulb" className="bulb-img" />
              <p className="search-did-label">Did you know</p>
              <p className="search-did-text">
                <span className="line">Starbucks Caffè Verona coffee has also</span>
                <br />
                <span className="line">gone by two other names over the</span>
                <br />
                <span className="line">years: Jake's Blend, and 80/20 Blend.</span>
                <span className="arrow"> ›</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Nav Icons active-state manager ──
// Wrap your nav in this component OR call useNavIcons() and pass refs manually.
export function useNavIcons() {
  const [activeIcon, setActiveIcon] = useState(null);

  const handleNavIconClick = useCallback((iconId, e) => {
    e?.stopPropagation();
    setActiveIcon(iconId);
  }, []);

  // Click outside deselects all
  useEffect(() => {
    const handler = () => setActiveIcon(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const isActive = (iconId) => activeIcon === iconId;

  return { activeIcon, handleNavIconClick, isActive };
}

// ── Default export: drop-in overlay manager ──
// Place <SearchPanel /> anywhere in your page (e.g. ourcoffee.jsx).
// It listens for clicks on #searchBtn and #globeBtn already rendered
// by HeaderFooter and manages both overlay panels automatically —
// no prop drilling or changes to HeaderFooter required.
export default function SearchPanel_Full() {

const [searchOpen, setSearchOpen] = useState(false);
  const [globeOpen, setGlobeOpen]   = useState(false);
  
  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    document.getElementById("searchBtn")?.classList.remove("search-selected");
  }, []);

  const closeGlobe = useCallback(() => {
    setGlobeOpen(false);
    document.getElementById("globeBtn")?.classList.remove("globe-selected");
  }, []);

  useEffect(() => {
    const searchBtn = document.getElementById("searchBtn");
    const globeBtn  = document.getElementById("globeBtn");

    const handleSearchClick = (e) => {
      e.stopPropagation();
      setSearchOpen((prev) => {
        const next = !prev;
        searchBtn?.classList.toggle("search-selected", next);
        if (next) {
          setGlobeOpen(false);
          globeBtn?.classList.remove("globe-selected");
        }
        return next;
      });
    };


    const handleGlobeClick = (e) => {
      e.stopPropagation();
      setGlobeOpen((prev) => {
        const next = !prev;
        globeBtn?.classList.toggle("globe-selected", next);
        if (next) {
          setSearchOpen(false);
          searchBtn?.classList.remove("search-selected");
        }
        return next;
      });
    };

    const handleOutsideClick = (e) => {
      if (!e.target.closest(".search-panel") && !e.target.closest("#searchBtn")) {
        setSearchOpen(false);
        searchBtn?.classList.remove("search-selected");
      }
      if (!e.target.closest(".globe-panel") && !e.target.closest("#globeBtn")) {
        setGlobeOpen(false);
        globeBtn?.classList.remove("globe-selected");
      }
    };

    searchBtn?.addEventListener("click", handleSearchClick);
    globeBtn?.addEventListener("click",  handleGlobeClick);
    document.addEventListener("click",   handleOutsideClick);

    return () => {
      searchBtn?.removeEventListener("click", handleSearchClick);
      globeBtn?.removeEventListener("click",  handleGlobeClick);
      document.removeEventListener("click",   handleOutsideClick);
    };
  }, []);

useEffect(() => {
  const isAnyOpen = searchOpen || globeOpen;

  if (isAnyOpen) {
    const sw = getScrollbarWidth();
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.paddingRight = sw + "px";

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  } else {
    document.documentElement.style.overflow = "";
    document.documentElement.style.paddingRight = "";
  }

  return () => {
    document.documentElement.style.overflow = "";
    document.documentElement.style.paddingRight = "";
  };
}, [searchOpen, globeOpen]);

  return (
    <>
      <SearchPanel isOpen={searchOpen} onClose={closeSearch} />
      <GlobePanel  isOpen={globeOpen}  onClose={closeGlobe}  />
    </>
  );
}