import React from 'react';

const HostedBuyerProgram = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header/Navigation Bar */}
      <header className="bg-gradient-to-r from-[#40033f] to-[#9c0c40] text-white py-8 px-6">
        <div className="container flex items-center justify-between mx-auto">
          <div className="flex items-center">
            {/* Logo */}
            <img className='main-logo' src="/images/logo.svg" alt="My Image" />

          </div>

          {/* Sign In & Cart */}
          <div className="flex items-center space-x-4 font-cardo">
               {/* Navigation Links */}
               <nav className="hidden space-x-12 md:flex">
              <a href="#" className="nav-menu">Home</a>
              <a href="#" className="nav-menu">Exhibitions</a>
              <a href="#" className="nav-menu">About us</a>
              <a href="#" className="nav-menu">Contact us</a>
            </nav>
            <button className="bg-white text-[#40033f] px-4 py-1 rounded-full text-sm font-medium">
              Sign In
            </button>
            <div className="p-2 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Image with Title */}
      <div className="relative h-48 md:h-64">
        <div className="absolute inset-0 bg-center bg-cover" style={{ backgroundImage: "url('/api/placeholder/800/300')" }}></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="font-serif text-4xl font-bold text-white md:text-5xl drop-shadow-lg">
            Hosted Buyer Program
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow py-12 bg-white">
        <div className="container px-4 mx-auto">
          {/* Why Section */}
          <section className="mb-16">
            <h2 className="text-3xl text-center text-[#40033f] font-serif mb-12">
              Why Hosted Buyer Program ?
            </h2>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Feature 1 */}
              <div className="flex items-start p-4 space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 text-[#40033f]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Complimentary 3 Day 2 Night 4-Star Hotel Stay</h3>
                  <p className="mt-1 text-gray-600"></p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start p-4 space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 text-[#40033f]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Build strategy business alliances with manufacturers, wholesalers, distributors, and suppliers.</h3>
                  <p className="mt-1 text-gray-600"></p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start p-4 space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 text-[#40033f]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="2" y1="12" x2="22" y2="12"></line>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Have discussions with country representatives from international pavilions to better understand the global market conditions.</h3>
                  <p className="mt-1 text-gray-600"></p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex items-start p-4 space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 text-[#40033f]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="20" x2="18" y2="10"></line>
                      <line x1="12" y1="20" x2="12" y2="4"></line>
                      <line x1="6" y1="20" x2="6" y2="14"></line>
                      <line x1="2" y1="20" x2="22" y2="20"></line>
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Obtain latest market trends and enhance your skills with our world-class experts, masters, and gurus.</h3>
                  <p className="mt-1 text-gray-600"></p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#40033f] to-[#9c0c40] text-white py-6">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-4 md:mb-0">
              <span className="font-medium">© 2025 International Beauty Centre.</span>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="hover:underline">Privacy Policy</a>
              <a href="#" className="hover:underline">Terms of Service</a>
              <a href="#" className="hover:underline">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HostedBuyerProgram;
