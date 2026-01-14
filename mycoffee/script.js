// ============================
// BY THE NUMBERS SLIDER LOGIC
// ============================

(function () {
    const track = document.querySelector('.numbers-track');
    const slides = Array.from(document.querySelectorAll('.numbers-slide'));
    const dots = Array.from(document.querySelectorAll('.dot'));
    const prev = document.getElementById('prevSlide');
    const next = document.getElementById('nextSlide');

    if (!track || slides.length === 0) return;

    let currentIndex = 0; // slide 0 = first slide

    // ---------------------------
    // UPDATE SLIDER POSITION
    // ---------------------------
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


    // ---------------------------
    // BUTTON CONTROLS
    // ---------------------------
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

    // ---------------------------
    // DOT CLICK CONTROLS
    // ---------------------------
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            goToSlide(i);
        });
    });

})();

document.addEventListener('DOMContentLoaded', function() {
    const pairingsCard = document.querySelector('.pairings-card');
    const pauseIcon = pairingsCard.querySelector('.pause-icon');
    const video = pairingsCard.querySelector('video');

    let isPaused = false;

    pauseIcon.addEventListener('click', () => {
        isPaused = !isPaused;
        if (isPaused) {
            video.pause();
            pauseIcon.textContent = '▶'; // Play icon
        } else {
            video.play();
            pauseIcon.textContent = '||'; // Pause icon
        }
    });

    // Hover effect for pause icon
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