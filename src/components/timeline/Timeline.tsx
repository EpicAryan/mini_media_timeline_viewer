'use client'

import React, { useRef, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '@/store'
import { setScrollPosition } from '@/store/slices/timelineSlice'
import { TimelineTrack } from './TimelineTrack'
import { TimelinePlayhead } from './TimelinePlayhead'
import { TimelineRuler } from './TimelineRuler'
import { TimelineSidebar } from './TimelineSidebar'

// Main timeline with tracks and playhead
export const Timeline = () => {
  const dispatch = useAppDispatch()
  const timelineRef = useRef<HTMLDivElement>(null)
  const { files } = useAppSelector(state => state.media)
  const { scale, playheadPosition } = useAppSelector(state => state.timeline)

  // Calculate timeline dimensions
  const maxDuration = files.reduce((max, file) => 
    Math.max(max, file.trimEnd), 30
  )
  const timelineWidth = Math.max(2000, maxDuration * scale)


   // Auto-scroll to follow playhead
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    dispatch(setScrollPosition(e.currentTarget.scrollLeft))
  }

  useEffect(() => {
    if (timelineRef.current && playheadPosition > 0) {
      const container = timelineRef.current
      const containerWidth = container.clientWidth
      const scrollLeft = container.scrollLeft
      
      if (playheadPosition < scrollLeft + 100 || playheadPosition > scrollLeft + containerWidth - 100) {
        container.scrollLeft = Math.max(0, playheadPosition - containerWidth / 2)
      }
    }
  }, [playheadPosition])

  return (
    <div className="h-full flex bg-timeline text-white">
      <TimelineSidebar files={files} />
      

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Time Ruler */}
        <TimelineRuler 
          maxDuration={maxDuration} 
          scale={scale} 
          timelineWidth={timelineWidth} 
        />
        
        {/* Timeline Tracks */}
        <div 
          ref={timelineRef}
          className="flex-1 overflow-auto relative"
          onScroll={handleScroll}
        >
          <div 
            className="relative"
            style={{ 
              width: `${timelineWidth}px`,
              minHeight: '100%'
            }}
          >
            <div className="space-y-1 py-2">
              {files.map((file, index) => (
                <TimelineTrack
                  key={file.id}
                  file={file}
                  trackIndex={index}
                  scale={scale}
                />
              ))}
            </div>
            
            {/* Playhead */}
            <TimelinePlayhead position={playheadPosition} />
          </div>
        </div>
      </div>
    </div>
  )
}
