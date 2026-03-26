'use client'

import dynamic from 'next/dynamic'

const MainPage = dynamic(() => import('../../../components/dark8/MainPage'), {
  ssr: false,
})

export default function Dark5ClientPage() {
  return <MainPage />
}
