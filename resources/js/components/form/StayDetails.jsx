import React from 'react';
import RadioGroup from './RadioGroup';

const StayDetails = ({ formData, handleChange }) => {
  // Function to format date as "DD MMM YYYY"
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Function to generate date range options
  const generateDateRanges = () => {
    const today = new Date();
    const options = [];
    
    // Generate 7 different 3-day ranges starting from today
    for (let i = 0; i < 7; i++) {
      const startDate = new Date(today);
      startDate.setDate(today.getDate() + i);
      
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 2); // Add 2 days to get 3-day range
      
      const value = `${formatDate(startDate)} - ${formatDate(endDate)}`;
      const label = `${formatDate(startDate)} - ${formatDate(endDate)}`;
      
      options.push({ value, label });
    }
    
    return options;
  };

  // Function to generate extra night options
  const generateExtraNightOptions = () => {
    const today = new Date();
    const options = [];
    
    // Generate 7 days of options starting from today
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const value = formatDate(date);
      const label = formatDate(date);
      
      options.push({ value, label });
    }
    
    return options;
  };

  const stayingDurationOptions = generateDateRanges();
  const extraNightOptions = generateExtraNightOptions();

  const roomTypeOptions = [
    { value: "Two Single Bed", label: "Two Single Bed" },
    { value: "One Double Bed", label: "One Double Bed" }
  ];

  return (
    <div className="space-y-6">
      <RadioGroup
        label="Staying Duration:"
        name="stayingDuration"
        options={stayingDurationOptions}
        value={formData.stayingDuration}
        onChange={handleChange}
        className="mb-6"
      />

      <RadioGroup
        label="Room Type:"
        name="roomType"
        options={roomTypeOptions}
        value={formData.roomType}
        onChange={handleChange}
        className="mb-6"
      />

      <RadioGroup
        label="Extra Room Night:"
        name="extraNight"
        options={extraNightOptions}
        value={formData.extraNight}
        onChange={handleChange}
        description="The organiser will book on behalf of the applicant. (Subcharge Rm450.00 for each additional night.)"
        columns={3}
      />
    </div>
  );
};

export default StayDetails;
