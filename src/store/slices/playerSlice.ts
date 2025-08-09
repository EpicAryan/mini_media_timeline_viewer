import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PlayerState } from '../types'

const initialState: PlayerState = {
  isPlaying: false,
  currentTime: 0,
  volume: 1,
  activeMediaId: null,
  playbackRate: 1,
}

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload
    },
    
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload
    },
    
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = Math.max(0, Math.min(1, action.payload))
    },
    
    setActiveMedia: (state, action: PayloadAction<string | null>) => {
      state.activeMediaId = action.payload
      state.isPlaying = false
      state.currentTime = 0
    },
    
    setPlaybackRate: (state, action: PayloadAction<number>) => {
      state.playbackRate = action.payload
    },
    
    togglePlayPause: (state) => {
      state.isPlaying = !state.isPlaying
    },
  },
})

export const {
  setPlaying,
  setCurrentTime,
  setVolume,
  setActiveMedia,
  setPlaybackRate,
  togglePlayPause,
} = playerSlice.actions

export default playerSlice.reducer
