'use client';

import { useState } from 'react';

interface AnimatedCardProps {
  title: string;
  description: string;
  colorScheme?: 'blue' | 'purple' | 'green';
}

export function AnimatedCard({ 
  title, 
  description, 
  colorScheme = 'blue' 
}: AnimatedCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const colorClasses = {
    blue: 'bg-gradient-to-br from-blue-500 to-blue-700',
    purple: 'bg-gradient-to-br from-purple-500 to-purple-800',
    green: 'bg-gradient-to-br from-emerald-500 to-emerald-700'
  };

  return (
    <div 
      className={`
        ${colorClasses[colorScheme]}
        rounded-xl p-6 shadow-lg 
        transition-all duration-500 ease-in-out
        ${isHovered ? 'shadow-2xl scale-105' : ''}
        ${isClicked ? 'rotate-3' : ''}
        hover:shadow-2xl cursor-pointer
        max-w-sm mx-auto
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        setIsClicked(true);
        setTimeout(() => setIsClicked(false), 300);
      }}
    >
      <div className="flex items-center mb-4">
        <div 
          className={`
            w-12 h-12 rounded-full flex items-center justify-center 
            bg-white/20 backdrop-blur-sm
            transition-all duration-500
            ${isHovered ? 'scale-110 rotate-12' : ''}
          `}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 text-white"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M13 10V3L4 14h7v7l9-11h-7z" 
            />
          </svg>
        </div>
        <h3 
          className={`
            ml-4 text-xl font-bold text-white
            transition-all duration-300
            ${isHovered ? 'translate-x-1' : ''}
          `}
        >
          {title}
        </h3>
      </div>
      
      <p 
        className={`
          text-white/90 
          transition-all duration-500 delay-100
          ${isHovered ? 'translate-y-1 text-white' : ''}
        `}
      >
        {description}
      </p>
      
      <button 
        className={`
          mt-6 px-4 py-2 bg-white/20 rounded-lg text-white 
          hover:bg-white/30 font-medium
          transition-all duration-300
          ${isHovered ? 'translate-y-[-4px] shadow-md' : ''}
        `}
      >
        Learn More
      </button>
    </div>
  );
} 