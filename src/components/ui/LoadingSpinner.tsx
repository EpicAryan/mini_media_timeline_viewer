import React from 'react'
import { cn } from '@/utils/cn'

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  variant?: 'default' | 'accent' | 'white'
}

export const LoadingSpinner = ({ 
  size = 'md', 
  className,
  variant = 'default'
}: LoadingSpinnerProps) => {
  const sizes = {
    xs: 'w-3 h-3 border',
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-2',
    xl: 'w-12 h-12 border-4'
  }

  const variants = {
    default: 'border-border-primary border-t-accent',
    accent: 'border-accent/20 border-t-accent',
    white: 'border-white/20 border-t-white'
  }

  return (
    <div className={cn(
      'animate-spin rounded-full',
      sizes[size],
      variants[variant],
      className
    )} />
  )
}
