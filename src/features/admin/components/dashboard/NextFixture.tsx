import { nextFixture } from '../../constants/dashboardData'

function NextFixture() {
  return (
    <section className="relative overflow-hidden rounded border border-white/[0.12] bg-[#182119] p-5 sm:p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(201,168,76,0.13),transparent_34%)]"
      />

      <div className="relative">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="font-heading text-[10px] font-bold uppercase tracking-[4px] text-gold">
              Next Fixture
            </p>

            <h3 className="mt-2 font-display text-[34px] leading-none tracking-[1px] text-white sm:text-[42px]">
              Match Day
            </h3>
          </div>

          <span className="rounded border border-gold/25 bg-gold/[0.08] px-3 py-2 font-heading text-[10px] font-bold uppercase tracking-[2.5px] text-gold">
            {nextFixture.status}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 min-[641px]:grid-cols-[150px_1fr]">
          <div className="rounded border border-white/[0.10] bg-white/[0.035] p-5">
            <div className="font-display text-[44px] leading-none text-white">
              14
            </div>
            <div className="mt-1 font-heading text-[11px] font-bold uppercase tracking-[3px] text-muted">
              Jun 2026
            </div>
          </div>

          <div>
            <p className="font-heading text-xs font-bold uppercase tracking-[3px] text-muted">
              Top G&apos;s CC vs
            </p>

            <h4 className="mt-2 font-display text-[30px] leading-[1.05] tracking-[1px] text-gold sm:text-[38px]">
              {nextFixture.opponent}
            </h4>

            <div className="mt-5 grid grid-cols-1 gap-3 min-[641px]:grid-cols-2">
              <div>
                <p className="font-heading text-[10px] font-bold uppercase tracking-[2.5px] text-muted">
                  Time
                </p>
                <p className="mt-1 font-body text-sm text-white">
                  {nextFixture.time}
                </p>
              </div>

              <div>
                <p className="font-heading text-[10px] font-bold uppercase tracking-[2.5px] text-muted">
                  Ground
                </p>
                <p className="mt-1 font-body text-sm text-white">
                  {nextFixture.ground}
                </p>
              </div>

              <div className="min-[641px]:col-span-2">
                <p className="font-heading text-[10px] font-bold uppercase tracking-[2.5px] text-muted">
                  Competition
                </p>
                <p className="mt-1 font-body text-sm text-white">
                  {nextFixture.competition}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NextFixture
