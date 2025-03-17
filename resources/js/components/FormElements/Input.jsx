import React from 'react';

const Input = ({
  label,
  type = 'text',
  name,
  id,
  placeholder,
  value,
  onChange,
  error,
  className = '',
  required = false
}) => {
  return (
    <div>
      <label htmlFor={id} className="form-label">
        {label}{required && <span className="text-red-500 ml-1">*</span>}:
      </label>
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        className={`form-input ${error ? 'border-red-500' : ''} ${className}`}
        value={value}
        onChange={onChange}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
