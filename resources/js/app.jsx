// resources/js/app.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./layouts/Home";
import BusinessRegistration from "./pages/Business/Registration";
import BusinessInterest from "./pages/Business/Interest";
import BusinessCompanyInfo from "./pages/Business/CompanyInfo";
import BusinessTopMatching from "./pages/Business/ExhibitorMatching";
import BusinessScheduleMeeting from "./pages/Business/ScheduleMeeting";
import BusinessThankYouPage from "./pages/Business/ThankYouPage";

import HostedRegistration from "./pages/Hosted/Registration";
import HostedCompanyInfo from "./pages/Hosted/CompanyInfo";
import PaymentGateway from "./pages/Hosted/PaymentGateway";
import HostedThankYouPage from "./pages/Hosted/ThankYouPage";
import PaymentCard from "./pages/Hosted/PaymentCard";

import OrganizerDashboard from "./pages/organizer/OrganizerDashboard";
import "../css/app.css"; // Make sure you are using the correct CSS

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/business/registration" element={<BusinessRegistration />} />
        <Route path="/business/company" element={<BusinessCompanyInfo />} />
        <Route path="/business/interest" element={<BusinessInterest />} />
        <Route path="/business/exhibitors" element={<BusinessTopMatching />} />
        <Route path="/business/schedule" element={<BusinessScheduleMeeting />} />
        <Route path="/business/thank-you" element={<BusinessThankYouPage />} />

        <Route path="/hosted/registration" element={<HostedRegistration />} />
        <Route path="/hosted/company" element={<HostedCompanyInfo />} />
        <Route path="/hosted/payments" element={<PaymentGateway />} />
        <Route path="/hosted/thank-you" element={<HostedThankYouPage />} />
        <Route path="/hosted/payment-card" element={<PaymentCard />} />

        <Route path="/dashboard" element={<OrganizerDashboard />} />
      </Routes>
    </Router>
  );
};

// Render to the root element
const root = createRoot(document.getElementById("app"));
root.render(<App />);
