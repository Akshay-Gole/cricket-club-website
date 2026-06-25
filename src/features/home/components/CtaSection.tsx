import { Link } from 'react-router-dom'
import { ROUTES } from '../../../constants/routes'

function CtaSection() {
  return (
    <section className="relative bg-green px-7 sm:px-12 py-20 sm:py-24 text-center overflow-hidden">
      {/* Giant faded background text */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-black/15 whitespace-nowrap pointer-events-none leading-none tracking-[10px] text-[120px] sm:text-[200px]"
        aria-hidden="true"
      >
        JOIN
      </div>

      {/* Content (sits above the background text) */}
      <h2 className="relative font-display text-white text-[clamp(48px,9vw,72px)] tracking-[2px] leading-none mb-4">
        Ready to Play?
      </h2>
      <p className="relative font-body text-white/60 text-base font-light mb-10">
        Join Top G's CC today.
      </p>
      <Link
        to={ROUTES.CONTACT}
        className="relative inline-block font-heading text-sm font-bold tracking-[3px] uppercase text-black bg-gold px-12 py-[18px] rounded-sm hover:bg-gold-light transition-colors"
      >
        Join Our Club
      </Link>
    </section>
  )
}

export default CtaSection
