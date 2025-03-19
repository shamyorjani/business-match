import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Exhibitors = () => {
  const navigate = useNavigate();
  const [exhibitors, setExhibitors] = useState([]);
  const [selectedExhibitors, setSelectedExhibitors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading exhibitor data from an API
    const fetchExhibitors = () => {
      // In a real app, this would be an API call
      setTimeout(() => {
        setExhibitors([
          {
            id: 1,
            name: 'ABC Company',
            boothNumber: 'A11',
            country: 'Malaysia',
            productProfile: 'Foundations, Concealers, Blush, Highlighters, Powders',
            description: 'We ABC Company are top 20 manufacturer of Makeup products in Malaysia. We specialise in...'
          },
          {
            id: 2,
            name: 'HJ Company',
            boothNumber: 'C 29',
            country: 'Indonesia',
            productProfile: 'Foundations, Concealers, Blush, Highlighters, Powders',
            description: 'We HJ Company are top 20 manufacturer of Makeup products in Indonesia. We specialise in...'
          },
          {
            id: 3,
            name: 'AAA Company',
            boothNumber: 'B 15',
            country: 'Malaysia',
            productProfile: 'Foundations, Concealers, Blush, Highlighters, Powders',
            description: 'We AAA Company are top 20 manufacturer of Makeup products in Malaysia. We specialise in...'
          },
          {
            id: 4,
            name: 'XYZ Company',
            boothNumber: 'D 42',
            country: 'Thailand',
            productProfile: 'Foundations, Concealers, Blush, Highlighters, Powders',
            description: 'We XYZ Company are top 20 manufacturer of Makeup products in Thailand. We specialise in...'
          }
        ]);
        setLoading(false);
      }, 1000);
    };

    fetchExhibitors();
  }, []);

  const toggleSelection = (companyName) => {
    if (selectedExhibitors.includes(companyName)) {
      setSelectedExhibitors(selectedExhibitors.filter(name => name !== companyName));
    } else {
      setSelectedExhibitors([...selectedExhibitors, companyName]);
    }
  };

  const handleContinue = () => {
    if (selectedExhibitors.length === 0) {
      alert('Please select at least one exhibitor');
      return;
    }

    navigate('/business/exhibitor-matching', {
      state: { selectedExhibitors }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading exhibitors...</div>
      </div>
    );
  }

  return (
    <div className="form-container">
      {/* Header */}
      <div className="header">
        <h1 className="header-title">Exhibitors Directory
          <p className="header-subtitle">Browse and select exhibitors you'd like to meet</p>
        </h1>
      </div>

      {/* Content */}
      <div className="content">
        <div className="info-bar">
            <p className="info-counter">Showing {exhibitors.length} exhibitors</p>
            <div className="flex items-center gap-4">
                <p className="selected-counter">{selectedExhibitors.length} Exhibitor(s) selected</p>
                <button
                    className="btn-primary"
                    onClick={handleContinue}
                    disabled={selectedExhibitors.length === 0}
                >
                    Continue to Matching
                </button>
            </div>
        </div>

        <div className="exhibitor-list">
          {exhibitors.map((exhibitor) => (
            <div key={exhibitor.id} className="exhibitor-card">
              <div className="exhibitor-flex">
                {/* Logo */}
                <div className="company-logo">
                  <div>Company</div>
                  <div>Logo</div>
                  <div>1:1</div>
                </div>

                {/* Content */}
                <div className="card-content">
                  <div className="card-grid">
                    <div>
                      <span className="label">Company Name: </span>
                      {exhibitor.name}
                    </div>
                    <div>
                      <span className="label">Booth Number: </span>
                      {exhibitor.boothNumber}
                    </div>
                    <div>
                      <span className="label">Country/Region: </span>
                      {exhibitor.country}
                    </div>
                  </div>

                  <div className="mt-2">
                    <span className="label">Product Profile: </span>
                    {exhibitor.productProfile}
                  </div>

                  <div className="mt-2">
                    <span className="label">Company Description: </span>
                    <p className="mt-1">{exhibitor.description}</p>
                  </div>

                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      className={selectedExhibitors.includes(exhibitor.name) ? 'btn-selected' : 'btn-unselected'}
                      onClick={() => toggleSelection(exhibitor.name)}
                    >
                      {selectedExhibitors.includes(exhibitor.name) ? 'Selected' : 'Select'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Exhibitors;
