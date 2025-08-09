import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MediaFile } from '../types'

interface MediaState {
  files: MediaFile[]
  uploadProgress: { [fileId: string]: number }
  selectedFileId: string | null
}

const initialState: MediaState = {
  files: [],
  uploadProgress: {},
  selectedFileId: null,
}

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    addMediaFile: (state, action: PayloadAction<MediaFile>) => {
      state.files.push(action.payload)
    },
    
    removeMediaFile: (state, action: PayloadAction<string>) => {
      state.files = state.files.filter(file => file.id !== action.payload)
      if (state.selectedFileId === action.payload) {
        state.selectedFileId = null
      }
    },
    
    updateMediaFile: (state, action: PayloadAction<{ id: string; updates: Partial<MediaFile> }>) => {
      const { id, updates } = action.payload
      const fileIndex = state.files.findIndex(file => file.id === id)
      if (fileIndex !== -1) {
        state.files[fileIndex] = { ...state.files[fileIndex], ...updates }
      }
    },
    
    setSelectedFile: (state, action: PayloadAction<string | null>) => {
      state.selectedFileId = action.payload
    },
    
    updateTrimRange: (state, action: PayloadAction<{ id: string; trimStart: number; trimEnd: number }>) => {
      const { id, trimStart, trimEnd } = action.payload
      const fileIndex = state.files.findIndex(file => file.id === id)
      if (fileIndex !== -1) {
        state.files[fileIndex].trimStart = trimStart
        state.files[fileIndex].trimEnd = trimEnd
      }
    },
    
    setUploadProgress: (state, action: PayloadAction<{ fileId: string; progress: number }>) => {
      const { fileId, progress } = action.payload
      state.uploadProgress[fileId] = progress
    },
    
    clearUploadProgress: (state, action: PayloadAction<string>) => {
      delete state.uploadProgress[action.payload]
    },
  },
})

export const {
  addMediaFile,
  removeMediaFile,
  updateMediaFile,
  setSelectedFile,
  updateTrimRange,
  setUploadProgress,
  clearUploadProgress,
} = mediaSlice.actions

export default mediaSlice.reducer
