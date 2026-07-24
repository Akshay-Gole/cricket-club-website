import FeaturedPlayers from '../features/home/components/FeaturedPlayers'
import FixturesPreview from '../features/home/components/FixturesPreview'
import HeroSection from '../features/home/components/HeroSection'
import StatsBar from '../features/home/components/StatsBar'
import Ticker from '../features/home/components/Ticker'
import Sponsors from '../features/home/components/Sponsors'
import CtaSection from '../features/home/components/CtaSection'

function Home() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <Ticker />
      <FeaturedPlayers />
      <FixturesPreview />
      <Sponsors />
      <CtaSection />
    </>
  )
}

export default Home
