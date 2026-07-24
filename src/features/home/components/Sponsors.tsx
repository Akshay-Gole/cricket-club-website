import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../../constants/routes'
import {
  PUBLIC_SPONSORS_QUERY_KEY,
  getPublicSponsors,
} from '../../sponsors/api/sponsor.api'
import { cloudinaryImage } from '../../../utils/cloudinaryImage'

function Sponsors() {
  const { data: sponsors = [] } = useQuery({
    queryKey: PUBLIC_SPONSORS_QUERY_KEY,
    queryFn: getPublicSponsors,
  })

  if (sponsors.length === 0) return null

  return (
    <section
      data-animate="reveal"
      className="relative overflow-hidden border-t border-gold/20 bg-[#080806] px-7 py-10 sm:px-12 sm:py-12"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(201,168,76,0.1),transparent_35%)]" />

      <div className="relative z-[1] mx-auto max-w-6xl">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <div className="mb-2 font-heading text-[11px] font-semibold uppercase tracking-[4px] text-gold">
              Backing the club
            </div>
            <h2 className="font-display text-[clamp(40px,7vw,56px)] leading-none tracking-[1px] text-[#efe9dc]">
              Our Partners &amp; Sponsors
            </h2>
          </div>

          <Link
            to={`${ROUTES.CONTACT}?intent=sponsor#contact-form`}
            className="border-b border-gold/30 pb-0.5 font-heading text-xs font-semibold uppercase tracking-[2.5px] text-gold transition-colors hover:border-gold"
          >
            Become a Sponsor →
          </Link>
        </div>

        <div className="grid grid-cols-2 items-center gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          {sponsors.map(sponsor => {
            const content = sponsor.logoUrl ? (
              <img
                src={cloudinaryImage(
                  sponsor.logoUrl,
                  'f_auto,q_auto,w_240,h_160,c_fit'
                )}
                srcSet={`${cloudinaryImage(sponsor.logoUrl, 'f_auto,q_auto,w_240,h_160,c_fit')} 240w, ${cloudinaryImage(sponsor.logoUrl, 'f_auto,q_auto,w_400,h_200,c_fit')} 400w`}
                sizes="(min-width: 1024px) 200px, (min-width: 640px) 30vw, 45vw"
                alt={sponsor.name}
                loading="lazy"
                decoding="async"
                className="max-h-24 max-w-full object-contain"
              />
            ) : (
              <span className="text-center font-heading text-xl font-bold uppercase tracking-[2px] text-white">
                {sponsor.name}
              </span>
            )
            const className =
              'flex h-24 items-center justify-center px-2 opacity-80 transition duration-200 hover:scale-105 hover:opacity-100'

            return sponsor.website ? (
              <a
                key={sponsor.id}
                href={sponsor.website}
                target="_blank"
                rel="noreferrer"
                data-animate="card"
                aria-label={`Visit ${sponsor.name}`}
                className={`${className} hover:border-gold/35 hover:bg-gold/[0.07]`}
              >
                {content}
              </a>
            ) : (
              <div key={sponsor.id} data-animate="card" className={className}>
                {content}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Sponsors
