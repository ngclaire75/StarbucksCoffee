// HeroParallax.jsx
'use client';

import { useEffect, useRef } from 'react';

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export default function HeroParallax({ children }) {
  const heroRef = useRef(null);
  const imagesRef = useRef([]);

  useEffect(() => {
    const heroSection = heroRef.current;
    const heroImages = imagesRef.current.filter(Boolean);

    if (!heroSection || heroImages.length === 0) return;

    const state = heroImages.map(() => ({
      x: 0, y: 0, rx: 0, ry: 0, tx: 0, ty: 0, trx: 0, try: 0
    }));

    const handleMouseMove = (e) => {
      const rect = heroSection.getBoundingClientRect();
      const normalizedX = (e.clientX - rect.left) / rect.width;
      const normalizedY = (e.clientY - rect.top) / rect.height;
      const mouseX = normalizedX * rect.width - rect.width / 2;
      const mouseY = normalizedY * rect.height - rect.height / 2;

      heroImages.forEach((img, index) => {
        const depth = (index + 1) * 0.03;
        state[index].tx = -mouseX * depth;
        const downBoost = 1 + normalizedY * 2;
        state[index].ty = -mouseY * depth * downBoost;
        state[index].trx = clamp(mouseY * depth * 0.08, -3, 3);
        state[index].try = clamp(-mouseX * depth * 0.08, -3, 3);
      });
    };

    heroSection.addEventListener('mousemove', handleMouseMove);

    let animFrameId;
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
      animFrameId = requestAnimationFrame(animate);
    }

    animate();

    const learnMoreBtn = heroSection.querySelector('.learn-more-btn');
    if (learnMoreBtn) {
      learnMoreBtn.innerHTML = `<span>${learnMoreBtn.textContent}</span>`;
    }

    return () => {
      heroSection.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  // Wrap children with a section and attach the heroRef
  return (
    <section ref={heroRef} className="hero-section">
      {children(imagesRef)}
    </section>
  );
}