import { useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

gsap.registerPlugin(ScrollTrigger)

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function shouldPreventSmoothScroll(node: HTMLElement) {
  return Boolean(
    node.closest('[data-lenis-prevent]') ||
    node.closest('textarea') ||
    node.closest('select')
  )
}

interface LenisScrollEvent {
  velocity: number
}

export function useLenisSmoothScroll() {
  const { pathname } = useLocation()
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    window.history.scrollRestoration = 'manual'
  }, [])

  useEffect(() => {
    if (prefersReducedMotion()) return

    const lenis = new Lenis({
      duration: 1.15,
      easing: t => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.82,
      touchMultiplier: 1.15,
      anchors: {
        offset: -72,
        duration: 1.05,
      },
      prevent: shouldPreventSmoothScroll,
    })

    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)
    lenis.on('scroll', ({ velocity }: LenisScrollEvent) => {
      window.dispatchEvent(
        new CustomEvent('topgs:lenis-scroll', {
          detail: { velocity },
        })
      )
    })

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(updateLenis)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(updateLenis)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  useLayoutEffect(() => {
    const lenis = lenisRef.current

    const scrollToTop = () => {
      if (lenis) {
        lenis.scrollTo(0, { immediate: true })
      }

      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      ScrollTrigger.refresh()
    }

    scrollToTop()
    const frameId = window.requestAnimationFrame(scrollToTop)

    return () => window.cancelAnimationFrame(frameId)
  }, [pathname])
}
