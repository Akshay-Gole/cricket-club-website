import { useEffect, type RefObject } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function isInsideExplicitAnimation(element: HTMLElement) {
  return Boolean(
    element.parentElement?.closest('[data-animate]') ||
    element.closest('[data-animate="hero"]') ||
    element.closest('[data-animate="reveal"]') ||
    element.closest('[data-animate="card"]') ||
    element.closest('[data-animate="stagger"]')
  )
}

function getAutoAnimateItems(scope: HTMLElement) {
  const candidates = gsap.utils.toArray<HTMLElement>(
    '[data-animate-auto] section, [data-animate-auto] article, [data-animate-auto] aside, [data-animate-auto] form'
  )

  return candidates.filter(item => {
    if (item.getAttribute('aria-hidden') === 'true') return false
    if (item.hasAttribute('data-animate')) return false
    if (isInsideExplicitAnimation(item)) return false
    if (item.offsetParent === null && item.tagName !== 'MAIN') return false
    if (!scope.contains(item)) return false

    return true
  })
}

export function useGsapPageAnimations(scopeRef: RefObject<HTMLElement | null>) {
  const { pathname } = useLocation()

  useEffect(() => {
    const scope = scopeRef.current
    if (!scope || prefersReducedMotion()) return

    let context: ReturnType<typeof gsap.context> | undefined

    const frameId = window.requestAnimationFrame(() => {
      context = gsap.context(() => {
        const heroItems = gsap.utils.toArray<HTMLElement>(
          '[data-animate="hero"]'
        )

        gsap.fromTo(
          heroItems,
          {
            autoAlpha: 0,
            y: 34,
            filter: 'blur(8px)',
          },
          {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.08,
            clearProps: 'filter,transform,opacity,visibility',
          }
        )

        const revealItems = gsap.utils.toArray<HTMLElement>(
          '[data-animate="reveal"]'
        )

        revealItems.forEach(item => {
          gsap.fromTo(
            item,
            {
              autoAlpha: 0,
              y: 30,
            },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: item,
                start: 'top 86%',
                toggleActions: 'play none none reverse',
              },
            }
          )
        })

        const autoItems = getAutoAnimateItems(scope)

        gsap.set(autoItems, {
          autoAlpha: 0,
          y: 24,
          scale: 0.992,
        })

        ScrollTrigger.batch(autoItems, {
          start: 'top 88%',
          onEnter: batch => {
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.7,
              ease: 'power3.out',
              stagger: 0.05,
              overwrite: true,
            })
          },
          onLeaveBack: batch => {
            gsap.to(batch, {
              autoAlpha: 0,
              y: 24,
              scale: 0.992,
              duration: 0.34,
              ease: 'power2.inOut',
              stagger: 0.03,
              overwrite: true,
            })
          },
        })

        const cardItems = gsap.utils.toArray<HTMLElement>(
          '[data-animate="card"]'
        )

        gsap.set(cardItems, {
          autoAlpha: 0,
          y: 26,
          scale: 0.985,
        })

        ScrollTrigger.batch(cardItems, {
          start: 'top 88%',
          onEnter: batch => {
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.75,
              ease: 'power3.out',
              stagger: 0.06,
              overwrite: true,
            })
          },
          onLeaveBack: batch => {
            gsap.to(batch, {
              autoAlpha: 0,
              y: 26,
              scale: 0.985,
              duration: 0.38,
              ease: 'power2.inOut',
              stagger: 0.04,
              overwrite: true,
            })
          },
        })

        const staggerGroups = gsap.utils.toArray<HTMLElement>(
          '[data-animate="stagger"]'
        )

        staggerGroups.forEach(group => {
          const children = Array.from(group.children) as HTMLElement[]

          gsap.fromTo(
            children,
            {
              autoAlpha: 0,
              y: 22,
            },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              ease: 'power3.out',
              stagger: 0.07,
              scrollTrigger: {
                trigger: group,
                start: 'top 88%',
                toggleActions: 'play none none reverse',
              },
            }
          )
        })

        ScrollTrigger.refresh()
      }, scope)
    })

    return () => {
      window.cancelAnimationFrame(frameId)
      context?.revert()
    }
  }, [pathname, scopeRef])
}
