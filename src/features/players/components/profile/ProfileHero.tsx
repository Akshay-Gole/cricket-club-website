import type { PlayerProfile } from '../../types/playerProfile.types'

const roleLabel: Record<PlayerProfile['role'], string> = {
  batsman: 'Batsman',
  bowler: 'Bowler',
  'all-rounder': 'All-Rounder',
  'wicket-keeper': 'Wicket-Keeper',
}

function ProfileHero({ player }: { player: PlayerProfile }) {
  const initials = player.name.slice(0, 3)

  return (
    <div
      data-animate="hero"
      className="grid grid-cols-1 min-[901px]:grid-cols-[400px_1fr] mx-5 sm:mx-7 lg:mx-12 bg-card border-[0.5px] border-white/[0.06] rounded overflow-hidden relative min-[901px]:min-h-[480px]"
    >
      {/* LEFT — visual panel */}
      <div className="group relative flex min-h-[420px] flex-col justify-end overflow-hidden bg-[#06120b] p-7 sm:min-h-[500px] min-[901px]:min-h-full min-[901px]:p-9">
        {player.imageUrl ? (
          <img
            src={player.imageUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full scale-[1.04] object-cover object-center saturate-[0.85] transition-transform duration-700 ease-out group-hover:scale-[1.08]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_30%,#1a4a28,#06120b_60%,#050706)] font-display text-[96px] tracking-[4px] text-green-light/35">
            {initials}
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(2,8,5,0.08)_0%,rgba(2,8,5,0.2)_32%,rgba(2,8,5,0.86)_74%,#030605_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(3,16,9,0.18),transparent_55%,rgba(201,168,76,0.1))]" />
        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.5)]" />

        <div className="pointer-events-none absolute -right-2 -top-4 font-display text-[150px] leading-none text-gold/[0.24] mix-blend-screen sm:text-[210px]">
          {String(player.jerseyNumber).padStart(2, '0')}
        </div>

        <div className="relative z-[1] mb-3 inline-flex items-center self-start rounded-sm border-[0.5px] border-green-light/40 bg-[#062512]/80 px-3 py-[5px] font-heading text-[10px] font-bold uppercase tracking-[2.5px] text-green-light shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-sm">
          {roleLabel[player.role]}
          {player.isCaptain && (
            <span className="ml-2 rounded-sm bg-gold px-1.5 py-0.5 text-[8px] tracking-[1.5px] text-black">
              Captain
            </span>
          )}
        </div>

        <div className="relative z-[1] mb-1 font-display text-[44px] leading-[0.92] tracking-[1px] text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] sm:text-[58px]">
          {player.name}
        </div>
        <div className="relative z-[1] font-body text-xs font-light tracking-[0.5px] text-white/70 drop-shadow-[0_2px_8px_rgba(0,0,0,1)] sm:text-[13px]">
          {player.fullName} · Jersey #
          {String(player.jerseyNumber).padStart(2, '0')}
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
            <div
              key={stat.lbl}
              data-animate="card"
              className="bg-card px-4 py-5 sm:px-5 sm:py-6"
            >
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
