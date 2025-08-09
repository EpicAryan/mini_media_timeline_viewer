export interface MediaFile {
  id: string
  name: string
  type: 'video' | 'audio' | 'image'
  file: File
  duration: number
  size: number
  url: string
  thumbnail?: string
  trimStart: number
  trimEnd: number
  isProcessing: boolean
  error?: string
}

export interface PlayerState {
  isPlaying: boolean
  currentTime: number
  volume: number
  activeMediaId: string | null
  playbackRate: number
}

export interface TimelineState {
  scale: number
  scrollPosition: number
  totalDuration: number
  showGrid: boolean
  playheadPosition: number
  showUntrimmed?: boolean
}
