import FeaturedPlayers from '../features/home/components/FeaturedPlayers'
import FixturesPreview from '../features/home/components/FixturesPreview'
import HeroSection from '../features/home/components/HeroSection'
// News is paused for now. Keep the component for future work.
// import LatestNews from '../features/home/components/LatestNews'
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
      {/* News is paused for now. */}
      {/* <LatestNews /> */}
      <FeaturedPlayers />
      <FixturesPreview />
      <Sponsors />
      <CtaSection />
    </>
  )
}

export default Home
