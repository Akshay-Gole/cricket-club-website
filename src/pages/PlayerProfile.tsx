import { Link } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import CATTO_PROFILE from '../features/players/data/playerProfileData'
import ProfileHero from '../features/players/components/profile/ProfileHero'
import ProfileTabs from '../features/players/components/profile/ProfileTabs'

function PlayerProfile() {
  // STATIC — hardcoded Catto. Later: fetch by route :id (enhancement pass)
  const player = CATTO_PROFILE

  return (
    <div className="pb-20">
      {/* BREADCRUMB */}
      <div className="flex flex-wrap items-center gap-2.5 px-5 sm:px-7 lg:px-12 py-4 sm:py-[18px] lg:py-5 font-heading text-[10px] sm:text-[11px] font-semibold tracking-[2px] uppercase">
        <Link
          to={ROUTES.HOME}
          className="text-muted hover:text-gold transition-colors"
        >
          Home
        </Link>
        <span className="text-muted opacity-40">/</span>
        <Link
          to={ROUTES.SQUAD}
          className="text-muted hover:text-gold transition-colors"
        >
          Squad
        </Link>
        <span className="text-muted opacity-40">/</span>
        <span className="text-gold">{player.fullName}</span>
      </div>

      {/* PROFILE HERO */}
      <ProfileHero player={player} />
      <ProfileTabs player={player} />
    </div>
  )
}

export default PlayerProfile
