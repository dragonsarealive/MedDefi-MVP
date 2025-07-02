import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import HeaderWrapper from '@/components/home/HeaderWrapper';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MedDeFi',
  description: 'Decentralized Medical Platform for Healthcare across Borders',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const isDashboard = pathname.startsWith('/dashboard');

  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} flex flex-col min-h-screen bg-gray-200`}>
        <HeaderWrapper />
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
} 