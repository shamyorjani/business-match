import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BusinessMatching from "./pages/BusinessMatching";
import Interest from "./pages/Interest";
import CompanyInfo from "./pages/CompanyInfo";
import "../css/app.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BusinessMatching />} />
        <Route path="/company" element={<CompanyInfo />} />
        <Route path="/interest" element={<Interest />} />

      </Routes>
    </Router>
  );
};

// Render to the root element
const root = createRoot(document.getElementById("app"));
root.render(<App />);
