'use client'

import dynamic from 'next/dynamic'

const MainPage = dynamic(() => import('../../../components/dark77/MainPage'), {
  ssr: false,
})

export default function Dark77ClientPage() {
  return <MainPage />
}
