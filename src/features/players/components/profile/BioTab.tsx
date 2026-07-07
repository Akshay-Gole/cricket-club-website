import type { PlayerProfile } from '../../types/playerProfile.types'

const roleLabel: Record<PlayerProfile['role'], string> = {
  batsman: 'Batsman',
  bowler: 'Bowler',
  'all-rounder': 'All-Rounder',
  'wicket-keeper': 'Wicket-Keeper',
}

function BioTab({ player }: { player: PlayerProfile }) {
  return (
    <div className="grid grid-cols-1 min-[901px]:grid-cols-[1fr_300px] gap-8 min-[901px]:gap-12 pb-14 sm:pb-16">
      {/* LEFT — bio text */}
      <div data-animate="reveal">
        <p className="font-body text-sm sm:text-[15px] font-light text-white/65 leading-[1.85] mb-5">
          {player.fullName} is part of the Top G's CC squad for the current
          season. This profile is connected to the live player database, with
          detailed biography and career notes ready to be added from the admin
          system later.
        </p>
        <p className="font-body text-sm sm:text-[15px] font-light text-white/65 leading-[1.85] mb-5">
          For now, the page uses the core squad details already stored in the
          backend: role, jersey number, batting average, best bowling and
          captain status. Match-by-match stats can be wired once the fixtures
          and scorecard backend is ready.
        </p>

        {/* Pull quote with attribution */}
        <div className="border-l-2 border-gold pl-5 sm:pl-6 my-7 sm:my-8">
          <p className="font-heading text-lg sm:text-[22px] font-semibold italic text-white leading-[1.4]">
            "Every player profile starts with the basics. The deeper cricket
            story comes next."
          </p>
          <cite className="block mt-2.5 font-heading text-[11px] font-semibold tracking-[2px] uppercase text-gold not-italic">
            — Top G's CC
          </cite>
        </div>

        <p className="font-body text-sm sm:text-[15px] font-light text-white/65 leading-[1.85] mb-5">
          {player.fullName} is listed as a{' '}
          {roleLabel[player.role].toLowerCase()}
          {player.isCaptain ? ' and currently marked as club captain' : ''}.
          Jersey #{String(player.jerseyNumber).padStart(2, '0')} is now served
          from the backend instead of local mock data.
        </p>
        <p className="font-body text-sm sm:text-[15px] font-light text-white/65 leading-[1.85]">
          When the backend grows, this section can become a proper editable bio
          field. For now, it stays honest and avoids showing another player's
          story.
        </p>
      </div>

      {/* RIGHT — info cards sidebar */}
      <div data-animate="stagger">
        <InfoCard
          title="Personal Details"
          rows={[
            ['Full Name', player.fullName],
            ['Age', 'To be updated'],
            ['Hometown', 'Adelaide, SA'],
            ['Jersey No.', `#${String(player.jerseyNumber).padStart(2, '0')}`],
            [
              'Role',
              player.isCaptain
                ? `Captain / ${roleLabel[player.role]}`
                : roleLabel[player.role],
            ],
          ]}
        />
        <InfoCard
          title="Playing Info"
          rows={[
            ['Bat', player.battingStyle],
            ['Bowl', player.bowlingStyle],
            ['Debut', player.debut],
            ['Club Since', '2026 (Founding)'],
          ]}
        />
      </div>
    </div>
  )
}

// Info card — header + bordered rows (matches mockup .info-card)
function InfoCard({
  title,
  rows,
}: {
  title: string
  rows: [string, string][]
}) {
  return (
    <div className="bg-card border-[0.5px] border-white/[0.06] rounded overflow-hidden mb-4">
      {/* Header */}
      <div className="font-heading text-[15px] font-bold tracking-[3px] uppercase text-gold px-5 py-3 bg-[#1a1a1a] border-b-[0.5px] border-white/[0.06]">
        {title}
      </div>
      {/* Rows */}
      {rows.map(([key, val], i) => (
        <div
          key={key}
          className={`flex justify-between items-center px-5 py-3 ${
            i !== rows.length - 1 ? 'border-b-[0.5px] border-white/[0.06]' : ''
          }`}
        >
          <span className="font-heading text-xs font-semibold tracking-[1px] uppercase text-muted">
            {key}
          </span>
          <span className="font-heading text-sm font-bold text-white">
            {val}
          </span>
        </div>
      ))}
    </div>
  )
}

export default BioTab
