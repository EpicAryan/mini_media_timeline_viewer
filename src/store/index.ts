import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'
import mediaReducer from './slices/mediaSlice'
import playerReducer from './slices/playerSlice'
import timelineReducer from './slices/timelineSlice'

export const store = configureStore({
  reducer: {
    media: mediaReducer,
    player: playerReducer,
    timeline: timelineReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['media/addMediaFile'],
        ignoredPaths: ['media.files.file'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
