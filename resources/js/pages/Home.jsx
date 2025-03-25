import React, { useState, useEffect } from 'react';
import Registration from '../components/Registration';
import Login from '../components/Login';
import axios from 'axios';

const HostedBuyerProgram = () => {
    const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State for hamburger menu

    // Check if user is authenticated
    useEffect(() => {
      const checkAuth = async () => {
        try {
          const response = await axios.get('/api/user');
          setUser(response.data);
        } catch (error) {
          setUser(null);
        } finally {
          setLoading(false);
        }
      };

      checkAuth();
    }, []);

    // Add event listeners for modal coordination
    useEffect(() => {
      const handleOpenLogin = () => setIsLoginOpen(true);
      const handleOpenRegistration = () => setIsRegistrationOpen(true);

      document.addEventListener('open-login-modal', handleOpenLogin);
      document.addEventListener('open-registration-modal', handleOpenRegistration);

      return () => {
        document.removeEventListener('open-login-modal', handleOpenLogin);
        document.removeEventListener('open-registration-modal', handleOpenRegistration);
      };
    }, []);

    const handleLogout = async () => {
      try {
        // Get CSRF token - use the sanctum/csrf-cookie endpoint first
        await axios.get('/sanctum/csrf-cookie');

        // Get the CSRF token from cookies or meta tag
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

        // Make the logout request with the token
        await axios.post('/logout', {}, {
          headers: {
            'X-CSRF-TOKEN': csrfToken,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        // Clear user state and reload page
        setUser(null);

        // Provide feedback
        alert('Logged out successfully');
        window.location.href = '/'; // Redirect to home page
      } catch (error) {
        console.error('Logout failed', error);
        alert('Logout failed: ' + (error.response?.data?.message || error.message));
      }
    };

    const termsData = [
        {
          id: 1,
          title: "Purpose",
          content: [
            "The Hosted Buyer Program is designed to facilitate valuable business connections during IBE 2025.",
            "Entitlement: Approved participants will receive a 3-day, 2-night stay at a designated 4-star hotel."
          ]
        },
        {
          id: 2,
          title: "Eligibility & Application Process",
          content: [
            "Eligibility: Participation is open to qualified applicants meeting the program criteria.",
            "Application Submission: Interested parties must complete the application form provided by IBE 2025.",
            "Approval Basis: Applications are reviewed on a first-come, first-served basis.",
            "Notification: Approved applicants will receive an official approval email detailing the next steps."
          ]
        },
        {
          id: 3,
          title: "Program Criteria",
          content: [
            "Applicants must meet the following criteria to be considered for the Hosted Buyer Program:",
            "Industry Focus: Applicants must be established professionals or businesses within the beauty industry.",
            "Professional Verification: Applicants should be able to provide verifiable business credentials (e.g., business licenses, company registration, or other professional documentation) that demonstrate their engagement in the beauty sector."
          ]
        },
        {
          id: 4,
          title: "Deposit Payment",
          content: [
            "Deposit Requirement: A deposit of 450 MYR is required upon receiving the approval email to secure your place in the program.",
            "Payment Process: Detailed instructions for the deposit payment will be provided via email. The deposit confirms participation and initiates the subsequent business matching process."
          ]
        },
        {
          id: 5,
          title: "Business Meetings Requirement",
          content: [
            "Minimum Meetings: Each participant must schedule and attend *at least four (4) business meetings* with suitable exhibitors during IBE 2025.",
            "Verification: Proof of attendance (such as meeting confirmations or exhibitor acknowledgments) must be provided to qualify for the deposit refund.",
            "Importance: These meetings are a core component of the program, designed to maximize networking and business opportunities."
          ]
        },
        {
          id: 6,
          title: "Refund of Deposit",
          content: [
            "Refund Conditions: The 450 MYR deposit will be fully refunded upon successful completion of the required four business meetings.",
            "Forfeiture: Failure to complete the minimum number of meetings will result in forfeiture of the deposit.",
            "Processing Time: Refunds will be processed within a reasonable period after verification of completed meetings (e.g., within 30 days)."
          ]
        },
        {
          id: 7,
          title: "Hotel Accommodation",
          content: [
            "Inclusion: The program includes a 3D2N stay at a selected 4-star hotel."
          ]
        }
      ];
    const steps = [
        {
          id: 1,
          title: "Fill Up",
          description: "Apply and fill up your business details and requirements.",
          icon: (
            <img src="/images/fill-up.svg" alt="" />
          ),
          url: "/hosted/registration"
        },
        {
          id: 2,
          title: "Deposit",
          description: "Submit a refundable deposit to confirm your booking.",
          icon: (
            <img src="/images/deposit.svg" alt="" />
          ),
          url: "/hosted/payment"
        },
        {
          id: 3,
          title: "Match Up and Meet Up",
          description: "The Organizer will match you with exhibitor(s) based on your requirements and Present at IBE to meet up with the selected exhibitor(s).",
          icon: (
            <img src="/images/search.svg" alt="" />
          ),
          url: "/hosted/interest"
        },
        {
          id: 4,
          title: "Enjoy",
          description: "Enjoy exclusive perks, including hotel accommodations, and make the most of your IBE experience.",
          icon: (
            <img src="/images/enjoy.svg" alt="" />
          ),
          url: "/benefits"
        }
      ];
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header/Navigation Bar */}
      <header className="bg-gradient-to-r from-[#40033f] to-[#9c0c40] text-white py-8 px-4 md:px-14 relative">
        <div className="container flex items-center justify-between mx-auto">
          <div className="flex items-center">
            {/* Logo */}
            <img className='main-logo' src="/images/logo.svg" alt="My Image" />
          </div>

          {/* Hamburger Menu */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white focus:outline-none">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-4 font-cardo">
            <nav className="flex flex-col sm:flex-row">
              <a href="/" className="nav-menu text-white hover:text-pink-200 transition-colors duration-200 font-medium py-2 border-b-2 border-transparent hover:border-white">Home</a>
              <a href="/exhibitions" className="nav-menu text-white hover:text-pink-200 transition-colors duration-200 font-medium py-2 border-b-2 border-transparent hover:border-white">Exhibitions</a>
              <a href="/hosted/registration" className="nav-menu text-white hover:text-pink-200 transition-colors duration-200 font-medium py-2 border-b-2 border-transparent hover:border-white">Hosted Buyer</a>
              <a href="/business/registration" className="nav-menu text-white hover:text-pink-200 transition-colors duration-200 font-medium py-2 border-b-2 border-transparent hover:border-white">Business Matching</a>
              <a href="/about" className="nav-menu text-white hover:text-pink-200 transition-colors duration-200 font-medium py-2 border-b-2 border-transparent hover:border-white">About IBE</a>
            </nav>

            {/* Authentication buttons */}
            {loading ? (
              <div className="w-20 h-8 bg-gray-300 rounded-full animate-pulse"></div>
            ) : user ? (
              <div className="flex items-center space-x-2">
                <span className="text-white">Hi, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-white text-[#40033f] px-6 py-2 rounded-full text-sm font-bold"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="bg-white text-[#40033f] px-6 py-2 rounded-full text-sm font-bold"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setIsRegistrationOpen(true)}
                  className="px-6 py-2 text-sm font-bold text-white bg-transparent border border-white rounded-full"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-gradient-to-r from-[#40033f] to-[#9c0c40] z-50 py-4 px-4 shadow-lg">
            <nav className="flex flex-col space-y-4">
              <a href="/" className="text-white py-3 px-4 border-b border-white/20 hover:bg-white/10 rounded-lg flex items-center">
                <span className="mr-2">🏠</span> Home
              </a>
              <a href="/exhibitions" className="text-white py-3 px-4 border-b border-white/20 hover:bg-white/10 rounded-lg flex items-center">
                <span className="mr-2">🎪</span> Exhibitions
              </a>
              <a href="/hosted/registration" className="text-white py-3 px-4 border-b border-white/20 hover:bg-white/10 rounded-lg flex items-center">
                <span className="mr-2">🏨</span> Hosted Buyer
              </a>
              <a href="/business/registration" className="text-white py-3 px-4 border-b border-white/20 hover:bg-white/10 rounded-lg flex items-center">
                <span className="mr-2">🤝</span> Business Matching
              </a>
              <a href="/about" className="text-white py-3 px-4 hover:bg-white/10 rounded-lg flex items-center">
                <span className="mr-2">ℹ️</span> About IBE
              </a>
            </nav>

            {/* Mobile Authentication buttons */}
            <div className="mt-4 flex flex-col space-y-3">
              {loading ? (
                <div className="w-full h-10 bg-gray-300 rounded-full animate-pulse"></div>
              ) : user ? (
                <>
                  <div className="text-white mb-2">Hi, {user.name}</div>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-white text-[#40033f] px-6 py-3 rounded-full text-sm font-bold"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="w-full bg-white text-[#40033f] px-6 py-3 rounded-full text-sm font-bold"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setIsRegistrationOpen(true)}
                    className="w-full px-6 py-3 text-sm font-bold text-white bg-transparent border border-white rounded-full"
                  > 
                    Register
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Registration and Login Modals */}
      <Registration isOpen={isRegistrationOpen} onClose={() => setIsRegistrationOpen(false)} />
      <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      {/* Hero Image with Title */}
      <div className="relative h-64 md:h-96 mb-12"> {/* Increased height and margin */}
        <div className="absolute inset-0 bg-center bg-cover" style={{ backgroundImage: "url('/images/bg-img.png')" }}></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-serif text-4xl font-bold text-white md:text-7xl drop-shadow-lg mb-4">
            Hosted Buyer Program
          </h1>
          <div className="z-20 flex flex-wrap justify-center mt-6 gap-4">
            <button
              className="text-lg font-bold primary-btn min-w-[180px]"
              onClick={() => window.location.href = '/hosted/registration'}
            >
              Hosted Buyer
            </button>
            <button
              className="text-lg font-bold primary-btn min-w-[180px]"
              onClick={() => window.location.href = '/business/registration'}
            >
              Business Matching
            </button>
          </div>
        </div>
      </div>

      {/* Buttons below hero section */}

      {/* Main Content */}
      <div className="flex-grow py-12 bg-white">
        <div className="container px-4 mx-auto">
          {/* Why Section */}
          <section className="mb-16">
            <h2 className="text-3xl md:text-4xl text-center font-bold text-[#40033f] font-serif mb-6">
              Why Hosted Buyer Program ?
            </h2>

            <div className="grid max-w-6xl grid-cols-1 gap-8 p-3 sm:p-6 mx-auto md:grid-cols-2">
              {/* Feature 1 */}
              <div className="flex items-center p-4 space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 text-[#40033f]">
                   <img src="/images/hotel.svg" alt="" />
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
                   <img src="/images/hands.svg" alt="" />
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
                   <img src="/images/global.svg" alt="" />
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
                  <img src="/images/marketing.svg" alt="" />
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

      <h1 className="text-3xl md:text-4xl text-center font-bold text-[#40033f] font-serif mb-6">
        Steps to apply for IBE Hosted Buyer Program
      </h1>
      <div className="max-w-6xl p-6 mx-auto">

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {steps.map((step) => (
          <div
            key={step.id}
            className="rounded-md overflow-hidden bg-gradient-to-r from-[#40033f] to-[#9c0c40] text-white hover:shadow-lg transition-all duration-300"
          >
            <div className="p-6 text-center">
              <div className="flex flex-col items-center mb-4">
                <div className="mb-2 text-white">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="mt-2">{step.description}</p>
              </div>
              <button
                className="px-4 py-2 mt-4 text-sm font-bold text-white bg-transparent border border-white rounded-full"
                onClick={() => window.location.href = step.url}
              >
                Learn More
              </button>
            </div>
          </div>
        ))}
      </div>


    </div>
    <div className="z-20 max-w-4xl p-8 mx-auto ">
      <h1 className="text-3xl md:text-4xl text-center font-bold text-[#40033f] font-serif mb-6">Terms & Conditions</h1>

      <section className="mb-8">
      <h2 className="mb-4 text-xl font-bold text-left">Program Overview</h2>
      </section>

      {/* Map through the termsData array to render each section */}
      {termsData.map((section) => (
        <section key={section.id} className="mb-8">
          <h3 className="mb-2 text-lg font-bold">{section.id}. {section.title}</h3>

          {/* Map through the content array for each section */}
          {section.content.map((paragraph, index) => (
            <p key={index} className="mb-2">{paragraph}</p>
          ))}
        </section>
      ))}
    </div>

    {/* Update the "Register Now" button at the bottom of the page to open registration modal if not logged in */}
    <div className="z-20 flex justify-center my-12 py-6">
      <button
        type="button"
        className="primary-btn text-[24px] font-bold px-10 py-4 hover:shadow-lg transition-all duration-300"
        onClick={() => user ? alert("You're already registered!") : setIsRegistrationOpen(true)}
      >
        Register Now
      </button>
    </div>

      {/* Enhanced Footer */}
      <footer className="py-10 text-center text-gray-600 bg-gray-100 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center">
            <img className="w-32 mb-6" src="/images/logo.svg" alt="IBE Logo" />
            <p className="mb-4">© {new Date().getFullYear()} IBE - International Beauty Expo. All rights reserved.</p>
            <div className="flex space-x-6 mt-2">
              <a href="#" className="text-gray-500 hover:text-[#40033f]">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-[#40033f]">Terms & Conditions</a>
              <a href="#" className="text-gray-500 hover:text-[#40033f]">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HostedBuyerProgram;
