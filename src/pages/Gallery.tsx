import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import PageLoader from '../components/shared/PageLoader'
import { getGalleryPosts, type GalleryPost } from '../services/gallery.api'
import { cloudinaryImage } from '../utils/cloudinaryImage'

const PAGE_SIZE = 12

function titleFromCaption(caption: string | null) {
  if (!caption) return "Top G's CC Instagram post"

  return (
    caption.split('\n')[0].replace(/#\S+/g, '').trim() ||
    "Top G's CC Instagram post"
  )
}

function previewImage(post: GalleryPost, width: number) {
  const image = post.thumbnailUrl || post.mediaUrl || ''

  return cloudinaryImage(
    image,
    `f_auto,q_auto,w_${width},h_${width},c_fill,g_auto`
  )
}

function mediaLabel(post: GalleryPost) {
  if (post.mediaType === 'VIDEO') return 'Reel'
  if (post.mediaType === 'CAROUSEL_ALBUM') return 'Carousel'

  return 'Photo'
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-AU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

function Gallery() {
  const [activeYear, setActiveYear] = useState<number>()
  const [page, setPage] = useState(1)

  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ['gallery', activeYear, page],
    queryFn: () =>
      getGalleryPosts({ year: activeYear, page, limit: PAGE_SIZE }),
    staleTime: 1000 * 60 * 10,
  })

  const posts = data?.posts ?? []
  const years = data?.years ?? []
  const selectedYear = activeYear ?? data?.activeYear ?? undefined
  const totalPages = data?.pagination.totalPages ?? 1

  const handleYearChange = (year: number) => {
    setActiveYear(year)
    setPage(1)
  }

  if (isLoading) return <PageLoader />

  return (
    <main className="min-h-screen bg-[#050806] text-white">
      <section className="relative overflow-hidden border-b-[0.5px] border-gold/15 px-5 py-16 sm:px-7 sm:py-20 lg:px-12 lg:py-24">
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(55,178,101,0.55)_1px,transparent_1px),linear-gradient(90deg,rgba(55,178,101,0.55)_1px,transparent_1px)] [background-size:80px_80px]" />
        <div className="absolute inset-0 [background:radial-gradient(circle_at_18%_18%,rgba(36,128,72,0.22),transparent_35%),linear-gradient(135deg,rgba(9,31,22,0.95),rgba(6,7,6,0.96)_55%,rgba(28,22,8,0.8))]" />

        <div className="relative max-w-[1280px]">
          <div className="mb-4 flex items-center gap-3 font-heading text-[11px] font-bold uppercase tracking-[4px] text-gold">
            <span className="h-px w-8 bg-gold" />
            From Instagram
          </div>

          <h1 className="font-display text-[56px] uppercase leading-[0.9] tracking-[2px] text-white sm:text-[72px] lg:text-[96px]">
            Gallery
          </h1>

          <div
            className="mt-3 font-display text-[56px] uppercase leading-[0.9] tracking-[2px] text-transparent [-webkit-text-stroke:0.5px_rgba(201,168,76,0.16)] sm:text-[72px] lg:text-[96px]"
            aria-hidden="true"
          >
            Gallery
          </div>

          <p className="mt-8 max-w-[620px] font-body text-base font-light leading-[1.8] text-muted sm:text-lg">
            Club moments pulled from the official Top G&apos;s CC Instagram
            feed.
          </p>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-7 lg:px-12 lg:py-16">
        <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-px overflow-x-auto rounded-sm bg-white/[0.055] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {years.map(year => (
              <button
                key={year}
                type="button"
                onClick={() => handleYearChange(year)}
                className={`font-heading cursor-pointer whitespace-nowrap px-5 py-3 text-xs font-bold uppercase tracking-[2.5px] transition-colors ${
                  selectedYear === year
                    ? 'bg-gold text-black'
                    : 'bg-card text-muted hover:text-white'
                }`}
              >
                {year}
              </button>
            ))}
          </div>

          <div className="font-heading text-[11px] font-bold uppercase tracking-[3px] text-muted">
            {data?.pagination.total ?? 0} posts
            {isFetching ? ' · updating' : ''}
          </div>
        </div>

        {isError ? (
          <div className="rounded-sm border-[0.5px] border-white/[0.08] bg-card px-6 py-12 text-center">
            <p className="font-display text-3xl uppercase tracking-[1px] text-white">
              Could not load gallery
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-6 rounded-sm bg-gold px-7 py-3 font-heading text-[11px] font-bold uppercase tracking-[2.5px] text-black"
            >
              Try again
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-sm border-[0.5px] border-white/[0.08] bg-card px-6 py-12 text-center">
            <p className="font-display text-3xl uppercase tracking-[1px] text-white">
              No Instagram posts yet
            </p>
            <p className="mt-3 font-body text-sm text-muted">
              Run the Instagram sync once after deploying the backend changes.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 min-[520px]:grid-cols-2 min-[900px]:grid-cols-3 min-[1280px]:grid-cols-4">
            {posts.map((post, index) => {
              const image = previewImage(post, 640)
              const smallImage = previewImage(post, 360)

              return (
                <a
                  key={post.id}
                  href={post.permalink}
                  target="_blank"
                  rel="noreferrer"
                  className="group overflow-hidden rounded-sm border-[0.5px] border-white/[0.08] bg-[#141614] shadow-[0_22px_70px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-1 hover:border-gold/45 hover:bg-[#181a17]"
                >
                  <div className="relative aspect-square overflow-hidden bg-[#090b09]">
                    {image ? (
                      <img
                        src={image}
                        srcSet={`${smallImage} 360w, ${image} 640w`}
                        sizes="(min-width: 1280px) 25vw, (min-width: 900px) 33vw, (min-width: 520px) 50vw, 100vw"
                        alt={titleFromCaption(post.caption)}
                        width="640"
                        height="640"
                        loading={index === 0 ? 'eager' : 'lazy'}
                        fetchPriority={index === 0 ? 'high' : 'auto'}
                        decoding="async"
                        className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center font-display text-4xl text-gold/40">
                        TG
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                    <span className="absolute left-4 top-4 rounded-sm border-[0.5px] border-gold/30 bg-black/45 px-3 py-1.5 font-heading text-[10px] font-bold uppercase tracking-[2px] text-gold backdrop-blur">
                      {mediaLabel(post)}
                    </span>

                    <span className="absolute bottom-4 right-4 font-heading text-[10px] font-bold uppercase tracking-[2px] text-white/70 transition group-hover:text-gold">
                      Instagram ↗
                    </span>
                  </div>

                  <div className="p-5">
                    <p className="font-heading text-[10px] font-bold uppercase tracking-[2.5px] text-gold">
                      {formatDate(post.timestamp)}
                    </p>
                    <h2 className="mt-3 font-display text-2xl leading-[1] tracking-[0.5px] text-white">
                      {titleFromCaption(post.caption)}
                    </h2>
                  </div>
                </a>
              )
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-3">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage(current => Math.max(1, current - 1))}
              className="rounded-sm border-[0.5px] border-white/[0.1] px-5 py-3 font-heading text-[11px] font-bold uppercase tracking-[2px] text-muted transition hover:border-gold/40 hover:text-gold disabled:cursor-not-allowed disabled:opacity-35"
            >
              Previous
            </button>

            <span className="font-heading text-[11px] font-bold uppercase tracking-[2px] text-muted">
              Page {page} / {totalPages}
            </span>

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() =>
                setPage(current => Math.min(totalPages, current + 1))
              }
              className="rounded-sm border-[0.5px] border-white/[0.1] px-5 py-3 font-heading text-[11px] font-bold uppercase tracking-[2px] text-muted transition hover:border-gold/40 hover:text-gold disabled:cursor-not-allowed disabled:opacity-35"
            >
              Next
            </button>
          </div>
        )}
      </section>
    </main>
  )
}

export default Gallery
