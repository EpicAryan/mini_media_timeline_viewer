export const SUPPORTED_FILE_TYPES = {
  video: ['.mp4', '.webm'],
  audio: ['.mp3', '.wav'],
  image: ['.jpg', '.jpeg', '.png', '.gif']
} as const

export const TIMELINE_SCALE = 100 
export const TIMELINE_HEIGHT = 80
export const BLOCK_HEIGHT = 48

export const FILE_SIZE_LIMIT = 100 * 1024 * 1024 

export const MEDIA_TYPES = {
  VIDEO: 'video',
  AUDIO: 'audio',
  IMAGE: 'image'
} as const
