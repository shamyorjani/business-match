import React from 'react';

const RadioGroup = ({
  label,
  name,
  options,
  value,
  onChange,
  description = null,
  columns = 0,
  className = '',
  error
}) => {
  const gridClasses = columns === 0
    ? 'flex flex-wrap gap-4'
    : `grid grid-cols-2 gap-4 md:grid-cols-${columns}`;

  return (
    <div className={`form-group mb-4 ${className}`}>
      <label className="block mb-2 form-label custom-label">{label}</label>

      {description && (
        <p className="mb-3 text-sm text-gray-600" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
          {description}
        </p>
      )}

      <div className={gridClasses}>
        {options.map((option) => (
          <label key={option.value} className="inline-flex items-center">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              className="h-4 w-4 text-[#40033f] focus:ring-[#40033f] border-gray-300"
            />
            <span className="ml-2" style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: '15px' }}>
              {option.label}
            </span>
          </label>
        ))}
      </div>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      <style jsx>{`
        .custom-label {
          font-family: 'Instrument Sans', sans-serif;
          font-weight: 700;
          font-size: 16px;
          line-height: 1.2;
          color: #333333;
        }

        input[type="radio"]:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }
      `}</style>
    </div>
  );
};

export default RadioGroup;
