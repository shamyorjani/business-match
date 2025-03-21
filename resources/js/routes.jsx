import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Registration from './pages/Business/Registration';
import CompanyInfo from './pages/Business/CompanyInfo';
import ExhibitorMatching from './pages/Business/ExhibitorMatching';
import Home from './layouts/Home';
import ScheduleMeeting from './pages/Business/ScheduleMeeting';
import ThankYouPage from './pages/Business/ThankYouPage';
import Interest from './pages/Business/Interest';

// Import Hosted components
import HostedRegistration from './pages/Hosted/Registration';
import HostedCompanyInfo from './pages/Hosted/CompanyInfo';
import PaymentGateway from './pages/Hosted/PaymentGateway';
import PaymentCard from './pages/Hosted/PaymentCard';
import HostedThankYouPage from './pages/Hosted/ThankYouPage';

// Import Organizer components
import OrganizerDashboard from './pages/organizer/OrganizerDashboard';
import BusinessMatching from './pages/organizer/BusinessMatching';
import HostedBuyerProgram from './pages/organizer/HostedBuyerProgram';

// Create and export the router
const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  // Business routes
  {
    path: '/business/registration',
    element: <Registration />
  },
  {
    path: '/business/company',
    element: <CompanyInfo />
  },
  {
    path: '/business/interest',
    element: <Interest />
  },
  {
    path: '/business/exhibitor-matching',
    element: <ExhibitorMatching />
  },
  {
    path: '/business/schedule',
    element: <ScheduleMeeting />,
  },
  {
    path: '/business/thank-you',
    element: <ThankYouPage />,
  },
  {
    path: '/business/thankyou',
    element: <ThankYouPage />,  // Add route without hyphen pointing to the same component
  },

  // Hosted routes
  {
    path: '/hosted/registration',
    element: <HostedRegistration />,
  },
  {
    path: '/hosted/company',
    element: <HostedCompanyInfo />,
  },
  {
    path: '/hosted/payments',
    element: <PaymentGateway />,
  },
  {
    path: '/hosted/payment-card',
    element: <PaymentCard />,
  },
  {
    path: '/hosted/thank-you',
    element: <HostedThankYouPage />,
  },

  // Organizer routes
  {
    path: '/dashboard',
    element: <OrganizerDashboard />,
    children: [
      {
        path: 'business-matching',
        element: <BusinessMatching />
      },
      {
        path: 'hosted-buyer-program',
        element: <HostedBuyerProgram />
      },
      {
        path: '',
        element: <BusinessMatching />
      }
    ]
  }
]);

export default router;
