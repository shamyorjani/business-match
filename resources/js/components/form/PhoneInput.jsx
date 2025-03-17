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
    <div className="mb-4 form-group">
      <label htmlFor={id} className="block mb-2 form-label custom-label">
        {label}{required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <div className="flex">
        <div className="flex items-center px-3 border border-gray-300 rounded-l-2xl bg-gray-50">
          <div className="flex items-center justify-center w-5 h-3 mr-1 overflow-hidden">
            <span className="text-xs">🇲🇾</span>
          </div>
          <span className="text-sm font-medium">{countryCode}</span>
        </div>
        <input
          type="tel"
          id={id}
          name={name}
          placeholder={placeholder}
          className={`form-input w-full rounded-r ${error ? 'border-red-500' : 'border-gray-300'}`}
          value={value}
          onChange={onChange}
          style={{
            height: '40px',
            borderRadius: '0 13px 13px 0',
            borderWidth: '1px',
            padding: '0 16px',
            outline: 'none',
            transition: 'border-color 0.2s ease-in-out'
          }}
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      <style jsx>{`
        input::placeholder {
          font-family: 'Instrument Sans', sans-serif;
          font-weight: 400;
          font-size: 15px;
          color: #BDBDBD;
        }

        input:focus {
          border-color: #40033f;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .custom-label {
          font-family: 'Instrument Sans', sans-serif;
          font-weight: 700;
          font-size: 16px;
          line-height: 1.2;
          color: #333333;
        }

        .form-input {
          font-family: 'Instrument Sans', sans-serif;
          font-size: 15px;
        }
      `}</style>
    </div>
  );
};

export default PhoneInput;
