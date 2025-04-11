import React from 'react';
import Input from './Input';
import PhoneInput from './PhoneInput';

const PrimaryApplicant = ({ formData, handleChange }) => {
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

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Phone Number:
        </label>
        <PhoneInput
          id="phoneNumber"
          name="phoneNumber"
          placeholder="E.g. 123456789"
          value={formData.phoneNumber}
          onChange={handleChange}
          countryCode="+60"
          country="Malaysia"
        />
      </div>
    </div>
  );
};

export default PrimaryApplicant;
