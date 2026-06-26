import { useEffect } from 'react'
import type { GalleryItem } from '../types/gallery.types'
import GalleryArt from './GalleryArt'

interface GalleryBundleModalProps {
  item: GalleryItem | null
  onClose: () => void
}

function GalleryBundleModal({ item, onClose }: GalleryBundleModalProps) {
  useEffect(() => {
    if (!item) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [item, onClose])

  if (!item) return null

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/85 px-4 py-6 backdrop-blur-md sm:px-7 sm:py-10">
      <button
        type="button"
        aria-label="Close gallery bundle"
        onClick={onClose}
        className="fixed inset-0 cursor-default"
      />

      <div className="relative mx-auto max-w-[1100px] overflow-hidden rounded-sm border-[0.5px] border-white/[0.1] bg-[#101210] shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
        <div className="flex flex-wrap items-start justify-between gap-5 border-b-[0.5px] border-white/[0.08] p-5 sm:p-7">
          <div>
            <div className="mb-2 font-heading text-[10px] font-bold uppercase tracking-[3px] text-gold">
              Club Upload · {item.images?.length ?? 0} Photos
            </div>
            <h2 className="font-display text-[42px] leading-none tracking-[1px] text-cream sm:text-[56px]">
              {item.title}
            </h2>
            <p className="mt-3 max-w-[620px] font-body text-sm font-light leading-[1.7] text-muted">
              {item.description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-sm border-[0.5px] border-white/[0.12] px-4 py-2 font-heading text-[11px] font-bold uppercase tracking-[2px] text-muted transition-colors hover:border-gold/30 hover:text-gold"
          >
            Close
          </button>
        </div>

        <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-7 lg:grid-cols-3">
          {item.images?.map((image, index) => (
            <figure
              key={image.id}
              className="overflow-hidden rounded-sm bg-card"
            >
              <GalleryArt
                tone={image.tone}
                label={String(index + 1).padStart(2, '0')}
                className="h-[220px]"
              />
              <figcaption className="border-t-[0.5px] border-white/[0.06] px-4 py-3 font-body text-xs text-muted">
                {image.alt}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  )
}

export default GalleryBundleModal
