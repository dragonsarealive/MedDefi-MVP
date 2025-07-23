import React, { type ReactNode } from 'react';
import { FaHamburger, FaCar, FaMoneyCheckAlt, FaUser, FaApple, FaUserMd, FaStethoscope, FaHeartbeat, FaTooth, FaBrain } from 'react-icons/fa';

// SVG Icons (simple placeholders)
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

const MedDeFiLogoType = () => (
  // Placeholder for a more complex logo, e.g. an <Image> component from Next.js
  // For now, a simple SVG circle with a plus sign
  <div className="flex items-center space-x-2">
    <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
    </svg>
    <span className="font-bold text-xl text-blue-600">MedDeFi</span>
  </div>
);
const WhiteMedDeFiLogoType = () => (
  // Placeholder for a more complex logo, e.g. an <Image> component from Next.js
  // For now, a simple SVG circle with a plus sign
  <div className="flex items-center space-x-2">
    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
    </svg>
    <span className="font-bold text-xl text-white">MedDeFi</span>
  </div>
);
const WhiteMedDeFiLogo = () => (
  // Placeholder for a more complex logo, e.g. an <Image> component from Next.js
  // For now, a simple SVG circle with a plus sign
  <div className="flex items-center space-x-2">
    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
    </svg>
  </div>
);

const DownloadAppButton = () => (
  <button className="hidden md:flex items-center bg-blue-600 hover:bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-full transition-colors">
    <DownloadIcon />
    Download App
  </button>
);
const PackageCard = () => (
    <div className="bg-yellow-200 text-yellow-900 rounded-lg p-4 flex-1 flex flex-col items-center">
    <span className="font-bold text-lg mb-2">$13.77 <span className="line-through text-xs text-yellow-500">$14.37</span></span>
    <span className="font-semibold">Magnetic Resonance Imaging</span>
  </div>
)
const PackageCard2 = () => (
    <div className="bg-red-200 text-red-900 rounded-lg p-4 flex-1 flex flex-col items-center">
    <span className="font-bold text-lg mb-2">$11.77 <span className="line-through text-xs text-red-500">$13.37</span></span>
    <span className="font-semibold">Clinic Visit Appointment</span>
  </div>
)
const CardiologistIcon = () => (
    <div className="bg-blue-100 text-blue-900 rounded-full w-16 h-16  flex flex-col items-center">
    <span className="text-4xl text-center mt-2">🫀</span>
    <span className="text-sm text-center mt-4">Cardiologist</span>
  </div>
)
const transactions = [
    {
      icon: <FaHamburger className="text-blue-400" />, name: 'Dunkin donuts', date: 'May 23, 2022 at 8:20 PM', type: 'Food', amount: '-$19.00', color: 'bg-pink-100 text-pink-600',
    },
    {
      icon: <FaCar className="text-blue-400" />, name: 'Uber', date: 'May 23, 2022 at 10:36 AM', type: 'Transport', amount: '-$7.00', color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: <FaMoneyCheckAlt className="text-green-400" />, name: 'Payment Salary', date: 'May 23, 2022 at 9:48 AM', type: 'Service', amount: '+$15,000', color: 'bg-green-100 text-green-600',
    },
    {
      icon: <FaUser className="text-green-400" />, name: 'Elon Musk', date: 'May 22, 2022 at 4:48 PM', type: 'Service', amount: '+$3,000', color: 'bg-green-100 text-green-600',
    },
    {
      icon: <FaApple className="text-orange-400" />, name: 'Apple', date: 'May 22, 2022 at 2:20 PM', type: 'Shop', amount: '-$99.00', color: 'bg-orange-100 text-orange-600',
    },
  ];
  const appointments = [
    {
      icon: <FaUserMd className="text-blue-400" />, name: 'Dr. Jhalok Deb', date: 'May 23, 2025 at 8:20 AM', type: 'Cardiologist', color: 'bg-pink-100 text-pink-600',
    },
    {
      icon: <FaStethoscope className="text-blue-400" />, name: 'Dr. Sarah Smith', date: 'May 25, 2025 at 10:30 AM', type: 'General Physician', color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: <FaHeartbeat className="text-green-400" />, name: 'Dr. Michael Brown', date: 'May 28, 2025 at 2:00 PM', type: 'Cardiologist', color: 'bg-green-100 text-green-600',
    },
    {
      icon: <FaTooth className="text-purple-400" />, name: 'Dr. Emily White', date: 'June 1, 2025 at 11:15 AM', type: 'Dentist', color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: <FaBrain className="text-orange-400" />, name: 'Dr. James Wilson', date: 'June 3, 2025 at 3:45 PM', type: 'Neurologist', color: 'bg-orange-100 text-orange-600',
    },
  ];

export {
  MenuIcon,
  PhoneIcon,
  BellIcon,
  UserIcon,
  DownloadIcon,
  MedDeFiLogoType,
  DownloadAppButton,
  PackageCard,
  PackageCard2,
  CardiologistIcon,
  transactions,
  appointments,
  WhiteMedDeFiLogoType,
  WhiteMedDeFiLogo
};