import DashboardStats from './components/dashboard/DashboardStats'
import NextFixture from './components/dashboard/NextFixture'
import QuickActions from './components/dashboard/QuickActions'
import RecentActivity from './components/dashboard/RecentActivity'
import RecentMessages from './components/dashboard/RecentMessages'

function Dashboard() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ADMIN_DASHBOARD_QUERY_KEY,
    queryFn: getAdminDashboard,
  })

  if (isLoading) {
    return <PageLoader variant="section" label="Loading Dashboard" />
  }

  if (isError || !data) {
    return (
      <div className="rounded border border-[#d86b5f]/25 bg-[#d86b5f]/[0.08] p-6">
        <p className="font-body text-sm text-[#ff9b8f]">
          Could not load dashboard data.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-3 font-heading text-[10px] font-bold uppercase tracking-[2px] text-gold"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="relative overflow-hidden rounded border border-white/[0.1] bg-[#181818] px-5 py-8 shadow-[0_20px_70px_rgba(0,0,0,0.28)] sm:px-8 sm:py-10 lg:px-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(201,168,76,0.1),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.035),transparent_45%)]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 44px, rgba(201,168,76,1) 44px, rgba(201,168,76,1) 45px), repeating-linear-gradient(90deg, transparent, transparent 56px, rgba(201,168,76,1) 56px, rgba(201,168,76,1) 57px)',
          }}
        />

        <div className="relative flex flex-col gap-8 min-[901px]:flex-row min-[901px]:items-end min-[901px]:justify-between">
          <div className="max-w-[720px]">
            <div className="mb-3 font-heading text-[10px] font-bold uppercase tracking-[4px] text-gold">
              Administration Overview
            </div>

            <h2 className="font-display text-[38px] leading-none tracking-[1px] text-white sm:text-[48px] lg:text-[56px]">
              Welcome To The Command Centre.
            </h2>

            <p className="mt-4 max-w-[620px] font-body text-sm font-light leading-[1.8] text-muted">
              Manage players, fixtures, messages, sponsors and club content from
              one place. All dashboard figures are calculated from the live
              database.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 min-[420px]:grid-cols-3 min-[901px]:w-[330px]">
            <div className="rounded border border-white/[0.1] bg-[#202020]/80 p-4">
              <div className="font-display text-3xl leading-none text-gold">
                {data.season}
              </div>
              <div className="mt-1 font-heading text-[9px] font-bold uppercase tracking-[2px] text-muted">
                Season
              </div>
            </div>

            <div className="rounded border border-white/[0.1] bg-[#202020]/80 p-4">
              <div className="font-display text-3xl leading-none text-white">
                {data.unread}
              </div>
              <div className="mt-1 font-heading text-[9px] font-bold uppercase tracking-[2px] text-muted">
                Unread
              </div>
            </div>

            <div className="rounded border border-white/[0.1] bg-[#202020]/80 p-4">
              <div className="font-display text-3xl leading-none text-gold-light">
                {data.upcoming}
              </div>
              <div className="mt-1 font-heading text-[9px] font-bold uppercase tracking-[2px] text-muted">
                Upcoming
              </div>
            </div>
          </div>
        </div>
      </section>

      <DashboardStats stats={data.stats} />

      <div className="grid grid-cols-1 gap-5 sm:gap-6 min-[1025px]:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]">
        <div className="space-y-5 sm:space-y-6">
          <NextFixture fixture={data.nextFixture} />
          <RecentMessages messages={data.recentMessages} />
        </div>

        <div className="space-y-5 sm:space-y-6">
          <QuickActions />
          <RecentActivity activity={data.recentActivity} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
import { useQuery } from '@tanstack/react-query'
import PageLoader from '../../components/shared/PageLoader'
import {
  ADMIN_DASHBOARD_QUERY_KEY,
  getAdminDashboard,
} from './api/dashboard.api'
