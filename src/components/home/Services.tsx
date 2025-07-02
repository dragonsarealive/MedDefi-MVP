'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Heart, Baby, Shield, Activity, FlaskConical, Users } from 'lucide-react';

interface ServiceCardProps {
  number: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  isSpecial?: boolean;
  isImage?: boolean;
  imageUrl?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ number, title, description, icon, isSpecial, isImage, imageUrl }) => {
  const [circleStyles, setCircleStyles] = useState<React.CSSProperties[]>([]);

  useEffect(() => {
    if (isSpecial) {
      const newStyles = Array.from({ length: 5 }).map(() => ({
        width: `${Math.random() * 20 + 10}px`,
        height: `${Math.random() * 20 + 10}px`,
        bottom: `${Math.random() * 60}%`,
        left: `${Math.random() * 80}%`,
        animationDelay: `${Math.random() * 2}s`,
      }));
      setCircleStyles(newStyles);
    }
  }, [isSpecial]);

  if (isSpecial) {
    return (
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-2xl shadow-xl flex flex-col justify-between min-h-[316px] relative overflow-hidden">
        <div>
          <h3 className="text-4xl font-bold mb-2">{title}</h3>
          <p className="text-lg opacity-90">{description}</p>
        </div>
        <div className="mt-4 relative h-12">
          {circleStyles.map((styleProps, i) => (
            <div
              key={i}
              className="absolute bg-white/20 rounded-full animate-pulse"
              style={styleProps}
            />
          ))}
        </div>
      </div>
    );
  }

  if (isImage && imageUrl) {
    return (
      <div className="rounded-2xl shadow-xl overflow-hidden h-[316px] group relative">
        <Image 
          src={imageUrl} 
          alt={title} 
          fill
          className="object-cover transform transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col justify-between min-h-[316px] relative overflow-hidden hover:shadow-2xl transition-all duration-300 group">
      <div className="absolute -top-2 -left-2 text-slate-100 font-bold text-8xl opacity-60 select-none">
        {number}
      </div>
      <div className="relative z-10">
        <div className="flex items-center mb-3">
          <div className="text-blue-600 group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          <h3 className="ml-3 text-2xl font-semibold text-slate-800">{title}</h3>
        </div>
        <p className="text-lg text-slate-600 leading-relaxed">{description}</p>
      </div>
      <div className="flex justify-between items-center mt-auto relative z-10 pt-4">
        <button className="text-blue-600 hover:text-blue-700 text-lg font-medium hover:underline transition-colors duration-200">
          Book now
        </button>
      </div>
    </div>
  );
};

const Services = () => {
  const services = [
    { 
      number: '01', 
      title: 'Family Medicine', 
      description: 'Comprehensive medical care for adults and children - prevention, diagnostics, treatment.', 
      icon: <Heart className="w-5 h-5" />
    },
    { 
      isSpecial: true, 
      title: 'MedDeFi', 
      description: 'From consultation and diagnosis to treatment with care and attention to detail.',
      number: ''
    },
    { 
      number: '02', 
      title: 'Pediatrics', 
      description: 'Caring for children\'s health from the first days of life: check-ups, vaccinations, treatment.', 
      icon: <Baby className="w-5 h-5" />
    },
    { 
      number: '03', 
      title: 'Women\'s Health', 
      description: 'Gynecological care, family planning, hormonal health, and preventive examinations.', 
      icon: <Shield className="w-5 h-5" />
    },
    { 
      number: '04', 
      title: 'Cardiology', 
      description: 'Diagnosis and treatment of cardiovascular diseases, ECG, cardiac ultrasound, Holter.', 
      icon: <Activity className="w-5 h-5" />
    },
    { 
      number: '05', 
      title: 'Ultrasound & Lab', 
      description: 'Fast and accurate tests, modern laboratory diagnostics and ultrasound of various organs.', 
      icon: <FlaskConical className="w-5 h-5" />
    },
    { 
      isImage: true, 
      imageUrl: '/images/2148884880.jpg',
      title: 'Medical Team',
      number: '',
      description: ''
    },
  ];

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Bento Box Container */}
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-white/30 w-full max-w-none mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-8 lg:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 mb-4">
            Connect with your Doctor
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
            We provide the facilitation of medical tourism by connecting you with the best doctors and hospitals.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {services.map((service, index) => (
            <div 
              key={index}
              className={`
                ${service.isImage ? 'sm:col-span-2 lg:col-span-2' : ''}
                ${service.isSpecial ? 'lg:col-span-1' : ''}
              `}
            >
              <ServiceCard
                number={service.number}
                title={service.title}
                description={service.description}
                icon={service.icon}
                isSpecial={service.isSpecial || false}
                isImage={service.isImage || false}
                imageUrl={service.imageUrl}
              />
            </div>
          ))}
        </div>

        {/* Bottom Action */}
        <div className="text-center mt-8 lg:mt-12">
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base hover:underline transition-colors duration-200">
            See all categories →
          </button>
        </div>

      </div>
    </div>
  );
};

export default Services; 