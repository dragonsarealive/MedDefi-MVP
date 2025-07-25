'use client';

import { FiMenu, FiPhone, FiUser } from 'react-icons/fi';
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { SignUpForm } from "@/components/onboarding/SignUpForm";
import { useUser } from "@/contexts/UserContext";
import { LogOut, User, UserCheck, Database } from "lucide-react";

const NavBarbig = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isIntegrationDemo = pathname === '/integration-demo';
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
  const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
  const NavButton = ({ onClick }: { onClick: () => void }) => (
    <button 
      onClick={onClick}
      className="hidden md:flex items-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-full transition-colors"
    >
      <UserIcon />
     
    </button>
  );

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between rounded-3xl m-4 px-4 md:p-4 md:px-8">
      {/* Left Section - Logo and Desktop Navigation */}
      <div className="flex items-center space-x-4">
        <MedDeFiLogo/>

        {/* Desktop Navigation Links (hidden on mobile) */}
        <div className="hidden md:flex items-center space-x-8 ml-8">
          <ul className="flex space-x-8 text-gray-800">
            <li><a href="#" className="px-4 py-2 rounded-full text-gray-800 hover:bg-gray-100 transition-colors duration-200">About us</a></li>
            <li><a href="#" className="px-4 py-2 rounded-full text-gray-800 hover:bg-gray-100 transition-colors duration-200">Services</a></li>
            <li><a href="#" className="px-4 py-2 rounded-full text-gray-800 hover:bg-gray-100 transition-colors duration-200">Doctors</a></li>
            <li><a href="#" className="px-4 py-2 rounded-full text-gray-800 hover:bg-gray-100 transition-colors duration-200">Contact</a></li>
          </ul>
          
          {/* Status Indicators - Only show on integration demo page */}
          {isIntegrationDemo && (
            <div className="flex items-center gap-3 ml-4">
              {/* API Status Indicator */}
              <div className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs border border-green-200">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="font-medium">API Ready</span>
              </div>

              {/* Database Status Indicator */}
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs border border-blue-200">
                <Database className="w-3 h-3" />
                <span className="font-medium">DB Connected</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Section - Mobile Phone, Mobile Hamburger, Desktop Login */}
      <div className="flex items-center space-x-4 pr-4">
        {/* Mobile Hamburger Icon */}
        <button onClick={() => setIsOpen(!isOpen)} className="p-3 bg-white rounded-full text-gray-800 hover:bg-gray-100 transition-colors duration-200 md:hidden">
            <FiMenu className="h-4 w-4" />
          </button>
          {/* Desktop Login Button */}
          <NavButton onClick={() => router.push('/auth')} />
      </div>
      
      {/* Mobile Nav Links Overlay */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg rounded-b-lg p-4">
          <ul className="flex flex-col space-y-2 text-gray-800">
            <li><a href="#" className="px-4 py-2 rounded-full hover:bg-gray-100 transition-colors duration-200">About us</a></li>
            <li><a href="#" className="px-4 py-2 rounded-full hover:bg-gray-100 transition-colors duration-200">Services</a></li>
            <li><a href="#" className="px-4 py-2 rounded-full hover:bg-gray-100 transition-colors duration-200">Doctors</a></li>
            <li><a href="#" className="px-4 py-2 rounded-full hover:bg-gray-100 transition-colors duration-200">Contact</a></li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default NavBarbig; 