'use client';

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
          backgroundImage: 'url(https://images.unsplash.com/photo-1511920170033-f8396924c348?w=900&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '480px',
        }} />

        {/* Right — message */}
        <div style={{
          flex: 1,
          background: '#3b2a1a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 52px',
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
        </div>
      </div>
    </div>
  );
}
