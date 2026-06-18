import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import logger from '../services/logger'

function HeroSection() {
  useEffect(() => {
    logger.info('Home page visited')
  }, [])

  return (
    <section className="relative h-screen min-h-[700px] flex flex-col justify-end overflow-hidden px-12 pb-20 -mt-[72px]">
      {/* Decorative layer 1: faint cricket-field grid */}
      <div
        className="absolute inset-0 z-0 opacity-[0.4]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 60px, #1a5c2e 60px, #1a5c2e 61px), repeating-linear-gradient(90deg, transparent, transparent 80px, #1a5c2e 80px, #1a5c2e 81px)',
        }}
      />
      {/* Decorative layer 2: dark + green gradient wash */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            'linear-gradient(to top, rgba(10,10,10,1) 0%, rgba(10,10,10,0.5) 40%, rgba(10,10,10,0.1) 100%), linear-gradient(135deg, rgba(26,92,46,0.3) 0%, transparent 60%)',
        }}
      />
      {/* Decorative layer 3: gold circle accent (hidden on smaller screens) */}
      <div className="absolute -top-[20%] -right-[8%] w-[700px] h-[700px] rounded-full border border-gold/10 z-[1] hidden min-[901px]:block" />
      {/* Hero content */}
      <div className="relative z-[2] max-w-[900px]">
        {/* Eyebrow */}
        <div className="flex items-center gap-3.5 mb-5 font-heading text-xs font-semibold tracking-[4px] uppercase text-gold">
          <span className="block w-10 h-px bg-gold" />
          Est. 2026 &nbsp;·&nbsp; Adelaide, SA
        </div>

        {/* Title */}
        <h1 className="font-display uppercase text-cream leading-[0.9] tracking-[2px] mb-3 text-[clamp(80px,12vw,140px)]">
          TOP <span className="text-gold">G's</span>
          <br />
          CC
        </h1>

        {/* Subtitle */}
        <div className="font-display text-green-light tracking-[6px] mb-7 text-[clamp(28px,4vw,48px)]">
          PLAY HARD. WIN HARDER.
        </div>

        {/* Description */}
        <p className="font-body font-light leading-[1.7] text-cream/55 max-w-[480px] mb-10 text-base">
          A new breed of cricket club. Built for the next generation of players
          who take the game seriously and live it harder.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
          <Link
            to={ROUTES.FIXTURES}
            className="font-heading text-[13px] font-bold tracking-[3px] uppercase text-black bg-gold px-9 py-4 rounded-sm text-center hover:bg-gold-light transition-colors"
          >
            View Fixtures
          </Link>
          <Link
            to={ROUTES.GALLERY}
            className="font-heading text-[13px] font-semibold tracking-[3px] uppercase text-cream bg-transparent border-[0.5px] border-cream/30 px-9 py-4 rounded-sm flex items-center justify-center gap-2.5 hover:border-cream/60 transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Club Highlights
          </Link>
        </div>
      </div>
      {/* Floating match card — STATIC PLACEHOLDER DATA (swap for API/fixtures data later) */}
      <div className="relative z-[3] w-full max-w-[420px] mt-9 bg-card border-[0.5px] border-gold/15 rounded p-7 min-[901px]:absolute min-[901px]:right-12 min-[901px]:bottom-20 min-[901px]:w-[300px] min-[901px]:mt-0">
        {' '}
        {/* Tag with live dot */}
        <div className="flex items-center gap-2 mb-4 font-heading text-[10px] font-bold tracking-[3px] uppercase text-gold">
          <span className="w-[7px] h-[7px] rounded-full bg-[#e74c3c] animate-pulse" />
          Next Match
        </div>
        {/* Teams — STATIC: replace with real fixture teams */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-center">
            <div className="font-heading text-xl font-bold tracking-[1px] text-cream">
              TOP G's
            </div>
            <div className="font-heading text-[13px] tracking-[1px] text-cream mt-0.5">
              CC
            </div>
          </div>
          <div className="font-heading text-[11px] font-semibold tracking-[2px] text-muted">
            VS
          </div>
          <div className="text-center">
            <div className="font-heading text-xl font-bold tracking-[1px] text-cream">
              RIVERSIDE
            </div>
            <div className="font-heading text-[13px] tracking-[1px] text-cream mt-0.5">
              CC
            </div>
          </div>
        </div>
        {/* Meta — STATIC: replace with real date/venue/time */}
        <div className="flex justify-between font-body text-xs text-muted border-t-[0.5px] border-gold/15 pt-3">
          <span>Sat 31 May</span>
          <span>Norwood Oval</span>
          <span>10:00 AM</span>
        </div>
        {/* Countdown + details — STATIC: countdown will be live later */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <div className="font-heading text-[10px] tracking-[2px] text-muted uppercase mb-1">
              Starts in
            </div>
            <div className="font-display text-2xl text-gold tracking-[2px]">
              05 : 12 : 38
            </div>
          </div>
          <Link
            to={ROUTES.FIXTURES}
            className="font-heading text-[10px] font-bold tracking-[2px] uppercase text-gold bg-gold/10 border-[0.5px] border-gold/30 px-3.5 py-2 rounded-sm hover:bg-gold/20 transition-colors"
          >
            Details →
          </Link>
        </div>
      </div>

      {/* Scroll hint (hidden on mobile/tablet) */}
      <div className="absolute bottom-8 left-12 z-[3] flex items-center gap-3 hidden min-[901px]:flex">
        <span className="w-px h-12 bg-gradient-to-b from-gold to-transparent animate-scroll-line" />
        <span className="font-heading text-[10px] tracking-[3px] uppercase text-muted [writing-mode:vertical-rl]">
          Scroll
        </span>
      </div>
    </section>
  )
}

export default HeroSection
