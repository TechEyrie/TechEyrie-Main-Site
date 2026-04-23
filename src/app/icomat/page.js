'use client'

import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Footer from '../../../components/dark7/Footer'
import HeroSection from '../../../components/icomat/HeroSection'
import RTSSection from '../../../components/icomat/RTSSection'
import RTSRevolutionSection from '../../../components/icomat/RTSRevolutionSection'
import CompositeShowcaseSection from '../../../components/icomat/CompositeShowcaseSection'
import RTSCombinedSection from '../../../components/icomat/RTSCombinedSection'
import HowWeOperateSection from '../../../components/icomat/HowWeOperateSection'
import OurAdvantageSection from '../../../components/icomat/OurAdvantageSection'
import EndToEndSection from '../../../components/icomat/EndToEndSection'
import CustomersSection from '../../../components/icomat/CustomerSection'
import BusinessModelSection from '../../../components/icomat/BusinessModelSection'
import IcomatSolutionSection from '../../../components/icomat/IcomatSolutionsSection'
import IndustriesSection from '../../../components/icomat/IndustriesSection'
import BuildWithIcomatSection from '../../../components/icomat/BuildWithIcomatSection'
import UnlockingSection from '../../../components/icomat/UnlockingSection'
import FooterSection from '../../../components/icomat/FooterSection'
import Header from '../../../components/icomat1/Header'

gsap.registerPlugin(ScrollTrigger)

export default function IcomatPage() {
  const [theme] = useState('dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark')
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    // ── Lenis setup ────────────────────────────────────────────────
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false, // keep false — smoothTouch causes mobile sticking
      touchMultiplier: 1.5,
      infinite: false,
    })

    // ── Critical: drive Lenis through gsap.ticker, NOT rAF manually ─
    // This keeps Lenis and ScrollTrigger on the exact same clock tick
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    // Zero lag smoothing so ticker fires every frame without throttle
    gsap.ticker.lagSmoothing(0)

    // Sync ScrollTrigger scroll position to Lenis
    lenis.on('scroll', () => ScrollTrigger.update())

    // Refresh ScrollTrigger AFTER first paint so all DOM heights are known
    ScrollTrigger.refresh()

    return () => {
      // Full cleanup on unmount
      gsap.ticker.remove((time) => lenis.raf(time * 1000))
      ScrollTrigger.getAll().forEach((t) => t.kill())
      lenis.destroy()
    }
  }, [])

  return (
    <div data-theme="dark" style={{ backgroundColor: '#1A1A1A', minHeight: '100vh' }}>
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

      <Header />
      <HeroSection />
      <RTSSection />
      {/* <RTSRevolutionSection />
      <CompositeShowcaseSection /> */}
      <RTSCombinedSection />
      <HowWeOperateSection />
      <OurAdvantageSection />
      <EndToEndSection />
      <CustomersSection />
      <BusinessModelSection />
      <IcomatSolutionSection />
      <IndustriesSection />
      <BuildWithIcomatSection />
      <UnlockingSection />
      <FooterSection />
      <Footer theme="dark" />
    </div>
  )
}