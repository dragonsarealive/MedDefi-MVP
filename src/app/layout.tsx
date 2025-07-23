import './globals.css';
import type { ReactNode } from 'react';
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { UserProvider } from '@/contexts/UserContext';
import HeaderWrapper from '@/components/home/HeaderWrapper';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: 'Your App Title',
  description: 'Your app description',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isSignup = typeof window !== 'undefined' && window.location.pathname === '/signup';
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} flex flex-col min-h-screen bg-gray-200`}>
        <UserProvider>
          {/* Only show header if not on /signup */}
          {!isSignup && <HeaderWrapper />}
          <main className="flex-grow">
            {children}
          </main>
        </UserProvider>
      </body>
    </html>
  );
}
