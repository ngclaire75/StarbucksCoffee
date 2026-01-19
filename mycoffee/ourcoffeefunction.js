// Numbers Slider
(function () {
    const track = document.querySelector('.numbers-track');
    const slides = Array.from(document.querySelectorAll('.numbers-slide'));
    const dots = Array.from(document.querySelectorAll('.dot'));
    const prev = document.getElementById('prevSlide');
    const next = document.getElementById('nextSlide');

    if (!track || slides.length === 0) return;

    let currentIndex = 0; 

function goToSlide(index) {
    currentIndex = index;

    // Calculate exact offset for that slide
    const offset = slides
        .slice(0, index)        // sum widths of all previous slides
        .reduce((total, slide) => total + slide.offsetWidth, 0);

    track.style.transform = `translateX(-${offset}px)`;

    // Update dots
    dots.forEach((d, i) => {
        d.classList.toggle('active', i === index);
    });
}

    next.addEventListener('click', () => {
        let newIndex = currentIndex + 1;
        if (newIndex >= slides.length) newIndex = 0;
        goToSlide(newIndex);
    });

    prev.addEventListener('click', () => {
        let newIndex = currentIndex - 1;
        if (newIndex < 0) newIndex = slides.length - 1;
        goToSlide(newIndex);
    });

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            goToSlide(i);
        });
    });

})();



// Video Pause and Play Toggle
document.addEventListener('DOMContentLoaded', function() {
    const pairingsCard = document.querySelector('.pairings-card');
    const pauseIcon = pairingsCard.querySelector('.pause-icon');
    const video = pairingsCard.querySelector('video');

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
});




// It's a Great Day Hero Parallax Effect
// Get the hero section and all images
const heroSection = document.querySelector('.hero-section');
const heroImages = document.querySelectorAll('.hero-img');

// Track if hovering over an image
let hoverTarget = null;

heroImages.forEach(img => {
    img.addEventListener('mouseenter', () => { hoverTarget = img; });
    img.addEventListener('mouseleave', () => { hoverTarget = null; });
});

// Add mousemove event listener to the hero section
heroSection.addEventListener('mousemove', (e) => {
    // Get the center of the hero section
    const rect = heroSection.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate cursor position relative to center
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Move each image with different intensity
    heroImages.forEach((img, index) => {
        // Different movement intensity for each image
        const intensity = (index + 1) * 0.02;
        
        // Move opposite to cursor direction
        const moveX = -mouseX * intensity;
        const moveY = -mouseY * intensity;
        
        // Apply parallax + hover effect if this image is being hovered
        if (img === hoverTarget) {
                    img.style.transform = `translate(${moveX}px, ${moveY}px)`;
            img.style.boxShadow = 'none';
        } else {
            img.style.transform = `translate(${moveX}px, ${moveY}px)`;
            img.style.boxShadow = 'none';
        }
    });
});

// Reset position when mouse leaves
heroSection.addEventListener('mouseleave', () => {
    heroImages.forEach((img) => {
        img.style.transform = 'translate(0, 0)';
        img.style.boxShadow = 'none';
    });
});

// Wrap button text in span for animation
const learnMoreBtn = document.querySelector('.learn-more-btn');
learnMoreBtn.innerHTML = `<span>${learnMoreBtn.textContent}</span>`;

/// Dropdown Menu Functionality
const navLinks = document.querySelectorAll('.nav-link.has-arrow');
const coffeeDropdown = document.getElementById('coffeeDropdown');
const peopleDropdown = document.getElementById('peopleDropdown');
const newsDropdown = document.getElementById('newsDropdown'); 
const overlay = document.getElementById('dropdownOverlay');

let currentActiveLink = null;
let currentDropdown = null;

navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();

        const dropdownType = this.getAttribute('data-dropdown');

        // If clicking the same link that's already active, close it
        if (this.classList.contains('active')) {
            closeDropdown();
        } else {
            // Close any open dropdown first
            closeDropdown();

            // Activate link + overlay
            this.classList.add('active');
            overlay.classList.add('active');

            // Open correct dropdown
            if (dropdownType === 'coffee') {
                coffeeDropdown.classList.add('active');
                currentDropdown = coffeeDropdown;
            } 
            else if (dropdownType === 'people') {
                peopleDropdown.classList.add('active');
                currentDropdown = peopleDropdown;
            }
            else if (dropdownType === 'news') { 
                newsDropdown.classList.add('active');
                currentDropdown = newsDropdown;
            }

            currentActiveLink = this;
        }
    });
});

// Close dropdown when clicking overlay
overlay.addEventListener('click', function() {
    closeDropdown();
});

function closeDropdown() {
    navLinks.forEach(l => l.classList.remove('active'));

    if (coffeeDropdown) coffeeDropdown.classList.remove('active');
    if (peopleDropdown) peopleDropdown.classList.remove('active');
    if (newsDropdown) newsDropdown.classList.remove('active'); 

    overlay.classList.remove('active');
    currentActiveLink = null;
    currentDropdown = null;
}

// Close on ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeDropdown();
    }
});
