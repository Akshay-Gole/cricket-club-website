import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { playerQuery } from '../../lib/queryOptions'

const PAGE_TITLES: Record<string, string> = {
  '/': "Top G's CC",
  '/squad': "Squad | Top G's CC",
  '/fixtures': "Fixtures & Results | Top G's CC",
  '/honours': "Honours | Top G's CC",
  '/gallery': "Gallery | Top G's CC",
  '/contact': "Contact | Top G's CC",
  '/about': "About | Top G's CC",
  '/admin/login': "Admin Login | Top G's CC",
  '/admin/dashboard': "Dashboard | Top G's CC Admin",
  '/admin/home-content': "Home Content | Top G's CC Admin",
  '/admin/players': "Players | Top G's CC Admin",
  '/admin/fixtures': "Fixtures | Top G's CC Admin",
  '/admin/honours': "Honours | Top G's CC Admin",
  '/admin/sponsors': "Sponsors | Top G's CC Admin",
  '/admin/messages': "Messages | Top G's CC Admin",
}

function DocumentTitle() {
  const { pathname } = useLocation()
  const playerId = pathname.match(/^\/players\/([^/]+)$/)?.[1] ?? ''
  const { data: player } = useQuery(playerQuery(playerId))

  useEffect(() => {
    document.title = playerId
      ? `${player?.name ?? 'Player'} | Top G's CC`
      : (PAGE_TITLES[pathname] ?? "Page Not Found | Top G's CC")
  }, [pathname, player?.name, playerId])

  return null
}

export default DocumentTitle
