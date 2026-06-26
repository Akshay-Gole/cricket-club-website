interface GalleryYearTabsProps {
  years: string[]
  activeYear: string
  onChange: (year: string) => void
}

function GalleryYearTabs({
  years,
  activeYear,
  onChange,
}: GalleryYearTabsProps) {
  return (
    <div className="flex gap-px overflow-x-auto rounded-sm bg-white/[0.06] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {years.map(year => {
        const isActive = activeYear === year

        return (
          <button
            key={year}
            type="button"
            onClick={() => onChange(year)}
            className={`shrink-0 px-8 py-3 font-heading text-xs font-bold uppercase tracking-[3px] transition-colors ${
              isActive
                ? 'bg-gold text-black'
                : 'bg-card text-muted hover:bg-[#1d1e1a] hover:text-cream'
            }`}
          >
            {year}
          </button>
        )
      })}
    </div>
  )
}

export default GalleryYearTabs
