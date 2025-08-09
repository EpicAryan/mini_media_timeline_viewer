'use client'

import React from 'react'
import { formatTime } from '@/utils/mediaUtils'

interface TimelineRulerProps {
  maxDuration: number
  scale: number
  timelineWidth: number
}

export const TimelineRuler = ({ maxDuration, scale, timelineWidth }: TimelineRulerProps) => {
  const seconds = Array.from({ length: maxDuration + 1 }, (_, i) => i)
  const minorFractions = [0.25, 0.5, 0.75]

  return (
    <div className="h-12 bg-surface border-b border-primary flex-shrink-0 overflow-hidden relative">
      <div className="relative h-full" style={{ width: `${timelineWidth}px` }}>
        {/* Major ticks */}
        <div className="absolute inset-0">
          {seconds.map((s) => {
            const x = Math.round(s * scale)
            return (
              <div key={`major-${s}`} className="absolute top-0 bottom-0" style={{ transform: `translateX(${x}px)` }}>
                <div className="h-full border-l border-border-primary" />
                <span className="absolute top-1 left-1 text-xs text-primary font-mono font-semibold">
                  {formatTime(s)}
                </span>
              </div>
            )
          })}
        </div>

        {/* Minor ticks */}
        <div className="absolute inset-0">
          {seconds.slice(0, -1).map((s) =>
            minorFractions.map((f) => {
              const x = Math.round((s + f) * scale)
              return (
                <div
                  key={`minor-${s}-${f}`}
                  className="absolute top-6 h-3 border-l border-border-secondary"
                  style={{ transform: `translateX(${x}px)`, width: 1 }}
                />
              )
            })
          )}
        </div>

        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(to right, transparent, transparent ${Math.max(
              1,
              Math.round(scale) - 1
            )}px, rgba(255,255,255,0.1) ${Math.round(scale)}px)`,
          }}
        />
      </div>
    </div>
  )
}
