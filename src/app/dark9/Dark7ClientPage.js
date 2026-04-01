'use client'

import dynamic from 'next/dynamic'

const MainPage = dynamic(() => import('../../../components/dark9/MainPage'), {
  ssr: false,
})

export default function Dark5ClientPage() {
  return <MainPage />
}
