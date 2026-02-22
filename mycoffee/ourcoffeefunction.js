document.addEventListener("DOMContentLoaded", function () {

    // Numbers Slider
    const track = document.querySelector('.numbers-track');
    const slides = Array.from(document.querySelectorAll('.numbers-slide'));
    const dots = Array.from(document.querySelectorAll('.dot'));
    const prev = document.getElementById('prevSlide');
    const next = document.getElementById('nextSlide');

    if (track && slides.length > 0 && prev && next && dots.length > 0) {
        let currentIndex = 0;

        function goToSlide(index) {
            currentIndex = index;
            const offset = slides[index].offsetLeft;
            track.style.transform = `translateX(-${offset}px)`;
            dots.forEach((d, i) => {
                d.classList.toggle('active', i === index);
            });
        }

        next.addEventListener('click', () => {
            if (currentIndex < slides.length - 1) goToSlide(currentIndex + 1);
        });

        prev.addEventListener('click', () => {
            if (currentIndex > 0) goToSlide(currentIndex - 1);
        });

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => goToSlide(i));
        });
    }

    // Video Pause and Play Toggle
    const pairingsCard = document.querySelector('.pairings-card');
    if (pairingsCard) {
        const pauseIcon = pairingsCard.querySelector('.pause-icon');
        const video = pairingsCard.querySelector('video');

        if (pauseIcon && video) {
            let isPaused = false;

            pauseIcon.addEventListener('click', () => {
                isPaused = !isPaused;
                if (isPaused) {
                    video.pause();
                    pauseIcon.textContent = '▶';
                } else {
                    video.play();
                    pauseIcon.textContent = '||';
                }
            });

            pauseIcon.style.transition = 'transform 0.2s ease, background-color 0.2s ease';
            pauseIcon.addEventListener('mouseenter', () => {
                pauseIcon.style.transform = 'scale(1.1)';
                pauseIcon.style.backgroundColor = 'rgba(0,0,0,0.2)';
            });
            pauseIcon.addEventListener('mouseleave', () => {
                pauseIcon.style.transform = 'scale(1)';
                pauseIcon.style.backgroundColor = 'transparent';
            });
        }
    }

    // Hero Parallax Effect
    const heroSection = document.querySelector('.hero-section');
    const heroImages = document.querySelectorAll('.hero-img');

    if (heroSection && heroImages.length > 0) {
        let mouseX = 0;
        let mouseY = 0;

        const state = [...heroImages].map(() => ({
            x: 0, y: 0, rx: 0, ry: 0, tx: 0, ty: 0, trx: 0, try: 0
        }));

        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const normalizedX = (e.clientX - rect.left) / rect.width;
            const normalizedY = (e.clientY - rect.top) / rect.height;
            mouseX = normalizedX * rect.width - rect.width / 2;
            mouseY = normalizedY * rect.height - rect.height / 2;

            heroImages.forEach((img, index) => {
                const depth = (index + 1) * 0.02;
                state[index].tx = -mouseX * depth;
                const downBoost = 1 + normalizedY * 2;
                state[index].ty = -mouseY * depth * downBoost;
                state[index].trx = clamp(mouseY * depth * 0.08, -3, 3);
                state[index].try = clamp(-mouseX * depth * 0.08, -3, 3);
            });
        });

        function animate() {
            heroImages.forEach((img, index) => {
                const s = state[index];
                s.x += (s.tx - s.x) * 0.06;
                s.y += (s.ty - s.y) * 0.06;
                s.rx += (s.trx - s.rx) * 0.035;
                s.ry += (s.try - s.ry) * 0.035;
                img.style.transform = `
                    perspective(1200px)
                    translate3d(${s.x}px, ${s.y}px, 0)
                    rotateX(${s.rx}deg)
                    rotateY(${s.ry}deg)
                `;
            });
            requestAnimationFrame(animate);
        }

        animate();
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    // Wrap button text in span for animation
    const learnMoreBtn = document.querySelector('.learn-more-btn');
    if (learnMoreBtn) {
        learnMoreBtn.innerHTML = `<span>${learnMoreBtn.textContent}</span>`;
    }

    // Dropdown Menu Functionality
    const navLinks = document.querySelectorAll('.nav-link.has-arrow');
    const coffeeDropdown = document.getElementById('coffeeDropdown');
    const peopleDropdown = document.getElementById('peopleDropdown');
    const newsDropdown = document.getElementById('newsDropdown');
    const overlay = document.getElementById('dropdownOverlay');
    const greenBar = document.querySelector('.top-green-bar');

    function getScrollbarWidth() {
        return window.innerWidth - document.documentElement.clientWidth;
    }

    function lockScroll() {
        const sw = getScrollbarWidth();
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = sw + 'px';
        if (greenBar) greenBar.style.paddingRight = sw + 'px';
    }

    function unlockScroll() {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        if (greenBar) greenBar.style.paddingRight = '';
    }

    if (navLinks.length > 0 && overlay) {

        navLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const dropdownType = this.getAttribute('data-dropdown');

                if (this.classList.contains('active')) {
                    closeDropdown();
                } else {
                    closeDropdown();
                    this.classList.add('active');
                    overlay.classList.add('active');
                    lockScroll();

                    if (dropdownType === 'coffee' && coffeeDropdown) {
                        coffeeDropdown.classList.add('active');
                    } else if (dropdownType === 'people' && peopleDropdown) {
                        peopleDropdown.classList.add('active');
                    } else if (dropdownType === 'news' && newsDropdown) {
                        newsDropdown.classList.add('active');
                    }
                }
            });
        });

        overlay.addEventListener('click', closeDropdown);

        function closeDropdown() {
            navLinks.forEach(l => l.classList.remove('active'));
            if (coffeeDropdown) coffeeDropdown.classList.remove('active');
            if (peopleDropdown) peopleDropdown.classList.remove('active');
            if (newsDropdown) newsDropdown.classList.remove('active');
            overlay.classList.remove('active');
            unlockScroll();
        }

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeDropdown();
        });
    }

    // Nav icon active state
