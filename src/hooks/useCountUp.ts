import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

interface UseCountUpOptions {
  target: number
  duration?: number
  delay?: number
  enabled?: boolean
}

/**
 * Animates a number from 0 up to `target` when the element
 * scrolls into view. Use `ref` on the element that contains the number.
 */
export function useCountUp({
  target,
  duration = 2,
  delay = 0,
  enabled = true,
}: UseCountUpOptions) {
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el || !enabled || prefersReducedMotion()) return

    const obj = { value: 0 }

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        if (hasAnimated.current) return
        hasAnimated.current = true

        gsap.to(obj, {
          value: target,
          duration,
          delay,
          ease: 'power2.out',
          snap: { value: 1 },
          onUpdate: () => {
            // Preserve the leading-zero format from the original data
            const raw = Math.round(obj.value)
            const formatted = String(raw).padStart(2, '0')
            el.textContent = formatted
          },
        })
      },
    })

    return () => {
      trigger.kill()
    }
  }, [target, duration, delay, enabled])

  return ref
}
