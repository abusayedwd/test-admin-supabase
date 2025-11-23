'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'purple' | 'green' | 'white';
  thickness?: 'thin' | 'regular' | 'thick';
}

export function LoadingSpinner({
  size = 'md',
  color = 'blue',
  thickness = 'regular'
}: LoadingSpinnerProps) {
  // Size mapping
  const sizeMapping = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  // Color mapping
  const colorMapping = {
    blue: 'border-blue-500',
    purple: 'border-purple-500',
    green: 'border-emerald-500',
    white: 'border-white'
  };

  // Thickness mapping
  const thicknessMapping = {
    thin: 'border-2',
    regular: 'border-3',
    thick: 'border-4'
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`
          ${sizeMapping[size]}
          ${thicknessMapping[thickness]}
          ${colorMapping[color]}
          border-solid rounded-full
          border-t-transparent
          animate-spin
        `}
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
} 