const navIcons = document.querySelectorAll('.nav-icon:not(#globeBtn)');
const globeBtn = document.getElementById('globeBtn');

document.addEventListener('click', (e) => {
    navIcons.forEach(icon => {
        if (!icon.contains(e.target)) icon.classList.remove('active');
    });

    // Also deselect globe if clicking anywhere outside
    if (globeBtn && globeBtn.classList.contains('globe-selected') &&
        !globeBtn.contains(e.target) &&
        !document.getElementById('globePanel').contains(e.target)) {
        // Deselect globe
        const img = globeBtn.querySelector('img');
        img.style.cssText = 'animation:none!important;transition:none!important;filter:brightness(0) invert(1)!important';
        globeBtn.classList.remove('globe-selected');
        setTimeout(() => { img.style.cssText = ''; }, 100);
    }
});

navIcons.forEach(icon => {
    icon.addEventListener('click', (e) => {
        e.stopPropagation();

        // Remove active from all icons
        navIcons.forEach(i => i.classList.remove('active'));

        // Add active to the clicked one
        icon.classList.add('active');

        // Remove globe selection if any
        if (globeBtn.classList.contains('globe-selected')) {
            const img = globeBtn.querySelector('img');
            img.style.cssText = 'animation:none!important;transition:none!important;filter:brightness(0) invert(1)!important';
            globeBtn.classList.remove('globe-selected');
            setTimeout(() => { img.style.cssText = ''; }, 100);
        }
    });
});

    // Globe Panel
    (function () {
        const globeBtn     = document.getElementById('globeBtn');
        const globePanel   = document.getElementById('globePanel');
        const globeOverlay = document.getElementById('globeOverlay');
        const globeClose   = document.getElementById('globeClose');
        let globeSelected  = false;

        function openGlobe() {
            globeSelected = true;
            globePanel.classList.add('active');
            globeOverlay.classList.add('active');
            globeBtn.classList.add('globe-selected');
        }

        function closeGlobe() {
            globePanel.classList.remove('active');
            globeOverlay.classList.remove('active');
        }

        function deselectGlobe() {
            globeSelected = false;
            const img = globeBtn.querySelector('img');
            img.style.cssText = 'animation:none!important;transition:none!important;filter:brightness(0) invert(1)!important';
            globeBtn.classList.remove('globe-selected');
            setTimeout(() => { img.style.cssText = ''; }, 100);
        }

        globeBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            const isOpen = globePanel.classList.contains('active');
            isOpen ? closeGlobe() : openGlobe();
        });

        globeOverlay.addEventListener('click', closeGlobe);
        globeClose.addEventListener('click', closeGlobe);

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeGlobe();
        });

        document.addEventListener('click', function (e) {
            if (globeSelected && !globeBtn.contains(e.target) && !globePanel.contains(e.target)) {
                deselectGlobe();
            }
        });

        document.querySelectorAll('.green-nav-links a.has-arrow').forEach(function (link) {
            link.addEventListener('click', closeGlobe);
        });
    })();

    document.querySelectorAll('.globe-lang-link').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
        });
    });
  
