"use client"

import { useCallback, useEffect, useRef } from "react"

export function useGSAP() {
  const gsapRef = useRef<any>(null)
  const timelineRef = useRef<any>(null)

  useEffect(() => {
    // Dynamically import GSAP to avoid SSR issues
    const loadGSAP = async () => {
      const { gsap } = await import("gsap")
      const { ScrollTrigger } = await import("gsap/ScrollTrigger")

      gsap.registerPlugin(ScrollTrigger)
      gsapRef.current = gsap
      timelineRef.current = gsap.timeline()
    }

    loadGSAP()
  }, [])

  const fadeIn = useCallback((element: string | Element, options = {}) => {
    if (gsapRef.current) {
      return gsapRef.current.fromTo(
        element,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", ...options },
      )
    }
  }, [])

  const slideIn = useCallback((element: string | Element, direction = "left", options = {}) => {
    if (gsapRef.current) {
      const x = direction === "left" ? -50 : 50
      return gsapRef.current.fromTo(
        element,
        { opacity: 0, x },
        { opacity: 1, x: 0, duration: 0.8, ease: "power2.out", ...options },
      )
    }
  }, [])

  const scaleUp = useCallback((element: string | Element, options = {}) => {
    if (gsapRef.current) {
      return gsapRef.current.fromTo(
        element,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)", ...options },
      )
    }
  }, [])

  const staggerAnimation = useCallback((elements: string, options = {}) => {
    if (gsapRef.current) {
      return gsapRef.current.fromTo(
        elements,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.2, ease: "power2.out", ...options },
      )
    }
  }, [])

  return {
    gsap: gsapRef.current,
    timeline: timelineRef.current,
    fadeIn,
    slideIn,
    scaleUp,
    staggerAnimation,
  }
}
