import type { AdminTone, DashboardStat } from '../../types/admin.types'

const toneClasses: Record<AdminTone, string> = {
  gold: 'border-gold/25 bg-gold/[0.08] text-gold',
  green: 'border-[#6fd28a]/25 bg-[#6fd28a]/[0.07] text-[#8de5a4]',
  blue: 'border-[#6f8cff]/25 bg-[#6f8cff]/[0.08] text-[#9aaeff]',
  red: 'border-[#d86b5f]/25 bg-[#d86b5f]/[0.08] text-[#ff9b8f]',
  neutral: 'border-white/[0.08] bg-white/[0.04] text-muted',
}

function DashboardStats({ stats }: { stats: DashboardStat[] }) {
  return (
    <section className="grid grid-cols-1 gap-4 min-[641px]:grid-cols-2 min-[1025px]:grid-cols-4">
      {stats.map(stat => (
        <article
          key={stat.label}
          className="group relative overflow-hidden rounded border border-white/[0.1] bg-[#161616] p-5 shadow-[0_14px_40px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-1 hover:border-gold/25 hover:bg-[#1b1b1b] hover:shadow-[0_18px_50px_-24px_rgba(201,168,76,0.38)]"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gold/[0.09] blur-2xl transition-opacity group-hover:opacity-100"
          />

          <div className="relative">
            <div className="mb-5 flex items-center justify-between gap-4">
              <p className="font-heading text-[10px] font-bold uppercase tracking-[3px] text-muted">
                {stat.label}
              </p>

              <span
                className={`rounded-full border px-2.5 py-1 font-heading text-[9px] font-bold uppercase tracking-[2px] ${toneClasses[stat.tone]}`}
              >
                {stat.change}
              </span>
            </div>

            <div className="font-display text-[42px] leading-none tracking-[1px] text-white">
              {stat.value}
            </div>

            <p className="mt-3 font-body text-xs font-light leading-[1.7] text-muted">
              {stat.hint}
            </p>
          </div>
        </article>
      ))}
    </section>
  )
}

export default DashboardStats
