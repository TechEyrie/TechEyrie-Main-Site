'use client'

import dynamic from 'next/dynamic'

const MainPage = dynamic(() => import('../../../components/dark7-neat2/MainPage'), {
  ssr: false,
})

export default function Dark7Neat2ClientPage() {
  return <MainPage />
}
