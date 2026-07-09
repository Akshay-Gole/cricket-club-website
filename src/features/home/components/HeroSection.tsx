import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ROUTES } from '../../../constants/routes'
import logger from '../../../services/logger'
import fixturesApi from '../../fixtures/api/fixture.api'
import type { Fixture } from '../../fixtures/types/fixture.types'

function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [fixtures, setFixtures] = useState<Fixture[]>([])
  const [now, setNow] = useState(() => new Date())

  const nextFixture = useMemo(() => {
    const liveWindowMs = 4 * 60 * 60 * 1000

    return fixtures
      .filter(fixture => fixture.result === 'upcoming')
      .map(fixture => ({
        fixture,
        dateTime: getFixtureDateTime(fixture),
      }))
      .filter(
        ({ dateTime }) => dateTime.getTime() >= now.getTime() - liveWindowMs
      )
      .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime())[0]
  }, [fixtures, now])

  const matchStatus = nextFixture
    ? getNextMatchStatus(nextFixture.dateTime, now)
    : null

  useEffect(() => {
    logger.info('Home page visited')

    const section = sectionRef.current
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (!section || prefersReducedMotion) return

    const context = gsap.context(() => {
      const heroLights = gsap.utils.toArray<HTMLElement>('[data-hero-light]')

      heroLights.forEach((light, index) => {
        const finalOpacity = Number(light.dataset.heroLightOpacity ?? 1)

        gsap
          .timeline({ delay: 0.2 + index * 0.06 })
          .fromTo(
            light,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.08,
              repeat: 7,
              yoyo: true,
              ease: 'none',
            }
          )
          .to(light, {
            opacity: finalOpacity,
            duration: 0.6,
            ease: 'power2.out',
          })
      })
    }, section)

    return () => context.revert()
  }, [])

  useEffect(() => {
    const loadFixtures = async () => {
      try {
        const nextFixtures = await fixturesApi.getAll()
        setFixtures(nextFixtures)
      } catch {
        setFixtures([])
      }
    }

    void loadFixtures()
  }, [])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      data-animate="hero"
      className="relative h-screen min-h-[700px] flex flex-col justify-end overflow-hidden px-12 pb-20 -mt-[72px]"
    >
      {/* Decorative layer 1: faint cricket-field grid */}
      <div
        data-hero-light
        data-hero-light-opacity="0.4"
        className="absolute inset-0 z-0 opacity-0"
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
      <div
        data-hero-light
        data-hero-light-opacity="1"
        className="absolute -top-[20%] -right-[8%] w-[700px] h-[700px] rounded-full border border-gold/10 z-[1] hidden opacity-0 min-[901px]:block"
      />
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
      {nextFixture && matchStatus && (
        <div className="relative z-[3] w-full max-w-[420px] mt-9 bg-card border-[0.5px] border-gold/15 rounded p-7 min-[901px]:absolute min-[901px]:right-12 min-[901px]:bottom-20 min-[901px]:w-[300px] min-[901px]:mt-0">
          <div className="flex items-center gap-2 mb-4 font-heading text-[10px] font-bold tracking-[3px] uppercase text-gold">
            <span
              className={`w-[7px] h-[7px] rounded-full ${
                matchStatus.isLive ? 'bg-green-light' : 'bg-[#e74c3c]'
              } animate-pulse`}
            />
            {matchStatus.isLive ? 'Live Now' : 'Next Match'}
          </div>

          <div className="flex items-center justify-between gap-4 mb-4">
            <TeamName name={nextFixture.fixture.homeTeam} />
            <div className="font-heading text-[11px] font-semibold tracking-[2px] text-muted">
              VS
            </div>
            <TeamName name={nextFixture.fixture.awayTeam} />
          </div>

          <div className="flex justify-between gap-3 font-body text-xs text-muted border-t-[0.5px] border-gold/15 pt-3">
            <span>{formatHeroMatchDate(nextFixture.dateTime)}</span>
            <span className="truncate">{nextFixture.fixture.venue}</span>
            <span>{formatHeroMatchTime(nextFixture.fixture.time)}</span>
          </div>

          <div className="mt-4 flex items-center justify-between gap-4">
            <div>
              <div className="font-heading text-[10px] tracking-[2px] text-muted uppercase mb-1">
                {matchStatus.label}
              </div>
              <div className="font-display text-2xl text-gold tracking-[2px]">
                {matchStatus.value}
              </div>
            </div>

            {matchStatus.isLive &&
            (nextFixture.fixture.scoreboardUrl ||
              nextFixture.fixture.playHqUrl) ? (
              <a
                href={
                  nextFixture.fixture.scoreboardUrl ??
                  nextFixture.fixture.playHqUrl
                }
                target="_blank"
                rel="noreferrer"
                className="font-heading text-[10px] font-bold tracking-[2px] uppercase text-gold bg-gold/10 border-[0.5px] border-gold/30 px-3.5 py-2 rounded-sm hover:bg-gold/20 transition-colors"
              >
                Details →
              </a>
            ) : (
              <Link
                to={ROUTES.FIXTURES}
                className="font-heading text-[10px] font-bold tracking-[2px] uppercase text-gold bg-gold/10 border-[0.5px] border-gold/30 px-3.5 py-2 rounded-sm hover:bg-gold/20 transition-colors"
              >
                Details →
              </Link>
            )}
          </div>
        </div>
      )}

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

function TeamName({ name }: { name: string }) {
  const parts = name.split(' ')
  const lastPart = parts.at(-1)
  const mainName = parts.slice(0, -1).join(' ') || name

  return (
    <div className="min-w-0 text-center">
      <div className="truncate font-heading text-xl font-bold tracking-[1px] text-cream">
        {mainName}
      </div>
      {lastPart && lastPart !== mainName ? (
        <div className="font-heading text-[13px] tracking-[1px] text-cream mt-0.5">
          {lastPart}
        </div>
      ) : null}
    </div>
  )
}

function getFixtureDateTime(fixture: Fixture) {
  const [hours = '0', minutes = '0'] = fixture.time.split(':')
  const date = new Date(`${fixture.date}T00:00:00`)

  date.setHours(Number(hours), Number(minutes), 0, 0)

  return date
}

function getNextMatchStatus(matchDate: Date, now: Date) {
  const diffMs = matchDate.getTime() - now.getTime()
  const dayMs = 24 * 60 * 60 * 1000

  if (diffMs <= 0) {
    return {
      label: 'Status',
      value: 'Live',
      isLive: true,
    }
  }

  if (diffMs > dayMs) {
    return {
      label: 'Match in',
      value: `${Math.ceil(diffMs / dayMs)} days`,
      isLive: false,
    }
  }

  const hours = Math.floor(diffMs / (60 * 60 * 1000))
  const minutes = Math.floor((diffMs % (60 * 60 * 1000)) / (60 * 1000))
  const seconds = Math.floor((diffMs % (60 * 1000)) / 1000)

  return {
    label: 'Starts in',
    value: [hours, minutes, seconds]
      .map(value => String(value).padStart(2, '0'))
      .join(' : '),
    isLive: false,
  }
}

function formatHeroMatchDate(date: Date) {
  return date.toLocaleDateString('en-AU', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  })
}

function formatHeroMatchTime(time: string) {
  const date = new Date(`2026-01-01T${time}`)

  if (Number.isNaN(date.getTime())) return time

  return date.toLocaleTimeString('en-AU', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default HeroSection
