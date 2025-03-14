import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./layouts/Home";
import BusinessMatching from "./pages/Business/BusinessMatching";
import Interest from "./pages/Business/Interest";
import CompanyInfo from "./pages/Hosted/CompanyInfo";
import TopMatching from "./pages/Business/ExhibitorMatching";
import ScheduleMeeting from "./pages/Business/ScheduleMeeting";
import ThankYouPage from "./pages/Business/ThankYouPage";
import OrganizerDashboard from "./pages/organizer/OrganizerDashboard";
import "../css/app.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/business" element={<BusinessMatching />} />
        <Route path="/company" element={<CompanyInfo />} />
        <Route path="/interest" element={<Interest />} />
        <Route path="/exhibitors" element={<TopMatching />} />
        <Route path="/schedule" element={<ScheduleMeeting />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/dashboard" element={<OrganizerDashboard />} />


      </Routes>
    </Router>
  );
};

// Render to the root element
const root = createRoot(document.getElementById("app"));
root.render(<App />);
