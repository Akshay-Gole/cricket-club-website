import type { ReactNode } from 'react'
import type {
  BowlingSpell,
  InningsScore,
  PlayerProfile,
} from '../../types/playerProfile.types'

const BASELINE = 162
const TOP = 46
const BAR_WIDTH = 26
const FIRST_X = 58
const STEP = 70

function barFor(value: number, maxValue: number) {
  const usableHeight = BASELINE - TOP
  const height = Math.max((value / maxValue) * usableHeight, 4)
  const y = BASELINE - height

  return { y, height }
}

function FormChart({ player }: { player: PlayerProfile }) {
  const hasBatting = player.recentInnings.length > 0
  const hasBowling = player.recentBowling.length > 0

  if (!hasBatting && !hasBowling) {
    return (
      <div
        data-animate="card"
        className="mt-10 rounded border-[0.5px] border-white/[0.06] bg-card p-5 text-center sm:p-7"
      >
        <div className="font-heading text-sm font-bold uppercase tracking-[1px] text-white">
          Recent Form
        </div>
        <p className="mt-2 font-body text-sm font-light text-muted">
          Sync Play Cricket stats to show recent batting and bowling charts.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-10 grid grid-cols-1 gap-5">
      {hasBatting && <BattingChart innings={player.recentInnings} />}
      {hasBowling && <BowlingChart spells={player.recentBowling} />}
    </div>
  )
}

function BattingChart({ innings }: { innings: InningsScore[] }) {
  const maxRuns = Math.max(50, ...innings.map(innings => innings.runs))

  return (
    <ChartShell title="Batting — Last 8 Match Stats" legend="Runs">
      {innings.map((innings, index) => {
        const x = FIRST_X + index * STEP
        const centerX = x + BAR_WIDTH / 2
        const { y, height } = barFor(innings.runs, maxRuns)

        return (
          <g key={`${innings.match}-${index}`}>
            <rect
              x={x}
              y={y}
              width={BAR_WIDTH}
              height={height}
              rx="2"
              fill="url(#barGold)"
            />
            <text
              x={centerX}
              y={y - 5}
              textAnchor="middle"
              fontSize="9"
              fontFamily="Space Grotesk"
              fill="rgba(201,168,76,0.85)"
            >
              {innings.runs}
            </text>
            <AxisLabel
              x={centerX}
              match={innings.match}
              opponent={innings.opponent}
            />
          </g>
        )
      })}
    </ChartShell>
  )
}

function BowlingChart({ spells }: { spells: BowlingSpell[] }) {
  const maxWickets = Math.max(3, ...spells.map(spell => spell.wickets))

  return (
    <ChartShell title="Bowling — Last 8 Match Stats" legend="Wickets">
      {spells.map((spell, index) => {
        const x = FIRST_X + index * STEP
        const centerX = x + BAR_WIDTH / 2
        const { y, height } = barFor(spell.wickets, maxWickets)

        return (
          <g key={`${spell.match}-${index}`}>
            <rect
              x={x}
              y={y}
              width={BAR_WIDTH}
              height={height}
              rx="2"
              fill="url(#barGreen)"
            />
            <text
              x={centerX}
              y={y - 5}
              textAnchor="middle"
              fontSize="9"
              fontFamily="Space Grotesk"
              fill="rgba(72,184,106,0.9)"
            >
              {spell.wickets}/{spell.runs}
            </text>
            <AxisLabel
              x={centerX}
              match={spell.match}
              opponent={spell.opponent}
            />
          </g>
        )
      })}
    </ChartShell>
  )
}

function ChartShell({
  title,
  legend,
  children,
}: {
  title: string
  legend: string
  children: ReactNode
}) {
  return (
    <div
      data-animate="card"
      className="rounded border-[0.5px] border-white/[0.06] bg-card p-5 sm:p-7"
    >
      <div className="mb-6 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="font-heading text-sm font-bold uppercase tracking-[1px] text-white sm:text-base">
          {title}
        </div>
        <div className="flex items-center gap-1.5 font-body text-xs text-muted">
          <span className="h-2.5 w-2.5 rounded-sm bg-gold" /> {legend}
        </div>
      </div>

      <svg
        viewBox="0 0 620 200"
        className="w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="barGold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#c9a84c" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="barGreen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#48b86a" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#48b86a" stopOpacity="0.25" />
          </linearGradient>
        </defs>

        {[40, 80, 120].map(y => (
          <line
            key={y}
            x1="48"
            y1={y}
            x2="620"
            y2={y}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="0.5"
            strokeDasharray="3,4"
          />
        ))}
        <line
          x1="48"
          y1="162"
          x2="620"
          y2="162"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.5"
        />

        {children}
      </svg>
    </div>
  )
}

function AxisLabel({
  x,
  match,
  opponent,
}: {
  x: number
  match: string
  opponent: string
}) {
  return (
    <>
      <text
        x={x}
        y="178"
        textAnchor="middle"
        fontSize="9"
        fontFamily="Space Grotesk"
        className="fill-muted"
      >
        {match}
      </text>
      <text
        x={x}
        y="192"
        textAnchor="middle"
        fontSize="9"
        fontFamily="Space Grotesk"
        className="fill-muted"
        opacity="0.5"
      >
        {opponent.slice(0, 3).toUpperCase()}
      </text>
    </>
  )
}

export default FormChart
