interface GalleryPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

function GalleryPagination({
  currentPage,
  totalPages,
  onPageChange,
}: GalleryPaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t-[0.5px] border-white/[0.08] pt-6">
      <div className="font-heading text-[10px] font-bold uppercase tracking-[3px] text-muted">
        Page {currentPage} of {totalPages}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="rounded-sm border-[0.5px] border-white/[0.1] px-4 py-2 font-heading text-[10px] font-bold uppercase tracking-[2px] text-muted transition-colors hover:border-gold/30 hover:text-gold disabled:pointer-events-none disabled:opacity-35"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, index) => {
          const page = index + 1
          const isActive = page === currentPage

          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`h-9 w-9 rounded-sm border-[0.5px] font-heading text-[10px] font-bold tracking-[1px] transition-colors ${
                isActive
                  ? 'border-gold bg-gold text-black'
                  : 'border-white/[0.1] text-muted hover:border-gold/30 hover:text-gold'
              }`}
            >
              {page}
            </button>
          )
        })}

        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="rounded-sm border-[0.5px] border-white/[0.1] px-4 py-2 font-heading text-[10px] font-bold uppercase tracking-[2px] text-muted transition-colors hover:border-gold/30 hover:text-gold disabled:pointer-events-none disabled:opacity-35"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default GalleryPagination
