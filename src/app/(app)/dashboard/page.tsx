"use client";

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  useEffect(() => {
    // Redirect to the main patient dashboard
    redirect('/patient');
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting to dashboard...</p>
    </div>
  );
}
