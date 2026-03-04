'use client';

import { useState, useEffect } from 'react';
import './toploadingbar.css';

export default function TopLoadingBar() {
  const [active, setActive] = useState(true);
  const [phase, setPhase] = useState('enter'); // 'enter' | 'exit' | 'done'

  useEffect(() => {
    // Slide in
    const enterTimer = setTimeout(() => {
      setPhase('exit');
    }, 1000); // duration of slide-in

    // Slide out after enter completes
    const exitTimer = setTimeout(() => {
      setPhase('done');
    }, 1400); // 1000ms enter + 400ms exit

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
    };
  }, []);

  if (phase === 'done') return null;

  return (
    <div className={`top-loading-bar ${phase}`} />
  );
}