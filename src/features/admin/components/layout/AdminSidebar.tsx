import { NavLink, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import { logoutUser } from '../../../auth/store/authSlice'
import { ADMIN_NAVIGATION } from '../../constants/adminNavigation'
import type { AdminIconName } from '../../constants/adminNavigation'
import { ROUTES } from '../../../../constants/routes'
import logo from '../../../../assets/images/logo.png'

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
}

function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector(state => state.auth.user)

  const handleLogout = async () => {
    await dispatch(logoutUser()).unwrap()
    onClose()
    navigate(ROUTES.ADMIN_LOGIN, { replace: true })
  }

  return (
    <>
      <button
        type="button"
        aria-label="Close admin navigation"
        onClick={onClose}
        className={`fixed inset-0 z-[70] bg-black/75 backdrop-blur-sm transition-opacity min-[901px]:hidden ${
          isOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-[80] flex w-[272px] flex-col border-r border-white/[0.07] bg-[#0d100e] transition-transform duration-300 min-[901px]:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="relative flex h-[88px] items-center border-b border-white/[0.07] px-6">
          <NavLink
            to={ROUTES.ADMIN_DASHBOARD}
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <img
              src={logo}
              alt="Top G's CC"
              className="h-12 w-12 object-contain"
            />

            <div>
              <div className="font-display text-[22px] tracking-[2px] text-white">
                TOP G'S <span className="text-gold">CC</span>
              </div>

              <div className="font-heading text-[9px] font-bold uppercase tracking-[3px] text-muted">
                Admin Portal
              </div>
            </div>
          </NavLink>

          <button
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
            className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-2xl text-muted hover:text-gold min-[901px]:hidden"
          >
            ×
          </button>
        </div>

        <div className="px-6 pb-3 pt-7 font-heading text-[9px] font-bold uppercase tracking-[3px] text-muted/70">
          Club Management
        </div>

        <nav className="flex-1 overflow-y-auto px-3">
          {ADMIN_NAVIGATION.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `group relative mb-1 flex min-h-12 items-center gap-3 rounded-sm px-4 font-heading text-[13px] font-semibold uppercase tracking-[1.5px] transition-colors ${
                  isActive
                    ? 'bg-gold/10 text-gold'
                    : 'text-muted hover:bg-white/[0.04] hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute inset-y-2 left-0 w-0.5 bg-gold" />
                  )}

                  <AdminIcon name={item.icon} />

                  <span className="flex-1">{item.label}</span>

                  {item.badge && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#c94c4c] px-1.5 text-[9px] font-bold text-white">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/[0.07] p-4">
          <div className="mb-3 flex items-center gap-3 rounded-sm bg-white/[0.025] p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/25 bg-gold/10 font-display text-lg text-gold">
              {user?.name?.charAt(0).toUpperCase() ?? 'A'}
            </div>

            <div className="min-w-0 flex-1">
              <div className="truncate font-heading text-sm font-bold text-white">
                {user?.name ?? 'Administrator'}
              </div>

              <div className="truncate font-body text-[10px] text-muted">
                {user?.email}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-sm border border-white/[0.08] font-heading text-[11px] font-bold uppercase tracking-[2px] text-muted transition-colors hover:border-[#c94c4c]/40 hover:bg-[#c94c4c]/10 hover:text-[#e07060]"
          >
            <AdminIcon name="logout" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}

function AdminIcon({ name }: { name: AdminIconName | 'logout' }) {
  const paths: Record<AdminIconName | 'logout', React.ReactNode> = {
    dashboard: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    players: (
      <>
        <circle cx="9" cy="8" r="4" />
        <path d="M2.5 21a6.5 6.5 0 0 1 13 0" />
        <circle cx="17" cy="8" r="3" />
        <path d="M16 15a5 5 0 0 1 5.5 5" />
      </>
    ),
    fixtures: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
    news: (
      <>
        <path d="M4 4h16v16H4z" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </>
    ),
    sponsors: (
      <>
        <path d="M8 12l3 3 5-6" />
        <path d="M3 7h5l2-2h4l2 2h5v12H3z" />
      </>
    ),
    messages: (
      <>
        <path d="M3 5h18v13H8l-5 3z" />
        <path d="M7 9h10M7 13h7" />
      </>
    ),
    applications: (
      <>
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <path d="M9 3h6v4H9zM8 11h8M8 15h6" />
      </>
    ),
    logout: (
      <>
        <path d="M10 5H5v14h5" />
        <path d="M14 8l4 4-4 4M18 12H9" />
      </>
    ),
  }

  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0"
    >
      {paths[name]}
    </svg>
  )
}

export default AdminSidebar
