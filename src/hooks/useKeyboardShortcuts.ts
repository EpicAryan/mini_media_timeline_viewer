
'use client'

import { useEffect, useCallback } from 'react'
import { useAppDispatch } from '@/store'
import { togglePlayPause } from '@/store/slices/playerSlice'

interface UseSimpleKeyboardProps {
  onEnterPress?: () => void
}

// Basic keyboard shortcuts for play/pause and enter
export const useSimpleKeyboard = ({ onEnterPress }: UseSimpleKeyboardProps = {}) => {
  const dispatch = useAppDispatch()

  // Handle global keyboard events with input detection
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    const target = event.target as HTMLElement
    const isInputFocused = target.tagName === 'INPUT' || 
                          target.tagName === 'TEXTAREA' || 
                          target.contentEditable === 'true'

    switch (event.key) {
      case ' ':
        if (!isInputFocused) {
          event.preventDefault()
          dispatch(togglePlayPause())
        }
        break
        
      case 'Enter':
        if (onEnterPress && !isInputFocused) {
          event.preventDefault()
          onEnterPress()
        }
        break
    }
  }, [dispatch, onEnterPress])

  // Attach global keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])
}
