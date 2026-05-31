import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Layout from './components/shared/Layout'
import { ROUTES } from './constants/routes'

// Lazy load pages — each page's code only downloads when navigated to
const Home = lazy(() => import('./pages/Home'))
const Squad = lazy(() => import('./pages/Squad'))
const Fixtures = lazy(() => import('./pages/Fixtures'))
const Honours = lazy(() => import('./pages/Honours'))
const News = lazy(() => import('./pages/News'))
const Gallery = lazy(() => import('./pages/Gallery'))
const Contact = lazy(() => import('./pages/Contact'))
const JoinClub = lazy(() => import('./pages/JoinClub'))
const About = lazy(() => import('./pages/About'))
const Sponsors = lazy(() => import('./pages/Sponsors'))
const NotFound = lazy(() => import('./pages/NotFound'))

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <div className="font-['Bebas_Neue'] text-[#c9a84c] text-2xl tracking-[3px]">
        Loading...
      </div>
    </div>
  )
}

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Layout wraps all these routes — they render inside its <Outlet /> */}
          <Route element={<Layout />}>
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.SQUAD} element={<Squad />} />
            <Route path={ROUTES.FIXTURES} element={<Fixtures />} />
            <Route path={ROUTES.HONOURS} element={<Honours />} />
            <Route path={ROUTES.NEWS} element={<News />} />
            <Route path={ROUTES.GALLERY} element={<Gallery />} />
            <Route path={ROUTES.CONTACT} element={<Contact />} />
            <Route path={ROUTES.JOIN} element={<JoinClub />} />
            <Route path={ROUTES.ABOUT} element={<About />} />
            <Route path={ROUTES.SPONSORS} element={<Sponsors />} />
            <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
