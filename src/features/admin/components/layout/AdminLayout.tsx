import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import AdminTopbar from './AdminTopbar'
import ErrorBoundary from '../../../../components/shared/ErrorBoundary'
import { useGsapPageAnimations } from '../../../../hooks/useGsapPageAnimations'
import { useLenisSmoothScroll } from '../../../../hooks/useLenisSmoothScroll'

function AdminLayout() {
  const location = useLocation()
  const mainRef = useRef<HTMLElement | null>(null)

  const [sidebarOpenedAtPath, setSidebarOpenedAtPath] = useState<string | null>(
    null
  )

  const isSidebarOpen = sidebarOpenedAtPath === location.pathname

  const openSidebar = () => {
    setSidebarOpenedAtPath(location.pathname)
  }

  const closeSidebar = () => {
    setSidebarOpenedAtPath(null)
  }

  useLenisSmoothScroll()
  useGsapPageAnimations(mainRef)

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [isSidebarOpen])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeSidebar()
      }
    }

    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#070707] text-cream">
      <AdminSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <div className="min-h-screen min-[901px]:ml-[272px]">
        <AdminTopbar onOpenMenu={openSidebar} />
        <main
          ref={mainRef}
          data-animate-auto
          className="relative min-h-[calc(100vh-76px)] overflow-hidden"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(201,168,76,0.65)_1px,transparent_1px),linear-gradient(90deg,rgba(201,168,76,0.65)_1px,transparent_1px)] [background-size:72px_72px]"
          />

          <div className="relative mx-auto w-full max-w-[1600px] px-5 py-6 sm:px-7 sm:py-8 lg:px-9 lg:py-9">
            <ErrorBoundary name="AdminContent">
              <Outlet />
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
