import React from 'react';
import { ChevronDown } from 'lucide-react';
import CommonLoadingBar from './CommonLoadingBar';

export interface FormField {
  name: string;
  label: string;
  type:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'tel'
    | 'time'
    | 'date'
    | 'select'
    | 'radio'
    | 'checkbox'
    | 'textarea'
    | 'file'
    | 'custom';
  placeholder?: string;
  required?: boolean;
  icon?: React.ReactNode;
  options?: { value: string | number; label: string }[];
  rows?: number;
  accept?: string;
  colSpan?: 1 | 2;
  renderCustom?: (
    formData: Record<string, any>,
    onChange: (fieldName: string, value: any) => void
  ) => React.ReactNode;
}

export interface CommonFormProps {
  title?: string;
  subtitle?: string;
  fields: FormField[];
  formData: Record<string, any>;
  onChange: (fieldName: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitText: string;
  isLoading?: boolean;
  error?: string | null;
  theme?: 'dark' | 'light';
  gridCols?: 1 | 2;
  children?: React.ReactNode;
  onCancel?: () => void;
  cancelText?: string;
}

export const CommonForm: React.FC<CommonFormProps> = ({
  title,
  subtitle,
  fields,
  formData,
  onChange,
  onSubmit,
  submitText,
  isLoading = false,
  error = null,
  theme = 'dark',
  gridCols = 1,
  children,
  onCancel,
  cancelText = 'Cancel',
}) => {
  const isLight = theme === 'light';

  const inputClasses = isLight
    ? 'w-full bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl py-2.5 pr-4 text-xs sm:text-sm text-slate-900 placeholder-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs font-medium'
    : 'w-full bg-slate-900 hover:bg-slate-800/80 focus:bg-slate-900 border border-slate-700 rounded-xl py-2.5 pr-4 text-xs sm:text-sm text-white placeholder-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 shadow-sm font-medium';

  const selectClasses = isLight
    ? 'w-full bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl py-2.5 pr-10 text-xs sm:text-sm text-slate-900 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 appearance-none shadow-xs font-medium cursor-pointer'
    : 'w-full bg-slate-900 hover:bg-slate-800 focus:bg-slate-900 border border-slate-700 rounded-xl py-2.5 pr-10 text-xs sm:text-sm text-white transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 appearance-none shadow-sm font-medium cursor-pointer';

  const labelColor = isLight ? 'text-slate-700' : 'text-slate-300';

  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'custom':
        return field.renderCustom ? field.renderCustom(formData, onChange) : null;

      case 'textarea':
        return (
          <textarea
            id={field.name}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={(e) => onChange(field.name, e.target.value)}
            required={field.required}
            placeholder={field.placeholder}
            rows={field.rows || 3}
            className={`${inputClasses} pl-3.5 resize-none`}
          />
        );

      case 'file':
        return (
          <input
            id={field.name}
            type="file"
            accept={field.accept || 'image/*'}
            onChange={(e) => onChange(field.name, e.target.files?.[0] || null)}
            className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
          />
        );

      case 'select':
        return (
          <div className="relative">
            {field.icon && (
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                {field.icon}
              </div>
            )}
            <select
              id={field.name}
              name={field.name}
              value={formData[field.name] ?? ''}
              onChange={(e) => onChange(field.name, e.target.value)}
              required={field.required}
              className={`${selectClasses} ${field.icon ? 'pl-10' : 'pl-3.5'}`}
            >
              <option value="" disabled className={isLight ? 'bg-white text-slate-400' : 'bg-slate-900 text-slate-400'}>
                {field.placeholder || 'Select an option'}
              </option>
              {field.options?.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  className={isLight ? 'bg-white text-slate-800' : 'bg-slate-900 text-white'}
                >
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
                  checked={String(formData[field.name]) === String(opt.value)}
                  onChange={(e) => onChange(field.name, e.target.value)}
                  required={field.required}
                  className="w-4 h-4 text-emerald-500 bg-slate-900 border-slate-700 focus:ring-emerald-500/20 cursor-pointer"
                />
                <span className={`ml-2 text-xs font-semibold ${labelColor} group-hover:text-emerald-500 transition-colors`}>
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
              className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-500/20 cursor-pointer"
            />
            <span className={`ml-2 text-xs font-semibold ${labelColor} group-hover:text-emerald-500 transition-colors`}>
              {field.label}
            </span>
          </label>
        );

      default:
        return (
          <div className="relative">
            {field.icon && (
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                {field.icon}
              </div>
            )}
            <input
              id={field.name}
              type={field.type}
              name={field.name}
              value={formData[field.name] ?? ''}
              onChange={(e) => onChange(field.name, e.target.value)}
              required={field.required}
              placeholder={field.placeholder}
              className={`${inputClasses} ${field.icon ? 'pl-10' : 'pl-3.5'}`}
            />
          </div>
        );
    }
  };

  return (
    <div className={`w-full ${isLight ? 'text-slate-800' : 'text-slate-100'}`}>
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h2 className={`text-lg sm:text-xl font-extrabold tracking-tight mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {title}
            </h2>
          )}
          {subtitle && <p className="text-xs text-slate-400 leading-relaxed">{subtitle}</p>}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-500 text-xs font-semibold shadow-sm">
            {error}
          </div>
        )}

        <div className={gridCols === 2 ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : 'space-y-4'}>
          {fields.map((field) => (
            <div
              key={field.name}
              className={`group ${field.colSpan === 2 && gridCols === 2 ? 'sm:col-span-2' : ''} ${
                field.type !== 'checkbox' ? 'space-y-1' : ''
              }`}
            >
              {field.type !== 'checkbox' && (
                <label htmlFor={field.name} className={`text-xs font-bold block ${labelColor}`}>
                  {field.label} {field.required && <span className="text-rose-500">*</span>}
                </label>
              )}
              {renderField(field)}
            </div>
          ))}
        </div>

        {/* Optional Custom Slots / Children */}
        {children && <div className="pt-1">{children}</div>}

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              {cancelText}
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="flex justify-center items-center py-2.5 px-6 rounded-xl shadow-lg shadow-emerald-500/20 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <CommonLoadingBar size="w-4 h-4" />
                <span>Saving...</span>
              </div>
            ) : (
              submitText
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommonForm;
