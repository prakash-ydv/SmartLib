// src/components/Button.jsx - Simple Button Component
import React from 'react';

const Button = ({ 
  children, 
  variant = 'default', 
  size = 'default', 
  className = '', 
  ...props 
}) => {
  // Base styles
  const baseStyles = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  
  // Variant styles
  const variants = {
    default: 'bg-primary text-white shadow hover:bg-primary/90 focus:ring-primary',
    destructive: 'bg-red-600 text-white shadow-sm hover:bg-red-700 focus:ring-red-600',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-100 focus:ring-primary',
    secondary: 'bg-gray-200 text-gray-900 shadow-sm hover:bg-gray-300 focus:ring-gray-400',
    ghost: 'bg-transparent hover:bg-gray-100 focus:ring-gray-400',
    link: 'text-primary underline-offset-4 hover:underline',
  };
  
  // Size styles
  const sizes = {
    default: 'h-10 px-4 py-2 text-sm',
    sm: 'h-8 px-3 text-xs',
    lg: 'h-12 px-8 text-base',
    icon: 'h-10 w-10',
  };
  
  // Combine classes
  const buttonClass = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  );
};

export default Button;