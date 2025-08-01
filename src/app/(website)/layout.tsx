import type { ReactNode } from 'react';
import { Geist, Geist_Mono } from "next/font/google";
import NavBarBig from "@/components/layout/NavBarbig";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'Your App Title',
  description: 'Your app description',
};

export default function WebsiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavBarBig />
      <div className={`${geistSans.variable} ${geistMono.variable} justify-center items-center antialiased outer-scroll hide-scrollbar overflow-y-auto w-full h-full`}>
        {children}
      </div>
    </>
  );
}
