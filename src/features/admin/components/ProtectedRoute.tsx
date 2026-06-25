// import { Navigate, Outlet, useLocation } from 'react-router-dom'
// import { useAppSelector } from '../../../store/hooks'
// import { ROUTES } from '../../../constants/routes'
import { Outlet } from 'react-router-dom'

function ProtectedRoute() {
  // const location = useLocation()
  // const user = useAppSelector(state => state.auth.user)
  // const token = localStorage.getItem('token')

  // if (!user || !token) {
  //   return (
  //     <Navigate
  //       to={ROUTES.ADMIN_LOGIN}
  //       replace
  //       state={{ from: location.pathname }}
  //     />
  //   )
  // }

  return <Outlet />
}

export default ProtectedRoute
