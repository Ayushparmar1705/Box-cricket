import React from 'react';
import { ChevronDown } from 'lucide-react';
import CommonLoadingBar from './CommonLoadingBar';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'radio' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  icon?: React.ReactNode;
  options?: { value: string; label: string }[];
}

interface CommonFormProps {
  title?: string;
  subtitle?: string;
  fields: FormField[];
  formData: Record<string, any>;
  onChange: (fieldName: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitText: string;
  isLoading?: boolean;
  error?: string | null;
}

export const CommonForm: React.FC<CommonFormProps> = ({
  title,
  subtitle,
  fields,
  formData,
  onChange,
  onSubmit,
  submitText,
  isLoading,
  error = null
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
              className={`w-full bg-slate-900 hover:bg-slate-800 focus:bg-slate-900 border border-slate-700 rounded-xl py-2.5 pr-10 text-xs sm:text-sm text-white transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 appearance-none shadow-sm font-medium cursor-pointer ${field.icon ? 'pl-10' : 'pl-3.5'
                }`}
            >
              <option value="" disabled className="bg-slate-900 text-slate-400">
                {field.placeholder || 'Select an option'}
              </option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
              <ChevronDown className="w-4 h-4" />
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
                  className="w-4 h-4 text-emerald-500 bg-slate-900 border-slate-700 focus:ring-emerald-500/20 cursor-pointer"
                />
                <span className="ml-2 text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">
                  {opt.label}
                </span>
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
              className="w-4 h-4 text-emerald-500 bg-slate-900 border-slate-700 rounded focus:ring-emerald-500/20 cursor-pointer"
            />
            <span className="ml-2 text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">
              {field.label}
            </span>
          </label>
        );

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
              className={`w-full bg-slate-900 hover:bg-slate-800/80 focus:bg-slate-900 border border-slate-700 rounded-xl py-2.5 pr-4 text-xs sm:text-sm text-white placeholder-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 shadow-sm font-medium ${field.icon ? 'pl-10' : 'pl-3.5'
                }`}
            />
          </div>
        );
    }
  };

  return (
    <div className="w-full text-slate-100">
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight mb-1">
              {title}
            </h2>
          )}
          {subtitle && <p className="text-xs text-slate-400 leading-relaxed">{subtitle}</p>}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-semibold shadow-sm">
            {error}
          </div>
        )}

        {fields.map((field) => (
          <div key={field.name} className={`group ${field.type !== 'checkbox' ? 'space-y-1' : ''}`}>
            {field.type !== 'checkbox' && (
              <label htmlFor={field.name} className="text-xs font-bold text-slate-300 block">
                {field.label} {field.required && <span className="text-rose-400">*</span>}
              </label>
            )}
            {renderField(field)}
          </div>
        ))}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-lg shadow-emerald-500/20 text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-6 cursor-pointer"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <CommonLoadingBar size="w-6 h-6" />
              <span>Saving...</span>
            </div>
          ) : (
            submitText
          )}
        </button>
      </form>
    </div>
  );
};

export default CommonForm;
