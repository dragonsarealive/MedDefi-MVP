import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: 'screen', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f8f8' }}>
      <div style={{ width: '100%', maxWidth: '100%'}}>
        {children}
      </div>
    </div>
  );
} 