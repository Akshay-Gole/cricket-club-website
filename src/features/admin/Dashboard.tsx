import DashboardStats from './components/dashboard/DashboardStats'
import NextFixture from './components/dashboard/NextFixture'
import QuickActions from './components/dashboard/QuickActions'
import RecentActivity from './components/dashboard/RecentActivity'
import RecentMessages from './components/dashboard/RecentMessages'

function Dashboard() {
  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="relative overflow-hidden rounded border border-white/[0.07] bg-[#121513] px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(45,138,71,0.14),transparent_30%)]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
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
              Manage players, fixtures, messages, applications and club content
              from one place. This is using mock data for now until your backend
              is ready.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 min-[420px]:grid-cols-3 min-[901px]:w-[330px]">
            <div className="rounded border border-white/[0.07] bg-black/20 p-4">
              <div className="font-display text-3xl leading-none text-gold">
                2026
              </div>
              <div className="mt-1 font-heading text-[9px] font-bold uppercase tracking-[2px] text-muted">
                Season
              </div>
            </div>

            <div className="rounded border border-white/[0.07] bg-black/20 p-4">
              <div className="font-display text-3xl leading-none text-white">
                4
              </div>
              <div className="mt-1 font-heading text-[9px] font-bold uppercase tracking-[2px] text-muted">
                Unread
              </div>
            </div>

            <div className="rounded border border-white/[0.07] bg-black/20 p-4">
              <div className="font-display text-3xl leading-none text-green-light">
                6
              </div>
              <div className="mt-1 font-heading text-[9px] font-bold uppercase tracking-[2px] text-muted">
                Upcoming
              </div>
            </div>
          </div>
        </div>
      </section>

      <DashboardStats />

      <div className="grid grid-cols-1 gap-5 sm:gap-6 min-[1025px]:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]">
        <div className="space-y-5 sm:space-y-6">
          <NextFixture />
          <RecentMessages />
        </div>

        <div className="space-y-5 sm:space-y-6">
          <QuickActions />
          <RecentActivity />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
