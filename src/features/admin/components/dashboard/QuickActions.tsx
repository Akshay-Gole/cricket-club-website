import { Link } from 'react-router-dom'
import { quickActions } from '../../constants/dashboardData'
import type { AdminTone } from '../../types/admin.types'

const toneClasses: Record<AdminTone, string> = {
  gold: 'hover:border-gold/35 hover:bg-gold/[0.06]',
  green: 'hover:border-green-light/35 hover:bg-green-light/[0.06]',
  blue: 'hover:border-[#9aaeff]/35 hover:bg-[#6f8cff]/[0.06]',
  red: 'hover:border-[#ff9b8f]/35 hover:bg-[#d86b5f]/[0.06]',
  neutral: 'hover:border-white/15 hover:bg-white/[0.04]',
}

function QuickActions() {
  return (
    <section className="rounded border border-white/[0.12] bg-[#182119] p-5">
      <div className="mb-4">
        <p className="font-heading text-[10px] font-bold uppercase tracking-[3px] text-gold">
          Shortcuts
        </p>
        <h3 className="mt-1 font-display text-2xl tracking-[1px] text-white">
          Quick Actions
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-3 min-[641px]:grid-cols-2 min-[1025px]:grid-cols-1">
        {quickActions.map(action => (
          <Link
            key={action.label}
            to={action.to}
            className={`group rounded border border-white/[0.12] bg-white/[0.035] p-4 transition-all duration-300 ${toneClasses[action.tone]}`}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h4 className="font-heading text-sm font-bold uppercase tracking-[1.5px] text-white">
                  {action.label}
                </h4>

                <p className="mt-1 font-body text-xs font-light leading-[1.6] text-muted">
                  {action.description}
                </p>
              </div>

              <span className="font-heading text-lg text-muted transition-all group-hover:translate-x-1 group-hover:text-gold">
                →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default QuickActions
