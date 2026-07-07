import { useRef } from 'react'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import Navbar from './Navbar'
import ErrorBoundary from './ErrorBoundary'
import { useLenisSmoothScroll } from '../../hooks/useLenisSmoothScroll'
import { useGsapPageAnimations } from '../../hooks/useGsapPageAnimations'

function Layout() {
  const mainRef = useRef<HTMLElement | null>(null)

  useLenisSmoothScroll()
  useGsapPageAnimations(mainRef)

  return (
    <>
      <Navbar />
      <main ref={mainRef} data-animate-auto className="pt-[72px]">
        <ErrorBoundary name="PageContent">
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
    </>
  )
}

export default Layout
