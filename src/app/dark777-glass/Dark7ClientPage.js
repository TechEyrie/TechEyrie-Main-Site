'use client'

import dynamic from 'next/dynamic'

const MainPage = dynamic(() => import('../../../components/dark777-glass/MainPage'), {
  ssr: false,
})

export default function Dark7ClientPage() {
  return <MainPage />
}
