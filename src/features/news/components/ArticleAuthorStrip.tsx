interface ArticleAuthorStripProps {
  initials: string
  name: string
  role: string
  tone?: 'green' | 'gold'
  showShare?: boolean
}

function ArticleAuthorStrip({
  initials,
  name,
  role,
  tone = 'green',
  showShare = true,
}: ArticleAuthorStripProps) {
  const avatarClass =
    tone === 'gold'
      ? 'border-gold/20 bg-[#141207] text-gold'
      : 'border-gold/20 bg-[#08140c] text-green-light'

  return (
    <div className="flex flex-wrap items-center gap-3 border-y-[0.5px] border-white/[0.06] bg-dark px-5 py-3 sm:px-7 lg:px-12">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full border font-display text-sm ${avatarClass}`}
      >
        {initials}
      </div>
      <div>
        <div className="font-heading text-sm font-bold text-cream">{name}</div>
        <div className="font-heading text-[10px] font-semibold uppercase tracking-[2px] text-muted">
          {role}
        </div>
      </div>

      {showShare && (
        <div className="flex w-full flex-wrap gap-2 min-[641px]:ml-auto min-[641px]:w-auto">
          {['Instagram', 'Facebook', 'Copy link'].map(item => (
            <button
              key={item}
              type="button"
              className="rounded-sm border-[0.5px] border-white/[0.08] px-3 py-1.5 font-heading text-[10px] font-bold uppercase tracking-[1.5px] text-muted transition-colors hover:border-white/15 hover:text-cream"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ArticleAuthorStrip
