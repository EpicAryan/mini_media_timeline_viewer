import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TimelineState } from '../types'
import { TIMELINE_SCALE } from '@/utils/constants'

const initialState: TimelineState = {
  scale: TIMELINE_SCALE,
  scrollPosition: 0,
  totalDuration: 0,
  showGrid: true,
  playheadPosition: 0,
}

const timelineSlice = createSlice({
  name: 'timeline',
  initialState,
  reducers: {
    setScale: (state, action: PayloadAction<number>) => {
      state.scale = Math.max(10, Math.min(500, action.payload))
    },
    
    setScrollPosition: (state, action: PayloadAction<number>) => {
      state.scrollPosition = action.payload
    },
    
    setTotalDuration: (state, action: PayloadAction<number>) => {
      state.totalDuration = action.payload
    },
    
    
    setPlayheadPosition: (state, action: PayloadAction<number>) => {
      state.playheadPosition = action.payload
    },
    
    zoomIn: (state) => {
      state.scale = Math.min(500, state.scale * 1.5)
    },
    
    zoomOut: (state) => {
      state.scale = Math.max(10, state.scale / 1.5)
    },
    toggleShowUntrimmed: (state) => {
      state.showUntrimmed = !state.showUntrimmed
    },
  },
})

export const {
  setScale,
  setScrollPosition,
  setTotalDuration,
  setPlayheadPosition,
  zoomIn,
  zoomOut,
} = timelineSlice.actions

export default timelineSlice.reducer
