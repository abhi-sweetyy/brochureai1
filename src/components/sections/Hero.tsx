import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="pt-28 md:pt-32 pb-16 md:pb-24 px-4 relative z-10 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Text content */}
          <div className="w-full lg:w-1/2 mb-16 lg:mb-0 lg:pr-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              <span data-aos="fade-right" data-aos-delay="150" className="inline-block">Professional</span>{" "}
              <span data-aos="fade-right" data-aos-delay="300" className="inline-block text-blue-500">Real Estate</span>{" "}
              <span data-aos="fade-right" data-aos-delay="450" className="inline-block">Brochures</span>
            </h1>
            <p data-aos="fade-right" data-aos-delay="600" className="text-lg sm:text-xl text-gray-300 mb-8">
              Create elegant, print-ready property presentations in minutes with our AI-powered template system. No design skills required.
            </p>
            
            {/* CTA buttons */}
            <div data-aos="fade-up" data-aos-delay="750" className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4">
              <a href="/dashboard" className="group relative inline-flex w-full sm:w-auto justify-center items-center overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 py-4 px-8 transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg focus:outline-none">
                <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 transform bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40"></span>
                <span className="relative flex items-center text-white font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Create Your Brochure
                </span>
              </a>
              
              <a href="#templates" className="group relative inline-flex w-full sm:w-auto justify-center items-center overflow-hidden rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 py-4 px-8 text-white transition-all duration-300 ease-out hover:bg-white/20 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] focus:outline-none">
                <span className="relative flex items-center font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                  </svg>
                  Browse Templates
                </span>
              </a>
            </div>
          </div>
          
          {/* Premium Interactive Brochure Design */}
          <div data-aos="fade-left" data-aos-delay="300" className="w-full sm:w-4/5 lg:w-1/2 relative mx-auto lg:mx-0">
            <div className="relative mx-auto max-w-md perspective-1000">
              {/* Main interactive brochure with 3D elements */}
              <div className="relative transform-style-3d transition-all duration-1000 hover:rotate-y-10 shadow-[0_20px_50px_rgba(8,112,184,0.7)]">
                {/* Front cover - luxury property */}
                <div className="bg-black rounded-lg overflow-hidden backface-hidden aspect-[1/1.414] w-full relative">
                  {/* Full bleed high-end property image */}
                  <div className="absolute inset-0 bg-cover bg-center" style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2675&q=80')"
                  }}></div>
                  
                  {/* Gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
                  
                  {/* Modern animated geometric elements */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-[10%] right-[10%] w-20 h-20 border-2 border-white/30 rounded-full animate-pulse"></div>
                    <div className="absolute top-[20%] left-[10%] w-16 h-16 border border-white/20 rounded-sm rotate-45 animate-pulse"></div>
                    <div className="absolute bottom-[40%] right-[15%] h-px w-20 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
                  </div>
                  
                  {/* Luxury branding element */}
                  <div className="absolute top-6 left-6 flex items-center">
                    <div className="h-10 w-10 bg-white flex items-center justify-center rounded-sm">
                      <div className="h-8 w-8 bg-black flex items-center justify-center">
                        <span className="text-white text-xs font-bold tracking-wider">LUXE</span>
                      </div>
                    </div>
                    <div className="ml-3 text-white uppercase text-sm tracking-[0.2em] font-light">Estates</div>
                  </div>
                  
                  {/* Premium content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="mb-6">
                      <div className="inline-block bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs tracking-wider mb-3">
                        EXCLUSIVE LISTING
                      </div>
                      <h2 className="text-5xl font-light text-white leading-tight tracking-tight">
                        Luminous<br/>
                        <span className="font-medium">Residence</span>
                      </h2>
                    </div>
                    
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="h-px w-12 bg-blue-400"></div>
                      <div className="text-blue-300 text-sm tracking-wide">BEVERLY HILLS, CA</div>
                    </div>
                    
                    {/* Property highlights */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      <div className="border-l-2 border-blue-500 pl-3">
                        <div className="text-white/70 text-xs">AREA</div>
                        <div className="text-white text-lg font-medium">7,650 sqft</div>
                      </div>
                      <div className="border-l-2 border-blue-500 pl-3">
                        <div className="text-white/70 text-xs">BEDROOMS</div>
                        <div className="text-white text-lg font-medium">5 Suites</div>
                      </div>
                      <div className="border-l-2 border-blue-500 pl-3">
                        <div className="text-white/70 text-xs">PRICE</div>
                        <div className="text-white text-lg font-medium">$12.8M</div>
                      </div>
                    </div>
                    
                    {/* Interactive elements */}
                    <div className="flex justify-between items-center">
                      <div className="text-white/80 text-sm">REF: LX-90210-A</div>
                      <div className="flex space-x-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm cursor-pointer transition-colors group">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white group-hover:text-blue-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                          </svg>
                        </div>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm cursor-pointer transition-colors group">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white group-hover:text-blue-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Second page - property details */}
              <div className="absolute top-4 -right-4 w-full h-full transform-style-3d z-[-1]">
                <div className="bg-white rounded-lg shadow-xl overflow-hidden backface-hidden h-full p-6">
                  <div className="h-full bg-gray-50 rounded-md p-4 flex flex-col">
                    {/* Header with agent details */}
                    <div className="flex items-center mb-6">
                      <div className="h-12 w-12 rounded-full overflow-hidden bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80')"}}></div>
                      <div className="ml-3">
                        <div className="text-gray-800 font-medium">Jonathan Parker</div>
                        <div className="text-blue-600 text-xs">Luxury Property Specialist</div>
                      </div>
                    </div>
                    
                    {/* Property images in grid */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="h-24 bg-cover bg-center rounded-md" style={{backgroundImage: "url('https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80')"}}></div>
                      <div className="h-24 bg-cover bg-center rounded-md" style={{backgroundImage: "url('https://images.unsplash.com/photo-1560185127-6ed189bf02f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=770&q=80')"}}></div>
                    </div>
                    
                    {/* Property description teaser */}
                    <div className="mb-4">
                      <h3 className="text-gray-800 font-medium mb-2">Property Overview</h3>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        This magnificent modern estate offers panoramic ocean views, cutting-edge smart home technology, and unparalleled luxury finishes. The residence features a grand primary suite, chef's kitchen with premium appliances, and an infinity pool overlooking the coastline...
                      </p>
                    </div>
                    
                    {/* Key features */}
                    <div className="flex-grow">
                      <h3 className="text-gray-800 font-medium mb-2">Highlights</h3>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li className="flex items-start">
                          <svg className="h-3 w-3 text-blue-500 mt-0.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Infinity pool with ocean views
                        </li>
                        <li className="flex items-start">
                          <svg className="h-3 w-3 text-blue-500 mt-0.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Home theater and wine cellar
                        </li>
                        <li className="flex items-start">
                          <svg className="h-3 w-3 text-blue-500 mt-0.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Smart home automation system
                        </li>
                      </ul>
                    </div>
                    
                    {/* Contact bar */}
                    <div className="bg-blue-600 text-white text-xs rounded-md p-2 px-3 flex justify-between items-center">
                      <span>+1 (310) 555-0123</span>
                      <span>info@luxeestates.com</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Third page - just for depth */}
              <div className="absolute top-8 -right-8 w-full h-full z-[-2] hidden md:block">
                <div className="bg-gray-200 rounded-lg shadow-lg overflow-hidden h-full"></div>
              </div>
            </div>
            
            {/* 3D effect highlight */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-[20px] bg-blue-600/20 blur-xl rounded-full"></div>
            
            {/* AI badge */}
            <div data-aos="zoom-in" data-aos-delay="900" className="absolute -top-5 right-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-1.5 sm:px-6 sm:py-2 rounded-full transform rotate-12 shadow-lg">
              <span className="text-sm sm:text-base font-bold">AI-Generated</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add the required CSS for 3D transformations */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-10:hover {
          transform: rotateY(10deg);
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.3;
          }
        }
        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </section>
  );
} 