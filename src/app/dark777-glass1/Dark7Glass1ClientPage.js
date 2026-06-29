'use client'

import dynamic from 'next/dynamic'

const MainPage = dynamic(() => import('../../../components/dark777-glass1/MainPage'), {
  ssr: false,
})

export default function Dark7Glass1ClientPage() {
  return <MainPage />
}
