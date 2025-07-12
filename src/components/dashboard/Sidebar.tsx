'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { Home, Users, Search, Calendar, MessageCircle, HeartPulse, HelpCircle, Info, Shield, UserCheck, Stethoscope, BarChart2, Receipt } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  
  // Determine the base route based on current pathname
  const isDoctorRoute = pathname.startsWith('/doctor');
  const isPatientRoute = pathname.startsWith('/patient');
  const baseRoute = isDoctorRoute ? '/doctor' : isPatientRoute ? '/patient' : '/dashboard';

  const navLinks = [
    { href: baseRoute, label: 'Dashboard', icon: <Home size={20} /> },
    { href: `${baseRoute}/top-doctors`, label: 'Top Doctors', icon: <Users size={20} /> },
    { href: `${baseRoute}/search`, label: 'Search', icon: <Search size={20} /> },
    { href: `${baseRoute}/appointments`, label: 'Appointments', icon: <Calendar size={20} />, badge: true },
    { href: `${baseRoute}/messages`, label: 'Messages', icon: <MessageCircle size={20} /> },
    { href: `${baseRoute}/my-health`, label: 'My Health', icon: <HeartPulse size={20} /> },
  ];

  // Add role-specific links
  if (isDoctorRoute) {
    navLinks.push(
      { href: `${baseRoute}/my-patients`, label: 'My Patients', icon: <Users size={20} /> },
      { href: `${baseRoute}/schedule`, label: 'Schedule', icon: <Calendar size={20} /> },
      { href: `${baseRoute}/my-ratings`, label: 'My Ratings', icon: <UserCheck size={20} /> },
      { href: `${baseRoute}/analytics`, label: 'Analytics', icon: <BarChart2 size={20} /> },
      { href: `${baseRoute}/invoices`, label: 'Invoices', icon: <Receipt size={20} /> }
    );
  }
  if (isPatientRoute) {
    navLinks.push(
      { href: `${baseRoute}/analytics`, label: 'Analytics', icon: <BarChart2 size={20} /> },
      { href: `${baseRoute}/invoices`, label: 'Invoices', icon: <Receipt size={20} /> }
    );
  }

  const helpLinks = [
    { href: `${baseRoute}/help-settings/about-meddefi`, label: 'About MedDeFi', icon: <Info size={18} /> },
    { href: `${baseRoute}/help-settings/privacy-policy`, label: 'Privacy Policy', icon: <Shield size={18} /> },
  ];

  return (
    <aside className="w-64 bg-white border-r flex flex-col justify-between min-h-screen py-8 px-4">
      <div>
        <div className="mb-8 flex flex-row items-center justify-center gap-2">
          <Image src="/MedDeFi logo.svg" alt="MedDeFi Logo" width={32} height={32} />
          <span className="font-bold text-xl text-blue-600">MedDeFi</span>
        </div>
        <nav className="flex flex-col gap-1">
          {navLinks.map(link => (
            <Link 
              key={link.href} 
              href={link.href} 
              className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium group transition-colors ${
                pathname === link.href 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:bg-blue-50'
              }`}
            >
              <span className={pathname === link.href ? 'text-blue-600' : 'text-gray-500'}>{link.icon}</span>
              <span>{link.label}</span>
              {link.badge && (
                <span className="ml-auto bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">05</span>
              )}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex flex-col gap-1 mt-8 items-start">
        <span className="text-xs text-gray-400 px-0 mb-1">Help & Settings</span>
        {helpLinks.map(link => (
          <Link 
            key={link.href} 
            href={link.href} 
            className={`flex items-center gap-2 px-0 py-2 rounded-lg text-sm w-full transition-colors ${
              pathname === link.href 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:bg-blue-50'
            }`}
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
} 