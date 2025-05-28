
import React from 'react';

interface SpringVisualProps {
  springs: string;
  className?: string;
}

export const SpringVisual = ({ springs, className = "" }: SpringVisualProps) => {
  if (springs === 'none') return null;
  
  const getSpringConfig = (springValue: string) => {
    // Handle numeric values (e.g., "1.5", "2")
    if (!isNaN(Number(springValue))) {
      const num = Number(springValue);
      if (num <= 1) return [{ color: 'bg-green-500', label: 'Light' }];
      if (num <= 2) return [{ color: 'bg-yellow-500', label: 'Medium' }];
      return [{ color: 'bg-red-500', label: 'Heavy' }, { color: 'bg-red-500', label: 'Heavy' }];
    }
    
    // Handle color combinations (e.g., "red,yellow", "green,red")
    if (springValue.includes(',')) {
      return springValue.split(',').map(color => {
        const trimmedColor = color.trim().toLowerCase();
        switch (trimmedColor) {
          case 'green': return { color: 'bg-green-500', label: 'Light' };
          case 'yellow': return { color: 'bg-yellow-500', label: 'Medium' };
          case 'red': return { color: 'bg-red-500', label: 'Heavy' };
          default: return { color: 'bg-gray-500', label: 'Custom' };
        }
      });
    }
    
    // Handle standard spring settings
    const springConfig = {
      'light': [{ color: 'bg-green-500', label: 'Light' }],
      'medium': [{ color: 'bg-yellow-500', label: 'Medium' }],
      'heavy': [{ color: 'bg-red-500', label: 'Heavy' }, { color: 'bg-red-500', label: 'Heavy' }],
      'mixed': [
        { color: 'bg-red-500', label: 'Heavy' },
        { color: 'bg-yellow-500', label: 'Medium' },
        { color: 'bg-green-500', label: 'Light' }
      ]
    };

    return springConfig[springValue as keyof typeof springConfig] || springConfig.light;
  };

  const springConfig = getSpringConfig(springs);
  
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {springConfig.map((spring, index) => (
        <div 
          key={index} 
          className={`w-3 h-3 rounded-full ${spring.color}`}
          title={spring.label}
        />
      ))}
    </div>
  );
};
