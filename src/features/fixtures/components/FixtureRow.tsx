import type { Fixture } from '../types/fixture.types'

const badgeStyles: Record<string, string> = {
  won: 'bg-green-light/15 text-[#4abe6e] border-green-light/30',
  lost: 'bg-[#c83c32]/10 text-[#d07060] border-[#c83c32]/20',
  upcoming: 'bg-gold/10 text-gold border-gold/[0.18]',
  draw: 'bg-[#828278]/10 text-[#888880] border-[#828278]/20',
  abandoned: 'bg-[#8ea0b8]/10 text-[#b5c2d4] border-[#8ea0b8]/20',
  forfeited: 'bg-[#d8975f]/10 text-[#ffc08a] border-[#d8975f]/20',
}

function FixtureRow({ fixture }: { fixture: Fixture }) {
  const isUpcoming = fixture.result === 'upcoming'
  const isResult = !isUpcoming
  const scoreboardUrl = fixture.scoreboardUrl ?? fixture.playHqUrl
  const isClickable = Boolean(scoreboardUrl)

  const handleClick = () => {
    if (scoreboardUrl) {
      window.open(scoreboardUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const leftBorder = isUpcoming
    ? 'border-l-2 border-l-green-light/50'
    : fixture.result === 'won'
      ? 'border-l-2 border-l-gold/40'
      : 'border-l-2 border-l-transparent'

  return (
    <div
      data-animate="card"
      onClick={handleClick}
      className={`group grid items-center gap-x-3 gap-y-3 px-3.5 py-4 min-[401px]:grid-cols-[auto_1fr_auto] min-[401px]:[grid-template-areas:'date_match_badge''score_score_cta'] min-[641px]:gap-x-4 min-[641px]:gap-y-3.5 min-[641px]:px-[18px] min-[641px]:py-[18px] min-[901px]:grid-cols-[80px_1fr_auto_auto_100px] min-[901px]:gap-4 min-[901px]:px-5 min-[901px]:py-[18px] min-[901px]:[grid-template-areas:'date_match_score_badge_cta'] min-[1025px]:grid-cols-[90px_1fr_auto_auto_120px] min-[1025px]:gap-5 min-[1025px]:px-6 min-[1025px]:py-5 rounded-sm mb-2 border-[0.5px] border-white/[0.1] bg-[linear-gradient(135deg,#171a18_0%,#101210_58%,#18160f_100%)] shadow-[0_18px_55px_rgba(0,0,0,0.28)] transition-all hover:-translate-y-0.5 hover:border-gold/25 hover:bg-[linear-gradient(135deg,#1b1e1b_0%,#121512_58%,#1c190f_100%)] hover:shadow-[0_22px_70px_rgba(0,0,0,0.38)] ${leftBorder} ${
        isClickable ? 'cursor-pointer' : 'cursor-default'
      }
      grid-cols-[auto_1fr]
      [grid-template-areas:'date_match''badge_match''score_cta']`}
    >
      {/* Date block */}
      <div className="text-center [grid-area:date]">
        <div className="font-display text-2xl text-[#eee7d8] leading-none min-[641px]:text-[28px] min-[901px]:text-[32px]">
          {fixture.day}
        </div>
        <div className="font-heading text-[9px] font-bold tracking-[2px] uppercase text-muted min-[641px]:text-[10px]">
          {fixture.monthShort}
        </div>
      </div>

      {/* Match teams + meta */}
      <div className="min-w-0 [grid-area:match]">
        <div className="mb-1 font-heading text-[15px] font-bold leading-[1.25] tracking-[0.5px] text-[#e7e0d1] min-[641px]:text-[17px] min-[641px]:leading-[1.2] min-[901px]:text-[19px]">
          {fixture.isHome ? (
            <>
              <span className="text-gold">{fixture.homeTeam}</span> vs{' '}
              {fixture.awayTeam}
            </>
          ) : (
            <>
              {fixture.homeTeam} vs{' '}
              <span className="text-gold">{fixture.awayTeam}</span>
            </>
          )}
        </div>
        <div className="font-body text-[11px] sm:text-xs font-light text-muted">
          {fixture.time} · {fixture.venue}
        </div>
      </div>

      {/* Score block */}
      <div className="[grid-area:score] min-w-0 text-left min-[901px]:min-w-[130px] min-[901px]:text-right">
        {isResult && fixture.ourScore && (
          <>
            <div>
              <span className="font-display text-xl tracking-[1px] text-gold min-[641px]:text-[22px] min-[901px]:text-[26px]">
                {fixture.ourScore.split('/')[0]?.trim()}
              </span>
              <span className="font-heading text-sm text-muted ml-1">
                / {fixture.ourScore.split('/')[1]?.trim()}
              </span>
            </div>
            <div>
              <span className="font-display text-base text-muted min-[901px]:text-lg">
                {fixture.oppScore?.split('/')[0]?.trim()}
              </span>
              <span className="font-heading text-xs text-muted ml-1">
                / {fixture.oppScore?.split('/')[1]?.trim()}
              </span>
            </div>
          </>
        )}
        {isUpcoming && (
          <div className="font-heading text-base tracking-[1px] text-muted">
            TBC
          </div>
        )}
      </div>

      {/* Badge */}
      <div className="[grid-area:badge] self-start justify-self-start min-[401px]:justify-self-auto min-[901px]:self-center">
        <span
          className={`inline-block rounded-sm border-[0.5px] px-[9px] py-1 font-heading text-[9px] font-bold uppercase tracking-[2px] whitespace-nowrap min-[641px]:px-3 min-[641px]:py-[5px] min-[641px]:text-[10px] ${badgeStyles[fixture.result]}`}
        >
          {fixture.badge}
        </span>
      </div>

      {/* CTA */}
      <div className="[grid-area:cta] text-right self-center font-heading text-[10px] font-bold tracking-[2px] uppercase text-muted group-hover:text-gold transition-colors">
        {isClickable ? 'Details →' : ''}
      </div>
    </div>
  )
}

export default FixtureRow
