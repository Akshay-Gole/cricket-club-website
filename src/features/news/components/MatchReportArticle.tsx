import type { RefObject } from 'react'
import type { NewsArticle } from '../types/news.types'
import { categoryLabel, formatArticleDate } from '../data/newsData'
import ArticleAuthorStrip from './ArticleAuthorStrip'
import ArticleMoreGrid from './ArticleMoreGrid'
import ArticleProgress from './ArticleProgress'

interface MatchReportArticleProps {
  article: NewsArticle
  progressRef: RefObject<HTMLDivElement | null>
}

const stats = [
  ['159', "Top G's total"],
  ['55*', 'Catto — not out'],
  ['47', 'Winning margin'],
]

const scorecard = [
  ['Catto (bat)', '55* off 38'],
  ['Walker (bat)', '34 off 28'],
  ['Jones (bat)', '28 off 22'],
  ['Ryan (bowl)', '3/18 off 4'],
  ['Parsons (bowl)', '2/22 off 4'],
  ['Catto (bowl)', '2/24 off 3'],
]

function MatchReportArticle({ article, progressRef }: MatchReportArticleProps) {
  return (
    <div className="bg-black">
      <ArticleProgress progressRef={progressRef} />

      <section className="relative flex min-h-[560px] overflow-hidden lg:min-h-[calc(88vh-72px)]">
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(7,9,7,1)_0%,rgba(7,9,7,0.68)_38%,rgba(7,9,7,0.12)_76%,rgba(7,9,7,0.36)_100%),linear-gradient(135deg,#091f10_0%,#14311d_32%,#1b4528_55%,#102b19_80%,#071009_100%)]" />
        <div className="absolute inset-0 opacity-[0.16] [background-image:repeating-linear-gradient(175deg,transparent,transparent_44px,rgba(45,138,71,0.5)_44px,rgba(45,138,71,0.5)_88px)]" />
        <div className="absolute left-1/2 top-[8%] h-[320px] w-[320px] -translate-x-1/2 rounded-full border-[0.5px] border-gold/[0.08] sm:h-[480px] sm:w-[480px]" />

        <div className="relative z-[1] flex w-full flex-col justify-end px-5 pb-9 pt-28 sm:px-7 sm:pb-12 lg:px-12 lg:pb-14">
          <div
            data-animate="hero"
            className="mb-6 w-fit border-[0.5px] border-gold/20 bg-black/75 p-4 backdrop-blur min-[901px]:absolute min-[901px]:right-12 min-[901px]:top-10"
          >
            <div className="mb-2 font-heading text-[9px] font-bold uppercase tracking-[3px] text-gold">
              Final Score
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center">
                <div className="font-heading text-[11px] font-bold uppercase tracking-[1.5px] text-muted">
                  Top G&apos;s
                </div>
                <div className="font-display text-[28px] leading-none text-gold">
                  159
                  <span className="font-heading text-sm text-muted">/8</span>
                </div>
              </div>
              <div className="font-heading text-[10px] font-semibold uppercase tracking-[2px] text-muted">
                VS
              </div>
              <div className="text-center">
                <div className="font-heading text-[11px] font-bold uppercase tracking-[1.5px] text-muted">
                  Norwood
                </div>
                <div className="font-display text-[28px] leading-none text-cream">
                  112
                  <span className="font-heading text-sm text-muted">/10</span>
                </div>
              </div>
            </div>
            <div className="mt-2 border-t-[0.5px] border-white/[0.06] pt-2 font-heading text-[10px] font-bold uppercase tracking-[2px] text-green-light">
              Top G&apos;s won by 47 runs
            </div>
          </div>

          <div className="max-w-[800px]">
            <div
              data-animate="hero"
              className="mb-5 flex flex-wrap items-center gap-3 font-heading text-[11px] font-bold uppercase tracking-[2px] text-muted"
            >
              <span className="rounded-sm bg-gold px-3 py-1 text-black">
                {categoryLabel[article.category]}
              </span>
              <span>{formatArticleDate(article.publishedAt)}</span>
              <span>6 min read</span>
            </div>
            <h1
              data-animate="hero"
              className="font-serif text-[36px] font-bold leading-[1.08] tracking-[-0.5px] text-cream sm:text-[54px] lg:text-[64px]"
            >
              Top G&apos;s <em className="text-gold">Demolish</em>
              <br />
              Norwood by 47 Runs
              <br />
              in Dominant Opener
            </h1>
            <p
              data-animate="hero"
              className="mt-5 max-w-[640px] font-body text-base font-light leading-[1.7] text-cream/70 sm:text-lg"
            >
              {article.excerpt}
            </p>
          </div>
        </div>
      </section>

      <ArticleAuthorStrip
        initials="JC"
        name="James Catto"
        role="Club Captain · Match Reporter"
      />

      <div className="mx-auto grid max-w-[1200px] gap-12 px-5 py-10 sm:px-7 sm:py-12 lg:grid-cols-[1fr_300px] lg:gap-16 lg:px-12 lg:py-16">
        <article className="font-body text-[15px] font-light leading-[1.85] text-cream/72 sm:text-[17px]">
          <p className="first-letter:float-left first-letter:mr-2.5 first-letter:mt-2 first-letter:font-display first-letter:text-[64px] first-letter:leading-[0.8] first-letter:text-gold sm:first-letter:text-[80px]">
            From the first over it was clear this wasn&apos;t going to be a
            close contest. Sent in to bat at a sunlit Adelaide Oval No.2, Top
            G&apos;s CC built their innings with patience and precision.
          </p>

          <div
            data-animate="stagger"
            className="my-9 grid grid-cols-3 gap-px bg-white/[0.06]"
          >
            {stats.map(([value, label]) => (
              <div key={label} className="bg-[#171918] p-4 text-center">
                <div className="font-display text-[34px] leading-none text-gold sm:text-[40px]">
                  {value}
                </div>
                <div className="mt-1 font-heading text-[9px] font-bold uppercase tracking-[2px] text-muted">
                  {label}
                </div>
              </div>
            ))}
          </div>

          <h2 className="mt-12 font-serif text-[26px] font-bold leading-[1.2] text-cream sm:text-[30px]">
            Catto sets the standard
          </h2>
          <p className="mt-4">
            Coming in at 68/2, Catto immediately looked at ease. He read length
            early, refused to be hurried, then changed the tempo with clean
            shots through mid-on and cover.
          </p>

          <blockquote className="my-10 border-l-[3px] border-gold py-1 pl-6">
            <p className="font-serif text-xl italic leading-[1.55] text-cream sm:text-[23px]">
              “I wasn&apos;t trying to be the hero. I just backed myself to stay
              in and let the ball-striking come naturally.”
            </p>
            <cite className="mt-3 block font-heading text-[11px] font-bold uppercase not-italic tracking-[2.5px] text-gold">
              — James Catto, Captain
            </cite>
          </blockquote>

          <p>
            He finished on 55 not out from 38 balls — a strike rate of 144.7
            that never felt forced. Five fours, two sixes, and only one false
            shot all innings: everything else was clean, deliberate, clinical.
          </p>

          <div data-animate="reveal" className="my-10 overflow-hidden bg-card">
            <div className="relative flex h-[220px] items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#0d2a18,#061510)] sm:h-[320px]">
              <div className="absolute inset-0 opacity-[0.12] [background-image:repeating-linear-gradient(170deg,transparent,transparent_40px,rgba(45,138,71,0.5)_40px,rgba(45,138,71,0.5)_80px)]" />
              <div className="relative font-display text-[38px] uppercase tracking-[4px] text-gold/20 sm:text-[52px]">
                Match Photo
              </div>
            </div>
            <div className="border-t-[0.5px] border-white/[0.06] px-4 py-2 font-body text-xs italic text-muted">
              James Catto drives through the covers en route to his 55*. Photo:
              Top G&apos;s CC.
            </div>
          </div>

          <h2 className="mt-12 font-serif text-[26px] font-bold leading-[1.2] text-cream sm:text-[30px]">
            Ryan dismantles the top order
          </h2>
          <p className="mt-4">
            Chasing 160, Norwood needed a strong start — and they didn&apos;t
            get one. Ryan was unplayable in his opening spell, removing both
            openers inside the powerplay and leaving the visitors behind the
            game.
          </p>

          <div className="my-9 border-[0.5px] border-white/[0.08] border-l-2 border-l-gold bg-card p-5 sm:p-6">
            <div className="mb-3 font-heading text-[10px] font-bold uppercase tracking-[3px] text-gold">
              Match Scorecard — Key Performances
            </div>
            {scorecard.map(([name, value], index) => (
              <div
                key={name}
                className="flex justify-between border-b-[0.5px] border-white/[0.06] py-2 last:border-b-0"
              >
                <span className="font-heading text-sm font-semibold text-muted">
                  {name}
                </span>
                <span
                  className={`font-heading text-sm font-bold ${
                    index === 0 || index === 3 ? 'text-gold' : 'text-cream'
                  }`}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>

          <h3 className="mt-9 font-heading text-base font-bold uppercase tracking-[3px] text-gold">
            Bowling honours
          </h3>
          <p className="mt-3">
            Parsons continued the pressure from the other end, removing the
            dangerous Green for 34. When Catto brought himself on and quickly
            claimed two of his own, the match was finished as a contest.
          </p>
          <p>
            The dressing room afterwards was measured rather than euphoric.
            Catto kept his speech short:{' '}
            <em>“That&apos;s the standard. Now we hold it.”</em>
          </p>

          <div className="mt-12 flex flex-wrap gap-2 border-t-[0.5px] border-white/[0.06] pt-8">
            {[
              'Match Report',
              'Season 2026',
              'James Catto',
              'Liam Ryan',
              'Norwood CC',
            ].map(tag => (
              <span
                key={tag}
                className="rounded-sm border-[0.5px] border-white/[0.08] px-3.5 py-1.5 font-heading text-[10px] font-bold uppercase tracking-[2px] text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </article>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="mb-8">
            <div className="mb-4 border-b-[0.5px] border-white/[0.06] pb-3 font-heading text-[10px] font-bold uppercase tracking-[3px] text-gold">
              Player of the Match
            </div>
            <div className="border-[0.5px] border-white/[0.08] bg-card p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/25 bg-[#08140c] font-display text-sm text-green-light">
                  CAT
                </div>
                <div>
                  <div className="font-heading text-lg font-bold text-cream">
                    James Catto
                  </div>
                  <div className="font-heading text-[9px] font-bold uppercase tracking-[2.5px] text-gold">
                    All-Rounder · Captain
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-px bg-white/[0.06]">
                {[
                  ['55*', 'Runs'],
                  ['38', 'Balls'],
                  ['2', 'Wickets'],
                  ['144', 'Strike Rate'],
                ].map(([value, label]) => (
                  <div key={label} className="bg-[#1b1d1b] p-3">
                    <div className="font-display text-2xl text-cream">
                      {value}
                    </div>
                    <div className="font-heading text-[9px] font-bold uppercase tracking-[2px] text-muted">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      <ArticleMoreGrid currentSlug={article.slug} />
    </div>
  )
}

export default MatchReportArticle
