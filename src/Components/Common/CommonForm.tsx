import React from 'react';
import { Loader2, ChevronDown } from 'lucide-react';

// 1. We define what a single input field should look like.
export interface FormField {
  name: string;         // e.g., 'email', 'role', 'agreeToTerms'
  label: string;        // e.g., 'Email Address'
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'radio' | 'checkbox';
  placeholder?: string; // Optional placeholder text
  required?: boolean;   // Is this field mandatory?
  icon?: React.ReactNode; // Optional Lucide icon for text inputs
  options?: { value: string; label: string }[]; // Used for 'select' and 'radio' types
}

// 2. We define all the properties (props) our CommonForm needs to receive.
interface CommonFormProps {
  title?: string;
  subtitle?: string;
  fields: FormField[];
  formData: Record<string, any>; // Holds the current values of all fields
  onChange: (fieldName: string, value: any) => void; // Function to call when a user interacts
  onSubmit: (e: React.FormEvent) => void;               // Function to call when user clicks Submit
  submitText: string;                                   // Text for the submit button
  isLoading?: boolean;                                  // Is it currently loading?
  error?: string | null;                                // Error message to display (if any)
}

/**
 * A highly reusable form component designed to handle text, selects, radios, and checkboxes.
 */
const CommonForm: React.FC<CommonFormProps> = ({
  title,
  subtitle,
  fields,
  formData,
  onChange,
  onSubmit,
  submitText,
  isLoading = false,
  error = null,
}) => {

  const renderField = (field: FormField) => {
    switch (field.type) {

      case 'select':
        return (
          <div className="relative">
            {field.icon && (
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                {field.icon}
              </div>
            )}
            <select
              id={field.name}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={(e) => onChange(field.name, e.target.value)}
              required={field.required}
              className={`w-full bg-white border border-gray-300 rounded-xl py-3 pr-10 text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 appearance-none shadow-sm ${field.icon ? 'pl-10' : 'pl-4'}`}
            >
              <option value="" disabled className="bg-white">{field.placeholder || 'Select an option'}</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-white">{opt.label}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-500">
              <ChevronDown className="w-5 h-5" />
            </div>
          </div>
        );

      case 'radio':
        return (
          <div className="flex flex-wrap gap-4 mt-2">
            {field.options?.map((opt) => (
              <label key={opt.value} className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  name={field.name}
                  value={opt.value}
                  checked={formData[field.name] === opt.value}
                  onChange={(e) => onChange(field.name, e.target.value)}
                  required={field.required}
                  className="w-4 h-4 text-emerald-600 bg-white border-gray-300 focus:ring-emerald-500/20 focus:ring-offset-white cursor-pointer"
                />
                <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{opt.label}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <label className="flex items-center cursor-pointer group mt-1">
            <input
              type="checkbox"
              name={field.name}
              checked={!!formData[field.name]}
              onChange={(e) => onChange(field.name, e.target.checked)}
              required={field.required}
              className="w-4 h-4 text-emerald-600 bg-white border-gray-300 rounded focus:ring-emerald-500/20 focus:ring-offset-white cursor-pointer"
            />
            <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{field.label}</span>
          </label>
        );

      // Default covers text, email, password, number
      default:
        return (
          <div className="relative">
            {field.icon && (
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                {field.icon}
              </div>
            )}
            <input
              id={field.name}
              type={field.type}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={(e) => onChange(field.name, e.target.value)}
              required={field.required}
              placeholder={field.placeholder}
              className={`w-full bg-white border border-gray-300 rounded-xl py-3 pr-4 text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm ${field.icon ? 'pl-10' : 'pl-4'}`}
            />
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      {/* Optional Header Section */}
      {(title || subtitle) && (
        <div className="mb-8">
          {title && <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>}
          {subtitle && <p className="text-gray-500">{subtitle}</p>}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-5">

        {/* Error Alert Box */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 text-sm font-medium shadow-sm">
            {error}
          </div>
        )}

        {/* Dynamically Generate Input Fields */}
        {fields.map((field) => (
          <div key={field.name} className={`group ${field.type !== 'checkbox' ? 'space-y-1.5' : ''}`}>
            {/* We don't render a top label for checkboxes since it sits next to the box */}
            {field.type !== 'checkbox' && (
              <label htmlFor={field.name} className="text-sm font-medium text-gray-700">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
            )}

            {renderField(field)}
          </div>
        ))}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-sm text-sm font-bold text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-8"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            submitText
          )}
        </button>
      </form>
    </div>
  );
};

export default CommonForm;
