import { useRef, useEffect, useCallback } from 'react'
import { useAppSelector, useAppDispatch } from '@/store'
import { setPlaying, setCurrentTime, setVolume } from '@/store/slices/playerSlice'
import { setPlayheadPosition } from '@/store/slices/timelineSlice'

// Media player controls with timeline sync
export const useMediaPlayer = () => {
  const dispatch = useAppDispatch()
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  
  const { activeMediaId, isPlaying, currentTime, volume } = useAppSelector(state => state.player)
  const { files, selectedFileId } = useAppSelector(state => state.media)
  const { scale } = useAppSelector(state => state.timeline)
  
  const activeFile = files.find(file => file.id === (activeMediaId || selectedFileId))

  // Get current media element reference
  const getActiveElement = useCallback(() => {
    if (!activeFile) return null
    return activeFile.type === 'video' ? videoRef.current : audioRef.current
  }, [activeFile])

  // Sync playhead position with current time
  useEffect(() => {
    if (activeFile && currentTime >= 0) {
      const playheadPos = (currentTime * scale)
      dispatch(setPlayheadPosition(playheadPos))
    }
  }, [currentTime, scale, activeFile, dispatch])

  // Toggle play/pause with trim boundary check
  const togglePlayPause = useCallback(() => {
    const element = getActiveElement()
    if (!element || !activeFile) return

    if (isPlaying) {
      element.pause()
      dispatch(setPlaying(false))
    } else {
      // Reset to trim start if outside boundaries
      if (currentTime < activeFile.trimStart || currentTime > activeFile.trimEnd) {
        element.currentTime = activeFile.trimStart
      }
      element.play()
      dispatch(setPlaying(true))
    }
  }, [isPlaying, currentTime, activeFile, getActiveElement, dispatch])


  // Seek within trim boundaries
  const seekTo = useCallback((time: number) => {
    const element = getActiveElement()
    if (!element || !activeFile) return
    
    const clampedTime = Math.max(
      activeFile.trimStart, 
      Math.min(activeFile.trimEnd, time)
    )
    
    element.currentTime = clampedTime
    dispatch(setCurrentTime(clampedTime))
  }, [activeFile, getActiveElement, dispatch])

 // Change volume with bounds checking
  const changeVolume = useCallback((newVolume: number) => {
    const element = getActiveElement()
    if (!element) return
    
    const clampedVolume = Math.max(0, Math.min(1, newVolume))
    element.volume = clampedVolume
    dispatch(setVolume(clampedVolume))
  }, [getActiveElement, dispatch])

// Handle time updates and trim boundary enforcement
  const handleTimeUpdate = useCallback(() => {
    const element = getActiveElement()
    if (!element || !activeFile) return
    
    const time = element.currentTime
    dispatch(setCurrentTime(time))

    // Auto-pause at trim end
    if (time >= activeFile.trimEnd) {
      element.pause()
      dispatch(setPlaying(false))
    }
  }, [activeFile, getActiveElement, dispatch])

  // Setup media element event listeners
  useEffect(() => {
    const element = getActiveElement()
    if (!element) return

    element.addEventListener('timeupdate', handleTimeUpdate)
    element.addEventListener('ended', () => dispatch(setPlaying(false)))
    element.volume = volume

    return () => {
      element.removeEventListener('timeupdate', handleTimeUpdate)
      element.removeEventListener('ended', () => dispatch(setPlaying(false)))
    }
  }, [activeFile, handleTimeUpdate, volume, getActiveElement, dispatch])

  return {
    videoRef,
    audioRef,
    activeFile,
    togglePlayPause,
    seekTo,
    changeVolume,
  }
}
