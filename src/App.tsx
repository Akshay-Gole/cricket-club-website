import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/shared/Layout'
import PageLoader from './components/shared/PageLoader'
import { ROUTES } from './constants/routes'

const Home = lazy(() => import('./pages/Home'))
const Squad = lazy(() => import('./pages/Squad'))
const Fixtures = lazy(() => import('./pages/Fixtures'))
const Honours = lazy(() => import('./pages/Honours'))
const News = lazy(() => import('./pages/News'))
const NewsArticle = lazy(() => import('./pages/NewsArticle'))
const Gallery = lazy(() => import('./pages/Gallery'))
const Contact = lazy(() => import('./pages/Contact'))
const JoinClub = lazy(() => import('./pages/JoinClub'))
const About = lazy(() => import('./pages/About'))
const Sponsors = lazy(() => import('./pages/Sponsors'))
const NotFound = lazy(() => import('./pages/NotFound'))
const PlayerProfile = lazy(() => import('./pages/PlayerProfile'))

const AdminLogin = lazy(() => import('./features/admin/Login'))
const AdminDashboard = lazy(() => import('./features/admin/Dashboard'))
const ManagePlayers = lazy(() => import('./features/admin/ManagePlayers'))
const ManageFixtures = lazy(() => import('./features/admin/ManageFixtures'))
const ManageNews = lazy(() => import('./features/admin/ManageNews'))
const ManageHonours = lazy(() => import('./features/admin/ManageHonours'))
const ManageGallery = lazy(() => import('./features/admin/ManageGallery'))
const ManageSponsors = lazy(() => import('./features/admin/ManageSponsors'))
const ContactSubmissions = lazy(
  () => import('./features/admin/ContactSubmissions')
)

const AdminLayout = lazy(
  () => import('./features/admin/components/layout/AdminLayout')
)

const ProtectedRoute = lazy(
  () => import('./features/admin/components/ProtectedRoute')
)

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public website */}
          <Route element={<Layout />}>
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.SQUAD} element={<Squad />} />
            <Route path={ROUTES.PLAYER_PROFILE} element={<PlayerProfile />} />
            <Route path={ROUTES.FIXTURES} element={<Fixtures />} />
            <Route path={ROUTES.HONOURS} element={<Honours />} />
            <Route path={ROUTES.NEWS} element={<News />} />
            <Route path={ROUTES.NEWS_ARTICLE} element={<NewsArticle />} />
            <Route path={ROUTES.GALLERY} element={<Gallery />} />
            <Route path={ROUTES.CONTACT} element={<Contact />} />
            <Route path={ROUTES.JOIN} element={<JoinClub />} />
            <Route path={ROUTES.ABOUT} element={<About />} />
            <Route path={ROUTES.SPONSORS} element={<Sponsors />} />
          </Route>

          {/* Admin login has no public navbar or footer */}
          <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLogin />} />

          {/* Protected administration */}
          <Route element={<ProtectedRoute />}>
            <Route path={ROUTES.ADMIN_ROOT} element={<AdminLayout />}>
              <Route
                index
                element={<Navigate to={ROUTES.ADMIN_DASHBOARD} replace />}
              />

              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="players" element={<ManagePlayers />} />
              <Route path="fixtures" element={<ManageFixtures />} />
              <Route path="news" element={<ManageNews />} />
              <Route path="honours" element={<ManageHonours />} />
              <Route path="gallery" element={<ManageGallery />} />
              <Route path="sponsors" element={<ManageSponsors />} />
              <Route path="messages" element={<ContactSubmissions />} />
            </Route>
          </Route>

          <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
