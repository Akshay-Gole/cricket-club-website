import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const MAX_ROTATE = 8
const MAX_SHADOW_SHIFT = 10

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * 3D magnetic tilt effect.
 * Returns a ref to attach to the element you want to tilt.
 * Requires a parent with `perspective: 1000px` (or similar) for the 3D effect to work.
 */
export function useMagneticTilt<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const mouseX = e.clientX - centerX
      const mouseY = e.clientY - centerY

      const pctX = mouseX / (rect.width / 2)
      const pctY = mouseY / (rect.height / 2)

      const rotateX = Math.max(
        -MAX_ROTATE,
        Math.min(MAX_ROTATE, -pctY * MAX_ROTATE)
      )
      const rotateY = Math.max(
        -MAX_ROTATE,
        Math.min(MAX_ROTATE, pctX * MAX_ROTATE)
      )

      const shadowX = Math.max(
        -MAX_SHADOW_SHIFT,
        Math.min(MAX_SHADOW_SHIFT, pctX * MAX_SHADOW_SHIFT)
      )
      const shadowY =
        Math.max(
          -MAX_SHADOW_SHIFT,
          Math.min(MAX_SHADOW_SHIFT, pctY * MAX_SHADOW_SHIFT)
        ) + 14

      gsap.to(el, {
        rotateX,
        rotateY,
        y: -4, // slight lift on hover
        boxShadow: `${shadowX}px ${shadowY}px 40px -12px rgba(201,168,76,0.28)`,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }

    const handleMouseLeave = () => {
      gsap.to(el, {
        rotateX: 0,
        rotateY: 0,
        y: 0,
        boxShadow: '0 14px 36px rgba(0,0,0,0.3)',
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }

    el.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseleave', handleMouseLeave)

    // Ensure the element has 3D transform style and perspective
    gsap.set(el, { transformStyle: 'preserve-3d', transformPerspective: 1000 })

    return () => {
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return ref
}
