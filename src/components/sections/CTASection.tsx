export default function CTASection() {
  return (
    <section className="py-20 px-4 relative z-10">
      {/* Remove the additional background highlight but keep the glass effect */}
      
      <div className="max-w-6xl mx-auto">
        <div className="bg-[#0c1324]/80 border border-[#1c2a47] rounded-2xl p-8 md:p-12 overflow-hidden shadow-lg">
          {/* Inner glow effect */}
          <div className="absolute inset-0 overflow-hidden -z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1/2 bg-blue-500/5 blur-[100px]"></div>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center">
            <div className="w-full lg:w-2/3 lg:pr-12 mb-8 lg:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Transform Your Real Estate Marketing?</h2>
              <p className="text-xl text-gray-300 mb-6">
                Join thousands of real estate professionals who are saving time and winning more listings with our AI-powered brochure maker.
              </p>
              
              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-6 mt-8">
                <span className="text-sm text-gray-400">Trusted by:</span>
                <div className="flex space-x-8">
                  <img src="/logos/remax.svg" alt="RE/MAX" className="h-8 opacity-70" />
                  <img src="/logos/century21.svg" alt="Century 21" className="h-8 opacity-70" />
                  <img src="/logos/keller-williams.svg" alt="Keller Williams" className="h-8 opacity-70" />
                </div>
              </div>
            </div>
            
            <div className="w-full lg:w-1/3">
              <div className="bg-[#111b33] rounded-xl p-6 border border-[#1c2a47]">
                <h3 className="text-xl font-bold text-white mb-4">Start Creating Today</h3>
                <p className="text-gray-300 mb-6">Sign up in 60 seconds and create your first brochure for free.</p>
                
                <a 
                  href="/dashboard" 
                  className="group relative inline-flex w-full justify-center items-center overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 py-4 px-6 transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg focus:outline-none"
                >
                  <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 transform bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40"></span>
                  <span className="relative flex items-center text-white font-medium">
                    Get Started — It's Free
                  </span>
                </a>
                
                <p className="text-gray-400 text-sm mt-4 text-center">No credit card required</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 