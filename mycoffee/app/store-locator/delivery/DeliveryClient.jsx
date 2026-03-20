'use client';

const TEXT = 'Delivery is not available in this region.';

export default function DeliveryClient() {
  return (
    <>
      <style>{`
        @keyframes letterIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .del-letter {
          display: inline-block;
          animation: letterIn 0.5s cubic-bezier(0.22,1,0.36,1) both;
        }
      `}</style>
      <div style={{
        minHeight: '100vh',
        background: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
      }}>
        <p style={{
          fontFamily: "'Dancing Script', cursive",
          color: '#1e3932',
          fontSize: '3.2rem',
          fontWeight: 700,
          textAlign: 'center',
          margin: 0,
          lineHeight: 1.4,
        }}>
          {TEXT.split('').map((char, i) => (
            <span
              key={i}
              className="del-letter"
              style={{ animationDelay: `${i * 0.035}s` }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </p>
      </div>
    </>
  );
}
