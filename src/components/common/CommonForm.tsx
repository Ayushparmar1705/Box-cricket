import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import type { CommonFormProps, FormField } from '../../types/form.types';
import LocationPicker from '../LocationPicker';

export function CommonForm<T>({
  fields,
  initialValues = {},
  mode = 'add',
  onSubmit,
  onCancel,
  submitLabel = mode === 'add' ? 'Create' : 'Save Changes',
  cancelLabel = 'Cancel'
}: CommonFormProps<T>) {
  
  const [formData, setFormData] = useState<Partial<T>>({} as Partial<T>);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setFormData(initialValues);
    }
  }, [initialValues]);

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    fields.forEach(field => {
      const value = (formData as any)[field.name];
      
      // Required check
      if (field.required && (value === undefined || value === null || value === '')) {
        newErrors[field.name as string] = `${field.label} is required`;
        isValid = false;
      }
      
      // Custom validation
      if (field.validation && value !== undefined && value !== '') {
        const customError = field.validation(value, formData);
        if (customError) {
          newErrors[field.name as string] = customError;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await Promise.resolve(onSubmit(formData));
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField<T>) => {
    const value = (formData as any)[field.name] || '';
    const hasError = !!errors[field.name as string];
    const baseInputClass = `w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm transition-colors focus:outline-none focus:ring-2 ${
      hasError 
        ? 'border-rose-300 dark:border-rose-700 focus:border-rose-500 focus:ring-rose-500/20 text-rose-900 dark:text-rose-100'
        : 'border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/20 text-slate-900 dark:text-slate-100'
    }`;

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleChange(field.name as string, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className={baseInputClass}
          />
        );
      
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleChange(field.name as string, e.target.value)}
            className={baseInputClass}
          >
            <option value="" disabled>Select {field.label}</option>
            {field.options?.map((opt, i) => (
              <option key={i} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center mt-3">
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => handleChange(field.name as string, e.target.checked)}
              className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-700"
            />
            <span className="ml-2 text-sm text-slate-600 dark:text-slate-300">
              {field.placeholder || `Enable ${field.label}`}
            </span>
          </div>
        );
        
      case 'file':
        return (
          <input
            type="file"
            accept={field.accept}
            onChange={(e) => {
              const file = e.target.files?.[0];
              handleChange(field.name as string, file);
            }}
            className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 dark:file:bg-emerald-900/30 dark:file:text-emerald-400 dark:hover:file:bg-emerald-900/50 transition-colors"
          />
        );
        
      case 'location':
        return (
          <div className="w-full mt-2 border rounded-xl overflow-hidden border-slate-200 dark:border-slate-700">
            <LocationPicker
              latitude={(formData as any).latitude || null}
              longitude={(formData as any).longitude || null}
              onLocationChange={(lat, lng) => {
                handleChange('latitude', lat);
                handleChange('longitude', lng);
              }}
            />
          </div>
        );

      default:
        return (
          <input
            type={field.type}
            value={value}
            onChange={(e) => handleChange(field.name as string, field.type === 'number' ? Number(e.target.value) : e.target.value)}
            placeholder={field.placeholder}
            className={baseInputClass}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        {fields.map((field) => (
          <div 
            key={field.name as string} 
            className={`flex flex-col gap-1.5 ${field.halfWidth ? 'col-span-1' : 'col-span-1 md:col-span-2'}`}
          >
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              {field.label}
              {field.required && <span className="text-rose-500">*</span>}
            </label>
            
            {renderField(field)}
            
            {errors[field.name as string] && (
              <span className="text-xs text-rose-500 font-medium">
                {errors[field.name as string]}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800 mt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center justify-center gap-2 transition-all shadow-sm shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : null}
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
