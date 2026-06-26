import type { GalleryItem } from '../types/gallery.types'
import GalleryArt from './GalleryArt'

interface GalleryCardProps {
  item: GalleryItem
  onOpenBundle: (item: GalleryItem) => void
}

function GalleryCard({ item, onOpenBundle }: GalleryCardProps) {
  const isInstagram = item.source === 'instagram'
  const imageCount = item.images?.length ?? 0

  const content = (
    <>
      <GalleryArt
        tone={item.coverTone}
        label={isInstagram ? 'IG' : String(imageCount).padStart(2, '0')}
        className="absolute inset-0 h-full"
      />

      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(7,9,7,0.92)_0%,rgba(7,9,7,0.5)_34%,rgba(7,9,7,0.02)_76%)] opacity-95 transition-opacity group-hover:opacity-80" />

      <div className="relative flex h-full min-h-[315px] flex-col justify-end p-7 pt-8 sm:min-h-[330px]">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-sm border-[0.5px] px-3 py-1 font-heading text-[9px] font-bold uppercase tracking-[2.5px] ${
              isInstagram
                ? 'border-[#d66cff]/25 bg-[#d66cff]/[0.08] text-[#f0a6ff]'
                : 'border-gold/25 bg-gold/[0.08] text-gold'
            }`}
          >
            {isInstagram ? 'Instagram' : 'Club Upload'}
          </span>
          {!isInstagram && (
            <span className="rounded-sm border-[0.5px] border-white/[0.08] px-3 py-1 font-heading text-[9px] font-bold uppercase tracking-[2px] text-muted">
              {imageCount} Photos
            </span>
          )}
        </div>

        <div className="mb-2 font-heading text-[24px] font-bold leading-[1.05] tracking-[0.5px] text-cream">
          {item.title}
        </div>
        <div className="mb-4 font-heading text-[10px] font-bold uppercase tracking-[2px] text-gold">
          {item.date}
        </div>
        <p className="line-clamp-2 font-body text-sm font-light leading-[1.65] text-muted">
          {item.description}
        </p>

        <div className="mt-7 font-heading text-[10px] font-bold uppercase tracking-[2.5px] text-gold">
          {isInstagram ? 'Open Instagram →' : 'View Bundle →'}
        </div>
      </div>
    </>
  )

  const className =
    'group relative block overflow-hidden rounded-sm border border-white/[0.09] bg-[#171918] text-left shadow-[0_14px_36px_rgba(0,0,0,0.3)] transition-colors duration-300 hover:border-gold/30 hover:bg-[#1b1d1b]'

  if (isInstagram) {
    return (
      <a
        data-animate="card"
        href={item.instagramUrl}
        target="_blank"
        rel="noreferrer"
        className={className}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      data-animate="card"
      type="button"
      onClick={() => onOpenBundle(item)}
      className={className}
    >
      {content}
    </button>
  )
}

export default GalleryCard
