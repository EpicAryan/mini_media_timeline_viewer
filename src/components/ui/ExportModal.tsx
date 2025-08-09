'use client'

import React from 'react'
import { X, Download, FileVideo, FileAudio, FileImage, Clock, HardDrive, Loader } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Modal } from '@/components/ui/Modal'
import { useMediaExport } from '@/hooks/useMediaExport'
import { formatTime, formatFileSize } from '@/utils/mediaUtils'
import { cn } from '@/utils/cn'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ExportModal = ({ isOpen, onClose }: ExportModalProps) => {
  const {
    exportSelectedMedia,
    isExporting,
    exportProgress,
    exportError,
    selectedFile,
    ffmpegReady,
    ffmpegLoading,
    clearError
  } = useMediaExport()

  if (!selectedFile) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Export Media">
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface border-2 border-dashed border-border-primary flex items-center justify-center">
            <Download size={24} className="text-muted" />
          </div>
          <h3 className="text-lg font-semibold text-primary mb-2">No Media Selected</h3>
          <p className="text-secondary">Please select a media file from the timeline to export.</p>
        </div>
      </Modal>
    )
  }

  const getFileIcon = () => {
    switch (selectedFile.type) {
      case 'video': return <FileVideo size={24} className="text-media-video" />
      case 'audio': return <FileAudio size={24} className="text-media-audio" />
      case 'image': return <FileImage size={24} className="text-media-image" />
      default: return <Download size={24} className="text-muted" />
    }
  }

  const trimmedDuration = selectedFile.trimEnd - selectedFile.trimStart
  const hasTrims = selectedFile.trimStart > 0 || selectedFile.trimEnd < selectedFile.duration
  const needsFFmpeg = selectedFile.type === 'video' || selectedFile.type === 'audio'

  const handleExport = async () => {
    if (exportError) clearError()
    await exportSelectedMedia()
  }

  const canExport = needsFFmpeg ? ffmpegReady : true

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export Media" size="md">
      <div className="space-y-6">
        {ffmpegLoading && (
          <div className="bg-info/5 border border-info/20 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <LoadingSpinner size="sm" />
              <div>
                <p className="text-sm font-medium text-info">Loading FFmpeg...</p>
                <p className="text-sm text-info/80">Please wait while we prepare the video processing engine.</p>
              </div>
            </div>
          </div>
        )}

        {/* File Preview */}
        <div className="bg-surface rounded-xl p-4 border border-primary">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              {getFileIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-primary truncate mb-2">
                {selectedFile.name}
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-secondary">Type:</span>
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-medium text-white",
                      selectedFile.type === 'video' && "bg-media-video",
                      selectedFile.type === 'audio' && "bg-media-audio",
                      selectedFile.type === 'image' && "bg-media-image"
                    )}>
                      {selectedFile.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HardDrive size={14} className="text-secondary" />
                    <span className="text-secondary">Size:</span>
                    <span className="text-primary">{formatFileSize(selectedFile.size)}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {selectedFile.duration > 0 && (
                    <>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-secondary" />
                        <span className="text-secondary">Original:</span>
                        <span className="text-primary">{formatTime(selectedFile.duration)}</span>
                      </div>
                      {hasTrims && (
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-warning" />
                          <span className="text-secondary">Trimmed:</span>
                          <span className="text-warning">{formatTime(trimmedDuration)}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trim Information */}
        {hasTrims && (
          <div className="bg-warning/5 border border-warning/20 rounded-lg p-4">
            <h4 className="font-medium text-warning mb-3 flex items-center gap-2">
              <Clock size={16} />
              Trim Settings Applied
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-secondary">Start Time:</span>
                <span className="ml-2 font-mono text-primary">{formatTime(selectedFile.trimStart)}</span>
              </div>
              <div>
                <span className="text-secondary">End Time:</span>
                <span className="ml-2 font-mono text-primary">{formatTime(selectedFile.trimEnd)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Export Progress */}
        {isExporting && (
          <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-accent">
                {needsFFmpeg ? 'Processing with FFmpeg...' : 'Exporting...'}
              </span>
              <span className="text-sm text-accent">{exportProgress}%</span>
            </div>
            <div className="w-full bg-border-primary rounded-full h-2 overflow-hidden">
              <div 
                className="bg-accent h-full rounded-full transition-all duration-300"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Export Error */}
        {exportError && (
          <div className="bg-error/5 border border-error/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <X size={16} className="text-error mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-error">Export Failed</p>
                <p className="text-sm text-error/80 mt-1">{exportError}</p>
              </div>
            </div>
          </div>
        )}


        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-primary">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isExporting}
            className="flex-1 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleExport}
            disabled={isExporting || !canExport}
            className="flex-1 cursor-pointer"
          >
            {isExporting ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                {needsFFmpeg ? 'Processing...' : 'Exporting...'}
              </>
            ) : !canExport ? (
              <>
                <Loader size={16} className="mr-2" />
                Loading FFmpeg...
              </>
            ) : (
              <>
                <Download size={16} className="mr-" />
                Export {needsFFmpeg ? 'Trimmed ' : ''}{selectedFile.type}
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
