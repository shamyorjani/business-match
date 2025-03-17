import React from 'react';

const PhoneInput = ({
  label,
  id,
  name,
  placeholder,
  value,
  onChange,
  error,
  countryCode = '+60',
  required = false
}) => {
  return (
    <div>
      <label htmlFor={id} className="form-label">
        {label}{required && <span className="ml-1 text-red-500">*</span>}:
      </label>
      <div className={`phone-input-container ${error ? 'border-red-500' : ''}`}>
        <div className="country-code-container">
          <div className="flag-container">
            {/* Malaysia flag - simplified version */}
            <div className="malaysia-flag">
              <div className="malaysia-flag-stripe"></div>
              <div className="malaysia-flag-emblem">
                <div className="malaysia-flag-star"></div>
              </div>
            </div>
          </div>
          <span className="country-code">{countryCode}</span>
        </div>
        <input
          type="tel"
          id={id}
          name={name}
          placeholder={placeholder}
          className="phone-input-field"
          value={value}
          onChange={onChange}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default PhoneInput;
