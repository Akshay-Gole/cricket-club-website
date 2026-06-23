import { recentActivity } from '../../constants/dashboardData'
import type { AdminTone } from '../../types/admin.types'

const dotClasses: Record<AdminTone, string> = {
  gold: 'bg-gold',
  green: 'bg-green-light',
  blue: 'bg-[#9aaeff]',
  red: 'bg-[#ff9b8f]',
  neutral: 'bg-muted',
}

function RecentActivity() {
  return (
    <section className="rounded border border-white/[0.07] bg-[#121412]">
      <div className="border-b border-white/[0.06] px-5 py-4">
        <p className="font-heading text-[10px] font-bold uppercase tracking-[3px] text-gold">
          Audit Trail
        </p>
        <h3 className="mt-1 font-display text-2xl tracking-[1px] text-white">
          Recent Activity
        </h3>
      </div>

      <div className="px-5 py-5">
        <div className="relative space-y-5">
          <div
            aria-hidden="true"
            className="absolute bottom-2 left-[5px] top-2 w-px bg-white/[0.08]"
          />

          {recentActivity.map(item => (
            <article key={item.id} className="relative flex gap-4">
              <span
                className={`relative z-[1] mt-1.5 h-2.5 w-2.5 rounded-full ${dotClasses[item.tone]}`}
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <h4 className="font-heading text-sm font-bold text-white">
                    {item.title}
                  </h4>

                  <span className="shrink-0 font-heading text-[10px] font-bold uppercase tracking-[1.5px] text-muted">
                    {item.time}
                  </span>
                </div>

                <p className="mt-1 font-body text-xs font-light leading-[1.7] text-muted">
                  {item.detail}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default RecentActivity
