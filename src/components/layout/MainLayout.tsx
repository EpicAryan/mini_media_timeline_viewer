'use client'

import React from 'react'
import { Header } from './Header'
import { MediaUploader } from '@/components/media/MediaUploader'
import { MediaPlayer } from '@/components/media/MediaPlayer'
import { Timeline } from '@/components/timeline/Timeline'
import { TrimControls } from '@/components/media/TrimControls'
import { useSimpleKeyboard } from '@/hooks/useKeyboardShortcuts'

// Main app layout with keyboard shortcuts
export const MainLayout = () => {
  useSimpleKeyboard() // Initialize global keyboard shortcuts
  
  return (
    <div className="h-screen bg-app text-primary flex flex-col overflow-hidden">
      <Header />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 flex flex-row overflow-hidden">
          {/* Left sidebar - Media upload */}
          <div className="w-70 2xl:w-80 bg-panel border-r border-primary overflow-y-hidden px-1">
            <MediaUploader />
          </div>

          {/* Center - Media player */}
          <div className="flex-1 bg-surface overflow-y-hidden px-2">
            <MediaPlayer />
          </div>

           {/* Right sidebar - Trim controls */}
          <div className="w-70 2xl:w-80 bg-panel border-l border-primary overflow-y-auto px-2">
            <TrimControls />
          </div>
        </div>

        {/* Bottom timeline */}
        <div className="h-40 2xl:h-60 bg-timeline border-t border-primary ">
          <Timeline />
        </div>
      </div>
    </div>
  )
}
