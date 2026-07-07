import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import homeContentApi from '../api/homeContent.api'
import { DEFAULT_HOME_CONTENT } from '../api/homeContent.api'

function clampSkew(value: number) {
  return Math.max(-8, Math.min(8, value))
}

function Ticker() {
  const tickerRef = useRef<HTMLDivElement | null>(null)
  const [messages, setMessages] = useState(DEFAULT_HOME_CONTENT.tickerText)

  useEffect(() => {
    homeContentApi
      .getPublic()
      .then(content => setMessages(content.tickerText))
      .catch(() => setMessages(DEFAULT_HOME_CONTENT.tickerText))
  }, [])

  useEffect(() => {
    const ticker = tickerRef.current
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (!ticker || prefersReducedMotion) return

    const handleLenisScroll = (event: Event) => {
      const { velocity } = (event as CustomEvent<{ velocity: number }>).detail
      const skewX = Math.abs(velocity) < 0.05 ? 0 : clampSkew(velocity * 0.15)

      gsap.to(ticker, {
        skewX,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: true,
      })
    }

    window.addEventListener('topgs:lenis-scroll', handleLenisScroll)

    return () => {
      window.removeEventListener('topgs:lenis-scroll', handleLenisScroll)
      gsap.killTweensOf(ticker)
    }
  }, [])

  return (
    <div className="bg-gold px-12 py-3 flex items-center gap-8 overflow-hidden">
      <div className="font-heading text-[11px] font-bold tracking-[3px] uppercase text-black shrink-0 pr-8 border-r border-black/20">
        Latest
      </div>
      <div className="flex-1 overflow-hidden">
        <div
          ref={tickerRef}
          className="inline-flex w-max animate-scroll-ticker will-change-transform"
        >
          <span className="font-heading text-[13px] font-semibold tracking-[1px] text-black whitespace-pre">
            {messages}
          </span>
          <span
            className="font-heading text-[13px] font-semibold tracking-[1px] text-black whitespace-pre"
            aria-hidden="true"
          >
            {messages}
          </span>
        </div>
      </div>
    </div>
  )
}

export default Ticker
