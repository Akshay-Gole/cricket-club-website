import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import Navbar from './Navbar'

function Layout() {
  return (
    <>
      <Navbar />
      <main className="pt-[72px]">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default Layout
