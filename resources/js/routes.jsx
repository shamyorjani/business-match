import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Registration from './pages/Business/Registration';
import CompanyInfo from './pages/Business/CompanyInfo';
import ExhibitorMatching from './pages/Business/ExhibitorMatching';
import Home from './pages/Home';
import ScheduleMeeting from './pages/Business/ScheduleMeeting';
import ThankYouPage from './pages/Business/ThankYouPage';
import Interest from './pages/Business/Interest';
import BusinessLayout from './layouts/BusinessLayout';

// Import Hosted components
import HostedRegistration from './pages/Hosted/Registration';
import HostedCompanyInfo from './pages/Hosted/CompanyInfo';
import PaymentGateway from './pages/Hosted/PaymentGateway';
import PaymentCard from './pages/Hosted/PaymentCard';
import HostedThankYouPage from './pages/Hosted/ThankYouPage';
import HostedInterest from './pages/Hosted/Interest';
import HostedExhibitorMatching from './pages/Hosted/ExhibitorMatching';

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
  // Business routes with shared layout
  {
    path: '/business',
    element: <BusinessLayout />,
    children: [
      {
        path: 'registration',
        element: <Registration />
      },
      {
        path: 'company',
        element: <CompanyInfo />
      },
      {
        path: 'interest',
        element: <Interest />
      },
      {
        path: 'exhibitor-matching',
        element: <ExhibitorMatching />
      },
      {
        path: 'schedule',
        element: <ScheduleMeeting />,
      },
      {
        path: 'thank-you',
        element: <ThankYouPage />,
      },
      {
        path: 'thankyou',
        element: <ThankYouPage />, // Add route without hyphen pointing to the same component
      }
    ]
  },

  // Hosted routes with BusinessLayout
  {
    path: '/hosted',
    element: <BusinessLayout />,
    children: [
      {
        path: 'registration',
        element: <HostedRegistration />,
      },
      {
        path: 'company',
        element: <HostedCompanyInfo />,
      },
      {
        path: 'payment',
        element: <PaymentGateway />,
      },
      {
        path: 'payment-card',
        element: <PaymentCard />,
      },
      {
        path: 'interest',
        element: <HostedInterest />,
      },
      {
        path: 'exhibitor-matching',
        element: <HostedExhibitorMatching />,
      },
      {
        path: 'thank-you',
        element: <HostedThankYouPage />,
      },
    ]
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
