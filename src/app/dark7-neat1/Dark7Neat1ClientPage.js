'use client'

import dynamic from 'next/dynamic'

const MainPage = dynamic(() => import('../../../components/dark7-neat1/MainPage'), {
  ssr: false,
})

export default function Dark7Neat1ClientPage() {
  return <MainPage />
}
