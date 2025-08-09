'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useAppSelector, useAppDispatch } from '@/store'
import { ExportModal } from '@/components/ui/ExportModal'
import { zoomIn, zoomOut } from '@/store/slices/timelineSlice'
import { 
  ZoomIn, 
  ZoomOut, 
  Download,
} from 'lucide-react'

export const Header = () => {
  const dispatch = useAppDispatch()
  const [showExportModal, setShowExportModal] = useState(false)
  const { scale } = useAppSelector(state => state.timeline)
  const { selectedFileId } = useAppSelector(state => state.media)


  return (
    <>
      <header className="h-14 bg-panel border-b border-primary px-6 flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-primary">Timeline Viewer</h1>
        </div>

        {/* Center controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(zoomOut())}
            disabled={scale <= 10}
          >
            <ZoomOut size={16} />
          </Button>
          
          <span className="text-sm text-secondary font-mono">
            {Math.round(scale)}%
          </span>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(zoomIn())}
            disabled={scale >= 500}
          >
            <ZoomIn size={16} />
          </Button>
          
          <div className="w-px h-6 bg-border-primary mx-2" />
          
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
            <Button 
              variant="primary" 
              size="sm" 
              onClick={() => setShowExportModal(true)}
              disabled={!selectedFileId}
              className={`transition-all duration-200 ${
                !selectedFileId 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:scale-105 cursor-pointer'
              }`}
            >
              <Download size={16} />
              Export
            </Button>
          </div>
      </header>


      <ExportModal 
        isOpen={showExportModal} 
        onClose={() => setShowExportModal(false)} 
      />
    </>
  )
}
