'use client';

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const MedDeFiLogo = () => (
  <div className="flex items-center space-x-2">
    <Image 
      src="/MedDeFi logo.svg" 
      alt="MedDeFi Logo" 
      width={32} 
      height={32}
      className="w-8 h-8"
    />
    <span className="font-bold text-xl text-blue-600">MedDeFi</span>
  </div>
);

const SignUpButton = () => (
  <button className="hidden md:flex items-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-full transition-colors">
    <UserIcon />
    Sign Up
  </button>
);

const LogInButton = () => {
  const router = useRouter();
  return (
    <button
      className="hidden md:flex items-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-full transition-colors"
      onClick={() => router.push('/dashboard')}
    >
      <UserIcon />
      Log In
    </button>
  );
};

const Header = () => {
  const navItems = ['About us', 'Services', 'Doctors', 'Contact'];

  return (
    <header className="bg-white shadow-md py-3 px-4 md:px-6 lg:px-8 rounded-3xl sticky top-4 z-50 ml-12 mr-12">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left Section: Logo and Nav */}
        <div className="flex items-center space-x-8">
          <MedDeFiLogo />
          <nav className="hidden md:flex items-center space-x-3 lg:space-x-5">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="px-3 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>

        {/* Right Section: CTA and Icons */}
        <div className="flex items-center space-x-4">
          <SignUpButton />
          <LogInButton />
          {/* Hamburger Menu for Mobile */}
          <div className="md:hidden flex items-center">
            <button className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 ml-2">
              <MenuIcon />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 