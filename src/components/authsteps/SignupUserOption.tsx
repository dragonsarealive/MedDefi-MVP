"use client";
import Image from "next/image";
import Link from "next/link";

const MedDeFiLogo = () => (
  <div className="flex items-center space-x-2">
    <Image 
      src="/MedDeFi logo.svg" 
      alt="MedDeFi Logo" 
      width={32} 
      height={32}
      className="w-8 h-8"
    />
    <span className="font-bold text-xl text-blue-600">MedDeFi</span>
  </div>
);


export default function SignupUserOption() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-blue-50">
      <div className="flex flex-row min-h-[80vh] w-4/5 bg-gray-100 rounded-3xl shadow-xl overflow-hidden">
        <div className="flex flex-col items-cemter justify-center px-12 py-16 bg-white w-full max-w-lg min-w-[350px]">
        <div className="mb-8 flex items-center">
          <MedDeFiLogo />
          
        </div>
        <div className="w-full max-w-md">
          <div className="flex justify-end text-sm mb-8">
            <span className="text-gray-500">Already have an account?</span>
            <Link href="/login" className="ml-2 text-blue-600 font-medium hover:underline">Sign In</Link>
          </div>
          <h1 className="text-3xl font-bold mb-2">Join Us!</h1>
          <p className="text-gray-500 mb-8">To begin this journey, tell us what type of account you'd be opening.</p>
          <div className="space-y-6">
            <Link href="/signup?type=individual" className="block border-2 border-gray-200 hover:border-blue-600 rounded-xl p-6 flex items-center gap-4 hover:shadow-lg transition group">
              <div className="bg-blue-100 text-blue-600 rounded-full p-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-lg text-blue-900">Patient</div>
                <div className="text-gray-500 text-sm">Patient account to manage all your medical activities.</div>
              </div>
              <svg className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </Link>
            <Link href="/signup?type=business" className="block border-2 border-gray-200 hover:border-blue-600 rounded-xl p-6 flex items-center gap-4 hover:shadow-lg transition group">
              <div className="bg-gray-100 text-blue-600 rounded-full p-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v4a1 1 0 001 1h3m10-5v4a1 1 0 01-1 1h-3m-4 0V5a1 1 0 011-1h4a1 1 0 011 1v6m-6 4h6" /></svg>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-lg text-blue-900">Doctor</div>
                <div className="text-gray-500 text-sm">For doctors and medical professionals.</div>
              </div>
            </Link>
            <Link href="/signup?type=business" className="block border-2 border-gray-200 hover:border-blue-600 rounded-xl p-6 flex items-center gap-4 hover:shadow-lg transition group">
              <div className="bg-gray-100 text-blue-600 rounded-full p-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v4a1 1 0 001 1h3m10-5v4a1 1 0 01-1 1h-3m-4 0V5a1 1 0 011-1h4a1 1 0 011 1v6m-6 4h6" /></svg>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-lg text-blue-900">Business</div>
                <div className="text-gray-500 text-sm">For large medical organizations and institutions.</div>
              </div>
            </Link>
          </div>
        </div>
        
      </div>
      {/* Right: Testimonial & Stats */}
      {/* Left Side: Branding & Quote */}
      <div className="flex-1 flex flex-col justify-center items-center relative p-12">
       
        <div className="flex-1 flex flex-col justify-center items-start mt-16">
          <div className="mb-8">
            
            <p className="text-lg leading-relaxed font-light text-blue-600 opacity-100">
              By joining <span className="font-semibold"> MedDeFi </span>, you'll be part of a community that is dedicated to improving healthcare access and outcomes.
            </p>
            <div className="mt-6 font-semibold text-blue-600 flex items-center gap-2">
              MedDeFi
            </div>
          </div>
        </div>
        <div className="absolute inset-0 z-0">
          <Image src="/images/2148984296.jpg" 
          alt="MedDeFi background" 
          fill style={{objectFit:'cover',objectPosition:'right'}} />
        </div>
      </div>
    </div>
    </div>
    
    
  );
}
