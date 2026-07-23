import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { playerQuery } from '../../lib/queryOptions'

const SITE_URL = 'https://www.topgscc.com'
const DEFAULT_DESCRIPTION =
  "Top G's CC is an Adelaide cricket club built for committed players. Explore our squad, fixtures, results, honours and club gallery."

const PAGE_METADATA: Record<string, { title: string; description: string }> = {
  '/': {
    title: "Top G's CC | Adelaide Cricket Club",
    description: DEFAULT_DESCRIPTION,
  },
  '/squad': {
    title: "Cricket Squad | Top G's CC",
    description:
      "Meet the Top G's CC squad, explore player roles, profiles and cricket statistics.",
  },
  '/fixtures': {
    title: "Fixtures & Results | Top G's CC",
    description:
      "View upcoming Top G's CC cricket fixtures, completed match results, scores and venues.",
  },
  '/honours': {
    title: "Club Honours | Top G's CC",
    description:
      "Explore Top G's CC team achievements, awards and cricket honours.",
  },
  '/gallery': {
    title: "Cricket Gallery | Top G's CC",
    description:
      "See match-day moments and club highlights from Top G's CC in Adelaide.",
  },
  '/contact': {
    title: "Contact Top G's CC | Play, Sponsor or Enquire",
    description:
      "Contact Top G's CC to join the club, arrange a match, become a sponsor or send a general enquiry.",
  },
  '/about': {
    title: "About Top G's CC | Adelaide Cricket Club",
    description:
      "Learn about Top G's CC, an ambitious cricket club established in Adelaide in 2026.",
  },
  '/admin/login': {
    title: "Admin Login | Top G's CC",
    description: 'Secure club administration login.',
  },
  '/admin/dashboard': {
    title: "Dashboard | Top G's CC Admin",
    description: 'Top G’s CC administration dashboard.',
  },
  '/admin/home-content': {
    title: "Home Content | Top G's CC Admin",
    description: 'Manage homepage content.',
  },
  '/admin/players': {
    title: "Players | Top G's CC Admin",
    description: 'Manage club players.',
  },
  '/admin/fixtures': {
    title: "Fixtures | Top G's CC Admin",
    description: 'Manage club fixtures and results.',
  },
  '/admin/honours': {
    title: "Honours | Top G's CC Admin",
    description: 'Manage club honours.',
  },
  '/admin/sponsors': {
    title: "Sponsors | Top G's CC Admin",
    description: 'Manage club sponsors.',
  },
  '/admin/messages': {
    title: "Messages | Top G's CC Admin",
    description: 'Manage contact enquiries.',
  },
}

function DocumentTitle() {
  const { pathname } = useLocation()
  const playerId = pathname.match(/^\/players\/([^/]+)$/)?.[1] ?? ''
  const { data: player } = useQuery(playerQuery(playerId))

  useEffect(() => {
    const metadata = playerId
      ? {
          title: `${player?.name ?? 'Player'} | Top G's CC`,
          description: player?.name
            ? `View ${player.name}'s Top G's CC player profile, role and cricket statistics.`
            : "View this Top G's CC player profile and cricket statistics.",
        }
      : (PAGE_METADATA[pathname] ?? {
          title: "Page Not Found | Top G's CC",
          description: 'The requested page could not be found.',
        })
    const canonicalUrl = `${SITE_URL}${pathname === '/' ? '/' : pathname}`
    const isAdminPage = pathname.startsWith('/admin')

    document.title = metadata.title
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', metadata.description)
    document
      .querySelector('meta[name="robots"]')
      ?.setAttribute(
        'content',
        isAdminPage ? 'noindex, nofollow' : 'index, follow'
      )
    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute('href', canonicalUrl)
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute('content', metadata.title)
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute('content', metadata.description)
    document
      .querySelector('meta[property="og:url"]')
      ?.setAttribute('content', canonicalUrl)
    document
      .querySelector('meta[name="twitter:title"]')
      ?.setAttribute('content', metadata.title)
    document
      .querySelector('meta[name="twitter:description"]')
      ?.setAttribute('content', metadata.description)
  }, [pathname, player?.name, playerId])

  return null
}

export default DocumentTitle
