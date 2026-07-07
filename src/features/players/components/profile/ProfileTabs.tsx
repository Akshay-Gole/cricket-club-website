import { useState } from 'react'
import type { PlayerProfile } from '../../types/playerProfile.types'
import logger from '../../../../services/logger'
import StatsTab from './StatsTab'
// import BioTab from './BioTab'
// import AchievementsTab from './AchievementsTab'

type TabId = 'stats' | 'bio' | 'achievements'

const TABS: { id: TabId; label: string }[] = [
  { id: 'stats', label: 'Stats & Form' },
  // { id: 'bio', label: 'Biography' },
  // { id: 'achievements', label: 'Achievements' },
]

function ProfileTabs({ player }: { player: PlayerProfile }) {
  const [activeTab, setActiveTab] = useState<TabId>('stats')

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab)
    logger.action('Profile tab changed', { tab, playerId: player.id })
  }

  return (
    <div data-animate="reveal">
      {/* TAB STRIP */}
      <div className="flex mx-5 sm:mx-7 lg:mx-12 mt-6 sm:mt-7 lg:mt-8 border-b-[0.5px] border-white/[0.06] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TABS.map(tab => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`relative shrink-0 cursor-pointer font-heading text-[11px] sm:text-xs font-bold tracking-[2px] sm:tracking-[2.5px] uppercase px-[18px] sm:px-7 py-3 sm:py-3.5 transition-colors ${
                isActive ? 'text-white' : 'text-muted hover:text-white/70'
              }`}
            >
              {tab.label}
              {/* Active underline */}
              <span
                className={`absolute -bottom-[0.5px] left-0 right-0 h-0.5 bg-gold origin-center transition-transform ${
                  isActive ? 'scale-x-100' : 'scale-x-0'
                }`}
              />
            </button>
          )
        })}
      </div>

      {/* TAB PANELS */}
      <div
        key={activeTab}
        className="animate-tab-panel px-5 sm:px-7 lg:px-12 pt-7 sm:pt-8 lg:pt-10"
      >
        {activeTab === 'stats' && <StatsTab player={player} />}
        {/* {activeTab === 'bio' && <BioTab player={player} />} */}
        {/* {activeTab === 'achievements' && <AchievementsTab />} */}
      </div>
    </div>
  )
}

export default ProfileTabs
