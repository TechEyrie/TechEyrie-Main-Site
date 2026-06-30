'use client'

import dynamic from 'next/dynamic'

const MainPage = dynamic(() => import('../../../components/dark7-neat5/MainPage'), {
  ssr: false,
})

export default function Dark7Neat5ClientPage() {
  return <MainPage />
}
