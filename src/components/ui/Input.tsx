import React, { forwardRef } from 'react'
import { cn } from '@/utils/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-secondary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full bg-surface border rounded-lg px-3 py-2 text-primary placeholder-text-muted transition-all duration-200 focus:outline-none focus:bg-panel",
            error 
              ? "border-error focus:border-error" 
              : "border-primary focus:border-accent",
            className
          )}
          {...props}
        />
        {(error || helperText) && (
          <p className={cn(
            "text-sm",
            error ? "text-error" : "text-muted"
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
