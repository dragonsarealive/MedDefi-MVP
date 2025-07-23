import '../globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MedDeFi - User Dashboard',
  description: 'User Dashboard for MedDeFi Platform',
};

export default function OldUserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100 overflow-hidden h-screen flex items-center justify-center`}>
        {children}
      </body>
    </html>
  );
} 