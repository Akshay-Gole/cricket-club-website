import type { GalleryImage } from '../types/gallery.types'

interface GalleryArtProps {
  tone: GalleryImage['tone']
  label: string
  className?: string
}

const toneClass: Record<GalleryImage['tone'], string> = {
  green:
    'text-green-light/30 [background:radial-gradient(circle_at_18%_18%,rgba(86,190,118,0.46),transparent_24%),radial-gradient(circle_at_74%_28%,rgba(201,168,76,0.22),transparent_28%),linear-gradient(135deg,#0d2a18_0%,#1d5630_48%,#07120b_100%)]',
  gold: 'text-gold/30 [background:radial-gradient(circle_at_20%_18%,rgba(240,201,106,0.5),transparent_26%),radial-gradient(circle_at_78%_60%,rgba(52,160,88,0.14),transparent_30%),linear-gradient(135deg,#3a2a08_0%,#1c170b_48%,#080806_100%)]',
  blue: 'text-[#8fa7ff]/30 [background:radial-gradient(circle_at_24%_20%,rgba(143,167,255,0.42),transparent_26%),radial-gradient(circle_at_72%_62%,rgba(201,168,76,0.16),transparent_30%),linear-gradient(135deg,#0b1734_0%,#17233a_48%,#060912_100%)]',
  red: 'text-[#ff8f7d]/30 [background:radial-gradient(circle_at_20%_18%,rgba(255,143,125,0.42),transparent_25%),radial-gradient(circle_at_72%_70%,rgba(201,168,76,0.16),transparent_28%),linear-gradient(135deg,#2a0d0a_0%,#28130e_48%,#080504_100%)]',
}

function GalleryArt({ tone, label, className = '' }: GalleryArtProps) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${toneClass[tone]} ${className}`}
    >
      <div className="absolute inset-0 opacity-[0.1] [background-image:repeating-linear-gradient(165deg,transparent,transparent_34px,rgba(255,255,255,0.7)_34px,rgba(255,255,255,0.7)_68px)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.16),transparent_44%,rgba(255,255,255,0.08))]" />
      <div className="relative font-display text-[44px] uppercase tracking-[4px] opacity-60">
        {label}
      </div>
    </div>
  )
}

export default GalleryArt
