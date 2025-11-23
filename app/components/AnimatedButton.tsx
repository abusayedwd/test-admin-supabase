'use client';

import { useState } from 'react';

interface AnimatedButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export function AnimatedButton({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  fullWidth = false,
  icon
}: AnimatedButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  
  // Handle button press animations
  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);
  
  // Size classes
  const sizeClasses = {
    sm: 'text-xs py-1.5 px-3',
    md: 'text-sm py-2 px-4',
    lg: 'text-base py-2.5 px-6'
  };
  
  // Variant classes
  const variantClasses = {
    primary: `
      bg-gradient-to-r from-blue-500 to-indigo-600
      hover:from-blue-600 hover:to-indigo-700
      text-white shadow-md hover:shadow-lg
      hover:shadow-blue-500/20
      active:shadow-blue-500/30
    `,
    secondary: `
      bg-gradient-to-r from-purple-500 to-pink-600
      hover:from-purple-600 hover:to-pink-700
      text-white shadow-md hover:shadow-lg
      hover:shadow-purple-500/20
      active:shadow-purple-500/30
    `,
    outline: `
      border-2 border-blue-500 dark:border-blue-400
      hover:border-blue-600 dark:hover:border-blue-300
      text-blue-600 dark:text-blue-300
      hover:bg-blue-50 dark:hover:bg-blue-900/20
    `
  };
  
  return (
    <button
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        rounded-lg font-medium transition-all duration-300
        transform relative
        ${isPressed ? 'scale-95' : 'hover:scale-105'}
        flex items-center justify-center gap-2
      `}
    >
      {icon && <span className="transition-transform duration-300 group-hover:rotate-12">{icon}</span>}
      <span className="relative">
        {/* Text with optional pseudo-element underline animation */}
        {children}
        {variant === 'outline' && (
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
        )}
      </span>
      
      {/* Animated circle effect on press */}
      {isPressed && (
        <span className="absolute inset-0 w-full h-full bg-white/20 rounded-lg animate-ping opacity-75"></span>
      )}
    </button>
  );
} 