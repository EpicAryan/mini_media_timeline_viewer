import { useState, useCallback } from 'react'
import { useAppDispatch } from '@/store'
import { addMediaFile, setUploadProgress, clearUploadProgress } from '@/store/slices/mediaSlice'
import { getFileType, getMediaDuration, generateThumbnail } from '@/utils/mediaUtils'
import { FILE_SIZE_LIMIT } from '@/utils/constants'
import { v4 as uuidv4 } from 'uuid'

// File upload with drag/drop and processing
export const useMediaUpload = () => {
  const dispatch = useAppDispatch()
  const [isDragging, setIsDragging] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

   // Process uploaded file with metadata extraction
  const processFile = useCallback(async (file: File) => {
    const fileId = uuidv4()
    
    try {
      const fileType = getFileType(file.name)
      if (!fileType) {
        throw new Error(`Unsupported file type: ${file.name}`)
      }
      
      if (file.size > FILE_SIZE_LIMIT) {
        throw new Error(`File size exceeds limit: ${file.name}`)
      }

      dispatch(setUploadProgress({ fileId, progress: 10 }))
      
      const url = URL.createObjectURL(file)
      let duration = 0
      let thumbnail: string | undefined
      
      // Extract duration for video/audio files
      if (fileType === 'video' || fileType === 'audio') {
        dispatch(setUploadProgress({ fileId, progress: 30 }))
        duration = await getMediaDuration(file)
      }

       // Generate thumbnail for video files
      if (fileType === 'video') {
        dispatch(setUploadProgress({ fileId, progress: 60 }))
        thumbnail = await generateThumbnail(file)
      }

      dispatch(setUploadProgress({ fileId, progress: 90 }))

      const mediaFile = {
        id: fileId,
        name: file.name,
        type: fileType,
        file,
        duration,
        size: file.size,
        url,
        thumbnail,
        trimStart: 0,
        trimEnd: duration,
        isProcessing: false,
      }

      dispatch(addMediaFile(mediaFile))
      dispatch(setUploadProgress({ fileId, progress: 100 }))

       // Clear progress after completion
      setTimeout(() => {
        dispatch(clearUploadProgress(fileId))
      }, 1000)

    } catch (error) {
      console.error('File processing error:', error)
      setUploadError(error instanceof Error ? error.message : 'Unknown error')
      dispatch(clearUploadProgress(fileId))
    }
  }, [dispatch])

   // Handle file selection from input or drop
  const handleFileSelect = useCallback((files: FileList | File[]) => {
    setUploadError(null)
    const fileArray = Array.from(files)
    
    fileArray.forEach(file => {
      processFile(file)
    })
  }, [processFile])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files)
    }
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  return {
    isDragging,
    uploadError,
    setUploadError,
    handleFileSelect,
    handleDrop,
    handleDragOver,
    handleDragLeave,
  }
}
