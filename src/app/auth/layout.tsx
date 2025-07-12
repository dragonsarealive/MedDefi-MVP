import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#10141a' }}>
      <div style={{ width: '100%', maxWidth: 600, padding: 24, background: '#1a2230', borderRadius: 12, boxShadow: '0 4px 32px rgba(0,0,0,0.12)' }}>
        {children}
      </div>
    </div>
  );
} 