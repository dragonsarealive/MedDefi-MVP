'use client';

import { CardiologistIcon, transactions, appointments, MedDeFiLogo } from '@/components/ui/mainpage/Components'; 
import React, { useState } from 'react';
import { FaHome, FaChartBar, FaWallet, FaFileInvoice, FaUser, FaCog, FaMoon, FaQuestionCircle, FaHamburger, FaCar, FaMoneyCheckAlt, FaApple, FaPaperPlane, FaSave } from 'react-icons/fa';
import { DoctorRatingPopup } from '@/components/ui/DoctorRatingPopup';

export default function OldUserDashboard() {
  const [isRatingPopupOpen, setIsRatingPopupOpen] = useState(false);
  const [hasRated, setHasRated] = useState(false);
   
  const handleRatingSubmit = () => {
    setHasRated(true);
    setIsRatingPopupOpen(false);
  };

  return (
    <div className="h-[calc(100vh-2rem)] bg-gray-100 flex rounded-3xl overflow-hidden pr-8 pl-8 ">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col justify-between rounded-3xl">
        <div>
          <div className="p-6 flex items-center space-x-2">
           <MedDeFiLogo />
          </div>
          <nav className="mt-8">
            <ul className="space-y-2">
              <li className="bg-blue-50 rounded-lg p-2 font-semibold text-blue-700 flex items-center space-x-2">
                <span>🏠</span>
                <span>Dashboard</span>
              </li>
              <li className="p-2 flex items-center space-x-2 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer">
                <span>👨‍⚕️</span>
                <span>Top Doctors</span>
              </li>
              <li className="p-2 flex items-center space-x-2 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer">
                <span>🔍</span>
                <span>Search</span>
              </li>
              <li className="p-2 flex items-center space-x-2 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer">
                <span>📅</span>
                <span>Appointment</span>
                <span className="ml-auto bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">05</span>
              </li>
              <li className="p-2 flex items-center space-x-2 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer">
                <span>💬</span>
                <span>Messages</span>
              </li>
              <li className="p-2 flex items-center space-x-2 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer">
                <span>🩺</span>
                <span>My Health</span>
              </li>
            </ul>
          </nav>
        </div>
        <div className="mb-8 px-6">
          
          <ul className="space-y-1 text-gray-600">
            <li className="hover:underline cursor-pointer">Help & Settings</li>
            <li className="hover:underline cursor-pointer">About MedDeFi</li>
            <li className="hover:underline cursor-pointer">Privacy Policy</li>
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 flex flex-col gap-6 overflow-y-auto h-full rounded-3xl">
        

        {/* Banner */}
       
        <section className="bg-blue-600 rounded-xl flex items-center justify-between p-6">
          <div>
            {!hasRated ? (
              <>
                <h2 className="text-2xl font-bold text-white mb-2">You have a pending doctor rating</h2>
                <p className="text-white mb-4">Help us improve our service by rating your doctor</p>
                <button 
                  onClick={() => setIsRatingPopupOpen(true)}
                  className="bg-gray-100 text-zinc-900 px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Rate Now
                </button>
              </>
            ) : (
              <>
              <div className="flex flex-col fade-in duration-300 ">
                <h2 className="text-2xl font-bold text-white mb-2">Thank you for your feedback!</h2>
                <p className="text-white mb-4">Your rating helps us improve our services</p>
                
                </div>
              </>
            )}
          </div>
          <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
            {/* Placeholder for doctor image */}
            <img src="/images/2149152536.jpg" alt="Doctor" className="w-full h-full object-cover" />
          </div>
        </section>

        {/* Categories */}
        <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">   
            <span className="text-xl font-bold">Categories</span>
        </div>
        
        <section className="w-full overflow-x-auto h-28">
            <div className="flex gap-8 min-w-max px-4">
                <div className="bg-blue-100 text-blue-900 rounded-full w-16 h-16 flex flex-col items-center">
                    <CardiologistIcon />
                </div>
          <div className="bg-blue-100 text-blue-900 rounded-full w-16 h-16  flex flex-col items-center">
            <span className="text-4xl text-center mt-2">🦷</span>
            <span className="text-sm text-center mt-4">Dentist</span>
          </div>
          <div className="bg-blue-100 text-blue-900 rounded-full w-16 h-16  flex flex-col items-center">
            <span className="text-4xl text-center mt-2">👩‍⚕️</span>
            <span className="text-sm text-center mt-4">Dermatologist</span>
          </div>
          <div className="bg-blue-100 text-blue-900 rounded-full w-16 h-16  flex flex-col items-center">
            <span className="text-4xl text-center mt-2">👶🏼</span>
            <span className="text-sm text-center mt-4">Pediatrician</span>
          </div>
          <div className="bg-blue-100 text-blue-900 rounded-full w-16 h-16  flex flex-col items-center">
            <span className="text-4xl text-center mt-2">‍⚕️</span>
            <span className="text-sm text-center mt-4">General Physician</span>
          </div> <div className="bg-blue-100 text-blue-900 rounded-full w-16 h-16  flex flex-col items-center">
            <span className="text-4xl text-center mt-2">🧠</span>
            <span className="text-sm text-center mt-4">Neurologist</span>
          </div>
          <div className="bg-blue-100 text-blue-900 rounded-full w-16 h-16  flex flex-col items-center">
            <span className="text-4xl text-center mt-2">🦴</span>
            <span className="text-sm text-center mt-4">Orthopedic</span>
          </div>
          <div className="bg-blue-100 text-blue-900 rounded-full w-16 h-16  flex flex-col items-center">
            <span className="text-4xl text-center mt-2">👩</span>
            <span className="text-sm text-center mt-4">Gynecologist</span>
          </div>
          <div className="bg-blue-100 text-blue-900 rounded-full w-16 h-16  flex flex-col items-center">
            <span className="text-4xl text-center mt-2">🏥</span>
            <span className="text-sm text-center mt-4">Endocrinologist</span>
          </div>
          <div className="bg-blue-100 text-blue-900 rounded-full w-16 h-16  flex flex-col items-center">
            <span className="text-4xl text-center mt-2">👨‍⚕️</span>
            <span className="text-sm text-center mt-4">Plastic Surgeon</span>
          </div>
            </div>
        </section>
        </section>

          {/* Appointments Section */}
          <section>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="font-semibold mb-4">Appointments</div>
            <div className="flex gap-4 mb-4">
              <button className="text-blue-500 font-semibold border-b-2 border-blue-500 pb-1">Upcoming</button>
              <button className="text-gray-400 font-semibold pb-1">Past</button>
            </div>
            <ul className="divide-y">
              {appointments.map((apt: any, idx: any) => (
                <li key={idx} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 rounded-full p-2">{apt.icon}</div>
                    <div>
                      <div className="font-medium">{apt.name}</div>
                      <div className="text-xs text-gray-400">{apt.date}</div>
                    </div>
                    <span className={`ml-3 px-2 py-1 rounded text-xs font-semibold ${apt.color}`}>{apt.type}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">{apt.amount}</span>
                  
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="bg-blue-50 text-blue-500 px-3 py-1 rounded text-xs font-semibold">View Details</button>
                    <button className="bg-red-50 text-red-500 px-3 py-1 rounded text-xs font-semibold">Cancel</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          </section>
        
      </main>

      {/* Right Sidebar */}
      <aside className="w-[25rem] bg-white border-l p-6 flex flex-col gap-4 rounded-3xl overflow-y-auto justify-center">
       
       {/* Wallet Card */}  
       <div className="bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl shadow-lg p-6 text-white relative">
       <div className="flex items-center space-x-4 justify-between">
            <button className="relative">
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
              <span role="img" aria-label="bell">🔔</span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="font-semibold flex items-center gap-2">Jhalok Deb <span className="text-xs bg-gray-300 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center">JD</span></div>
            </div>
           
          </div>
            <div className="text-lg tracking-widest font-mono mb-2">1234 5678 9000 0000</div>
            
            
          </div>
       
        {/* Calendar */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">Calendar</span>
            <select className="border rounded px-2 py-1 text-xs">
              <option>2023</option>
              <option>2024</option>
              <option>2025</option>
              <option>2026</option>
              <option>2027</option>
              <option>2028</option>
              <option>2029</option>
              <option>2030</option>
            </select>
          </div>
          <div className="bg-gray-100 rounded-lg p-4">
            {/* Placeholder for calendar */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500">
              <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
              {/* Example days */}
              {Array.from({ length: 30 }, (_, i) => (
                <span key={i} className={i === 15 ? 'bg-blue-100 text-blue-700 rounded-full' : ''}>{i + 1}</span>
              ))}
            </div>
          </div>
        </section>
      
       {/* Available Appointment */}
       <section className="flex flex-col gap-4">
          <span className="font-semibold mb-2 block">Your Recent Doctors</span>
          <div className="bg-blue-100/50 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full" />
            <div>
              <div className="font-semibold">Dr. John Smith</div>
              <div className="text-xs text-gray-500">Neurologist</div>
              <div className="flex items-center text-xs text-yellow-500">
                <span>★ 4.9</span>
              </div>
              <div className="mt-2 bg-blue-400 text-white rounded-lg px-2 py-1 text-xs flex items-center gap-2">
                <span role="img" aria-label="calendar">📅</span>
                22 May 2025, 08:00 am
              </div>
            </div>
          </div>
          <div className="bg-blue-100/50 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full" />
            <div>
              <div className="font-semibold">Dr. Frank Heller</div>
              <div className="text-xs text-gray-500">Cardiologist</div>
              <div className="flex items-center text-xs text-yellow-500">
                <span>★ 4.9</span>
              </div>
              <div className="mt-2 bg-blue-400 text-white rounded-lg px-2 py-1 text-xs flex items-center gap-2">
                <span role="img" aria-label="calendar">📅</span>
                10 May 2025, 02:00 pm
              </div>
            </div>
          </div>
          
          <div className="bg-blue-100/50 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full" />
            <div>
              <div className="font-semibold">Dr. Maria Flores</div>
              <div className="text-xs text-gray-500">Dentist</div>
              <div className="flex items-center text-xs text-yellow-500">
                <span>★ 4.9</span>
              </div>
              <div className="mt-2 bg-blue-400 text-white rounded-lg px-2 py-1 text-xs flex items-center gap-2">
                <span role="img" aria-label="calendar">📅</span>
                8 May 2025, 08:00 am
              </div>
            </div>
          </div>
          
        </section>
      </aside>

      {/* Rating Popup */}
      <DoctorRatingPopup
        isOpen={isRatingPopupOpen}
        onClose={() => setIsRatingPopupOpen(false)}
        doctorName="Dr. John Smith"
        doctorImage="/images/2149152536.jpg"
        onSubmit={handleRatingSubmit}
      />
    </div>
  );
}
