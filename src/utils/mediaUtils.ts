import { SUPPORTED_FILE_TYPES } from './constants'

export const getFileType = (fileName: string): 'video' | 'audio' | 'image' | null => {
  const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'))

  for (const [type, extensions] of Object.entries(SUPPORTED_FILE_TYPES) as Array<[keyof typeof SUPPORTED_FILE_TYPES, readonly string[]]>) {
    if (extensions.includes(extension)) {
      return type
    }
  }
  return null
}

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export const formatFileSize = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`
}

export const getMediaDuration = (file: File): Promise<number> => {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const element = document.createElement(file.type.startsWith('video') ? 'video' : 'audio')
    
    element.addEventListener('loadedmetadata', () => {
      resolve(element.duration || 0)
      URL.revokeObjectURL(url)
    })
    
    element.addEventListener('error', () => {
      resolve(0)
      URL.revokeObjectURL(url)
    })
    
    element.src = url
  })
}

export const generateThumbnail = (videoFile: File, time: number = 1): Promise<string> => {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    video.addEventListener('loadeddata', () => {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      video.currentTime = time
    })
    
    video.addEventListener('seeked', () => {
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        const thumbnail = canvas.toDataURL('image/jpeg', 0.7)
        resolve(thumbnail)
        URL.revokeObjectURL(video.src)
      }
    })
    
    video.src = URL.createObjectURL(videoFile)
  })
}
