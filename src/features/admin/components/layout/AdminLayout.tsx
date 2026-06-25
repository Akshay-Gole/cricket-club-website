import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import AdminTopbar from './AdminTopbar'
import ErrorBoundary from '../../../../components/shared/ErrorBoundary'

function AdminLayout() {
  const location = useLocation()

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
    <div className="min-h-screen bg-[#070a07] text-cream">
      <AdminSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <div className="min-h-screen min-[901px]:ml-[272px]">
        <AdminTopbar onOpenMenu={openSidebar} />
        <main className="relative min-h-[calc(100vh-76px)] overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.055] [background-image:linear-gradient(rgba(201,168,76,1)_1px,transparent_1px),linear-gradient(90deg,rgba(201,168,76,1)_1px,transparent_1px)] [background-size:64px_64px]"
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
