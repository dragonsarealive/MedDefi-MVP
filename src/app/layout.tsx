import './globals.css';
import type { ReactNode } from 'react';
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { UserProvider } from '@/contexts/UserContext';
import HeaderWrapper from '@/components/home/HeaderWrapper';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap', // Optimize font loading
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

// Enhanced metadata for SEO
export const metadata = {
  title: {
    default: 'MedDefi - Medical Tourism Platform',
    template: '%s | MedDefi'
  },
  description: 'Connect with top healthcare providers worldwide. MedDefi makes medical tourism seamless, transparent, and accessible with blockchain technology.',
  keywords: ['medical tourism', 'healthcare', 'blockchain', 'doctors', 'medical services', 'defi', 'health'],
  authors: [{ name: 'MedDefi Team' }],
  creator: 'MedDefi',
  publisher: 'MedDefi',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://meddefi.netlify.app',
    siteName: 'MedDefi',
    title: 'MedDefi - Medical Tourism Platform',
    description: 'Connect with top healthcare providers worldwide. Seamless, transparent, and accessible medical tourism.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MedDefi - Medical Tourism Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MedDefi - Medical Tourism Platform',
    description: 'Connect with top healthcare providers worldwide. Seamless, transparent, and accessible medical tourism.',
    images: ['/og-image.jpg'],
    creator: '@meddefi',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        {process.env.NEXT_PUBLIC_SUPABASE_URL && (
          <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_SUPABASE_URL} />
        )}
        {/* Preload critical resources */}
        <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body 
        className={`${inter.className} ${geistSans.variable} ${geistMono.variable} flex flex-col min-h-screen bg-gray-200`}
        suppressHydrationWarning={true}
      >
        <UserProvider>
          <HeaderWrapper />
          <main className="flex-grow" role="main">
            {children}
          </main>
          {/* Footer can be added here if needed */}
        </UserProvider>
        {/* Performance monitoring script can be added here */}
        {process.env.NODE_ENV === 'production' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Basic performance monitoring
                if ('performance' in window) {
                  window.addEventListener('load', function() {
                    setTimeout(function() {
                      const perfData = performance.getEntriesByType('navigation')[0];
                      console.log('Page Load Time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
                    }, 0);
                  });
                }
              `,
            }}
          />
        )}
      </body>
    </html>
  );
}
