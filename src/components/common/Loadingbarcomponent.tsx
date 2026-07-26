import React from 'react';

export interface LoadingbarcomponentProps {
  label?: string;
  subtext?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'amazon' | 'tcs' | 'neutral';
  // Legacy props kept for compatibility — unused by spinner
  progress?: number | null;
  height?: string;
  showPercent?: boolean;
  showLabel?: boolean;
  glass?: boolean;
  className?: string;
}

/**
 * Spinner Loading Indicator — Amazon / TCS enterprise style
 * Replaces the bar-based loader with a clean circular spinner.
 */
const Loadingbarcomponent: React.FC<LoadingbarcomponentProps> = ({
  label = 'Loading...',
  subtext = '',
  size = 'md',
  variant = 'amazon',
  className = '',
}) => {
  const colors = {
    amazon: { ring: 'border-[#ff9900]', text: 'text-[#ff9900]', sub: 'text-[#555]' },
    tcs: { ring: 'border-[#003365]', text: 'text-[#003365]', sub: 'text-[#666]' },
    neutral: { ring: 'border-slate-500', text: 'text-slate-600', sub: 'text-slate-400' },
  }[variant] ?? { ring: 'border-[#ff9900]', text: 'text-[#ff9900]', sub: 'text-[#555]' };

  const spinnerSize = { sm: 'w-6 h-6 border-2', md: 'w-10 h-10 border-[3px]', lg: 'w-14 h-14 border-4' }[size];

  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-8 ${className}`}>
      {/* Spinner circle */}
      <div
        className={`${spinnerSize} rounded-full border-slate-200 ${colors.ring} border-t-transparent animate-spin`}
        style={{ borderStyle: 'solid' }}
        role="status"
        aria-label="Loading"
      />

      {/* Label */}
      {label && (
        <p className={`text-sm font-semibold tracking-tight ${colors.text}`}>{label}</p>
      )}

      {/* Subtext */}
      {subtext && (
        <p className={`text-xs ${colors.sub}`}>{subtext}</p>
      )}
    </div>
  );
};

export default Loadingbarcomponent;
