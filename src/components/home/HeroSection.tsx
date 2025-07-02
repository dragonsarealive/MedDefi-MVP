import React from 'react';
import Image from 'next/image';
import { User, ArrowRight, Shield, Globe, Zap, CreditCard } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="min-h-screen bg-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Bento Grid Container */}
        <div className="bg-white rounded-3xl p-6 shadow-2xl">
          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 min-h-[80vh]">
          
          {/* Main Hero Card - Takes up largest space */}
          <div className="md:col-span-2 lg:col-span-2 bg-blue-600 text-white rounded-3xl shadow-xl">
            <div className="p-8 h-full flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500 text-white text-sm mb-6">
                  <Globe className="w-4 h-4 mr-2" />
                  Cross-Border Healthcare
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                  MedDeFi
                </h1>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-blue-100 mb-6">
                  Across Borders
                </h2>
                
                <p className="text-lg text-blue-100 mb-8 max-w-md leading-relaxed">
                  Medical tourism has never been so easy. Make and receive payments across borders with no delays. No more risks of scams, no more hidden costs.
                </p>
                
                <button className="bg-white text-blue-600 hover:bg-blue-50 transition-colors duration-200 rounded-full px-8 py-4 text-lg font-semibold flex items-center shadow-lg">
                  <User className="w-5 h-5 mr-3" />
                  Sign Up Free
                  <ArrowRight className="w-5 h-5 ml-3" />
                </button>
              </div>
              
              <div className="flex items-center gap-4 mt-8">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-blue-400 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-blue-300 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-blue-200 rounded-full border-2 border-white"></div>
                </div>
                <span className="text-sm text-blue-100">Trusted by 10k+ patients</span>
              </div>
            </div>
          </div>

          {/* Hero Image Card */}
          <div className="md:col-span-1 lg:col-span-2 rounded-3xl shadow-xl overflow-hidden">
            <div className="h-full relative">
              <Image 
                src="/images/2148984296.jpg" 
                alt="Happy elderly couple embracing" 
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 right-6 opacity-0">
                <div className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                  8888
                </div>
              </div>
              <div className="absolute top-6 left-6">
                <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Secure Platform
                </div>
              </div>
            </div>
          </div>

          {/* Feature Cards Row */}
          <div className="bg-blue-500 text-white rounded-3xl shadow-lg">
            <div className="p-6 h-full flex flex-col justify-center items-center text-center">
              <Zap className="w-12 h-12 mb-4 text-blue-100" />
              <h3 className="text-xl font-semibold mb-2">Instant Payments</h3>
              <p className="text-blue-100 text-sm">No delays, no waiting</p>
            </div>
          </div>

          <div className="bg-blue-400 text-white rounded-3xl shadow-lg">
            <div className="p-6 h-full flex flex-col justify-center items-center text-center">
              <Shield className="w-12 h-12 mb-4 text-blue-100" />
              <h3 className="text-xl font-semibold mb-2">Cheaper Healthcare</h3>
              <p className="text-blue-100 text-sm">Affordable medicines</p>
            </div>
          </div>

          <div className="bg-blue-300 text-blue-900 rounded-3xl shadow-lg">
            <div className="p-6 h-full flex flex-col justify-center items-center text-center">
              <CreditCard className="w-12 h-12 mb-4 text-blue-700" />
              <h3 className="text-xl font-semibold mb-2">No Hidden Fees</h3>
              <p className="text-blue-700 text-sm">Transparent pricing</p>
            </div>
          </div>

          <div className="bg-white text-blue-600 rounded-3xl shadow-lg border border-blue-100">
            <div className="p-6 h-full flex flex-col justify-center items-center text-center">
              <Globe className="w-12 h-12 mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-2">Global Reach</h3>
              <p className="text-blue-500 text-sm">Worldwide coverage</p>
            </div>
          </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection; 