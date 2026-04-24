'use client'

import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Footer from '../../../components/dark7/Footer'
import HeroSection from '../../../components/icomat1/HeroSection'
import RTSSection from '../../../components/icomat1/RTSSection'
import RTSRevolutionSection from '../../../components/icomat1/RTSRevolutionSection'
import CompositeShowcaseSection from '../../../components/icomat1/CompositeShowcaseSection'
import RTSCombinedSection from '../../../components/icomat1/RTSCombinedSection'
import HowWeOperateSection from '../../../components/icomat1/HowWeOperateSection'
import OurAdvantageSection from '../../../components/icomat1/OurAdvantageSection'
import EndToEndSection from '../../../components/icomat1/EndToEndSection'
import CustomersSection from '../../../components/icomat1/CustomerSection'
import BusinessModelSection from '../../../components/icomat1/BusinessModelSection'
import IcomatSolutionSection from '../../../components/icomat1/IcomatSolutionsSection'
import IndustriesSection from '../../../components/icomat1/IndustriesSection'
import BuildWithIcomatSection from '../../../components/icomat1/BuildWithIcomatSection'
import UnlockingSection from '../../../components/icomat1/UnlockingSection'
import FooterSection from '../../../components/icomat1/FooterSection'
import Header from '../../../components/icomat1/Header'
import CTASection from '../../../components/icomat1/CTASection'

gsap.registerPlugin(ScrollTrigger)

export default function IcomatPage() {
  const [theme] = useState('dark')
  const [quoteOpen, setQuoteOpen] = useState(false)

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
      <RTSSection />
      {/* <RTSRevolutionSection />
      <CompositeShowcaseSection /> */}
      <RTSCombinedSection />
      <HowWeOperateSection />
      <OurAdvantageSection />
      <EndToEndSection />
      <CustomersSection />
      {/* <BusinessModelSection /> */}
      <IcomatSolutionSection />
      <IndustriesSection />
      <BuildWithIcomatSection />
      <UnlockingSection />
      <CTASection />
      <FooterSection />
      {/* <Footer theme="dark" /> */}
    </div>
  )
}