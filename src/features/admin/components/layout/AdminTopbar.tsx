import { Link, useLocation } from 'react-router-dom'
import { ADMIN_PAGE_META } from '../../constants/adminNavigation'
import { useAppSelector } from '../../../../store/hooks'

interface AdminTopbarProps {
  onOpenMenu: () => void
}

function AdminTopbar({ onOpenMenu }: AdminTopbarProps) {
  const location = useLocation()
  const user = useAppSelector(state => state.auth.user)

  const page =
    ADMIN_PAGE_META.find(item => location.pathname.startsWith(item.path)) ??
    ADMIN_PAGE_META[0]

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#0c0f0d]/95 backdrop-blur-xl">
      <div className="flex min-h-[76px] items-center gap-4 px-5 sm:px-7 lg:px-9">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Open admin navigation"
          className="flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-[5px] rounded-sm border border-white/[0.08] text-gold min-[901px]:hidden"
        >
          <span className="h-0.5 w-5 bg-current" />
          <span className="h-0.5 w-5 bg-current" />
          <span className="h-0.5 w-5 bg-current" />
        </button>

        <div className="min-w-0 flex-1">
          <div className="mb-0.5 hidden font-heading text-[9px] font-bold uppercase tracking-[3px] text-gold sm:block">
            {page.eyebrow}
          </div>

          <h1 className="truncate font-display text-[26px] tracking-[1px] text-white sm:text-[30px]">
            {page.title}
          </h1>
        </div>

        {page.actionLabel && page.actionTo && (
          <Link
            to={page.actionTo}
            className="hidden min-h-10 items-center rounded-sm bg-gold px-5 font-heading text-[11px] font-bold uppercase tracking-[2px] text-black transition-colors hover:bg-gold-light sm:inline-flex"
          >
            {page.actionLabel}
          </Link>
        )}

        <div className="hidden h-8 w-px bg-white/[0.08] sm:block" />

        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/25 bg-gold/10 font-display text-lg text-gold">
          {user?.name?.charAt(0).toUpperCase() ?? 'A'}
        </div>
      </div>
    </header>
  )
}

export default AdminTopbar
