import { INTENTS, type IntentId } from '../intents'

interface Props {
  selected: IntentId | null
  onSelect: (intent: IntentId) => void
}

function IntentSelector({ selected, onSelect }: Props) {
  return (
    <div className="px-5 sm:px-7 lg:px-12 pt-12 sm:pt-14">
      {/* Eyebrow */}
      <div className="flex items-center gap-3.5 mb-6 font-heading text-[11px] font-semibold tracking-[4px] uppercase text-gold">
        <span className="block w-7 h-px bg-gold" />
        Get in Touch
      </div>

      {/* Question */}
      <div className="font-display text-3xl sm:text-[42px] tracking-[1px] text-white leading-[1.05] mb-7">
        Pick your reason —<br />
        we'll tailor the form.
      </div>

      {/* Intent grid */}
      <div className="grid grid-cols-1 min-[641px]:grid-cols-2 min-[1025px]:grid-cols-4 gap-px bg-white/[0.06]">
        {INTENTS.map(intent => {
          const isActive = selected === intent.id
          return (
            <button
              key={intent.id}
              onClick={() => onSelect(intent.id)}
              className={`group relative text-left p-7 overflow-hidden cursor-pointer transition-colors border-2 ${
                isActive
                  ? 'border-gold bg-[#0e1a0a]'
                  : 'border-transparent bg-card hover:bg-[#1b1b1b]'
              }`}
            >
              {/* Check badge (top-right) */}
              <div
                className={`absolute top-3 right-3 w-5 h-5 rounded-full bg-gold flex items-center justify-center transition-all ${
                  isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                }`}
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0a0a0a"
                  strokeWidth="3"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              {/* Ghost number */}
              <div className="absolute -bottom-3 -right-1.5 font-display text-[72px] text-white/[0.025] leading-none pointer-events-none">
                {intent.ghost}
              </div>

              <div className="relative">
                <span className="block text-[28px] mb-3.5">{intent.emoji}</span>
                <div
                  className={`font-display text-[22px] tracking-[1px] mb-1.5 transition-colors ${
                    isActive ? 'text-gold' : 'text-white'
                  }`}
                >
                  {intent.name}
                </div>
                <div className="font-body text-xs font-light text-muted leading-[1.5]">
                  {intent.sub}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default IntentSelector
