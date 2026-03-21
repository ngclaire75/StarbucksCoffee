'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function DeliveryClient() {
  const [hovered, setHovered] = useState(false);
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
    }}>
      <div style={{
        display: 'flex',
        width: '100%',
        height: '100%',
      }}>
        {/* Left — photo */}
        <div style={{
          flex: '0 0 48%',
          backgroundImage: 'url(/images/deliveries.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }} />

        {/* Right — message */}
        <div style={{
          flex: 1,
          background: '#443428',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '60px 52px',
          gap: '36px',
        }}>
          <p style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: 'clamp(2.4rem, 5vw, 4rem)',
            fontWeight: 700,
            color: '#ffffff',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            lineHeight: 1.15,
            margin: 0,
            textAlign: 'left',
          }}>
            Delivery is<br />not<br />available in<br />this region.
          </p>
          <Link
            href="/store-locator?tab=Delivery"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '28px',
              background: hovered ? 'rgba(255,255,255,0.18)' : 'transparent',
              border: '1.5px solid rgba(255,255,255,0.6)',
              borderRadius: '100px',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '12px 28px',
              textDecoration: 'none',
              transition: 'background 0.2s ease',
            }}
          >
            Go Back
          </Link>
        </div>
      </div>
    </div>
  );
}
