import type { PlayerProfile } from '../../types/playerProfile.types'

function BioTab({ player }: { player: PlayerProfile }) {
  // STATIC bio content (Catto). Swap for real player bio data later.
  return (
    <div className="grid grid-cols-1 min-[901px]:grid-cols-[1fr_300px] gap-8 min-[901px]:gap-12 pb-14 sm:pb-16">
      {/* LEFT — bio text */}
      <div>
        <p className="font-body text-sm sm:text-[15px] font-light text-white/65 leading-[1.85] mb-5">
          James Catto is the heartbeat of Top G's CC — both with the bat and
          with the armband. A natural leader who was voted captain before the
          club had even played its first competitive fixture, Catto set the tone
          from day one with his aggressive but intelligent brand of cricket.
        </p>
        <p className="font-body text-sm sm:text-[15px] font-light text-white/65 leading-[1.85] mb-5">
          Growing up in the northern suburbs of Adelaide, Catto started playing
          backyard cricket with his cousins before picking up his first proper
          bat at thirteen. His instinct for reading the game quickly stood out
          in club Under-16s, where he twice won the competition's best player
          award in consecutive seasons.
        </p>

        {/* Pull quote with attribution */}
        <div className="border-l-2 border-gold pl-5 sm:pl-6 my-7 sm:my-8">
          <p className="font-heading text-lg sm:text-[22px] font-semibold italic text-white leading-[1.4]">
            "We didn't build this club to finish mid-table. We're here to win,
            and we expect every player who puts on that jersey to feel exactly
            the same."
          </p>
          <cite className="block mt-2.5 font-heading text-[11px] font-semibold tracking-[2px] uppercase text-gold not-italic">
            — James Catto, Captain
          </cite>
        </div>

        <p className="font-body text-sm sm:text-[15px] font-light text-white/65 leading-[1.85] mb-5">
          As an all-rounder, Catto offers genuine value in both departments. His
          batting is built on a strong off-side game and a fearless approach
          against pace, while his medium-fast bowling consistently generates
          movement off the pitch, making him a reliable first-change option for
          Top G's in all conditions.
        </p>
        <p className="font-body text-sm sm:text-[15px] font-light text-white/65 leading-[1.85]">
          Off the field, Catto works in construction management and credits the
          discipline of his trade with shaping his mindset as a cricketer. He is
          known around the club for his meticulous preparation and team-first
          attitude — two qualities that have made him the unanimous choice to
          lead the side through its inaugural season.
        </p>
      </div>

      {/* RIGHT — info cards sidebar */}
      <div>
        <InfoCard
          title="Personal Details"
          rows={[
            ['Full Name', player.fullName],
            ['Age', '24'],
            ['Hometown', 'Adelaide, SA'],
            ['Jersey No.', `#${String(player.jerseyNumber).padStart(2, '0')}`],
            ['Role', 'Captain / All-Rounder'],
          ]}
        />
        <InfoCard
          title="Playing Info"
          rows={[
            ['Bat', 'Right-hand'],
            ['Bowl', 'Right-arm med'],
            ['Debut', 'Mar 2026'],
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
