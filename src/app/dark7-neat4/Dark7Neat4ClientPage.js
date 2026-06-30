'use client'

import dynamic from 'next/dynamic'

const MainPage = dynamic(() => import('../../../components/dark7-neat4/MainPage'), {
  ssr: false,
})

export default function Dark7Neat4ClientPage() {
  return <MainPage />
}
