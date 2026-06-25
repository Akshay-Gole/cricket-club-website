import { useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent, ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import SQUAD from '../players/data/squadData'
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

function ManagePlayers() {
  const [players, setPlayers] = useState<Player[]>(SQUAD)
  const [search, setSearch] = useState('')
  const [activeRole, setActiveRole] = useState<RoleFilter>('all')
  const [editingId, setEditingId] = useState<string | null>(null)
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
      leaders: players.filter(player => player.isCaptain).length,
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

    setFormError('')
  }

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file')
      return
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
    setForm(current => ({
      ...current,
      imageFile: null,
      imagePreviewUrl: '',
    }))

    if (imageInputRef.current) {
      imageInputRef.current.value = ''
    }
  }

  const resetForm = () => {
    setForm(EMPTY_PLAYER_FORM)
    setEditingId(null)
    setFormError('')

    if (imageInputRef.current) {
      imageInputRef.current.value = ''
    }
  }

  const focusForm = () => {
    formPanelRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })

    window.setTimeout(() => {
      nameInputRef.current?.focus()
    }, 350)
  }

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
  }, [searchParams, setSearchParams])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
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
    const battingAverage = Number(form.battingAverage || 0)

    if (Number.isNaN(jerseyNumber)) {
      setFormError('Jersey number must be a number')
      return
    }

    if (Number.isNaN(battingAverage)) {
      setFormError('Batting average must be a number')
      return
    }

    const nextPlayer: Player = {
      id: editingId ?? `player-${Date.now()}`,
      name: form.name.trim(),
      role: form.role,
      jerseyNumber,
      battingAverage,
      bestBowling: form.bestBowling.trim() || '0/0',

      // TEMP UI only:
      // Later backend will upload form.imageFile to Cloudinary
      // and return a real Cloudinary URL.
      imageUrl: form.imagePreviewUrl,

      isCaptain: form.isCaptain,
    }

    if (editingId) {
      setPlayers(current =>
        current.map(player => (player.id === editingId ? nextPlayer : player))
      )
    } else {
      setPlayers(current => [nextPlayer, ...current])
    }

    resetForm()
  }

  const handleEdit = (player: Player) => {
    setEditingId(player.id)

    setForm({
      name: player.name,
      role: player.role,
      jerseyNumber: String(player.jerseyNumber),
      battingAverage: String(player.battingAverage),
      bestBowling: player.bestBowling,
      imageFile: null,
      imagePreviewUrl: player.imageUrl ?? '',
      isCaptain: Boolean(player.isCaptain),
    })

    setFormError('')

    if (imageInputRef.current) {
      imageInputRef.current.value = ''
    }

    focusForm()
  }

  const handleDelete = (playerId: string) => {
    setPlayers(current => current.filter(player => player.id !== playerId))

    if (editingId === playerId) {
      resetForm()
    }
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="relative overflow-hidden rounded border border-white/[0.12] bg-[#1b241d] px-5 py-7 sm:px-7 lg:px-8">
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
              Add, edit and organise squad members. Image upload is UI-only for
              now. Later the backend will upload the image to Cloudinary.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 min-[520px]:grid-cols-4 min-[901px]:w-[520px]">
            <StatCard label="Players" value={stats.total} />
            <StatCard label="Batters" value={stats.batters} />
            <StatCard label="Bowlers" value={stats.bowlers} />
            <StatCard label="Leaders" value={stats.leaders} />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 sm:gap-6 min-[1180px]:grid-cols-[minmax(0,1fr)_390px]">
        <section className="overflow-hidden rounded border border-white/[0.12] bg-[#182119]">
          <div className="border-b border-white/[0.10] p-5 sm:p-6">
            <div className="flex flex-col gap-4 min-[901px]:flex-row min-[901px]:items-center min-[901px]:justify-between">
              <div>
                <p className="font-heading text-[10px] font-bold uppercase tracking-[3px] text-gold">
                  Squad List
                </p>

                <h3 className="mt-1 font-display text-2xl tracking-[1px] text-white">
                  {filteredPlayers.length} Players
                </h3>
              </div>

              <div className="flex flex-col gap-3 min-[641px]:flex-row">
                <input
                  type="search"
                  value={search}
                  placeholder="Search player or jersey..."
                  onChange={event => setSearch(event.target.value)}
                  className="h-11 rounded border border-white/[0.12] bg-white/[0.045] px-4 font-heading text-sm font-semibold tracking-[0.5px] text-white outline-none placeholder:text-muted focus:border-gold/40 min-[641px]:w-[260px]"
                />

                <div className="flex overflow-x-auto rounded border border-white/[0.12] bg-white/[0.035] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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

                        <button
                          type="button"
                          onClick={() => handleDelete(player.id)}
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
              <article key={player.id} className="bg-[#182119] p-5">
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

                  <button
                    type="button"
                    onClick={() => handleDelete(player.id)}
                    className="flex-1 rounded border border-[#d86b5f]/20 px-3 py-2.5 font-heading text-[10px] font-bold uppercase tracking-[2px] text-[#ff9b8f] transition-colors hover:bg-[#d86b5f]/10"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>

          {filteredPlayers.length === 0 && (
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
          className="rounded border border-white/[0.12] bg-[#182119] p-5 sm:p-6"
        >
          <div className="mb-6">
            <p className="font-heading text-[10px] font-bold uppercase tracking-[3px] text-gold">
              {editingId ? 'Edit Player' : 'Create Player'}
            </p>

            <h3 className="mt-1 font-display text-2xl tracking-[1px] text-white">
              {editingId ? 'Update Squad Member' : 'Add Squad Member'}
            </h3>

            <p className="mt-2 font-body text-xs font-light leading-[1.7] text-muted">
              This form updates local UI state only. Backend save and Cloudinary
              upload will come later.
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

            <div className="grid grid-cols-2 gap-3">
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

              <AdminField label="Bat Avg">
                <input
                  type="number"
                  value={form.battingAverage}
                  placeholder="42.3"
                  onChange={event =>
                    updateForm('battingAverage', event.target.value)
                  }
                  className={adminInputClass}
                />
              </AdminField>
            </div>

            <AdminField label="Best Bowling">
              <input
                type="text"
                value={form.bestBowling}
                placeholder="4/18"
                onChange={event =>
                  updateForm('bestBowling', event.target.value)
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
                          Preview only — backend upload will come later
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
                      Choose JPG, PNG or WebP. This will preview now and upload
                      to Cloudinary later through backend.
                    </span>
                  </button>
                )}

                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>
            </div>

            <label className="flex cursor-pointer items-center justify-between gap-4 rounded border border-white/[0.12] bg-white/[0.035] px-4 py-3">
              <span>
                <span className="block font-heading text-xs font-bold uppercase tracking-[2px] text-white">
                  Club Captain
                </span>

                <span className="mt-1 block font-body text-xs font-light text-muted">
                  Show captain badge on profile.
                </span>
              </span>

              <input
                type="checkbox"
                checked={form.isCaptain}
                onChange={event =>
                  updateForm('isCaptain', event.target.checked)
                }
                className="h-4 w-4 accent-gold"
              />
            </label>

            {formError && (
              <div className="rounded border border-[#d86b5f]/25 bg-[#d86b5f]/[0.08] px-4 py-3 font-body text-xs text-[#ff9b8f]">
                {formError}
              </div>
            )}

            <div className="flex flex-col gap-3 min-[420px]:flex-row">
              <button
                type="submit"
                className="flex-1 rounded bg-gold px-5 py-3.5 font-heading text-[11px] font-bold uppercase tracking-[2.5px] text-black transition-colors hover:bg-gold/90"
              >
                {editingId ? 'Save Changes' : 'Add Player'}
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
