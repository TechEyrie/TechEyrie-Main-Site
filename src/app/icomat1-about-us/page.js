'use client'

import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Header from '../../../components/icomat1/Header'
import FooterSection from '../../../components/icomat1/FooterSection'
import HeroSection from '../../../components/icomat1-about-us/HeroSection'
import FactorySection from '../../../components/icomat1-about-us/FactorySection'
import ReliableSection from '../../../components/icomat1-about-us/ReliableSection'
import UnlockingSection from '../../../components/icomat1-about-us/UnlockingSection'
import EndToEndSection from '../../../components/icomat1/EndToEndSection'
import CTASection from '../../../components/icomat1/CTASection'

gsap.registerPlugin(ScrollTrigger)

export default function Icomat1AboutUsPage() {
  const [theme] = useState('dark')
  const [quoteOpen, setQuoteOpen] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark')
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 1.5,
      infinite: false,
    })

    const onTick = (time) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)
    lenis.on('scroll', () => ScrollTrigger.update())
    ScrollTrigger.refresh()

    return () => {
      gsap.ticker.remove(onTick)
      ScrollTrigger.getAll().forEach((t) => t.kill())
      lenis.destroy()
    }
  }, [])

  return (
    <div data-theme="dark" className="icomat1-laygrotesk" style={{ backgroundColor: '#162D24', minHeight: '100vh' }}>
      <style jsx global>{`
        html, body {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        html::-webkit-scrollbar,
        body::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <Header quoteOpen={quoteOpen} setQuoteOpen={setQuoteOpen} />
      <HeroSection onQuoteClick={() => setQuoteOpen(true)} />
      <FactorySection />
      <ReliableSection />
      <UnlockingSection />
      <EndToEndSection />
      <CTASection />
      <FooterSection />
    </div>
  )
}

