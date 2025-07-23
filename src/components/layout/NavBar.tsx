'use client';

import React, { useState } from 'react';
import { FiMenu, FiPhone, FiUser } from 'react-icons/fi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const MedDeFiLogoType = () => (
    <div className="flex items-center space-x-2">
      <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
      </svg>
      <span className="font-semibold text-xl text-blue-600">MedDeFi</span>
    </div>
  );

  return (
    <nav className="absolute top-4 lg:top-8 left-0 lg:left-8 right-0 z-50 flex items-center justify-between rounded-3xl m-4 px-4 md:px-0">
      {/* Left Section - Logo and Desktop Navigation */}
      <div className="flex items-center space-x-4">
        <MedDeFiLogoType/>

        {/* Desktop Navigation Links (hidden on mobile) */}
        <div className="hidden md:flex items-center space-x-8 ml-8">
          
        </div>
      </div>

      {/* Right Section - Mobile Phone, Mobile Hamburger, Desktop Login */}
      <div className="flex items-center space-x-4 pr-4">
      
      </div>
    </nav>
  );
};

export default Navbar; 