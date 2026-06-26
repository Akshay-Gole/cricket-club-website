import type { RefObject } from 'react'
import type { NewsArticle } from '../types/news.types'
import { categoryLabel, formatArticleDate } from '../data/newsData'
import ArticleAuthorStrip from './ArticleAuthorStrip'
import ArticleMoreGrid from './ArticleMoreGrid'
import ArticleProgress from './ArticleProgress'

interface StandardArticleProps {
  article: NewsArticle
  progressRef: RefObject<HTMLDivElement | null>
}

function StandardArticle({ article, progressRef }: StandardArticleProps) {
  const paragraphs = article.content.split('\n\n')

  return (
    <div className="bg-black">
      <ArticleProgress progressRef={progressRef} />

      <section className="relative overflow-hidden border-b-[0.5px] border-white/[0.06] px-5 py-16 sm:px-7 sm:py-20 lg:px-12 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_14%,rgba(201,168,76,0.15),transparent_30%),radial-gradient(circle_at_82%_42%,rgba(52,160,88,0.1),transparent_34%),linear-gradient(135deg,#10100c_0%,#0b0d0b_55%,#070907_100%)]" />
        <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px)] [background-size:72px_72px]" />

        <div className="relative mx-auto grid max-w-[1180px] gap-10 min-[901px]:grid-cols-[0.9fr_1.1fr] min-[901px]:items-end">
          <div data-animate="hero">
            <div className="mb-5 flex flex-wrap items-center gap-3 font-heading text-[11px] font-bold uppercase tracking-[2px] text-muted">
              <span className="rounded-sm bg-gold px-3 py-1 text-black">
                {categoryLabel[article.category]}
              </span>
              <span>{formatArticleDate(article.publishedAt)}</span>
              <span>3 min read</span>
            </div>
            <h1 className="font-serif text-[38px] font-bold leading-[1.08] tracking-[-0.5px] text-cream sm:text-[58px] lg:text-[70px]">
              {article.title}
            </h1>
            <p className="mt-6 max-w-[620px] font-body text-base font-light leading-[1.8] text-cream/70 sm:text-lg">
              {article.excerpt}
            </p>
          </div>

          <div
            data-animate="hero"
            className="relative min-h-[280px] overflow-hidden rounded-sm border-[0.5px] border-white/[0.08] bg-[linear-gradient(135deg,#171711,#080908)] sm:min-h-[360px]"
          >
            <div className="absolute inset-8 border-[0.5px] border-gold/10" />
            <div className="absolute inset-0 opacity-[0.1] [background-image:repeating-linear-gradient(165deg,transparent,transparent_42px,rgba(201,168,76,0.45)_42px,rgba(201,168,76,0.45)_84px)]" />
            <div className="absolute bottom-7 left-7 font-display text-[72px] leading-none text-gold/10 sm:text-[110px]">
              {categoryLabel[article.category][0]}
            </div>
          </div>
        </div>
      </section>

      <ArticleAuthorStrip
        initials="TG"
        name={article.author}
        role="Club Media Team"
        tone="gold"
        showShare={false}
      />

      <div className="mx-auto grid max-w-[1100px] gap-12 px-5 py-10 sm:px-7 sm:py-12 lg:grid-cols-[1fr_280px] lg:px-12 lg:py-16">
        <article className="font-body text-[16px] font-light leading-[1.9] text-cream/72 sm:text-[18px]">
          <div className="mb-10 rounded-sm border-[0.5px] border-gold/20 bg-gold/[0.06] p-5">
            <div className="mb-2 font-heading text-[10px] font-bold uppercase tracking-[3px] text-gold">
              Club Notice
            </div>
            <p className="m-0 text-base leading-[1.7] text-cream/75">
              This is a standard article layout. No scorecard, no player of the
              match, no match-specific stats — just a clean editorial story.
            </p>
          </div>

          {paragraphs.map((paragraph, index) => (
            <p
              key={paragraph}
              className={
                index === 0
                  ? 'first-letter:float-left first-letter:mr-2.5 first-letter:mt-2 first-letter:font-display first-letter:text-[64px] first-letter:leading-[0.8] first-letter:text-gold sm:first-letter:text-[80px]'
                  : ''
              }
            >
              {paragraph}
            </p>
          ))}

          <div data-animate="reveal" className="my-10 overflow-hidden bg-card">
            <div className="relative flex h-[220px] items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#18170f,#090a08)] sm:h-[300px]">
              <div className="absolute inset-0 opacity-[0.08] [background-image:repeating-linear-gradient(170deg,transparent,transparent_40px,rgba(201,168,76,0.6)_40px,rgba(201,168,76,0.6)_80px)]" />
              <div className="relative font-display text-[38px] uppercase tracking-[4px] text-gold/20 sm:text-[52px]">
                Club Photo
              </div>
            </div>
          </div>

          <h2 className="mt-12 font-serif text-[26px] font-bold leading-[1.2] text-cream sm:text-[30px]">
            What members should know
          </h2>
          <ul className="mt-5 grid gap-3">
            {[
              'Keep an eye on club communication for confirmed dates.',
              'Speak to the committee if you want to volunteer or sponsor.',
              'New players can still reach out through the contact form.',
            ].map(item => (
              <li
                key={item}
                className="border-l-2 border-gold/60 bg-white/[0.03] px-4 py-3 text-base text-cream/75"
              >
                {item}
              </li>
            ))}
          </ul>
        </article>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="mb-8 rounded-sm border-[0.5px] border-white/[0.08] bg-card p-5">
            <div className="mb-4 font-heading text-[10px] font-bold uppercase tracking-[3px] text-gold">
              Article Details
            </div>
            <div className="space-y-4 font-heading">
              <div>
                <div className="text-[9px] font-bold uppercase tracking-[2px] text-muted">
                  Category
                </div>
                <div className="text-base font-bold text-cream">
                  {categoryLabel[article.category]}
                </div>
              </div>
              <div>
                <div className="text-[9px] font-bold uppercase tracking-[2px] text-muted">
                  Published
                </div>
                <div className="text-base font-bold text-cream">
                  {formatArticleDate(article.publishedAt)}
                </div>
              </div>
              <div>
                <div className="text-[9px] font-bold uppercase tracking-[2px] text-muted">
                  Layout
                </div>
                <div className="text-base font-bold text-gold">Standard</div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <ArticleMoreGrid currentSlug={article.slug} />
    </div>
  )
}

export default StandardArticle
