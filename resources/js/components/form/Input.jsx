import React from 'react';

const Input = ({
  id,
  name,
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  className = '',
  prefix = null,
  error,
  required = false
}) => {
return (
    <div className={`form-group mb-4 ${className}`}>
        <label htmlFor={id} className="block mb-2 form-label custom-label">
            {label}{required && <span className="ml-1 text-red-500">*</span>}
        </label>
        <div className={`flex ${error ? 'border-red-500' : ''}`}>
            {prefix && (
                <div className="flex items-center px-3 border border-gray-300 rounded-l-4xl bg-gray-50">
                    {prefix}
                </div>
            )}
            <input
                type={type}
                id={id}
                name={name}
                placeholder={placeholder}
                className={`form-input w-full ${prefix ? 'rounded-r' : 'rounded'}`}
                value={value}
                onChange={onChange}
                style={{
                    height: '40px',
                    borderRadius: prefix ? '0 13px 13px 0' : '13px',
                    borderWidth: '1px',
                    padding: '0 16px',
                    outline: 'none',
                    transition: 'border-color 0.2s ease-in-out',
                    borderColor: error ? '#ef4444' : '#d1d5db'
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

export default Input;
