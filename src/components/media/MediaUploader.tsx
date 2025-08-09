'use client'

import React, { useRef } from 'react'
import { Upload, File, X, Play, Trash2, Clock, Video, Music, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useMediaUpload } from '@/hooks/useMediaUpload'
import { useAppSelector, useAppDispatch } from '@/store'
import { removeMediaFile, setSelectedFile } from '@/store/slices/mediaSlice'
import { setActiveMedia, togglePlayPause } from '@/store/slices/playerSlice'
import { formatFileSize, formatTime } from '@/utils/mediaUtils'
import { cn } from '@/utils/cn'

export const MediaUploader = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { files, uploadProgress } = useAppSelector(state => state.media)
  const { activeMediaId, isPlaying } = useAppSelector(state => state.player)
  const dispatch = useAppDispatch()
  
  const {
    isDragging,
    uploadError,
    setUploadError,
    handleFileSelect,
    handleDrop,
    handleDragOver,
    handleDragLeave,
  } = useMediaUpload()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      handleFileSelect(files)
    }
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handlePlayVideo = (fileId: string) => {
    if (activeMediaId === fileId && isPlaying) {
      dispatch(togglePlayPause())
    } else {
      dispatch(setSelectedFile(fileId))
      dispatch(setActiveMedia(fileId))
      if (activeMediaId !== fileId) {
        setTimeout(() => dispatch(togglePlayPause()), 100)
      }
    }
  }

  const handleDeleteFile = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch(removeMediaFile(fileId))
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5 text-white" />
      case 'audio':
        return <Music className="w-5 h-5 text-white" />
      case 'image':
        return <ImageIcon className="w-5 h-5 text-white" />
      default:
        return <File className="w-5 h-5 text-white" />
    }
  }

  return (
    <div className="h-full flex flex-col bg-panel px-2">
      {/* Header */}
      <div className="border-b border-primary">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-bold text-primary ">Media Library</h2>
          <div className="text-sm text-accent font-medium">
            {files.length} file{files.length !== 1 ? 's' : ''}
          </div>
        </div>
        <p className="text-sm text-secondary leading-snug ">
          Upload videos, audio files, and images to build your timeline
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mt-2 space-y-6">
          {/* Drop Zone */}
          <div
            className={cn(
              "relative border-2 border-dashed rounded-2xl transition-all duration-200 cursor-pointer group overflow-hidden bg-neutral-800 ",
              isDragging 
                ? "border-accent bg-accent shadow-xl shadow-accent/20" 
                : "border-border-primary hover:border-accent/50 hover:bg-hover/40"
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={triggerFileSelect}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".mp4,.webm,.mp3,.wav,.jpg,.jpeg,.png,.gif"
              onChange={handleInputChange}
              className="hidden"
            />
            
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative p-1 text-center">
              <div className="">
                <div className="size-10 mx-auto rounded-2xl flex items-center justify-center transition-all duration-200 shadow-lg !p-0">
                  <Upload size={24} className={cn(
                    "transition-colors duration-200",
                    isDragging ? "text-white" : "text-secondary group-hover:text-accent"
                  )} />
                </div>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-base font-bold text-primary">
                  {isDragging ? "Drop your files here" : "Upload Media Files"}
                </h3>
                
                <p className="text-xs text-secondary max-w-2xs mx-auto leading-snug">
                  {isDragging 
                    ? "Release to upload your media files" 
                    : "Drag and drop your files here, or click to browse"
                  }
                </p>
                
                <div className="inline-flex items-center gap-2 px-4 py-1 bg-surface/80 backdrop-blur-sm rounded-full text-[11px] text-gray-400 border border-border-primary mt-1">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-media-video rounded-full" />
                    <span>MP4, WebM</span>
                  </div>
                  <div className="w-px h-3 bg-border-primary" />
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-media-audio rounded-full" />
                    <span>MP3, WAV</span>
                  </div>
                  <div className="w-px h-3 bg-border-primary" />
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-media-image rounded-full" />
                    <span>JPG, PNG, GIF</span>
                  </div>
                </div>
                
                <p className="text-xs text-gray-400 mt-1">
                  Maximum file size: 100MB per file
                </p>
              </div>
            </div>
          </div>

          {/* Upload Error */}
          {uploadError && (
            <div className="bg-error/8 border border-error/20 rounded-xl p-5 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-error/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <X size={14} className="text-error" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-semibold text-error">Upload Failed</p>
                  <p className="text-sm text-error/80 leading-relaxed">{uploadError}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setUploadError(null)}
                  className="text-error hover:bg-error/10 p-2 h-auto -mt-1"
                >
                  <X size={16} />
                </Button>
              </div>
            </div>
          )}

          {files.length > 0 && (
            <div className="space-y-5 mb-2">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-primary">
                  Your Files
                </h3>
                <p className="text-sm text-secondary">
                  Click to select and play
                </p>
              </div>
              
              <div className="space-y-2">
                {files.map((file) => {
                  const progress = uploadProgress[file.id]
                  const isUploading = progress !== undefined && progress < 100
                  const isActive = activeMediaId === file.id
                  const canPlay = file.type === 'video' || file.type === 'audio'
                  
                  return (
                    <div
                      key={file.id}
                      className={cn(
                        "group relative bg-gradient-to-r from-surface to-surface/50 border rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-black/10",
                        isActive 
                          ? "border-accent bg-gradient-to-r from-accent/8 to-accent/4 shadow-lg shadow-accent/10" 
                          : "border-primary hover:border-accent/30",
                        canPlay && "cursor-pointer",
                        isUploading && "animate-pulse"
                      )}
                      onClick={() => canPlay && !isUploading && handlePlayVideo(file.id)}
                    >
                      <div className="">
                        <div className="flex items-center gap-5">
                          {/* Fixed Thumbnail Display */}
                          <div className="relative flex-shrink-0">
                            <div className="size-12 rounded-xl overflow-hidden relative">
                              {file.thumbnail ? (
                                <>
                                  <Image
                                    src={file.thumbnail}
                                    alt={file.name}
                                    fill
                                    className="object-cover"
                                    sizes="64px"
                                    unoptimized
                                  />
                                  {canPlay && (
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
                                      <div className="w-6 h-6 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-lg">
                                        <Play size={10} className="text-black ml-0.5" />
                                      </div>
                                    </div>
                                  )}
                                </>
                              ) : file.type === 'image' ? (
                                <>
                                  <Image
                                    src={file.url}
                                    alt={file.name}
                                    fill
                                    className="object-cover"
                                    sizes="64px"
                                    unoptimized
                                  />
                                </>
                              ) : (
                                <div className={cn(
                                  "w-full h-full flex items-center justify-center",
                                  file.type === 'video' && "bg-gradient-to-br from-media-video to-purple-600",
                                  file.type === 'audio' && "bg-gradient-to-br from-media-audio to-cyan-600"
                                )}>
                                  {getFileIcon(file.type)}
                                </div>
                              )}
                            </div>
                            
                            {isUploading && (
                              <div className="absolute inset-0 bg-black/70 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                <LoadingSpinner size="sm" variant="white" />
                              </div>
                            )}
                          </div>
                          
                          {/* File Info */}
                          <div className="flex-1 min-w-0 space-y-2 ">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 space-y-2">
                                <p className="text-sm font-semibold text-primary truncate group-hover:text-accent transition-colors leading-tight">
                                  {file.name}
                                </p>
                                <div className="flex items-center gap-3">
                                  <span className={cn(
                                    "text-[10px] px-2 py-[1px] rounded-full text-white font-medium shadow-sm",
                                    file.type === 'video' && "bg-purple-600",
                                    file.type === 'audio' && "bg-cyan-600",
                                    file.type === 'image' && "bg-emerald-600"
                                  )}>
                                    {file.type.toUpperCase()}
                                  </span>
                                  <div className="flex items-center gap-2 text-nowrap text-[11px] text-secondary">
                                    <span className="font-medium">{formatFileSize(file.size)}</span>
                                    {file.duration > 0 && (
                                      <>
                                        <span className="text-muted">•</span>
                                        <div className="flex items-center gap-1">
                                          <Clock size={10} />
                                          <span className="font-mono">{formatTime(file.duration)}</span>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => handleDeleteFile(file.id, e)}
                                className="text-muted px-2 py-1 h-auto"
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                            
                            {/* Progress Bar */}
                            {isUploading && (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-accent font-medium">Uploading...</span>
                                  <span className="text-accent font-bold">{progress}%</span>
                                </div>
                                <div className="w-full bg-border-primary/50 rounded-full h-2 overflow-hidden shadow-inner">
                                  <div 
                                    className="bg-gradient-to-r from-accent via-purple-500 to-accent h-full rounded-full transition-all duration-500 shadow-sm"
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          
          {/* Empty State */}
          {files.length === 0 && !uploadError && (
            <div className="text-center py-12">
              <div className="size-16 mx-auto !mb-4 rounded-2xl bg-gradient-to-br from-surface to-hover border-2 border-dashed border-border-primary flex items-center justify-center place-self-center">
                <File size={28} className="text-muted" />
              </div>
              <h3 className="text-base font-semibold text-primary !mb-2">No files yet</h3>
              <p className="text-secondary text-xs max-w-xs mx-auto leading-relaxed">
                Upload your first media file to get started with your timeline
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
