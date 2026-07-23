import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent, ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import PageLoader from '../../components/shared/PageLoader'
import api from '../../services/api'
import type { Player, PlayerRole } from '../players/types/player.types'
import {
  adminInputClass,
  EMPTY_PLAYER_FORM,
  ROLE_FILTERS,
  ROLE_OPTIONS,
  roleBadgeClass,
  roleLabel,
  type PlayerFormState,
  type RoleFilter,
} from './constants/adminPlayer.constants'
import { queryKeys } from '../../lib/queryOptions'

interface AdminPlayerResponse {
  id: string
  name: string
  role: PlayerRole
  jerseyNumber: number
  imageUrl?: string | null
  imagePublicId?: string | null
  playCricketPlayerId?: string | null
  stats: {
    battingAverage: number
    bestBowling: string
  }
  isCaptain?: boolean
  isFeatured?: boolean
  featuredStatValue?: string | null
  featuredStatLabel?: string | null
  active?: boolean
}

interface PlayerPayload {
  firstName: string
  lastName: string
  displayName: string
  initials: string
  role: PlayerRole
  jerseyNumber: number
  imageUrl?: string
  imagePublicId?: string
  playCricketPlayerId?: string
  isCaptain: boolean
  isFeatured: boolean
  featuredStatValue?: string
  featuredStatLabel?: string
  active: boolean
}

function mapAdminPlayer(player: AdminPlayerResponse): Player {
  return {
    id: player.id,
    name: player.name,
    role: player.role,
    jerseyNumber: player.jerseyNumber,
    battingAverage: player.stats.battingAverage,
    bestBowling: player.stats.bestBowling,
    imageUrl: player.imageUrl ?? undefined,
    imagePublicId: player.imagePublicId ?? undefined,
    playCricketPlayerId: player.playCricketPlayerId ?? undefined,
    isCaptain: player.isCaptain,
    isFeatured: player.isFeatured,
    featuredStatValue: player.featuredStatValue ?? undefined,
    featuredStatLabel: player.featuredStatLabel ?? undefined,
    active: player.active,
  }
}

function getNameParts(name: string) {
  const parts = name.trim().split(/\s+/)
  const firstName = parts[0] ?? ''
  const lastName = parts.slice(1).join(' ') || firstName

  return { firstName, lastName }
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 3)
    .map(part => part[0])
    .join('')
    .toUpperCase()
}

function getApiMessage(error: unknown, fallback: string) {
  if (
    typeof error === 'object' &&
    error &&
    'response' in error &&
    typeof error.response === 'object' &&
    error.response &&
    'data' in error.response &&
    typeof error.response.data === 'object' &&
    error.response.data &&
    'message' in error.response.data &&
    typeof error.response.data.message === 'string'
  ) {
    return error.response.data.message
  }

  return fallback
}

