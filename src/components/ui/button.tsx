

import React, { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { FiArrowRight } from 'react-icons/fi';

// Define the specific literal types for variant and size
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary', // Default variant
  size = 'md',         // Default size
  children,
  className = '',
  ...props
}): React.ReactElement => {
  const baseStyle = 'font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md transition-colors duration-150 ease-in-out';

  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400',
    outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
    ghost: 'hover:bg-gray-100 text-gray-800 focus:ring-gray-400',
    link: 'text-blue-600 hover:text-blue-700 hover:underline focus:ring-blue-500',
  };

  const sizes: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  // Construct className string carefully
  const classNames = [
    baseStyle,
    variants[variant], // variant is guaranteed to be a ButtonVariant due to default
    sizes[size],       // size is guaranteed to be a ButtonSize due to default
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      className={classNames}
      {...props}
    >
      {children}
    </button>
  );
};

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z" />
  </svg>
);

const BellIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

const MedDeFilogo = () => (
  // Placeholder for a more complex logo, e.g. an <Image> component from Next.js
  // For now, a simple SVG circle with a plus sign
  <div className="flex items-center space-x-2">
    <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
    </svg>
    <span className="font-bold text-xl text-blue-600">MedDeFi</span>
  </div>
);

const DownloadAppButton = () => (
  <button className="hidden md:flex items-center bg-blue-600 hover:bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-full transition-colors">
    <DownloadIcon />
    Download App
  </button>
);

const SignUpButton = () => (
  <button className="hidden md:flex items-center bg-blue-600 hover:bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-full transition-colors">
    <UserIcon />
    Sign Up
  </button>
);

const LogInButton = () => (
  <button className="hidden md:flex items-center bg-blue-600 hover:bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-full transition-colors">
    <UserIcon />
    Log In
  </button>
);

const SignUpFreeButton = () => (
  <button className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold py-3 px-1 rounded-3xl shadow-md hover:shadow-lg transition duration-300 ease-in-out flex items-center justify-center">
    <UserIcon />
    Sign Up Free
  </button>
);

const JoinwithWalletButton = () => (
  <button className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold py-3 px-1 rounded-3xl shadow-md hover:shadow-lg transition duration-300 ease-in-out flex items-center justify-center">
    <UserIcon />
    Join with Wallet
  </button>
);

const SimpleSignUp = () => (
  <button className="w-4/5 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold mt-8 py-3 px-12 rounded-3xl shadow-md hover:shadow-lg transition duration-300 ease-in-out flex items-center justify-center group">
    Sign Up Free <FiArrowRight className="ml-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
  </button>
);

export default Button;