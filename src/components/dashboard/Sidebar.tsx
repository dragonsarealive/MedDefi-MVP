import Link from 'next/link';
import Image from 'next/image';
import { Home, Users, Search, Calendar, MessageCircle, HeartPulse, HelpCircle, Info, Shield } from 'lucide-react';


const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: <Home size={20} /> },
  { href: '/dashboard/top-doctors', label: 'Top Doctors', icon: <Users size={20} /> },
  { href: '/dashboard/search', label: 'Search', icon: <Search size={20} /> },
  { href: '/dashboard/appointments', label: 'Appointments', icon: <Calendar size={20} />, badge: true },
  { href: '/dashboard/messages', label: 'Messages', icon: <MessageCircle size={20} /> },
  { href: '/dashboard/my-health', label: 'My Health', icon: <HeartPulse size={20} /> },
];

const helpLinks = [
  { href: '/dashboard/help-settings/about-meddefi', label: 'About MedDeFi', icon: <Info size={18} /> },
  { href: '/dashboard/help-settings/privacy-policy', label: 'Privacy Policy', icon: <Shield size={18} /> },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r flex flex-col justify-between min-h-screen py-8 px-4">
      <div>
        <div className="mb-8 flex flex-row items-center justify-center gap-2">
          <Image src="/MedDeFi logo.svg" alt="MedDeFi Logo" width={32} height={32} />
          <span className="font-bold text-xl text-blue-600">MedDeFi</span>
        </div>
        <nav className="flex flex-col gap-1">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 font-medium group">
              <span className="text-blue-600">{link.icon}</span>
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
          <Link key={link.href} href={link.href} className="flex items-center gap-2 px-0 py-2 rounded-lg text-gray-600 hover:bg-blue-50 text-sm w-full">
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
} 