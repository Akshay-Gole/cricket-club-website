import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ROUTES } from '../../../constants/routes'

function ProtectedRoute() {
  const location = useLocation()
  const token = localStorage.getItem('token')

  if (!token) {
    return (
      <Navigate
        to={ROUTES.ADMIN_LOGIN}
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  return <Outlet />
}

export default ProtectedRoute
