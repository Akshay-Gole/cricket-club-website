import type { PlayerProfile } from '../../types/playerProfile.types'

function ProfileHero({ player }: { player: PlayerProfile }) {
  const initials = player.name.slice(0, 3)

  return (
    <div className="grid grid-cols-1 min-[901px]:grid-cols-[400px_1fr] mx-5 sm:mx-7 lg:mx-12 bg-card border-[0.5px] border-white/[0.06] rounded overflow-hidden relative min-[901px]:min-h-[480px]">
      {/* LEFT — visual panel */}
      <div className="relative flex flex-col justify-end p-7 min-[901px]:p-9 overflow-hidden min-h-[240px] sm:min-h-[280px] [background:linear-gradient(160deg,#0d2a18_0%,#061510_60%,#0a0a0a_100%)]">
        <div className="absolute -top-3 sm:-top-5 -right-1.5 sm:-right-2.5 font-display text-[140px] sm:text-[200px] text-gold/40 leading-none pointer-events-none">
          {String(player.jerseyNumber).padStart(2, '0')}
        </div>

        <div className="relative w-[90px] h-[90px] sm:w-[120px] sm:h-[120px] rounded-full border-2 border-gold/20 flex items-center justify-center font-display text-[28px] sm:text-4xl text-green-light tracking-[2px] mb-4 sm:mb-5 [background:radial-gradient(circle_at_30%_30%,#1a4a28,#06120b)]">
          {initials}
          {player.isCaptain && (
            <div className="absolute top-1 right-1 w-7 h-7 rounded-full bg-gold border-2 border-card flex items-center justify-center font-heading text-[11px] font-bold text-black">
              C
            </div>
          )}
        </div>

        <div className="inline-flex items-center self-start font-heading text-[10px] font-bold tracking-[2.5px] uppercase px-3 py-[5px] rounded-sm mb-3 bg-green-light/15 text-green-light border-[0.5px] border-green-light/30">
          All-Rounder
        </div>

        <div className="font-display text-[38px] sm:text-[52px] leading-[0.95] tracking-[1px] text-white mb-1">
          {player.name}
        </div>
        <div className="font-body text-xs sm:text-[13px] font-light text-muted tracking-[0.5px]">
          {player.fullName} · Jersey #
          {String(player.jerseyNumber).padStart(2, '0')} · Captain
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 [background:linear-gradient(90deg,#c9a84c_0%,#2d8a47_40%,#c9a84c_100%)]" />
      </div>

      {/* RIGHT — stats panel */}
      <div className="flex flex-col justify-between p-8 sm:p-7 lg:px-12 lg:py-10 min-[901px]:border-l-[0.5px] border-white/[0.06]">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-white/[0.2] mb-8">
          {[
            { val: player.runs, lbl: 'Runs' },
            { val: player.wickets, lbl: 'Wickets' },
            { val: player.highScore, lbl: 'High Score' },
            { val: player.battingAverage, lbl: 'Bat Avg' },
            { val: player.bowlingAverage, lbl: 'Bowl Avg' },
            { val: player.matches, lbl: 'Matches' },
          ].map(stat => (
            <div key={stat.lbl} className="bg-card px-4 py-5 sm:px-5 sm:py-6">
              <div className="font-display text-4xl sm:text-5xl text-gold leading-none mb-1.5">
                {stat.val}
              </div>
              <div className="font-heading text-[10px] font-semibold tracking-[2.5px] uppercase text-muted">
                {stat.lbl}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
          {[
            { lbl: 'Batting Style', val: player.battingStyle },
            { lbl: 'Bowling Style', val: player.bowlingStyle },
            { lbl: 'Debut', val: player.debut },
            { lbl: 'Best Bowling', val: player.bestBowling },
            { lbl: '50s / 100s', val: player.fiftiesHundreds },
            { lbl: 'Catches', val: String(player.catches) },
          ].map(meta => (
            <div key={meta.lbl}>
              <div className="font-heading text-[10px] font-semibold tracking-[2px] uppercase text-muted mb-0.5">
                {meta.lbl}
              </div>
              <div className="font-heading text-base font-bold text-white tracking-[0.5px]">
                {meta.val}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProfileHero
