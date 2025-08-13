import React from 'react';
import './FormField.css';

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  error?: string;
  required?: boolean;
  description?: string;
}

export const FormField: React.FC<FormFieldProps> = ({ 
  label, 
  children, 
  error, 
  required = false, 
  description 
}) => {
  return (
    <div className="form-field">
      <label className="form-field__label">
        {label}
        {required && <span className="form-field__required">*</span>}
      </label>
      
      {description && (
        <p className="form-field__description">{description}</p>
      )}
      
      <div className="form-field__input">
        {children}
      </div>
      
      {error && (
        <div className="form-field__error">{error}</div>
      )}
    </div>
  );
};