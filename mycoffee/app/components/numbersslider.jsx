'use client';

import { useState, useRef } from 'react';

export default function NumbersSlider({ children }) {
  const [current, setCurrent] = useState(0);
  const trackRef = useRef(null);
  const slidesRef = useRef([]);
  const total = children.length;

  function goToSlide(index) {
    setCurrent(index);
    const offset = slidesRef.current[index].offsetLeft;
    trackRef.current.style.transform = `translateX(-${offset}px)`;
  }

  function handleNext() {
    if (current < total - 1) goToSlide(current + 1);
  }

  function handlePrev() {
    if (current > 0) goToSlide(current - 1);
  }

  return (
    <div className="numbers-slider">
      <div className="numbers-track" ref={trackRef}>

        {children.map((child, index) => (
          <div
            key={index}
            className="numbers-slide"
            ref={el => slidesRef.current[index] = el}
          >
            {child}
          </div>
        ))}

      </div>

      <div className="numbers-footer">
        <div className="numbers-dots">
          {children.map((_, index) => (
            <div
              key={index}
              className={`dot ${current === index ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            ></div>
          ))}
        </div>

        <div className="numbers-controls">
          <div className="arrow left" onClick={handlePrev}>←</div>
          <div className="arrow right" onClick={handleNext}>→</div>
        </div>
      </div>
    </div>
  );
}