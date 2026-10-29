import React from 'react';
import { ChevronDown } from 'lucide-react';
import CommonLoadingBar from './CommonLoadingBar';

export interface FormField {
  name: string;
  label: string;
  type?:
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
  submitText?: string;
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
  submitText = 'Submit',
  isLoading = false,
  error = null,
  theme = 'dark',
  gridCols = 1,
  children,
  onCancel,
  cancelText = 'Cancel',
}) => {
  const isLight = theme === 'light';

  // Base styling for form controls
  const inputClass = `w-full rounded-xl border py-2.5 text-xs sm:text-sm font-medium transition-all focus:outline-none focus:ring-2 ${
    isLight
      ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-emerald-500/20 focus:border-emerald-500'
      : 'bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:bg-slate-900 focus:ring-emerald-500/30 focus:border-emerald-500'
  }`;

  const labelColor = isLight ? 'text-slate-700' : 'text-slate-300';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'custom':
        return field.renderCustom ? field.renderCustom(formData, onChange) : null;

      case 'textarea':
        return (
          <textarea
            id={field.name}
            name={field.name}
            value={formData[field.name] ?? ''}
            onChange={(e) => onChange(field.name, e.target.value)}
            required={field.required}
            placeholder={field.placeholder}
            rows={field.rows || 3}
            className={`${inputClass} px-3.5 resize-none`}
          />
        );

      case 'file':
        return (
          <input
            id={field.name}
            type="file"
            accept={field.accept || 'image/*'}
            onChange={(e) => onChange(field.name, e.target.files?.[0] || null)}
            className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-500/10 file:text-emerald-500 hover:file:bg-emerald-500/20 cursor-pointer"
          />
        );

      case 'select':
        return (
          <div className="relative">
            {field.icon && (
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                {field.icon}
              </span>
            )}
            <select
              id={field.name}
              name={field.name}
              value={formData[field.name] ?? ''}
              onChange={(e) => onChange(field.name, e.target.value)}
              required={field.required}
              className={`${inputClass} ${field.icon ? 'pl-10' : 'pl-3.5'} pr-10 appearance-none cursor-pointer`}
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
            <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
              <ChevronDown className="w-4 h-4" />
            </span>
          </div>
        );

      case 'radio':
        return (
          <div className="flex flex-wrap gap-4 mt-1.5">
            {field.options?.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={field.name}
                  value={opt.value}
                  checked={String(formData[field.name]) === String(opt.value)}
                  onChange={(e) => onChange(field.name, e.target.value)}
                  required={field.required}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className={`text-xs font-semibold ${labelColor}`}>{opt.label}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <label className="flex items-center gap-2 cursor-pointer mt-1">
            <input
              type="checkbox"
              id={field.name}
              name={field.name}
              checked={Boolean(formData[field.name])}
              onChange={(e) => onChange(field.name, e.target.checked)}
              required={field.required}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
            />
            <span className={`text-xs font-semibold ${labelColor}`}>{field.label}</span>
          </label>
        );

      default:
        return (
          <div className="relative">
            {field.icon && (
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                {field.icon}
              </span>
            )}
            <input
              id={field.name}
              type={field.type || 'text'}
              name={field.name}
              value={formData[field.name] ?? ''}
              onChange={(e) => onChange(field.name, e.target.value)}
              required={field.required}
              placeholder={field.placeholder}
              className={`${inputClass} ${field.icon ? 'pl-10' : 'pl-3.5'} pr-3.5`}
            />
          </div>
        );
    }
  };

  return (
    <div className={`w-full ${isLight ? 'text-slate-800' : 'text-slate-100'}`}>
      {(title || subtitle) && (
        <div className="mb-5">
          {title && (
            <h2 className={`text-lg font-bold tracking-tight mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {title}
            </h2>
          )}
          {subtitle && <p className="text-xs text-slate-400 leading-relaxed">{subtitle}</p>}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-xs font-semibold">
            {error}
          </div>
        )}

        <div className={gridCols === 2 ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : 'space-y-4'}>
          {fields.map((field) => (
            <div
              key={field.name}
              className={`${field.colSpan === 2 && gridCols === 2 ? 'sm:col-span-2' : ''} ${
                field.type !== 'checkbox' ? 'space-y-1' : ''
              }`}
            >
              {field.type !== 'checkbox' && (
                <label htmlFor={field.name} className={`text-xs font-semibold block ${labelColor}`}>
                  {field.label} {field.required && <span className="text-rose-500">*</span>}
                </label>
              )}
              {renderField(field)}
            </div>
          ))}
        </div>

        {/* Optional custom children */}
        {children && <div className="pt-1">{children}</div>}

        {/* Action buttons */}
        <div className={`pt-3 border-t flex items-center justify-end gap-3 ${isLight ? 'border-slate-100' : 'border-slate-800'}`}>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              {cancelText}
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center py-2.5 px-6 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-md shadow-emerald-600/20"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
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
