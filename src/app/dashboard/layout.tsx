import Sidebar from '@/components/dashboard/Sidebar';
import { Calendar, User, Star, Stethoscope, Brain, Baby, HeartPulse, Users, Shield, Search, MessageCircle } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
} 