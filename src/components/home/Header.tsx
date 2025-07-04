'use client';

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { useUser } from "@/contexts/UserContext";
import { LogOut, User, UserCheck } from "lucide-react";

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

const SignUpButton = ({ onClick }: { onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="hidden md:flex items-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-full transition-colors"
  >
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

const UserProfileButton = ({ user, onLogout }: { user: any; onLogout: () => void }) => {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.user-profile-dropdown')) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div className="relative user-profile-dropdown">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-full transition-colors"
      >
        {user.role === 'doctor' ? (
          <UserCheck className="w-5 h-5" />
        ) : (
          <User className="w-5 h-5" />
        )}
        {user.firstName}
      </button>
      
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
            <div className="text-xs text-gray-500">{user.email}</div>
            <div className="text-xs text-blue-600 font-medium mt-1">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </div>
          </div>
          <button
            onClick={() => {
              router.push('/dashboard');
              setShowDropdown(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Dashboard
          </button>
          <button
            onClick={() => {
              onLogout();
              setShowDropdown(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

const Header = () => {
  const navItems = ['About us', 'Services', 'Doctors', 'Contact'];
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const { user, setUser } = useUser();

  const handleLogout = () => {
    setUser(null);
    // Redirect to home page
    window.location.href = '/';
  };

  return (
    <>
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
            {user ? (
              <UserProfileButton user={user} onLogout={handleLogout} />
            ) : (
              <>
                <SignUpButton onClick={() => setIsSignUpOpen(true)} />
                <LogInButton />
              </>
            )}
            {/* Hamburger Menu for Mobile */}
            <div className="md:hidden flex items-center">
              <button className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 ml-2">
                <MenuIcon />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sign Up Modal */}
      <SignUpForm 
        isOpen={isSignUpOpen} 
        onClose={() => setIsSignUpOpen(false)} 
      />
    </>
  );
};

export default Header; 