import FeaturedPlayers from '../features/home/components/FeaturedPlayers'
import HeroSection from '../features/home/components/HeroSection'
import LatestNews from '../features/home/components/LatestNews'
import StatsBar from '../features/home/components/StatsBar'
import Ticker from '../features/home/components/Ticker'

function Home() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <Ticker />
      <LatestNews />
      <FeaturedPlayers />
    </>
  )
}

export default Home
