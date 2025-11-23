'use client';

import { useEffect, useRef } from 'react';

interface FloatingElementsProps {
  count?: number;
  maxSize?: number;
  minSize?: number;
  colorScheme?: 'blue' | 'purple' | 'mixed';
}

export function FloatingElements({
  count = 20,
  maxSize = 100,
  minSize = 20,
  colorScheme = 'blue'
}: FloatingElementsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // Clear any existing floating elements
    container.innerHTML = '';
    
    // Set container position to relative if not already
    if (window.getComputedStyle(container).position === 'static') {
      container.style.position = 'relative';
    }
    
    // Create floating elements
    for (let i = 0; i < count; i++) {
      const element = document.createElement('div');
      const size = Math.random() * (maxSize - minSize) + minSize;
      
      // Random position
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      
      // Random animation duration between 15-40s
      const animDuration = (Math.random() * 25 + 15).toFixed(1);
      
      // Random delay
      const animDelay = (Math.random() * 10).toFixed(1);
      
      // Color based on scheme
      let color;
      if (colorScheme === 'blue') {
        color = `rgba(59, 130, 246, ${Math.random() * 0.2 + 0.1})`;
      } else if (colorScheme === 'purple') {
        color = `rgba(168, 85, 247, ${Math.random() * 0.2 + 0.1})`;
      } else {
        // Mixed: randomly choose between blue and purple
        const colors = [
          `rgba(59, 130, 246, ${Math.random() * 0.2 + 0.1})`,
          `rgba(168, 85, 247, ${Math.random() * 0.2 + 0.1})`,
          `rgba(52, 211, 153, ${Math.random() * 0.2 + 0.1})`
        ];
        color = colors[Math.floor(Math.random() * colors.length)];
      }
      
      // Apply styles
      Object.assign(element.style, {
        position: 'absolute',
        left: `${posX}%`,
        top: `${posY}%`,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        backgroundColor: color,
        filter: 'blur(8px)',
        pointerEvents: 'none',
        animation: `float ${animDuration}s ease-in-out ${animDelay}s infinite alternate, 
                   spin ${(Math.random() * 20 + 10).toFixed(1)}s linear ${animDelay}s infinite`,
        transformOrigin: 'center center'
      });
      
      container.appendChild(element);
    }
    
    // Add keyframe animation styles if not already present
    if (!document.getElementById('floating-animations')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'floating-animations';
      styleEl.textContent = `
        @keyframes float {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px) scale(1.1); }
          100% { transform: translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px) scale(1); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(styleEl);
    }
    
    // Clean up
    return () => {
      const style = document.getElementById('floating-animations');
      if (style) {
        style.remove();
      }
    };
  }, [count, maxSize, minSize, colorScheme]);
  
  return (
    <div 
      ref={containerRef}
      style={{ 
        width: '100%', 
        height: '100%',
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0
      }}
      aria-hidden="true"
    />
  );
} 