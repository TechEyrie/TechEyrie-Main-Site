'use client'

import dynamic from 'next/dynamic'

const MainPage = dynamic(() => import('../../../components/dark7-luxury/MainPage'), {
  ssr: false,
})

export default function Dark7LuxuryClientPage() {
  return <MainPage />
}
