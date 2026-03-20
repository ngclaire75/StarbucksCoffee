'use client';

export default function ProductPage({ slug, onBack }) {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px' }}>
        {slug?.replace(/-/g, ' ')}
      </h1>
      <p style={{ color: '#666', marginBottom: '24px' }}>Product details coming soon.</p>
      <button
        onClick={onBack}
        style={{ padding: '12px 28px', borderRadius: '50px', border: '1.5px solid #000', background: 'none', fontWeight: '600', cursor: 'pointer' }}
      >
        Back to Menu
      </button>
    </div>
  );
}
