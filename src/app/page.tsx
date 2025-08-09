'use client'

import { Provider } from 'react-redux'
import { store } from '@/store'
import { MainLayout } from '@/components/layout/MainLayout'

export default function Home() {
  return (
    <Provider store={store}>
      <MainLayout />
    </Provider>
  )
}
