'use client'

import React from 'react'
import { useAppSelector } from '@/store'

interface TimelinePlayheadProps {
  position: number
}

export const TimelinePlayhead = ({ position }: TimelinePlayheadProps) => {
  const { isPlaying } = useAppSelector(state => state.player)

  return (
    <div
      className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-30 pointer-events-none"
      style={{ left: `${position}px` }}
    >

      <div className="absolute -top-1 -left-2 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg">
        {isPlaying && (
          <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />
        )}
      </div>
      
      <div className="absolute top-0 left-0 w-0.5 h-full bg-red-500 shadow-md" />
    </div>
  )
}
