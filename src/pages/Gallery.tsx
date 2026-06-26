import { useMemo, useState } from 'react'
import GalleryBundleModal from '../features/gallery/components/GalleryBundleModal'
import GalleryCard from '../features/gallery/components/GalleryCard'
import GalleryPagination from '../features/gallery/components/GalleryPagination'
import GalleryYearTabs from '../features/gallery/components/GalleryYearTabs'
import {
  GALLERY_ITEMS,
  GALLERY_YEARS,
} from '../features/gallery/data/galleryData'
import type { GalleryItem } from '../features/gallery/types/gallery.types'

const ITEMS_PER_PAGE = 6

function Gallery() {
  const [activeYear, setActiveYear] = useState(GALLERY_YEARS[0])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedBundle, setSelectedBundle] = useState<GalleryItem | null>(null)

  const filteredItems = useMemo(
    () => GALLERY_ITEMS.filter(item => item.year === activeYear),
    [activeYear]
  )
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE)
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [currentPage, filteredItems])

  const handleYearChange = (year: string) => {
    setActiveYear(year)
    setCurrentPage(1)
  }

  return (
    <div className="relative overflow-hidden bg-black">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_4%,rgba(201,168,76,0.11),transparent_30%),radial-gradient(circle_at_84%_16%,rgba(52,160,88,0.1),transparent_32%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(201,168,76,0.9)_1px,transparent_1px),linear-gradient(90deg,rgba(201,168,76,0.9)_1px,transparent_1px)] [background-size:96px_96px]" />

      <section className="relative px-5 pb-12 pt-16 sm:px-7 sm:pb-16 sm:pt-20 lg:px-12 lg:pb-20 lg:pt-24">
        <div
          data-animate="hero"
          className="mb-4 font-heading text-[11px] font-bold uppercase tracking-[4px] text-gold"
        >
          Club Media
        </div>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1
              data-animate="hero"
              className="font-display text-[64px] uppercase leading-none tracking-[1px] text-cream sm:text-[92px] lg:text-[120px]"
            >
              Gallery.
            </h1>
            <p
              data-animate="hero"
              className="mt-5 max-w-[620px] font-body text-base font-light leading-[1.8] text-muted sm:text-lg"
            >
              Club uploads open as photo bundles. Instagram posts take visitors
              straight to the original post.
            </p>
          </div>

          <div
            data-animate="hero"
            className="rounded-sm border-[0.5px] border-gold/20 bg-gold/[0.06] px-5 py-4"
          >
            <div className="font-display text-4xl leading-none text-gold">
              {filteredItems.length}
            </div>
            <div className="font-heading text-[10px] font-bold uppercase tracking-[2px] text-muted">
              {activeYear} posts
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-5 pb-14 sm:px-7 sm:pb-16 lg:px-12 lg:pb-20">
        <div className="mb-8">
          <GalleryYearTabs
            years={GALLERY_YEARS}
            activeYear={activeYear}
            onChange={handleYearChange}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 min-[641px]:grid-cols-2 min-[901px]:grid-cols-3 min-[1025px]:grid-cols-4 sm:gap-6">
          {paginatedItems.map(item => (
            <GalleryCard
              key={item.id}
              item={item}
              onOpenBundle={setSelectedBundle}
            />
          ))}
        </div>

        <GalleryPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </section>

      <GalleryBundleModal
        item={selectedBundle}
        onClose={() => setSelectedBundle(null)}
      />
    </div>
  )
}

export default Gallery
