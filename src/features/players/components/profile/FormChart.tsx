import type { PlayerProfile } from '../../types/playerProfile.types'

function FormChart({ player }: { player: PlayerProfile }) {
  const innings = player.recentInnings

  // Chart geometry
  const BASELINE = 162 // y where bars start (0 runs)
  const TOP = 46 // y for the max value
  const MAX_RUNS = 120 // scale top
  const BAR_WIDTH = 26
  const FIRST_X = 58 // x of first bar
  const STEP = 70 // horizontal gap between bars

  // Convert a runs value to a bar {y, height}
  const barFor = (runs: number) => {
    const usableHeight = BASELINE - TOP // pixels for MAX_RUNS
    const height = Math.max((runs / MAX_RUNS) * usableHeight, 4) // min 4px so tiny scores show
    const y = BASELINE - height
    return { y, height }
  }

  // Opacity scales with runs (bigger score = bolder bar) — matches mockup's vibe
  const opacityFor = (runs: number) => {
    if (runs >= 90) return 1
    if (runs >= 60) return 0.88
    if (runs >= 40) return 0.8
    if (runs >= 25) return 0.65
    return 0.6
  }

  return (
    <div
      data-animate="card"
      className="mt-10 bg-card border-[0.5px] border-white/[0.06] rounded p-5 sm:p-7"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2.5 mb-6">
        <div className="font-heading text-sm sm:text-base font-bold tracking-[1px] uppercase text-white">
          Run Scoring — Last 8 Innings
        </div>
        <div className="flex gap-3 sm:gap-4">
          <div className="flex items-center gap-1.5 font-body text-xs text-muted">
            <span className="w-2.5 h-2.5 rounded-sm bg-gold" /> Runs
          </div>
          <div className="flex items-center gap-1.5 font-body text-xs text-muted">
            <span className="w-2.5 h-2.5 rounded-full bg-green-light" /> Wickets
          </div>
        </div>
      </div>

      {/* SVG chart */}
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
        </defs>

        {/* Horizontal grid lines */}
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
        <line
          x1="48"
          y1="10"
          x2="48"
          y2="162"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="0.5"
        />

        {/* Y-axis labels */}
        {[
          { y: 44, label: '100' },
          { y: 84, label: '75' },
          { y: 124, label: '50' },
          { y: 164, label: '0' },
        ].map(t => (
          <text
            key={t.label}
            x="38"
            y={t.y}
            textAnchor="end"
            className="fill-muted"
            fontSize="9"
            fontFamily="Space Grotesk"
          >
            {t.label}
          </text>
        ))}

        {/* Bars + value labels + match labels — generated from data */}
        {innings.map((inn, i) => {
          const x = FIRST_X + i * STEP
          const centerX = x + BAR_WIDTH / 2
          const { y, height } = barFor(inn.runs)
          return (
            <g key={inn.match}>
              {/* Bar */}
              <rect
                x={x}
                y={y}
                width={BAR_WIDTH}
                height={height}
                rx="2"
                fill="url(#barGold)"
                opacity={inn.notOut ? 1 : opacityFor(inn.runs)}
              />
              {/* Value above bar */}
              <text
                x={centerX}
                y={y - 5}
                textAnchor="middle"
                fontSize="9"
                fontFamily="Space Grotesk"
                fill={inn.notOut ? '#c9a84c' : 'rgba(201,168,76,0.75)'}
                fontWeight={inn.notOut ? '700' : '400'}
              >
                {inn.runs}
                {inn.notOut ? '★' : ''}
              </text>
              {/* Match label */}
              <text
                x={centerX}
                y="178"
                textAnchor="middle"
                fontSize="9"
                fontFamily="Space Grotesk"
                className="fill-muted"
              >
                {inn.match}
              </text>
              {/* Opponent label */}
              <text
                x={centerX}
                y="192"
                textAnchor="middle"
                fontSize="9"
                fontFamily="Space Grotesk"
                className="fill-muted"
                opacity="0.5"
              >
                {inn.opponent}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default FormChart
