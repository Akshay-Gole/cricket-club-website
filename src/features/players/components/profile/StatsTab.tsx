import type { PlayerProfile } from '../../types/playerProfile.types'
import FormChart from './FormChart'

function StatsTab({ player }: { player: PlayerProfile }) {
  return (
    <div className="pb-14 sm:pb-16">
      {/* BATTING TABLE */}
      <div
        data-animate="reveal"
        className="font-heading text-[11px] font-semibold tracking-[3px] uppercase text-gold mb-4"
      >
        Batting — Career Summary
      </div>
      <div
        data-animate="card"
        className="overflow-x-auto rounded border-[0.5px] border-white/[0.06]"
      >
        <table className="w-full border-collapse min-w-[560px]">
          <thead>
            <tr className="bg-[#1a1a1a]">
              {[
                'Season',
                'Mat',
                'Inn',
                'Runs',
                'HS',
                'Avg',
                'SR',
                '50s',
                '100s',
              ].map(h => (
                <th
                  key={h}
                  className="font-heading text-[10px] font-bold tracking-[2px] uppercase text-muted px-5 py-3 text-left border-b-[0.5px] border-white/[0.06]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-white/[0.02] transition-colors">
              <td className="font-heading font-bold text-gold px-5 py-3.5">
                2026
              </td>
              <td className="font-heading text-base font-semibold text-white px-5 py-3.5">
                {player.matches}
              </td>
              <td className="font-heading text-base font-semibold text-white px-5 py-3.5">
                {player.batting.innings}
              </td>
              <td className="font-display text-[22px] text-gold px-5 py-3.5">
                {player.batting.runs}
              </td>
              <td className="font-display text-[22px] text-gold px-5 py-3.5">
                {player.batting.highScore}
              </td>
              <td className="font-display text-[22px] text-gold px-5 py-3.5">
                {player.batting.average}
              </td>
              <td className="font-heading text-base font-semibold text-white px-5 py-3.5">
                {player.batting.strikeRate}
              </td>
              <td className="font-heading text-base font-semibold text-white px-5 py-3.5">
                {player.batting.fifties}
              </td>
              <td className="font-heading text-base font-semibold text-white px-5 py-3.5">
                {player.batting.hundreds}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* BOWLING TABLE */}
      <div
        data-animate="reveal"
        className="font-heading text-[11px] font-semibold tracking-[3px] uppercase text-gold mb-4 mt-7"
      >
        Bowling — Career Summary
      </div>
      <div
        data-animate="card"
        className="overflow-x-auto rounded border-[0.5px] border-white/[0.06]"
      >
        <table className="w-full border-collapse min-w-[560px]">
          <thead>
            <tr className="bg-[#1a1a1a]">
              {[
                'Season',
                'Mat',
                'Overs',
                'Wkts',
                'Best',
                'Avg',
                'Econ',
                '5Wi',
              ].map(h => (
                <th
                  key={h}
                  className="font-heading text-[10px] font-bold tracking-[2px] uppercase text-muted px-5 py-3 text-left border-b-[0.5px] border-white/[0.06]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-white/[0.02] transition-colors">
              <td className="font-heading font-bold text-gold px-5 py-3.5">
                2026
              </td>
              <td className="font-heading text-base font-semibold text-white px-5 py-3.5">
                {player.matches}
              </td>
              <td className="font-heading text-base font-semibold text-white px-5 py-3.5">
                {player.bowling.overs}
              </td>
              <td className="font-display text-[22px] text-gold px-5 py-3.5">
                {player.bowling.wickets}
              </td>
              <td className="font-display text-[22px] text-gold px-5 py-3.5">
                {player.bowling.bestBowling}
              </td>
              <td className="font-display text-[22px] text-gold px-5 py-3.5">
                {player.bowling.average}
              </td>
              <td className="font-heading text-base font-semibold text-white px-5 py-3.5">
                {player.bowling.economy}
              </td>
              <td className="font-heading text-base font-semibold text-white px-5 py-3.5">
                {player.bowling.fiveWickets}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <FormChart player={player} />
    </div>
  )
}

export default StatsTab
