'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function AOSProvider({ children }) {
  const pathname = usePathname()

  useEffect(() => {
    AOS.init({
      duration: 650,
      once: true,
      easing: 'ease-out-cubic',
      offset: 60,
      delay: 50,
    })
  }, [])

  useEffect(() => {
    // Refresh AOS whenever route changes so newly mounted pages have scroll triggers recalculate
    AOS.refresh()
  }, [pathname])

  return <>{children}</>
}

