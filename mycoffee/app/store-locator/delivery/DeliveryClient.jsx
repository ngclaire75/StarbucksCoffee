'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function DeliveryClient() {
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#fff',
      padding: '40px 24px',
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1100px',
        borderRadius: '4px',
        overflow: 'hidden',
        boxShadow: '0 8px 40px rgba(0,0,0,0.13)',
      }}>
        <img
          src="/images/deliveries.png"
          alt="Delivery is not available in this region"
          style={{ width: '100%', display: 'block' }}
        />

        {/* Go Back — bottom left corner */}
        <Link
          href="/store-locator?tab=Delivery"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            position: 'absolute',
            bottom: '32px',
            left: '32px',
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
          ← Go Back
        </Link>
      </div>
    </div>
  );
}
