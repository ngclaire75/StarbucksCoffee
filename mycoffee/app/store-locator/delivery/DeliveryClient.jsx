'use client';

import Link from 'next/link';

export default function DeliveryClient() {
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
        display: 'flex',
        width: '100%',
        maxWidth: '1100px',
        borderRadius: '4px',
        overflow: 'hidden',
        boxShadow: '0 8px 40px rgba(0,0,0,0.13)',
      }}>
        {/* Left — photo */}
        <div style={{
          flex: '0 0 48%',
          backgroundImage: 'url(/images/deliveries.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '480px',
        }} />

        {/* Right — message */}
        <div style={{
          flex: 1,
          background: '#5c3d20',
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
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '16px',
              background: 'transparent',
              border: '1.5px solid rgba(255,255,255,0.6)',
              borderRadius: '100px',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '12px 28px',
              textDecoration: 'none',
            }}
          >
            ← Go Back
          </Link>
        </div>
      </div>
    </div>
  );
}
