import React from 'react'
import { cn } from '@/utils/cn'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export const Button = ({ 
  variant = 'primary', 
  size = 'md',
  className, 
  children, 
  disabled,
  ...props 
}: ButtonProps) => {
  const baseStyles = "font-medium transition-all duration-200 focus-ring rounded-lg flex items-center justify-center gap-2"
  
  const variants = {
    primary: "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed",
    secondary: "bg-surface hover:bg-hover text-primary border border-primary hover:border-secondary disabled:opacity-50 disabled:cursor-not-allowed",
    ghost: "hover:bg-hover text-secondary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed",
    danger: "bg-error hover:bg-red-600 text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
  }

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  }

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
