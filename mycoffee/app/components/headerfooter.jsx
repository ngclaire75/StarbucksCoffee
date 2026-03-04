import React, { useEffect, useRef, useCallback } from 'react';
import '../ourcoffeepage/ourcoffee.css';

const HeaderFooter = ({ children }) => {
  const coffeeDropdownRef = useRef(null);
  const peopleDropdownRef = useRef(null);
  const newsDropdownRef = useRef(null);
  const overlayRef = useRef(null);
  const greenBarRef = useRef(null);
  const navLinksRef = useRef([]);

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
            <img src="/images/starbuckslogov2.png" alt="Starbucks" />
          </div>
          <nav className="green-nav-links">
            <a
              href="#"
              className="nav-link has-arrow"
              data-dropdown="coffee"
              ref={el => (navLinksRef.current[0] = el)}
            >
              Coffee &amp; Craft
            </a>
            <a
              href="#"
              className="nav-link has-arrow"
              data-dropdown="people"
              ref={el => (navLinksRef.current[1] = el)}
            >
              People &amp; Impact
            </a>
            <a
              href="#"
              className="nav-link has-arrow"
              data-dropdown="news"
              ref={el => (navLinksRef.current[2] = el)}
            >
              News
            </a>
            <a href="/storiessubpage" className="nav-link">Stories</a>
          </nav>
          <div className="right-icons">
            <div className="nav-icon" id="searchBtn">
              <img src="/images/searchicon.png" alt="Search Icon" />
            </div>
            <div className="nav-icon" id="globeBtn">
              <img src="/images/globalicon.png" alt="Globe Icon" />
            </div>
          </div>
        </div>

        {/* DROPDOWN MENUS */}
        <div className="dropdown-menu" id="coffeeDropdown" ref={coffeeDropdownRef}>
          <div className="dropdown-content">
            <div className="empty-grid-left"></div>
            <div className="dropdown-item">
              <div className="dropdown-icon"><img src="/images/black.png" alt="Coffee" /></div>
              <div className="dropdown-label">Coffee</div>
            </div>
            <div className="dropdown-item">
              <div className="dropdown-icon"><img src="/images/coffeehouse.png" alt="Coffeehouse" /></div>
              <div className="dropdown-label">Coffeehouse Experience</div>
            </div>
            <div className="dropdown-item">
              <div className="dropdown-icon"><img src="/images/wintermerch.png" alt="Cups" /></div>
              <div className="dropdown-label">Cups &amp; Merch</div>
            </div>
            <div className="empty-grid-right"></div>
            <div className="dropdown-item">
              <div className="dropdown-icon"><img src="/images/roastery.png" alt="Drinks" /></div>
              <div className="dropdown-label">Drinks &amp; Food</div>
            </div>
          </div>
        </div>

        <div className="dropdown-menu" id="peopleDropdown" ref={peopleDropdownRef}>
          <div className="dropdown-content">
            <div className="empty-grid-left"></div>
            <div className="dropdown-item">
              <div className="dropdown-icon"><img src="/images/esg.png" alt="Annual Report" /></div>
              <div className="dropdown-label">Annual Impact Report (ESG)</div>
            </div>
            <div className="dropdown-item">
              <div className="dropdown-icon"><img src="/images/belong.png" alt="Belonging" /></div>
              <div className="dropdown-label">Belonging at Starbucks</div>
            </div>
            <div className="dropdown-item">
              <div className="dropdown-icon"><img src="/images/communities.png" alt="Communities" /></div>
              <div className="dropdown-label">Communities</div>
            </div>
            <div className="empty-grid-right"></div>
            <div className="dropdown-item">
              <div className="dropdown-icon"><img src="/images/farmers.png" alt="Farmers" /></div>
              <div className="dropdown-label">Farmers</div>
            </div>
            <div className="dropdown-item">
              <div className="dropdown-icon"><img src="/images/employees.png" alt="Partners" /></div>
              <div className="dropdown-label">Partners (Employees)</div>
            </div>
            <div className="dropdown-item">
              <div className="dropdown-icon"><img src="/images/tsf.png" alt="Foundation" /></div>
              <div className="dropdown-label">The Starbucks Foundation</div>
            </div>
            <div className="dropdown-item">
              <div className="dropdown-icon"><img src="/images/sustainability.png" alt="Sustainability" /></div>
              <div className="dropdown-label">Sustainability</div>
            </div>
          </div>
        </div>

        <div className="dropdown-menu" id="newsDropdown" ref={newsDropdownRef}>
          <div className="dropdown-content news-layout">
            <div className="news-item"><span>Contact Us</span></div>
            <div className="news-item"><span>Media Library</span></div>
            <div className="news-item"><span>News Blog</span></div>
            <div className="news-item"><span>Press Releases</span></div>
            <div className="news-item"><span>Starbucks for the Record</span></div>
          </div>
        </div>
      </header>

      {/* Blur Overlay */}
      <div className="dropdown-overlay" id="dropdownOverlay" ref={overlayRef}></div>

      {/* --- FIX: render children so pages inside HeaderFooter appear --- */}
      <main>{children}</main>
    </>
  );
};

export default HeaderFooter;