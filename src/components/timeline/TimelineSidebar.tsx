'use client'

import React from 'react'
import Image from 'next/image'
import { Play, Volume2, FileImage } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/store'
import { setSelectedFile } from '@/store/slices/mediaSlice'
import { setActiveMedia } from '@/store/slices/playerSlice'
import { formatTime } from '@/utils/mediaUtils'
import { MediaFile } from '@/store/types'
import { cn } from '@/utils/cn'

interface TimelineSidebarProps {
  files: MediaFile[]
}

// Sidebar with track list for timeline navigation
export const TimelineSidebar = ({ files }: TimelineSidebarProps) => {
  const dispatch = useAppDispatch()
  const { selectedFileId } = useAppSelector(state => state.media)
  const { activeMediaId } = useAppSelector(state => state.player)

  // Handle file selection and activation
  const handleFileSelect = (fileId: string) => {
    dispatch(setSelectedFile(fileId))
    dispatch(setActiveMedia(fileId))
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play size={16} className="text-media-video" />
      case 'audio': return <Volume2 size={16} className="text-media-audio" />
      case 'image': return <FileImage size={16} className="text-media-image" />
      default: return <FileImage size={16} className="text-muted" />
    }
  }

  return (
    <div className="w-70 2xl:w-80 bg-panel border-r border-primary flex-shrink-0 flex flex-col">
      {/* Header */}
      <div className="p-2 flex items-center justify-around border-b border-primary">
        <h3 className="font-semibold text-primary mb-1">Timeline Tracks</h3>
        <p className="text-xs text-secondary">
          {files.length} file{files.length !== 1 ? 's' : ''}
        </p>
      </div>
      
      {/* Scrollable file list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-12 h-12 rounded-full bg-surface border-2 border-dashed border-border-primary flex items-center justify-center mb-3">
              <Play size={20} className="text-muted" />
            </div>
            <p className="text-sm text-secondary">No tracks yet</p>
            <p className="text-xs text-muted mt-1">Upload files to see them here</p>
          </div>
        ) : (
          files.map((file, index) => (
            <div
              key={file.id}
              className={cn(
                "group flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-hover",
                selectedFileId === file.id && "bg-accent/10 border border-accent",
                activeMediaId === file.id && "bg-accent/5"
              )}
              onClick={() => handleFileSelect(file.id)}
              aria-label={`Select track ${index + 1}: ${file.name}`}
            >
              {/* Track Number */}
              <div className="w-6 h-6 rounded bg-surface flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-mono text-secondary">{index + 1}</span>
              </div>
              
              {/* Thumbnail */}
              <div className="w-12 h-12 rounded-md overflow-hidden bg-surface flex-shrink-0 relative">
                {file.thumbnail ? (
                  <Image
                    src={file.thumbnail}
                    alt={file.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                    unoptimized
                  />
                ) : file.type === 'image' ? (
                  <Image
                    src={file.url}
                    alt={file.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                    unoptimized
                  />
                ) : (
                  <div className={cn(
                    "w-full h-full flex items-center justify-center",
                    file.type === 'video' && "bg-media-video/20",
                    file.type === 'audio' && "bg-media-audio/20"
                  )}>
                    {getFileIcon(file.type)}
                  </div>
                )}
                
                {/* Active indicator */}
                {activeMediaId === file.id && (
                  <div className="absolute inset-0 bg-accent/20 flex items-center justify-center">
                    <div className="w-4 h-4 bg-accent rounded-full animate-pulse" />
                  </div>
                )}
              </div>
              
              {/* File Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary truncate group-hover:text-accent transition-colors">
                  {file.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded text-white font-medium",
                    file.type === 'video' && "bg-media-video",
                    file.type === 'audio' && "bg-media-audio",
                    file.type === 'image' && "bg-media-image"
                  )}>
                    {file.type.charAt(0).toUpperCase()}
                  </span>
                  <span className="text-xs text-secondary">
                    {file.duration > 0 ? formatTime(file.duration) : 'Static'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
