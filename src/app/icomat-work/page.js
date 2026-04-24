'use client'

import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import HeroSection from '../../../components/icomat/HeroSection'
import RTSSection from '../../../components/icomat/RTSSection'
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
import Header from '../../../components/icomat1/Header'
import FooterSection from '../../../components/icomat1/FooterSection'

gsap.registerPlugin(ScrollTrigger)

export default function IcomatWorkPage() {
  const [theme] = useState('dark')

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

      <Header />
      <HeroSection />
      <RTSSection />
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
    </div>
  )
}