// --- Search icon active selection independent of panel ---
const searchBtn = document.getElementById('searchBtn');
const searchOverlay = document.getElementById('searchOverlay');
const searchPanel = document.querySelector('.search-panel');
let searchSelected = false; // visual active state

// Toggle active selection
function toggleSearchSelection() {
    if (searchSelected) {
        searchSelected = false;
        searchBtn.classList.remove('search-selected');
    } else {
        searchSelected = true;
        searchBtn.classList.add('search-selected');

        // Deselect globe & nav icons
        if (globeBtn.classList.contains('globe-selected')) {
            const img = globeBtn.querySelector('img');
            img.style.cssText = 'animation:none!important;transition:none!important;filter:brightness(0) invert(1)!important';
            globeBtn.classList.remove('globe-selected');
            setTimeout(() => { img.style.cssText = ''; }, 100);
        }
        navIcons.forEach(i => i.classList.remove('active'));
    }
}

// Open/close panel without touching selection
function openSearchPanel() {
    searchOverlay.classList.add('open');
    searchPanel && (searchPanel.style.transform = 'translateX(0)');
    setTimeout(() => searchInput && searchInput.focus(), 400);
}

function closeSearchPanel() {
    searchOverlay.classList.remove('open');
    searchPanel && (searchPanel.style.transform = 'translateX(100%)');
}

// Click search icon: toggle selection + panel open
searchBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    toggleSearchSelection();
    openSearchPanel();
});

// Clicking close button or overlay only closes panel
const searchClose = document.getElementById('searchClose');
const searchBg = document.getElementById('searchBg');
searchClose && searchClose.addEventListener('click', closeSearchPanel);
searchBg && searchBg.addEventListener('click', closeSearchPanel);

// Click anywhere else: close panel AND deselect icon
document.addEventListener('click', function(e) {
    // Close panel if click outside
    if (!searchBtn.contains(e.target) && !searchPanel.contains(e.target)) {
        closeSearchPanel();

        // Deselect search icon visually
        if (searchSelected) {
            searchSelected = false;
            searchBtn.classList.remove('search-selected');
        }
    }
});

// Escape key closes panel but keeps selection (optional: you can deselect here if you want)
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeSearchPanel();
});

const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('click', function (e) {
    e.stopPropagation();
    searchInput.classList.add('clicked');
});

document.addEventListener('click', function (e) {
    if (!searchInput.contains(e.target)) {
        searchInput.classList.remove('clicked');
    }
});

