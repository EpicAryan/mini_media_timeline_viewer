'use client'

import React from 'react'
import Image from 'next/image'
import { useAppDispatch, useAppSelector } from '@/store'
import { setSelectedFile } from '@/store/slices/mediaSlice'
import { setActiveMedia } from '@/store/slices/playerSlice'
import { formatTime } from '@/utils/mediaUtils'
import { MediaFile } from '@/store/types'
import { cn } from '@/utils/cn'

interface TimelineTrackProps {
  file: MediaFile
  trackIndex: number
  scale: number
}

// Individual timeline track with trim visualization
export const TimelineTrack = ({ file, scale }: TimelineTrackProps) => {
  const dispatch = useAppDispatch()
  const { selectedFileId } = useAppSelector(state => state.media)
  const { activeMediaId } = useAppSelector(state => state.player)

  const isSelected = selectedFileId === file.id
  const isActive = activeMediaId === file.id
  const isHighlighted = isSelected || isActive

  // Calculate track dimensions based on scale
  const trimmedDuration = file.trimEnd - file.trimStart
  const blockWidth = Math.max(80, trimmedDuration * scale)
  const blockLeft = file.trimStart * scale
  const fullWidth = file.duration * scale

  const handleClick = () => {
    dispatch(setSelectedFile(file.id))
    dispatch(setActiveMedia(file.id))
  }

  const getFlatBg = () => {
    switch (file.type) {
      case 'video':
        return 'bg-media-video'
      case 'audio':
        return 'bg-media-audio'
      case 'image':
        return 'bg-media-image'
      default:
        return 'bg-gray-600'
    }
  }

  const baseBorder = 'border-border-primary/60'
  const highlightBorder = isHighlighted ? 'border-green-400' : baseBorder

  return (
    <div className="h-16 relative">
      {/* Track center reference line */}
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t border-border-primary/40 pointer-events-none" />

      {/* Full duration background bar */}
      <div
        className={cn(
          'absolute top-1 bottom-1 rounded-md',
          getFlatBg(),
          'border border-border-primary/30'
        )}
        style={{ left: '0px', width: `${fullWidth}px` }}
        aria-hidden="true"
      />
      <div
        className={cn(
          'absolute top-1 bottom-1 z-10 cursor-pointer transition-colors duration-150',
          'px-3 flex items-center gap-3 rounded-md',
          getFlatBg(),
          'border-2', highlightBorder,
          'shadow-sm hover:shadow'
        )}
        style={{ left: `${blockLeft}px`, width: `${blockWidth}px` }}
        onClick={handleClick}
        role="button"
        aria-label={`Select ${file.name} track`}
      >
        <div className="w-10 h-10 rounded overflow-hidden bg-black/20 flex-shrink-0">
          {file.thumbnail ? (
            <Image
              src={file.thumbnail}
              alt={file.name}
              width={40}
              height={40}
              className="w-full h-full object-cover"
              unoptimized
            />
          ) : file.type === 'image' ? (
            <Image
              src={file.url}
              alt={file.name}
              width={40}
              height={40}
              className="w-full h-full object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-black/30">
              <span className="text-xs font-bold text-white">
                {file.type.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* File info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{file.name}</p>
          <p className="text-xs text-white/80">{formatTime(trimmedDuration)}</p>
        </div>

        {isActive && <div className="w-3 h-3 bg-white rounded-full" />}
      </div>

       {/* Dimmed overlay for left trimmed section */}
      {file.trimStart > 0 && (
        <div
          className="absolute top-1 bottom-1 bg-black/50 rounded-l-md pointer-events-none z-5"
          style={{ left: '0px', width: `${blockLeft}px` }}
          aria-hidden="true"
        />
      )}

      {/* Dimmed overlay for right trimmed section */}
      {file.trimEnd < file.duration && (
        <div
          className="absolute top-1 bottom-1 bg-black/50 rounded-r-md pointer-events-none z-5"
          style={{ 
            left: `${blockLeft + blockWidth}px`, 
            width: `${fullWidth - (blockLeft + blockWidth)}px` 
          }}
          aria-hidden="true"
        />
      )}

      {/* Trim boundary indicators */}
      {(file.trimStart > 0 || file.trimEnd < file.duration) && (
        <>
          {file.trimStart > 0 && (
            <div
              className="absolute top-1 bottom-1 w-1 bg-warning rounded-l-md"
              style={{ left: `${blockLeft}px` }}
            />
          )}
          {file.trimEnd < file.duration && (
            <div
              className="absolute top-1 bottom-1 w-1 bg-warning rounded-r-md"
              style={{ left: `${blockLeft + blockWidth - 4}px` }}
            />
          )}
        </>
      )}
    </div>
  )
}
