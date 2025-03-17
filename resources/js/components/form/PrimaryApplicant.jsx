import React from 'react';
import Input from './Input';

const PrimaryApplicant = ({ formData, handleChange }) => {
  const phonePrefix = (
    <div className="flex items-center px-2 border border-gray-300 rounded-l bg-gray-50">
      <div className="flex items-center justify-center w-5 h-3 mr-1 overflow-hidden">
        <span className="text-xs">🇲🇾</span>
      </div>
      <span className="text-sm">+60</span>
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2">
      <Input
        id="name"
        name="name"
        label="Name:"
        placeholder="E.g. John Doe"
        value={formData.name}
        onChange={handleChange}
      />

      <Input
        id="passportNumber"
        name="passportNumber"
        label="Passport Number :"
        placeholder="E.g. A334F"
        value={formData.passportNumber}
        onChange={handleChange}
      />

      <Input
        id="email"
        name="email"
        label="Email:"
        type="email"
        placeholder="E.g. John@xyz.com"
        value={formData.email}
        onChange={handleChange}
      />

      <Input
        id="phoneNumber"
        name="phoneNumber"
        label="Phone Number:"
        type="tel"
        placeholder="E.g. 123456789"
        value={formData.phoneNumber}
        onChange={handleChange}
        prefix={phonePrefix}
      />
    </div>
  );
};

export default PrimaryApplicant;