// ── SEARCH FUNCTIONALITY ──
(function () {

    var searchTimer = null;
    var allPages    = [];   // { title, meta, href }
    var pagesLoaded = false;

    function normalise(str) {
        return str.toLowerCase().replace(/\s+/g, ' ').trim();
    }

    // ── Build the index from <a> tags in the BODY CONTENT only.
    //    Nav / header / footer links point to main pages (which have the search icon)
    //    and are intentionally excluded.  Only sub-page / article links from the
    //    content area are indexed.
    function buildIndex() {
        if (pagesLoaded) return;

        var seen        = {};
        var currentPath = window.location.pathname;

        // ── Walk only links that are NOT inside nav / header / footer ──
        document.querySelectorAll('a[href]').forEach(function (a) {

            // Skip nav / header / footer — those are main pages with the search icon
            if (a.closest('header, footer, nav, [role="navigation"], [role="banner"], [role="contentinfo"]')) return;

            var href = a.getAttribute('href');
            if (!href) return;
            if (href.startsWith('#')) return;
            if (href.startsWith('mailto:')) return;
            if (href.startsWith('tel:')) return;
            if (href.startsWith('http') && !href.includes(window.location.hostname)) return;

            var path;
            try { path = new URL(href, window.location.origin).pathname; } catch (e) { return; }

            if (path === currentPath) return;
            if (/\.(png|jpg|jpeg|gif|svg|css|js|ico|pdf|webp)$/i.test(path)) return;

            // ── Dedup by path ──
            if (seen[path]) return;
            seen[path] = true;

            // ── Derive the best label for this link ──
            // Priority: heading inside/near the link → link text → path slug
            var label = '';

            var heading = a.querySelector('h1, h2, h3, h4') ||
                          a.closest('h1, h2, h3, h4') ||
                          (a.parentElement && a.parentElement.querySelector('h1, h2, h3, h4'));

            if (heading) {
                label = heading.textContent.replace(/[›>»«]/g, '').trim();
            }

            if (!label) {
                label = a.textContent.replace(/[›>»«]/g, '').trim();
            }

            if (!label || label.length < 2) {
                label = path.replace(/^\//, '').replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
            }

            if (!label) return;

            // ── Check nearby text for MIN READ ──
            var container = a.parentElement;
            var meta = '';
            for (var i = 0; i < 5; i++) {
                if (!container) break;
                var match = container.textContent.match(/(\d+)\s*MIN\s*READ/i);
                if (match) { meta = match[1] + ' MIN READ'; break; }
                container = container.parentElement;
            }

            allPages.push({ title: label, meta: meta, href: path });
        });

        pagesLoaded = true;
    }

    // ── UI helpers ──
    function showEl(id)    { document.getElementById(id).classList.add('visible'); }
    function hideEl(id)    { document.getElementById(id).classList.remove('visible'); }
    function hideDidWrap() { document.getElementById('searchDidWrap').style.display = 'none'; }
    function showDidWrap() { document.getElementById('searchDidWrap').style.display = ''; }

    function resetSearchUI() {
        clearTimeout(searchTimer);
        hideEl('searchLoading');
        hideEl('searchResults');
        hideEl('searchNoResults');
        hideEl('viewAllWrap');
        document.getElementById('searchResults').innerHTML = '';
        showDidWrap();
    }

    function triggerSearch() {
        var query = document.getElementById('searchInput').value.trim();
        if (!query) { resetSearchUI(); return; }

        clearTimeout(searchTimer);
        hideDidWrap();
        showEl('searchLoading');           // ── show loading spinner ──

        searchTimer = setTimeout(function () {
            buildIndex();
            hideEl('searchLoading');       // ── hide loading spinner ──
            renderResults(query);
        }, 500);
    }

    function renderResults(query) {
        var q        = normalise(query);
        var seen     = {};
        var filtered = allPages.filter(function (p) {
            var k = normalise(p.title);
            if (!p.title.toLowerCase().includes(q)) return false;
            if (seen[k]) return false;
            seen[k] = true;
            return true;
        }).slice(0, 6);

        hideEl('searchResults');
        hideEl('searchNoResults');
        hideEl('viewAllWrap');

        var resultsEl = document.getElementById('searchResults');
        resultsEl.innerHTML = '';

        if (filtered.length === 0) { showEl('searchNoResults'); return; }

        filtered.forEach(function (item) {
            var div = document.createElement('div');
            div.className = 'result-item';

            var metaHtml = item.meta
                ? '<div class="result-meta">' + item.meta + '</div>'
                : '';

            div.innerHTML =
                '<div class="result-title">' + item.title + ' <span class="arrow">›</span></div>' +
                metaHtml;

            if (item.href) {
                div.addEventListener('click', function () { window.location.href = item.href; });
            }

            resultsEl.appendChild(div);
        });

        showEl('searchResults');
        showEl('viewAllWrap');
    }

    document.getElementById('searchSubmit').addEventListener('click', triggerSearch);
    document.getElementById('searchInput').addEventListener('keydown', function (e) {
        if (e.key === 'Enter') triggerSearch();
    });
    document.getElementById('searchInput').addEventListener('input', triggerSearch);

    function onClose() {
        document.getElementById('searchInput').value = '';
        resetSearchUI();
    }
    document.getElementById('searchClose').addEventListener('click', onClose);
    document.getElementById('searchBg').addEventListener('click', onClose);

    // Pre-build the index on page load so search is instant
    buildIndex();

})();

}); 