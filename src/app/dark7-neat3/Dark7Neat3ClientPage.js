'use client'

import dynamic from 'next/dynamic'

const MainPage = dynamic(() => import('../../../components/dark7-neat3/MainPage'), {
  ssr: false,
})

export default function Dark7Neat3ClientPage() {
  return <MainPage />
}
