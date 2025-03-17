import React from 'react';
import Input from './Input';

const AdditionalApplicant = ({ formData, handleChange }) => {
  return (
    <div className="mb-8">
      <h2 className="mb-2 text-lg font-medium">Additional applicant information</h2>
      <p className="mb-4 text-sm text-gray-600">If booking for two persons, fill in the additional applicant's details below. Otherwise, leave blank.</p>

      <div className="grid grid-cols-1 gap-6 mb-4 md:grid-cols-2 md:gap-x-[120px]">
        <Input
          id="additionalName"
          name="additionalName"
          label="Name:"
          placeholder="E.g. John Doe"
          value={formData.additionalName}
          onChange={handleChange}
        />

        <Input
          id="additionalPassport"
          name="additionalPassport"
          label="Passport Number :"
          placeholder="E.g. A334F"
          value={formData.additionalPassport}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default AdditionalApplicant;
