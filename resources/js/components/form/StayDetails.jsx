import React from 'react';
import RadioGroup from './RadioGroup';

const StayDetails = ({ formData, handleChange }) => {
  const stayingDurationOptions = [
    { value: "1-3 June 2025", label: "1-3 June 2025" },
    { value: "2-4 June 2025", label: "2-4 June 2025" },
    { value: "3-5 June 2025", label: "3-5 June 2025" }
  ];

  const roomTypeOptions = [
    { value: "Two Single Bed", label: "Two Single Bed" },
    { value: "One Double Bed", label: "One Double Bed" }
  ];

  const extraNightOptions = [
    { value: "30 May 2025", label: "30 May 2025" },
    { value: "1 June 2025", label: "1 June 2025" },
    { value: "2 June 2025", label: "2 June 2025" },
    { value: "4 June 2025", label: "4 June 2025" },
    { value: "5 June 2025", label: "5 June 2025" },
    { value: "6 June 2025", label: "6 June 2025" }
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