function ManagePlayers() {
  const queryClient = useQueryClient()
  const [players, setPlayers] = useState<Player[]>([])
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(true)
  const [isSavingPlayer, setIsSavingPlayer] = useState(false)
  const [syncingPlayerId, setSyncingPlayerId] = useState<string | null>(null)
  const [isVerifyingPlayCricketId, setIsVerifyingPlayCricketId] =
    useState(false)
  const [playCricketVerifyMessage, setPlayCricketVerifyMessage] = useState('')
  const [isPlayCricketIdValid, setIsPlayCricketIdValid] = useState<
    boolean | null
  >(null)
  const [playersError, setPlayersError] = useState('')
  const [search, setSearch] = useState('')
  const [activeRole, setActiveRole] = useState<RoleFilter>('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null)
  const [form, setForm] = useState<PlayerFormState>(EMPTY_PLAYER_FORM)
  const [formError, setFormError] = useState('')

  const [searchParams, setSearchParams] = useSearchParams()

  const imageInputRef = useRef<HTMLInputElement | null>(null)
  const formPanelRef = useRef<HTMLElement | null>(null)
  const nameInputRef = useRef<HTMLInputElement | null>(null)

  const filteredPlayers = useMemo(() => {
    const searchValue = search.trim().toLowerCase()

    return players.filter(player => {
      const matchesSearch =
        player.name.toLowerCase().includes(searchValue) ||
        String(player.jerseyNumber).includes(searchValue)

      const matchesRole = activeRole === 'all' || player.role === activeRole

      return matchesSearch && matchesRole
    })
  }, [players, search, activeRole])

  const stats = useMemo(() => {
    return {
      total: players.length,
      batters: players.filter(player => player.role === 'batsman').length,
      bowlers: players.filter(player => player.role === 'bowler').length,
      allRounders: players.filter(player => player.role === 'all-rounder')
        .length,
      keepers: players.filter(player => player.role === 'wicket-keeper').length,
    }
  }, [players])

  const updateForm = (
    field: keyof PlayerFormState,
    value: string | boolean | File | null
  ) => {
    setForm(current => ({
      ...current,
      [field]: value,
    }))

    if (field === 'playCricketPlayerId') {
      setPlayCricketVerifyMessage('')
      setIsPlayCricketIdValid(null)
    }

    setFormError('')
  }

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormError('Player image must be smaller than 5 MB')
      return
    }

    if (form.imagePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(form.imagePreviewUrl)
    }

    const previewUrl = URL.createObjectURL(file)

    setForm(current => ({
      ...current,
      imageFile: file,
      imagePreviewUrl: previewUrl,
    }))

    setFormError('')
  }

  const removeImage = () => {
    if (form.imagePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(form.imagePreviewUrl)
    }

    setForm(current => ({
      ...current,
      imageFile: null,
      imagePreviewUrl: '',
      imageUrl: '',
      imagePublicId: '',
    }))

    if (imageInputRef.current) {
      imageInputRef.current.value = ''
    }
  }

  const resetForm = useCallback(() => {
    if (form.imagePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(form.imagePreviewUrl)
    }

    setForm(EMPTY_PLAYER_FORM)
    setEditingId(null)
    setFormError('')
    setPlayCricketVerifyMessage('')
    setIsPlayCricketIdValid(null)

    if (imageInputRef.current) {
      imageInputRef.current.value = ''
    }
  }, [form.imagePreviewUrl])

  const focusForm = useCallback(() => {
    formPanelRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })

    window.setTimeout(() => {
      nameInputRef.current?.focus()
    }, 350)
  }, [])

  const buildPlayerPayload = (jerseyNumber: number): PlayerPayload => {
    const displayName = form.name.trim()
    const { firstName, lastName } = getNameParts(displayName)
    return {
      firstName,
      lastName,
      displayName,
      initials: getInitials(displayName),
      role: form.role,
      jerseyNumber,
      imageUrl: form.imageUrl,
      imagePublicId: form.imagePublicId,
      playCricketPlayerId: form.playCricketPlayerId.trim() || undefined,
      isCaptain: form.isCaptain,
      isFeatured: form.isFeatured,
      featuredStatValue: form.featuredStatValue.trim() || undefined,
      featuredStatLabel: form.featuredStatLabel.trim() || undefined,
      active: form.active,
    }
  }

  useEffect(() => {
    async function loadPlayers() {
      try {
        setIsLoadingPlayers(true)
        setPlayersError('')

        const response = await queryClient.fetchQuery({
          queryKey: ['admin', 'players'],
          queryFn: () => api.get('/admin/players'),
        })

        setPlayers(response.data.data.map(mapAdminPlayer))
      } catch {
        setPlayersError('Could not load players')
      } finally {
        setIsLoadingPlayers(false)
      }
    }

    loadPlayers()
  }, [queryClient])

  useEffect(() => {
    if (searchParams.get('action') !== 'create') return

    const timeoutId = window.setTimeout(() => {
      resetForm()
      focusForm()

      setSearchParams({}, { replace: true })
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [focusForm, resetForm, searchParams, setSearchParams])

  useEffect(() => {
    if (!playerToDelete) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [playerToDelete])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!form.name.trim()) {
      setFormError('Player name is required')
      return
    }

    if (!form.jerseyNumber.trim()) {
      setFormError('Jersey number is required')
      return
    }

    const jerseyNumber = Number(form.jerseyNumber)

    if (Number.isNaN(jerseyNumber)) {
      setFormError('Jersey number must be a number')
      return
    }

    try {
      setIsSavingPlayer(true)
      setFormError('')

      const uploadedImage = form.imageFile
        ? (
            await api.post('/admin/players/image', form.imageFile, {
              headers: { 'Content-Type': form.imageFile.type },
            })
          ).data.data
        : null
      const payload = {
        ...buildPlayerPayload(jerseyNumber),
        ...(uploadedImage ?? {}),
      }
      const response = editingId
        ? await api.patch(`/admin/players/${editingId}`, payload)
        : await api.post('/admin/players', payload)

      const savedPlayer = mapAdminPlayer(response.data.data)

      if (editingId) {
        setPlayers(current =>
          current.map(player =>
            player.id === editingId ? savedPlayer : player
          )
        )
      } else {
        setPlayers(current => [savedPlayer, ...current])
      }
      void queryClient.invalidateQueries({ queryKey: queryKeys.adminPlayers })
      void queryClient.invalidateQueries({ queryKey: queryKeys.players })

      resetForm()
    } catch (error) {
      setFormError(
        getApiMessage(
          error,
          'Could not save player. If the Play Cricket ID was just added, verify it and try again.'
        )
      )
    } finally {
      setIsSavingPlayer(false)
    }
  }

  const handleEdit = (player: Player) => {
    setEditingId(player.id)

    setForm({
      name: player.name,
      role: player.role,
      jerseyNumber: String(player.jerseyNumber),
      playCricketPlayerId: player.playCricketPlayerId ?? '',
      imageFile: null,
      imagePreviewUrl: player.imageUrl ?? '',
      imageUrl: player.imageUrl ?? '',
      imagePublicId: player.imagePublicId ?? '',
      isCaptain: Boolean(player.isCaptain),
      isFeatured: Boolean(player.isFeatured),
      featuredStatValue: player.featuredStatValue ?? '',
      featuredStatLabel: player.featuredStatLabel ?? '',
      active: player.active ?? true,
    })

    setFormError('')
    setPlayCricketVerifyMessage(
      player.playCricketPlayerId ? 'Play Cricket ID already saved.' : ''
    )
    setIsPlayCricketIdValid(player.playCricketPlayerId ? true : null)

    if (imageInputRef.current) {
      imageInputRef.current.value = ''
    }

    focusForm()
  }

  const verifyPlayCricketId = async () => {
    const playerId = form.playCricketPlayerId.trim()

    if (!playerId) {
      setPlayCricketVerifyMessage('Enter a Play Cricket player ID first.')
      setIsPlayCricketIdValid(false)
      return
    }

    try {
      setIsVerifyingPlayCricketId(true)
      setPlayCricketVerifyMessage('')

      const response = await api.get(
        `/admin/players/verify-play-cricket/${playerId}`
      )

      if (response.data.data.valid) {
        const summary = response.data.data.summary
        setIsPlayCricketIdValid(true)
        setPlayCricketVerifyMessage(
          `Valid ID — ${summary.matches} matches, ${summary.runs} runs, ${summary.wickets} wickets found.`
        )
        return
      }

      setIsPlayCricketIdValid(false)
      setPlayCricketVerifyMessage('No player stats found for this ID.')
    } catch {
      setIsPlayCricketIdValid(false)
      setPlayCricketVerifyMessage('Could not verify this ID. Try again.')
    } finally {
      setIsVerifyingPlayCricketId(false)
    }
  }

  const handleDeleteClick = (player: Player) => {
    setPlayerToDelete(player)
  }

  const syncPlayerStats = async (player: Player) => {
    if (!player.playCricketPlayerId) {
      setPlayersError('Add a Play Cricket player ID before syncing stats')
      return
    }

    try {
      setSyncingPlayerId(player.id)
      setPlayersError('')

      const response = await api.post(`/admin/players/${player.id}/sync-stats`)
      const syncedPlayer = mapAdminPlayer(response.data.data)

      setPlayers(current =>
        current.map(currentPlayer =>
          currentPlayer.id === player.id ? syncedPlayer : currentPlayer
        )
      )
      void queryClient.invalidateQueries({ queryKey: queryKeys.adminPlayers })
      void queryClient.invalidateQueries({ queryKey: queryKeys.players })
    } catch {
      setPlayersError('Could not sync player stats')
    } finally {
      setSyncingPlayerId(null)
    }
  }

  const confirmDelete = async () => {
    if (!playerToDelete) return

    try {
      await api.delete(`/admin/players/${playerToDelete.id}`)

      setPlayers(current =>
        current.filter(player => player.id !== playerToDelete.id)
      )
      void queryClient.invalidateQueries({ queryKey: queryKeys.adminPlayers })
      void queryClient.invalidateQueries({ queryKey: queryKeys.players })

      if (editingId === playerToDelete.id) {
        resetForm()
      }

      setPlayerToDelete(null)
    } catch {
      setPlayersError('Could not delete player')
    }
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="relative overflow-hidden rounded border border-white/[0.1] bg-[#181818] px-5 py-7 shadow-[0_20px_70px_rgba(0,0,0,0.24)] sm:px-7 lg:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(201,168,76,0.12),transparent_34%)]"
        />

        <div className="relative flex flex-col gap-5 min-[901px]:flex-row min-[901px]:items-end min-[901px]:justify-between">
          <div>
            <div className="mb-3 font-heading text-[10px] font-bold uppercase tracking-[4px] text-gold">
              Squad Operations
            </div>

            <h2 className="font-display text-[38px] leading-none tracking-[1px] text-white sm:text-[48px]">
              Manage Players.
            </h2>

            <p className="mt-4 max-w-[620px] font-body text-sm font-light leading-[1.8] text-muted">
              Add, edit and organise squad members. Player images are stored
              securely through the backend.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 min-[520px]:grid-cols-3 min-[901px]:w-[650px] min-[901px]:grid-cols-5">
            <StatCard label="Players" value={stats.total} />
            <StatCard label="Batters" value={stats.batters} />
            <StatCard label="Bowlers" value={stats.bowlers} />
            <StatCard label="All-Rounders" value={stats.allRounders} />
            <StatCard label="Keepers" value={stats.keepers} />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 sm:gap-6 min-[1180px]:grid-cols-[minmax(0,1fr)_390px]">
        <section className="overflow-hidden rounded border border-white/[0.1] bg-[#161616]">
          <div className="border-b border-white/[0.10] p-5 sm:p-6">
            <div className="flex flex-col gap-4">
              <div>
                <p className="font-heading text-[10px] font-bold uppercase tracking-[3px] text-gold">
                  Squad List
                </p>

                <h3 className="mt-1 font-display text-2xl tracking-[1px] text-white">
                  {isLoadingPlayers
                    ? 'Loading...'
                    : `${filteredPlayers.length} Players`}
                </h3>
              </div>

              <div className="flex min-w-0 flex-col gap-3">
                <input
                  type="search"
                  value={search}
                  placeholder="Search player or jersey..."
                  onChange={event => setSearch(event.target.value)}
                  className="h-11 w-full rounded border border-white/[0.12] bg-white/[0.045] px-4 font-heading text-sm font-semibold tracking-[0.5px] text-white outline-none placeholder:text-muted focus:border-gold/40"
                />

                <div className="flex min-w-0 flex-wrap overflow-hidden rounded border border-white/[0.12] bg-white/[0.035]">
                  {ROLE_FILTERS.map(filter => {
                    const isActive = activeRole === filter.value

                    return (
                      <button
                        key={filter.value}
                        type="button"
                        onClick={() => setActiveRole(filter.value)}
                        className={`shrink-0 px-4 py-3 font-heading text-[10px] font-bold uppercase tracking-[2px] transition-colors ${
                          isActive
                            ? 'bg-gold text-black'
                            : 'text-muted hover:bg-white/[0.04] hover:text-white'
                        }`}
                      >
                        {filter.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="hidden min-[901px]:block">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/[0.10] text-left">
                  <TableHead>Player</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Jersey</TableHead>
                  <TableHead>Bat Avg</TableHead>
                  <TableHead>Best Bowl</TableHead>
                  <TableHead>Actions</TableHead>
                </tr>
              </thead>

              <tbody>
                {filteredPlayers.map(player => (
                  <tr
                    key={player.id}
                    className="border-b border-white/[0.09] transition-colors last:border-b-0 hover:bg-white/[0.055]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <PlayerAvatar player={player} />

                        <div>
                          <div className="font-heading text-sm font-bold text-white">
                            {player.name}
                          </div>

                          <div className="mt-1 font-heading text-[10px] font-bold uppercase tracking-[2px] text-muted">
                            {player.isCaptain ? 'Captain' : 'Squad Member'}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <RoleBadge role={player.role} />
                    </td>

                    <td className="px-5 py-4 font-display text-2xl text-white">
                      {String(player.jerseyNumber).padStart(2, '0')}
                    </td>

                    <td className="px-5 py-4 font-heading text-sm font-bold text-white">
                      {player.battingAverage}
                    </td>

                    <td className="px-5 py-4 font-heading text-sm font-bold text-white">
                      {player.bestBowling}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(player)}
                          className="rounded border border-white/[0.08] px-3 py-2 font-heading text-[10px] font-bold uppercase tracking-[2px] text-muted transition-colors hover:border-gold/30 hover:text-gold"
                        >
                          Edit
                        </button>

                        {player.playCricketPlayerId && (
                          <button
                            type="button"
                            onClick={() => syncPlayerStats(player)}
                            disabled={syncingPlayerId === player.id}
                            className="rounded border border-green-light/20 px-3 py-2 font-heading text-[10px] font-bold uppercase tracking-[2px] text-green-light transition-colors hover:bg-green-light/10 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {syncingPlayerId === player.id ? 'Syncing' : 'Sync'}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDeleteClick(player)}
                          className="rounded border border-[#d86b5f]/20 px-3 py-2 font-heading text-[10px] font-bold uppercase tracking-[2px] text-[#ff9b8f] transition-colors hover:bg-[#d86b5f]/10"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 gap-px bg-white/[0.10] min-[901px]:hidden">
            {filteredPlayers.map(player => (
              <article key={player.id} className="bg-[#161616] p-5">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <PlayerAvatar player={player} size="large" />

                    <div>
                      <h4 className="font-heading text-base font-bold text-white">
                        {player.name}
                      </h4>

                      <p className="mt-1 font-heading text-[10px] font-bold uppercase tracking-[2px] text-muted">
                        #{player.jerseyNumber}
                        {player.isCaptain ? ' · Captain' : ''}
                      </p>
                    </div>
                  </div>

                  <RoleBadge role={player.role} />
                </div>

                <div className="grid grid-cols-3 border-y border-white/[0.10] py-4 text-center">
                  <MiniStat label="Bat Avg" value={player.battingAverage} />
                  <MiniStat label="Best Bowl" value={player.bestBowling} />
                  <MiniStat label="Jersey" value={player.jerseyNumber} />
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(player)}
                    className="flex-1 rounded border border-white/[0.08] px-3 py-2.5 font-heading text-[10px] font-bold uppercase tracking-[2px] text-muted transition-colors hover:border-gold/30 hover:text-gold"
                  >
                    Edit
                  </button>

                  {player.playCricketPlayerId && (
                    <button
                      type="button"
                      onClick={() => syncPlayerStats(player)}
                      disabled={syncingPlayerId === player.id}
                      className="flex-1 rounded border border-green-light/20 px-3 py-2.5 font-heading text-[10px] font-bold uppercase tracking-[2px] text-green-light transition-colors hover:bg-green-light/10 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {syncingPlayerId === player.id ? 'Syncing' : 'Sync'}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDeleteClick(player)}
                    className="flex-1 rounded border border-[#d86b5f]/20 px-3 py-2.5 font-heading text-[10px] font-bold uppercase tracking-[2px] text-[#ff9b8f] transition-colors hover:bg-[#d86b5f]/10"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>

          {isLoadingPlayers && !playersError && (
            <PageLoader
              variant="section"
              label="Loading Players"
              className="border-t border-white/[0.08]"
            />
          )}

          {playersError && (
            <div className="p-10 text-center">
              <p className="font-display text-2xl tracking-[1px] text-white">
                Could not load players.
              </p>

              <p className="mt-2 font-body text-sm font-light text-muted">
                Please check that the backend is running.
              </p>
            </div>
          )}

          {!playersError &&
            !isLoadingPlayers &&
            filteredPlayers.length === 0 && (
              <div className="p-10 text-center">
                <p className="font-display text-2xl tracking-[1px] text-white">
                  No players found.
                </p>

                <p className="mt-2 font-body text-sm font-light text-muted">
                  Try changing the search or role filter.
                </p>
              </div>
            )}
        </section>

        <aside
          ref={formPanelRef}
          className="rounded border border-white/[0.1] bg-[#161616] p-5 shadow-[0_14px_44px_rgba(0,0,0,0.22)] sm:p-6"
        >
          <div className="mb-6">
            <p className="font-heading text-[10px] font-bold uppercase tracking-[3px] text-gold">
              {editingId ? 'Edit Player' : 'Create Player'}
            </p>

            <h3 className="mt-1 font-display text-2xl tracking-[1px] text-white">
              {editingId ? 'Update Squad Member' : 'Add Squad Member'}
            </h3>

            <p className="mt-2 font-body text-xs font-light leading-[1.7] text-muted">
              Save player identity here. Cricket stats come from Play Cricket
              when a player ID is connected.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AdminField label="Player Name" required>
              <input
                ref={nameInputRef}
                type="text"
                value={form.name}
                placeholder="e.g. James Catto"
                onChange={event => updateForm('name', event.target.value)}
                className={adminInputClass}
              />
            </AdminField>

            <AdminField label="Role" required>
              <select
                value={form.role}
                onChange={event =>
                  updateForm('role', event.target.value as PlayerRole)
                }
                className={adminInputClass}
              >
                {ROLE_OPTIONS.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </AdminField>

            <AdminField label="Jersey" required>
              <input
                type="number"
                value={form.jerseyNumber}
                placeholder="03"
                onChange={event =>
                  updateForm('jerseyNumber', event.target.value)
                }
                className={adminInputClass}
              />
            </AdminField>

            <div>
              <span className="mb-2 block font-heading text-[10px] font-bold uppercase tracking-[2.5px] text-muted">
                Player Image
              </span>

              <div className="overflow-hidden rounded border border-white/[0.12] bg-white/[0.035]">
                {form.imagePreviewUrl ? (
                  <div className="relative">
                    <img
                      src={form.imagePreviewUrl}
                      alt="Player preview"
                      className="h-52 w-full object-cover"
                    />

                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-black/70 px-4 py-3 backdrop-blur-sm">
                      <div className="min-w-0">
                        <p className="truncate font-heading text-xs font-bold text-white">
                          {form.imageFile?.name ?? 'Current player image'}
                        </p>

                        <p className="mt-0.5 font-body text-[11px] text-muted">
                          Saved to Cloudinary when you save the player
                        </p>
                      </div>

                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() => imageInputRef.current?.click()}
                          className="rounded border border-white/[0.12] px-3 py-2 font-heading text-[9px] font-bold uppercase tracking-[2px] text-white transition-colors hover:border-gold/30 hover:text-gold"
                        >
                          Change
                        </button>

                        <button
                          type="button"
                          onClick={removeImage}
                          className="rounded border border-[#d86b5f]/30 px-3 py-2 font-heading text-[9px] font-bold uppercase tracking-[2px] text-[#ff9b8f] transition-colors hover:bg-[#d86b5f]/10"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="group flex min-h-[180px] w-full flex-col items-center justify-center px-5 py-8 text-center transition-colors hover:bg-white/[0.055]"
                  >
                    <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-gold/25 bg-gold/[0.08] text-2xl text-gold">
                      ↑
                    </span>

                    <span className="font-heading text-sm font-bold uppercase tracking-[2px] text-white">
                      Upload Player Image
                    </span>

                    <span className="mt-2 max-w-[260px] font-body text-xs font-light leading-[1.6] text-muted">
                      Choose JPG, PNG, WebP or SVG · maximum 5 MB
                    </span>
                  </button>
                )}

                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>
            </div>

            <div className="rounded border border-gold/15 bg-gold/[0.035] p-4">
              <div className="mb-4">
                <p className="font-heading text-[10px] font-bold uppercase tracking-[3px] text-gold">
                  Advanced Controls
                </p>

                <p className="mt-1 font-body text-[11px] font-light leading-[1.6] text-muted">
                  Optional admin-only settings for homepage, profile badges and
                  Play Cricket sync.
                </p>
              </div>

              <div className="space-y-3">
                <AdminField label="Play Cricket Player ID">
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={form.playCricketPlayerId}
                        placeholder="f27e5b35-5409-4ae0-acad-644e7fb55bbb"
                        onChange={event =>
                          updateForm('playCricketPlayerId', event.target.value)
                        }
                        className={adminInputClass}
                      />

                      <button
                        type="button"
                        onClick={verifyPlayCricketId}
                        disabled={isVerifyingPlayCricketId}
                        className="shrink-0 rounded border border-gold/25 bg-gold/[0.08] px-3 font-heading text-[10px] font-bold uppercase tracking-[2px] text-gold transition-colors hover:bg-gold/15 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isVerifyingPlayCricketId ? 'Checking' : 'Verify'}
                      </button>
                    </div>

                    <p className="font-body text-[11px] font-light leading-[1.5] text-muted">
                      Optional. Used to sync Cricket Australia stats.
                    </p>

                    {playCricketVerifyMessage && (
                      <p
                        className={`font-body text-[11px] font-semibold leading-[1.5] ${
                          isPlayCricketIdValid
                            ? 'text-green-light'
                            : 'text-[#ff9b8f]'
                        }`}
                      >
                        {playCricketVerifyMessage}
                      </p>
                    )}
                  </div>
                </AdminField>

                <AdminToggle
                  label="Featured Player"
                  description="Show this player in the homepage featured player strip."
                  checked={form.isFeatured}
                  onChange={checked => updateForm('isFeatured', checked)}
                />

                {form.isFeatured && (
                  <div className="grid grid-cols-1 gap-3 min-[520px]:grid-cols-2">
                    <AdminField label="Featured Value">
                      <input
                        type="text"
                        value={form.featuredStatValue}
                        placeholder="847"
                        onChange={event =>
                          updateForm('featuredStatValue', event.target.value)
                        }
                        className={adminInputClass}
                      />
                    </AdminField>

                    <AdminField label="Featured Text">
                      <input
                        type="text"
                        value={form.featuredStatLabel}
                        placeholder="Runs this season"
                        onChange={event =>
                          updateForm('featuredStatLabel', event.target.value)
                        }
                        className={adminInputClass}
                      />
                    </AdminField>
                  </div>
                )}

                <AdminToggle
                  label="Club Captain"
                  description="Show captain badge on profile and squad cards."
                  checked={form.isCaptain}
                  onChange={checked => updateForm('isCaptain', checked)}
                />

                <AdminToggle
                  label="Active Squad Member"
                  description="Active players appear on the public squad page."
                  checked={form.active}
                  onChange={checked => updateForm('active', checked)}
                />
              </div>
            </div>

            {formError && (
              <div className="rounded border border-[#d86b5f]/25 bg-[#d86b5f]/[0.08] px-4 py-3 font-body text-xs text-[#ff9b8f]">
                {formError}
              </div>
            )}

            <div className="flex flex-col gap-3 min-[420px]:flex-row">
              <button
                type="submit"
                disabled={isSavingPlayer}
                className="flex-1 rounded bg-gold px-5 py-3.5 font-heading text-[11px] font-bold uppercase tracking-[2.5px] text-black transition-colors hover:bg-gold/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSavingPlayer
                  ? 'Saving...'
                  : editingId
                    ? 'Save Changes'
                    : 'Add Player'}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded border border-white/[0.08] px-5 py-3.5 font-heading text-[11px] font-bold uppercase tracking-[2.5px] text-muted transition-colors hover:text-white"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </aside>
      </div>

      {playerToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-player-title"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#050505]/85 px-5 py-8 backdrop-blur-md"
          onClick={() => setPlayerToDelete(null)}
        >
          <div
            className="relative w-full max-w-[460px] overflow-hidden rounded border border-gold/20 bg-[#151515] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.6)]"
            onClick={event => event.stopPropagation()}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,rgba(201,168,76,0.16),transparent_34%),linear-gradient(145deg,rgba(23,33,25,0.58),transparent_58%)]"
            />

            <div className="relative mb-3 font-heading text-[10px] font-bold uppercase tracking-[3px] text-gold">
              Squad Action
            </div>

            <h3
              id="delete-player-title"
              className="relative font-display text-[34px] leading-none tracking-[1px] text-white"
            >
              Delete Player?
            </h3>

            <div className="relative mt-5 rounded border border-white/[0.08] bg-black/20 p-4">
              <p className="font-body text-sm font-light leading-[1.7] text-muted">
                Are you sure you want to remove{' '}
                <span className="font-semibold text-white">
                  {playerToDelete.name}
                </span>
                ?
              </p>

              <p className="mt-2 font-heading text-[10px] font-bold uppercase tracking-[2.5px] text-[#ff9b8f]">
                This action hides the player from the squad list.
              </p>
            </div>

            <div className="relative mt-5 flex items-center gap-3 rounded border border-white/[0.08] bg-white/[0.035] px-4 py-3">
              <PlayerAvatar player={playerToDelete} />

              <div>
                <div className="font-heading text-sm font-bold text-white">
                  {playerToDelete.name}
                </div>

                <div className="mt-1 font-heading text-[10px] font-bold uppercase tracking-[2px] text-muted">
                  #{playerToDelete.jerseyNumber} ·{' '}
                  {roleLabel[playerToDelete.role]}
                </div>
              </div>
            </div>

            <div className="relative mt-6 flex flex-col gap-3 min-[420px]:flex-row">
              <button
                type="button"
                onClick={() => setPlayerToDelete(null)}
                className="flex-1 rounded border border-white/[0.12] bg-white/[0.035] px-5 py-3.5 font-heading text-[11px] font-bold uppercase tracking-[2.5px] text-muted transition-colors hover:border-gold/30 hover:text-white"
              >
                Keep Player
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 rounded border border-[#d86b5f]/35 bg-[#d86b5f]/15 px-5 py-3.5 font-heading text-[11px] font-bold uppercase tracking-[2.5px] text-[#ff9b8f] transition-colors hover:bg-[#d86b5f]/25 hover:text-white"
              >
                Delete Player
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface StatCardProps {
  label: string
  value: number
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded border border-white/[0.12] bg-white/[0.035] p-4">
      <div className="font-display text-3xl leading-none text-white">
        {value}
      </div>

      <div className="mt-1 font-heading text-[9px] font-bold uppercase tracking-[2px] text-muted">
        {label}
      </div>
    </div>
  )
}

interface TableHeadProps {
  children: ReactNode
}

function TableHead({ children }: TableHeadProps) {
  return (
    <th className="px-5 py-4 font-heading text-[10px] font-bold uppercase tracking-[2.5px] text-muted">
      {children}
    </th>
  )
}

interface RoleBadgeProps {
  role: PlayerRole
}

function RoleBadge({ role }: RoleBadgeProps) {
  return (
    <span
      className={`inline-flex rounded border px-2.5 py-1.5 font-heading text-[9px] font-bold uppercase tracking-[2px] ${roleBadgeClass[role]}`}
    >
      {roleLabel[role]}
    </span>
  )
}

interface MiniStatProps {
  label: string
  value: string | number
}

function MiniStat({ label, value }: MiniStatProps) {
  return (
    <div className="border-r border-white/[0.10] last:border-r-0">
      <div className="font-display text-xl leading-none text-white">
        {value}
      </div>

      <div className="mt-1 font-heading text-[8px] font-bold uppercase tracking-[2px] text-muted">
        {label}
      </div>
    </div>
  )
}

interface AdminToggleProps {
  label: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}

function AdminToggle({
  label,
  description,
  checked,
  onChange,
}: AdminToggleProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded border border-white/[0.12] bg-white/[0.035] px-4 py-3">
      <span>
        <span className="block font-heading text-xs font-bold uppercase tracking-[2px] text-white">
          {label}
        </span>

        <span className="mt-1 block font-body text-xs font-light leading-[1.5] text-muted">
          {description}
        </span>
      </span>

      <input
        type="checkbox"
        checked={checked}
        onChange={event => onChange(event.target.checked)}
        className="h-4 w-4 accent-gold"
      />
    </label>
  )
}

interface AdminFieldProps {
  label: string
  required?: boolean
  children: ReactNode
}

function AdminField({ label, required, children }: AdminFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block font-heading text-[10px] font-bold uppercase tracking-[2.5px] text-muted">
        {label}
        {required ? <span className="text-gold"> *</span> : null}
      </span>

      {children}
    </label>
  )
}

interface PlayerAvatarProps {
  player: Player
  size?: 'normal' | 'large'
}

function PlayerAvatar({ player, size = 'normal' }: PlayerAvatarProps) {
  const sizeClass = size === 'large' ? 'h-12 w-12' : 'h-11 w-11'

  if (player.imageUrl) {
    return (
      <img
        src={player.imageUrl}
        alt={player.name}
        className={`${sizeClass} rounded-full border border-gold/25 object-cover`}
      />
    )
  }

  return (
    <div
      className={`${sizeClass} flex items-center justify-center rounded-full border border-gold/25 bg-gold/[0.08] font-heading text-xs font-bold uppercase tracking-[1.5px] text-gold`}
    >
      {player.name.slice(0, 3)}
    </div>
  )
}

export default ManagePlayers
