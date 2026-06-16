import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import Navbar from './Navbar'
import ErrorBoundary from './ErrorBoundary'

function Layout() {
  return (
    <>
      <Navbar />
      <main className="pt-[72px]">
        <ErrorBoundary name="PageContent">
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
    </>
  )
}

export default Layout
