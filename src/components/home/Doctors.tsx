'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Plus } from 'lucide-react';

const Doctors = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [itemsPerSlide, setItemsPerSlide] = useState(1);

  // Professional data with consistent structure
  const professionals = [
    {
      name: 'Dr. Jenny Doe',
      specialty: 'MBBS / Dip in Psychology',
      imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
      description: 'Specialized in mental health and behavioral therapy with over 10 years of experience'
    },
    {
      name: 'Dr. Michael Chen',
      specialty: 'MBBS / Dip in Cardiology',
      imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
      description: 'Expert in cardiovascular medicine and minimally invasive heart surgery'
    },
    {
      name: 'Dr. Sarah Johnson',
      specialty: 'MBBS / Dip in Neurology',
      imageUrl: 'https://images.unsplash.com/photo-1594824475050-7da46b84c6e8?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
      description: 'Leading neurologist specializing in brain disorders and stroke rehabilitation'
    },
    {
      name: 'Dr. Richard Smith',
      specialty: 'MBBS / Dip in Pediatrics',
      imageUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
      description: 'Dedicated pediatrician with 15+ years experience in child healthcare'
    },
    {
      name: 'Dr. Maria Rodriguez',
      specialty: 'MBBS / Dip in Orthopedics',
      imageUrl: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
      description: 'Orthopedic surgeon specializing in joint replacement and sports medicine'
    },
    {
      name: 'Dr. James Wilson',
      specialty: 'MBBS / Dip in Oncology',
      imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
      description: 'Oncologist focused on cancer treatment, immunotherapy and clinical research'
    },
    {
      name: 'Dr. Emily Zhang',
      specialty: 'MBBS / Dip in Dermatology',
      imageUrl: 'https://images.unsplash.com/photo-1594824475050-7da46b84c6e8?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
      description: 'Expert dermatologist specializing in skin cancer detection and cosmetic procedures'
    },
    {
      name: 'Dr. Robert Thompson',
      specialty: 'MBBS / Dip in Emergency Medicine',
      imageUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
      description: 'Emergency medicine specialist with expertise in trauma and critical care'
    },
    {
      name: 'Dr. Lisa Martinez',
      specialty: 'MBBS / Dip in Radiology',
      imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
      description: 'Diagnostic radiologist specializing in MRI, CT scans and medical imaging'
    },
    {
      name: 'Dr. David Kumar',
      specialty: 'MBBS / Dip in Gastroenterology',
      imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
      description: 'Gastroenterologist focused on digestive system disorders and endoscopy procedures'
    },
    {
      name: 'Dr. Amanda Foster',
      specialty: 'MBBS / Dip in Psychiatry',
      imageUrl: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
      description: 'Psychiatrist specializing in mood disorders, anxiety and cognitive behavioral therapy'
    },
    {
      name: 'Dr. Kevin O\'Brien',
      specialty: 'MBBS / Dip in Ophthalmology',
      imageUrl: 'https://images.unsplash.com/photo-1594824475050-7da46b84c6e8?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
      description: 'Eye specialist with expertise in cataract surgery and retinal disorders'
    },
    {
      name: 'Dr. Rachel Kim',
      specialty: 'MBBS / Dip in Endocrinology',
      imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
      description: 'Endocrinologist specializing in diabetes management and hormonal disorders'
    },
    {
      name: 'Dr. Marcus Johnson',
      specialty: 'MBBS / Dip in Urology',
      imageUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
      description: 'Urologist with expertise in kidney stones, prostate health and minimally invasive surgery'
    },
    {
      name: 'Dr. Sofia Patel',
      specialty: 'MBBS / Dip in Pulmonology',
      imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
      description: 'Lung specialist focusing on respiratory diseases, asthma and sleep disorders'
    }
  ];

  const totalSlides = Math.ceil(professionals.length / itemsPerSlide);

  // Function to calculate items per slide based on window width
  const calculateItemsPerSlide = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width >= 1536) return 5;
      if (width >= 1280) return 4;
      if (width >= 1024) return 3;
      if (width >= 640) return 2;
      return 1;
    }
    return 1; // Default for SSR
  };

  useEffect(() => {
    // Set initial items per slide
    const newItemsPerSlide = calculateItemsPerSlide();
    setItemsPerSlide(newItemsPerSlide);
    setIsVisible(true);

    // Handle window resize
    const handleResize = () => {
      const newItems = calculateItemsPerSlide();
      setItemsPerSlide(newItems);
      setCurrentSlide(0); // Reset to first slide on resize
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
    }

    // Auto-scroll carousel every 8 seconds
    const autoSlide = setInterval(() => {
      setCurrentSlide((prev) => {
        const slides = Math.ceil(professionals.length / newItemsPerSlide);
        return (prev + 1) % slides;
      });
    }, 8000);

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
      clearInterval(autoSlide);
    };
  }, [professionals.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 w-full py-8 px-4 sm:px-6 lg:px-8">
      {/* Outer Container */}
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-4 sm:p-6 lg:p-8 xl:p-12 shadow-2xl border border-white/30 w-full max-w-none mx-auto">
        
        {/* Inner Bento Container for Cards */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-white/20">

          {/* Header Section */}
          <div className={`text-center mb-8 lg:mb-12 transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <Plus className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-2xl sm:text-3xl font-bold text-blue-600">MedDeFi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-800 mb-2">
              Top <span className="text-blue-600">Professionals.</span>
            </h2>
            <div className="w-12 sm:w-16 h-0.5 bg-blue-400 mx-auto"></div>
          </div>

          {/* Carousel Container */}
          <div className="relative overflow-hidden">

            {/* Cards Container */}
            <div 
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
                    {professionals
                      .slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide)
                      .map((prof, index) => (
                        <div 
                          key={`${slideIndex}-${index}`}
                          className={`bg-white rounded-3xl shadow-lg p-4 sm:p-6 flex flex-col items-center text-center hover:shadow-xl transition-all duration-500 ease-out hover:-translate-y-2 group ${
                            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                          }`}
                          style={{ transitionDelay: `${index * 200}ms` }}
                        >
                          {/* Professional Image */}
                          <div className="relative mb-4 sm:mb-6 group-hover:scale-105 transition-transform duration-300">
                            <img
                              src={prof.imageUrl}
                              alt={prof.name}
                              className="w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full object-cover shadow-lg border-4 border-blue-100"
                              loading="lazy"
                            />
                            <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full border-2 sm:border-4 border-white flex items-center justify-center">
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                            </div>
                          </div>

                          {/* Professional Info */}
                          <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2">{prof.name}</h3>
                          <p className="text-blue-600 font-medium mb-2 sm:mb-3 text-xs sm:text-sm">{prof.specialty}</p>
                          <p className="text-slate-600 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed line-clamp-3">{prof.description}</p>

                          {/* Action Button */}
                          <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 sm:p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group/btn">
                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button 
              onClick={prevSlide}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 sm:p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:bg-white z-10 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentSlide === 0}
            >
              <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-slate-600" />
            </button>

            <button 
              onClick={nextSlide}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 sm:p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:bg-white z-10 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentSlide === totalSlides - 1}
            >
              <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-slate-600" />
            </button>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-6 sm:mt-8 space-x-2 sm:space-x-3">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-blue-600 scale-125' 
                    : 'bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Doctors; 