'use client';

import { useState, useEffect, useRef } from 'react';

interface CounterAnimationProps {
  start?: number;
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export function CounterAnimation({
  start = 0,
  end,
  duration = 2000,
  prefix = '',
  suffix = '',
  decimals = 0
}: CounterAnimationProps) {
  const [count, setCount] = useState(start);
  const [isInView, setIsInView] = useState(false);
  const countRef = useRef<HTMLDivElement>(null);

  // Format number with commas and decimal places
  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  // Set up intersection observer to trigger animation when in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 } // Trigger when at least 10% is visible
    );
    
    if (countRef.current) {
      observer.observe(countRef.current);
    }
    
    return () => {
      if (countRef.current) {
        observer.unobserve(countRef.current);
      }
    };
  }, []);

  // Run the counter animation
  useEffect(() => {
    if (!isInView) return;
    
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentCount = progress * (end - start) + start;
      
      setCount(currentCount);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [start, end, duration, isInView]);

  return (
    <div 
      ref={countRef} 
      className="font-bold text-4xl md:text-5xl lg:text-6xl transition-all duration-300"
    >
      <div className="flex items-center justify-center">
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {prefix}{formatNumber(count)}{suffix}
        </span>
      </div>
    </div>
  );
} 