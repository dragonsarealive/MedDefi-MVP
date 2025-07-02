import { Calendar, User, Star, Stethoscope, Brain, Baby, HeartPulse, Users, Shield, Search, MessageCircle } from 'lucide-react';
import Image from 'next/image';

const specialties = [
  { label: 'Cardiology', icon: <HeartPulse className="w-5 h-5" /> },
  { label: 'Dentistry', icon: <Stethoscope className="w-5 h-5" /> },
  { label: 'Dermatology', icon: <Shield className="w-5 h-5" /> },
  { label: 'Pediatrics', icon: <Baby className="w-5 h-5" /> },
  { label: 'General', icon: <User className="w-5 h-5" /> },
  { label: 'Neurology', icon: <Brain className="w-5 h-5" /> },
  { label: 'Orthopedics', icon: <Users className="w-5 h-5" /> },
  { label: 'Gynecology', icon: <Stethoscope className="w-5 h-5" /> },
];

const appointments = [
  { name: 'Dr. John Smith', date: '22 May 2025, 08:00 am', type: 'Consultation', price: 50 },
  { name: 'Dr. Maria Garcia', date: '23 May 2025, 02:00 pm', type: 'Check-up', price: 75 },
  { name: 'Dr. Frank Heller', date: '24 May 2025, 10:00 am', type: 'Surgery', price: 200 },
];

const recentConsultations = [
  { initials: 'JS', name: 'Dr. John Smith', specialty: 'Neurologist', rating: 4.9, date: '22 May 2025, 08:00 am' },
  { initials: 'FH', name: 'Dr. Frank Heller', specialty: 'Cardiologist', rating: 4.8, date: '10 May 2025, 02:00 pm' },
  { initials: 'MF', name: 'Dr. Maria Flores', specialty: 'Dentist', rating: 4.7, date: '8 May 2025, 08:00 am' },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Pending Doctor Rating Notification */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl p-6 flex items-center justify-between shadow">
          <div>
            <div className="text-white text-lg font-semibold mb-1">You have a pending doctor rating</div>
            <div className="text-white text-sm mb-3">Help us improve our service by rating your recent consultation</div>
            <button className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-full shadow hover:bg-blue-50 transition">Rate Now</button>
          </div>
          <div className="hidden md:block">
            <Image src="/images/2149355015.jpg" alt="Doctors" width={64} height={64} className="rounded-full object-cover border-4 border-blue-200" />
          </div>
        </div>

        {/* Medical Specialties */}
        <div className="bg-white rounded-2xl p-6 shadow flex flex-col gap-4">
          <div className="text-lg font-semibold text-gray-800 mb-2">Medical Specialties</div>
          <div className="flex flex-wrap gap-3">
            {specialties.map((s, i) => (
              <button key={s.label} className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full font-medium shadow-sm">
                {s.icon}
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Appointments */}
        <div className="bg-white rounded-2xl p-6 shadow flex flex-col gap-4">
          <div className="text-lg font-semibold text-gray-800 mb-2">Your Appointments</div>
          <div className="flex gap-2 mb-4">
            <button className="px-4 py-1 rounded-full bg-blue-600 text-white font-medium">Upcoming</button>
            <button className="px-4 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">Past</button>
          </div>
          <div className="flex flex-col gap-3">
            {appointments.map((a, i) => (
              <div key={a.name} className="flex items-center justify-between bg-blue-50 rounded-xl px-4 py-3 shadow-sm">
                <div>
                  <div className="font-semibold text-blue-900">{a.name}</div>
                  <div className="text-xs text-gray-500">{a.date}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">{a.type}</span>
                  <span className="text-green-600 font-bold text-sm">${a.price}</span>
                  <button className="text-blue-600 hover:underline font-medium text-sm">View</button>
                  <button className="text-red-500 hover:underline font-medium text-sm">Cancel</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full lg:w-80 flex flex-col gap-6">
        {/* User Info Card */}
        <div className="bg-white rounded-2xl p-6 shadow flex items-center gap-4">
          <div className="flex-1">
            <div className="text-blue-700 font-bold">Jhalok Deb</div>
            <div className="text-xs text-gray-500">Patient ID: #MD2025</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">JD</div>
        </div>
        {/* Calendar */}
        <div className="bg-white rounded-2xl p-6 shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold text-gray-800">Calendar</div>
            <div className="text-xs text-gray-500">2024</div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-600">
            <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
            {/* Mock days */}
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className={`py-1 rounded-full ${i === 15 ? 'bg-blue-600 text-white font-bold' : ''}`}>{i+1}</div>
            ))}
          </div>
        </div>
        {/* Recent Consultations */}
        <div className="bg-white rounded-2xl p-6 shadow flex flex-col gap-4">
          <div className="font-semibold text-gray-800 mb-2">Recent Consultations</div>
          <div className="flex flex-col gap-3">
            {recentConsultations.map((c, i) => (
              <div key={c.name} className="flex items-center gap-3 bg-blue-50 rounded-xl p-3">
                <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center font-bold text-blue-700 text-lg">{c.initials}</div>
                <div className="flex-1">
                  <div className="font-semibold text-blue-900 text-sm">{c.name}</div>
                  <div className="text-xs text-gray-500">{c.specialty}</div>
                  <div className="flex items-center gap-1 text-xs text-yellow-500">
                    <Star className="w-3 h-3" />
                    <span>{c.rating}</span>
                  </div>
                  <div className="text-xs text-blue-600 font-medium mt-1">{c.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 