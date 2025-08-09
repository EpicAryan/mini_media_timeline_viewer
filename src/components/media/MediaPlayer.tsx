'use client'

import React from 'react'
import Image from 'next/image'
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useMediaPlayer } from '@/hooks/useMediaPlayer'
import { useAppSelector } from '@/store'
import { formatTime } from '@/utils/mediaUtils'

export const MediaPlayer = () => {
  const { isPlaying, currentTime, volume } = useAppSelector(state => state.player)
  
  const {
    videoRef,
    audioRef,
    activeFile,
    togglePlayPause,
    seekTo,
    changeVolume,
  } = useMediaPlayer()

  const skipTime = (seconds: number) => {
    if (activeFile) {
      const newTime = Math.max(
        activeFile.trimStart,
        Math.min(activeFile.trimEnd, currentTime + seconds)
      )
      seekTo(newTime)
    }
  }

  if (!activeFile) {
    return (
      <div className="h-full flex flex-col bg-surface">
        {/* Header */}
        <div className="pb-2 border-b border-primary flex-shrink-0">
          <h2 className="text-xl font-bold text-primary mb-2">Media Player</h2>
          <p className="text-sm text-secondary">
            Select a file from the library to preview and control playback
          </p>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center !p-4">
          <div className="text-center max-w-md">
            <div className="size-24 mx-auto !mb-4 rounded-3xl bg-gradient-to-br from-panel to-hover border-2 border-dashed border-border-primary flex items-center justify-center place-self-center">
              <Play size={36} className="text-muted" />
            </div>
            <h3 className="text-2xl font-bold text-primary !mb-4">Ready to Play</h3>
            <p className="text-secondary text-base leading-relaxed !mb-6">
              Upload some media files and select one from the library to start playing
            </p>
          </div>
        </div>
      </div>
    )
  }

  const trimmedDuration = activeFile.trimEnd - activeFile.trimStart
  const playbackProgress = trimmedDuration > 0
    ? ((currentTime - activeFile.trimStart) / trimmedDuration) * 100
    : 0

  return (
    <div className="h-full flex flex-col bg-surface">
      <div className="pb-2 border-b border-primary flex-shrink-0 h-20">
        <div className="flex items-center justify-between h-full">
          <div className="min-w-0 flex-1 mr-4">
            <h2 className="text-xl font-bold text-primary mb-1">Now Playing</h2>
            <p className="text-sm text-secondary truncate">{activeFile.name}</p>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 h-[60%]">
        <div className="h-full mb-0 bg-black  overflow-hidden relative group">
          {activeFile.isProcessing ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <LoadingSpinner size="lg" variant="white" className="mb-4" />
                <p className="text-white/80 text-sm">Processing media...</p>
              </div>
            </div>
          ) : activeFile.type === 'video' ? (
            <video
              ref={videoRef}
              src={activeFile.url}
              className="w-full h-full object-contain "
              poster={activeFile.thumbnail}
              onClick={togglePlayPause}
            />
          ) : activeFile.type === 'audio' ? (
            <div className="h-full flex items-center justify-center text-center p-8">
              <audio ref={audioRef} src={activeFile.url} />
              <div>
                <div className="w-24 h-24 bg-gradient-to-br from-media-audio to-cyan-600 rounded-full flex items-center justify-center mb-4 shadow-2xl">
                  <Volume2 size={36} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1 max-w-sm truncate">{activeFile.name}</h3>
                <p className="text-white/60 text-sm">
                  {formatTime(activeFile.duration)}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-4">
              <div className="relative w-full h-full">
                <Image
                  src={activeFile.url}
                  alt={activeFile.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized
                />
              </div>
            </div>
          )}
          
          {activeFile.type === 'video' && !isPlaying && (
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                variant="ghost"
                className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/20"
                onClick={togglePlayPause}
              >
                <Play size={24} className="text-white ml-1" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0 px-6 py-4 2xl:space-y-2">
        {/* Progress Bar */}
        {(activeFile.type === 'video' || activeFile.type === 'audio') && (
          <div className="space-y-3">
            <div
              className="group h-3 bg-panel rounded-full cursor-pointer relative overflow-hidden border border-primary hover:border-accent/50 transition-all duration-200 shadow-inner"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const progress = (e.clientX - rect.left) / rect.width
                const newTime = activeFile.trimStart + (progress * trimmedDuration)
                seekTo(newTime)
              }}
            >
              <div className="absolute inset-0 bg-border-primary rounded-full" />
              <div
                className="absolute top-0 left-0 h-full bg-purple-500 rounded-full transition-all duration-100 shadow-sm"
                style={{ width: `${Math.max(0, Math.min(100, playbackProgress))}%` }}
              />
              <div 
                className="absolute top-1/2 transform -translate-y-1/2 size-3 bg-white border-2 border-accent rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `calc(${Math.max(0, Math.min(100, playbackProgress))}% - 8px)` }}
              />
            </div>
            
            <div className="flex justify-between text-sm text-secondary font-mono px-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(activeFile.trimEnd)}</span>
            </div>
          </div>
        )}


        <div className="flex items-center justify-center gap-6">
          <Button
            variant="ghost"
            size="md"
            onClick={() => skipTime(-10)}
            disabled={activeFile.type === 'image'}
            className="size-8 2xl:size-11 rounded-full hover:bg-hover p-2 2xl:p-3 cursor-pointer"
          >
            <SkipBack size={20} />
          </Button>
          
          <Button
            variant="primary"
            onClick={togglePlayPause}
            disabled={activeFile.type === 'image'}
            className="size-9 2xl:size-12 rounded-full shadow-xl p-2 2xl:p-3 cursor-pointer"
          >
            {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
          </Button>
          
          <Button
            variant="ghost"
            size="md"
            onClick={() => skipTime(10)}
            disabled={activeFile.type === 'image'}
            className="size-8 2xl:size-11 rounded-full hover:bg-hover p-2 2xl:p-3 cursor-pointer"
          >
            <SkipForward size={20} />
          </Button>

          {/* Volume Control */}
          {(activeFile.type === 'video' || activeFile.type === 'audio') && (
            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => changeVolume(volume > 0 ? 0 : 1)}
                className="w-10 h-10 rounded-full"
              >
                {volume > 0 ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </Button>
              
              <div className="w-20">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => changeVolume(parseFloat(e.target.value))}
                  className="w-full h-2 bg-panel rounded-full appearance-none cursor-pointer slider"
                />
              </div>
              
              <span className="text-xs text-secondary font-mono w-8 text-center">
                {Math.round(volume * 100)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
