'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function AOSProvider({ children }) {
  const pathname = usePathname()

  useEffect(() => {
    // Delay initialization so React finishes hydrating all DOM nodes (including Suspense boundaries)
    const timer = setTimeout(() => {
      AOS.init({
        duration: 650,
        once: true,
        easing: 'ease-out-cubic',
        offset: 60,
        delay: 50,
      })
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Refresh AOS whenever route changes so newly mounted pages have scroll triggers recalculate
    const timer = setTimeout(() => {
      AOS.refresh()
    }, 100)

    return () => clearTimeout(timer)
  }, [pathname])

  return <>{children}</>
}

