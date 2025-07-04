import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import HeaderWrapper from '@/components/home/HeaderWrapper';
import { UserProvider } from '@/contexts/UserContext';

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
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} flex flex-col min-h-screen bg-gray-200`}>
        <UserProvider>
          <HeaderWrapper />
          <main className="flex-grow">
            {children}
          </main>
        </UserProvider>
      </body>
    </html>
  );
} 