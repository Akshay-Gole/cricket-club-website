import { useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  AdminField,
  Badge,
  MiniStat,
  StatCard,
  ToggleCard,
} from './components/shared/AdminFormPrimitives'
import {
  adminGalleryInputClass,
  adminGalleryTextareaClass,
  EMPTY_GALLERY_FORM,
  galleryBadgeClass,
  GALLERY_FILTERS,
  GALLERY_TONES,
  MOCK_ADMIN_GALLERY_ITEMS,
  type AdminGalleryItem,
  type GalleryFilter,
  type GalleryFormState,
} from './constants/adminGallery.constants'

function ManageGallery() {
  const [items, setItems] = useState<AdminGalleryItem[]>(
    MOCK_ADMIN_GALLERY_ITEMS
  )
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<GalleryFilter>('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<GalleryFormState>(EMPTY_GALLERY_FORM)
  const [formError, setFormError] = useState('')

  const [searchParams, setSearchParams] = useSearchParams()

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const formPanelRef = useRef<HTMLElement | null>(null)
  const titleInputRef = useRef<HTMLInputElement | null>(null)

  const filteredItems = useMemo(() => {
    const searchValue = search.trim().toLowerCase()

    return items.filter(item => {
      const itemText = [
        item.title,
        item.year,
        item.description,
        item.source,
        item.status,
      ]
        .join(' ')
        .toLowerCase()

      const matchesSearch = itemText.includes(searchValue)
      const matchesFilter =
        activeFilter === 'all' ||
        item.source === activeFilter ||
        item.status === activeFilter ||
        (activeFilter === 'featured' && item.featured)

      return matchesSearch && matchesFilter
    })
  }, [items, search, activeFilter])

  const stats = useMemo(
    () => ({
      total: items.length,
      bundles: items.filter(item => item.source === 'admin').length,
      instagram: items.filter(item => item.source === 'instagram').length,
      drafts: items.filter(item => item.status === 'draft').length,
    }),
    [items]
  )

  const updateForm = (
    field: keyof GalleryFormState,
    value: GalleryFormState[keyof GalleryFormState]
  ) => {
    setForm(current => ({
      ...current,
      [field]: value,
    }))
    setFormError('')
  }

  const revokePreviews = (previewUrls: string[]) => {
    previewUrls.forEach(url => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url)
      }
    })
  }

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])

    if (files.length === 0) return

    const invalidFile = files.find(file => !file.type.startsWith('image/'))

    if (invalidFile) {
      setFormError('Please select image files only')
      return
    }

    revokePreviews(form.imagePreviewUrls)

    setForm(current => ({
      ...current,
      imageFiles: files,
      imagePreviewUrls: files.map(file => URL.createObjectURL(file)),
    }))

    setFormError('')
  }

  const removeImages = () => {
    revokePreviews(form.imagePreviewUrls)

    setForm(current => ({
      ...current,
      imageFiles: [],
      imagePreviewUrls: [],
    }))

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const resetForm = () => {
    revokePreviews(form.imagePreviewUrls)
    setForm(EMPTY_GALLERY_FORM)
    setEditingId(null)
    setFormError('')

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const focusForm = () => {
    formPanelRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })

    window.setTimeout(() => {
      titleInputRef.current?.focus()
    }, 350)
  }

  useEffect(() => {
    if (searchParams.get('action') !== 'create') return

    const timeoutId = window.setTimeout(() => {
      setForm(EMPTY_GALLERY_FORM)
      setEditingId(null)
      setFormError('')

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      focusForm()
      setSearchParams({}, { replace: true })
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [searchParams, setSearchParams])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!form.title.trim()) {
      setFormError('Gallery title is required')
      return
    }

    if (!form.year.trim()) {
      setFormError('Year is required')
      return
    }

    if (!form.date.trim()) {
      setFormError('Date is required')
      return
    }

    if (!form.description.trim()) {
      setFormError('Description is required')
      return
    }

    if (form.source === 'instagram' && !form.instagramUrl.trim()) {
      setFormError('Instagram URL is required for Instagram posts')
      return
    }

    const existingItem = items.find(item => item.id === editingId)
    const imageCount =
      form.source === 'admin'
        ? form.imageFiles.length || existingItem?.imageCount || 0
        : 0

    if (form.source === 'admin' && imageCount === 0) {
      setFormError('Please upload at least one image for a club bundle')
      return
    }

    const nextItem: AdminGalleryItem = {
      id: editingId ?? `gallery-${Date.now()}`,
      year: form.year.trim(),
      title: form.title.trim(),
      date: form.date,
      description: form.description.trim(),
      source: form.source,
      coverTone: form.coverTone,
      instagramUrl: form.source === 'instagram' ? form.instagramUrl.trim() : '',
      imageCount,
      status: form.status,
      featured: form.featured,
    }

    if (editingId) {
      setItems(current =>
        current.map(item => (item.id === editingId ? nextItem : item))
      )
    } else {
      setItems(current => [nextItem, ...current])
    }

    resetForm()
  }

  const handleEdit = (item: AdminGalleryItem) => {
    setEditingId(item.id)
    revokePreviews(form.imagePreviewUrls)

    setForm({
      year: item.year,
      title: item.title,
      date: item.date,
      description: item.description,
      source: item.source,
      coverTone: item.coverTone,
      instagramUrl: item.instagramUrl,
      status: item.status,
      featured: item.featured,
      imageFiles: [],
      imagePreviewUrls: [],
    })

    setFormError('')

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }

    focusForm()
  }

  const handleDelete = (itemId: string) => {
    setItems(current => current.filter(item => item.id !== itemId))

    if (editingId === itemId) {
      resetForm()
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
              Club Media
            </div>

            <h2 className="font-display text-[38px] leading-none tracking-[1px] text-white sm:text-[48px]">
              Manage Gallery.
            </h2>

            <p className="mt-4 max-w-[660px] font-body text-sm font-light leading-[1.8] text-muted">
              Add club photo bundles or link Instagram posts. Image upload is
              UI-only for now; backend will later send files to Cloudinary.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 min-[520px]:grid-cols-4 min-[901px]:w-[520px]">
            <StatCard label="Posts" value={stats.total} />
            <StatCard label="Bundles" value={stats.bundles} />
            <StatCard label="Instagram" value={stats.instagram} />
            <StatCard label="Drafts" value={stats.drafts} />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 sm:gap-6 min-[1180px]:grid-cols-[minmax(0,1fr)_440px]">
        <section className="overflow-hidden rounded border border-white/[0.1] bg-[#161616]">
          <div className="border-b border-white/[0.1] p-5 sm:p-6">
            <div className="flex flex-col gap-4 min-[901px]:flex-row min-[901px]:items-center min-[901px]:justify-between">
              <div>
                <p className="font-heading text-[10px] font-bold uppercase tracking-[3px] text-gold">
                  Media Library
                </p>
                <h3 className="mt-1 font-display text-2xl tracking-[1px] text-white">
                  {filteredItems.length} Items
                </h3>
              </div>

              <div className="flex flex-col gap-3 min-[641px]:flex-row">
                <input
                  type="search"
                  value={search}
                  placeholder="Search gallery..."
                  onChange={event => setSearch(event.target.value)}
                  className="h-11 rounded border border-white/[0.12] bg-white/[0.045] px-4 font-heading text-sm font-semibold tracking-[0.5px] text-white outline-none placeholder:text-muted focus:border-gold/40 min-[641px]:w-[260px]"
                />

                <div className="flex overflow-x-auto rounded border border-white/[0.12] bg-white/[0.035] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {GALLERY_FILTERS.map(filter => (
                    <button
                      key={filter.value}
                      type="button"
                      onClick={() => setActiveFilter(filter.value)}
                      className={`shrink-0 px-4 py-3 font-heading text-[10px] font-bold uppercase tracking-[2px] transition-colors ${
                        activeFilter === filter.value
                          ? 'bg-gold text-black'
                          : 'text-muted hover:bg-white/[0.04] hover:text-white'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-px bg-white/[0.1] min-[760px]:grid-cols-2">
            {filteredItems.map(item => (
              <article key={item.id} className="bg-[#161616] p-5">
                <div
                  className={`mb-5 flex min-h-[190px] items-end rounded border border-white/[0.08] p-5 ${galleryToneClass(
                    item.coverTone
                  )}`}
                >
                  <div>
                    <div className="mb-2 flex flex-wrap gap-2">
                      <Badge
                        className={
                          item.source === 'admin'
                            ? galleryBadgeClass.admin
                            : galleryBadgeClass.instagram
                        }
                      >
                        {item.source === 'admin' ? 'Bundle' : 'Instagram'}
                      </Badge>
                      <Badge
                        className={
                          item.status === 'published'
                            ? galleryBadgeClass.published
                            : galleryBadgeClass.draft
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>

                    <h4 className="font-heading text-2xl font-bold leading-[1.05] text-white">
                      {item.title}
                    </h4>
                  </div>
                </div>

                <div className="mb-4 grid grid-cols-3 border-y border-white/[0.1] py-4 text-center">
                  <MiniStat label="Year" value={item.year} />
                  <MiniStat
                    label={item.source === 'admin' ? 'Photos' : 'Source'}
                    value={item.source === 'admin' ? item.imageCount : 'IG'}
                  />
                  <MiniStat
                    label="Featured"
                    value={item.featured ? 'Yes' : 'No'}
                  />
                </div>

                <p className="line-clamp-2 font-body text-sm font-light leading-[1.7] text-muted">
                  {item.description}
                </p>

                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className="flex-1 rounded border border-white/[0.08] px-3 py-2.5 font-heading text-[10px] font-bold uppercase tracking-[2px] text-muted transition-colors hover:border-gold/30 hover:text-gold"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="flex-1 rounded border border-[#d86b5f]/20 px-3 py-2.5 font-heading text-[10px] font-bold uppercase tracking-[2px] text-[#ff9b8f] transition-colors hover:bg-[#d86b5f]/10"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="p-10 text-center">
              <p className="font-display text-2xl tracking-[1px] text-white">
                No gallery items found.
              </p>
              <p className="mt-2 font-body text-sm font-light text-muted">
                Try changing the search or filter.
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
              {editingId ? 'Edit Gallery Item' : 'Create Gallery Item'}
            </p>
            <h3 className="mt-1 font-display text-2xl tracking-[1px] text-white">
              {editingId ? 'Update Media' : 'Add Media'}
            </h3>
            <p className="mt-2 font-body text-xs font-light leading-[1.7] text-muted">
              Choose “Club Upload” for image bundles, or “Instagram” for posts
              that should redirect to Instagram.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AdminField label="Title" required>
              <input
                ref={titleInputRef}
                type="text"
                value={form.title}
                placeholder="Season Opener vs Norwood"
                onChange={event => updateForm('title', event.target.value)}
                className={adminGalleryInputClass}
              />
            </AdminField>

            <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
              <AdminField label="Year" required>
                <input
                  type="text"
                  value={form.year}
                  placeholder="2026"
                  onChange={event => updateForm('year', event.target.value)}
                  className={adminGalleryInputClass}
                />
              </AdminField>

              <AdminField label="Date" required>
                <input
                  type="date"
                  value={form.date}
                  onChange={event => updateForm('date', event.target.value)}
                  className={adminGalleryInputClass}
                />
              </AdminField>
            </div>

            <AdminField label="Description" required>
              <textarea
                value={form.description}
                placeholder="Short description for the public gallery card..."
                onChange={event =>
                  updateForm('description', event.target.value)
                }
                className={adminGalleryTextareaClass}
              />
            </AdminField>

            <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
              <AdminField label="Source">
                <select
                  value={form.source}
                  onChange={event =>
                    updateForm(
                      'source',
                      event.target.value as GalleryFormState['source']
                    )
                  }
                  className={adminGalleryInputClass}
                >
                  <option value="admin">Club Upload</option>
                  <option value="instagram">Instagram</option>
                </select>
              </AdminField>

              <AdminField label="Visual Tone">
                <select
                  value={form.coverTone}
                  onChange={event =>
                    updateForm(
                      'coverTone',
                      event.target.value as GalleryFormState['coverTone']
                    )
                  }
                  className={adminGalleryInputClass}
                >
                  {GALLERY_TONES.map(tone => (
                    <option key={tone.value} value={tone.value}>
                      {tone.label}
                    </option>
                  ))}
                </select>
              </AdminField>
            </div>

            {form.source === 'instagram' ? (
              <AdminField label="Instagram URL" required>
                <input
                  type="url"
                  value={form.instagramUrl}
                  placeholder="https://www.instagram.com/p/..."
                  onChange={event =>
                    updateForm('instagramUrl', event.target.value)
                  }
                  className={adminGalleryInputClass}
                />
              </AdminField>
            ) : (
              <div>
                <span className="mb-2 block font-heading text-[10px] font-bold uppercase tracking-[2.5px] text-muted">
                  Photo Bundle <span className="text-gold">*</span>
                </span>

                <div className="overflow-hidden rounded border border-white/[0.12] bg-white/[0.035]">
                  {form.imagePreviewUrls.length > 0 ? (
                    <div>
                      <div className="grid grid-cols-3 gap-1 p-2">
                        {form.imagePreviewUrls.slice(0, 6).map(url => (
                          <img
                            key={url}
                            src={url}
                            alt="Gallery upload preview"
                            className="h-24 w-full rounded-sm object-cover"
                          />
                        ))}
                      </div>

                      <div className="flex items-center justify-between gap-3 border-t border-white/[0.08] px-4 py-3">
                        <p className="font-body text-xs text-muted">
                          {form.imageFiles.length} image
                          {form.imageFiles.length === 1 ? '' : 's'} selected
                        </p>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="rounded border border-white/[0.12] px-3 py-2 font-heading text-[9px] font-bold uppercase tracking-[2px] text-white transition-colors hover:border-gold/30 hover:text-gold"
                          >
                            Change
                          </button>
                          <button
                            type="button"
                            onClick={removeImages}
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
                      onClick={() => fileInputRef.current?.click()}
                      className="group flex min-h-[180px] w-full flex-col items-center justify-center px-5 py-8 text-center transition-colors hover:bg-white/[0.055]"
                    >
                      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-gold/25 bg-gold/[0.08] text-2xl text-gold">
                        ↑
                      </span>
                      <span className="font-heading text-sm font-bold uppercase tracking-[2px] text-white">
                        Upload Gallery Images
                      </span>
                      <span className="mt-2 max-w-[260px] font-body text-xs font-light leading-[1.6] text-muted">
                        Select multiple photos. Backend will later upload them
                        to Cloudinary and save URLs.
                      </span>
                    </button>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
              <ToggleCard
                title="Published"
                description="Visible on public gallery."
                checked={form.status === 'published'}
                onChange={checked =>
                  updateForm('status', checked ? 'published' : 'draft')
                }
              />
              <ToggleCard
                title="Featured"
                description="Can be highlighted later."
                checked={form.featured}
                onChange={checked => updateForm('featured', checked)}
              />
            </div>

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
                {editingId ? 'Save Changes' : 'Add Gallery Item'}
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

function galleryToneClass(tone: AdminGalleryItem['coverTone']) {
  const tones: Record<AdminGalleryItem['coverTone'], string> = {
    green:
      'bg-[linear-gradient(145deg,rgba(18,70,36,0.78),rgba(7,9,7,0.86)),repeating-linear-gradient(170deg,transparent,transparent_44px,rgba(52,160,88,0.22)_44px,rgba(52,160,88,0.22)_88px)]',
    gold: 'bg-[linear-gradient(145deg,rgba(90,68,12,0.68),rgba(7,9,7,0.88)),repeating-linear-gradient(170deg,transparent,transparent_44px,rgba(201,168,76,0.2)_44px,rgba(201,168,76,0.2)_88px)]',
    blue: 'bg-[linear-gradient(145deg,rgba(24,42,84,0.7),rgba(7,9,7,0.88)),repeating-linear-gradient(170deg,transparent,transparent_44px,rgba(100,130,200,0.18)_44px,rgba(100,130,200,0.18)_88px)]',
    red: 'bg-[linear-gradient(145deg,rgba(90,30,22,0.7),rgba(7,9,7,0.88)),repeating-linear-gradient(170deg,transparent,transparent_44px,rgba(216,107,95,0.16)_44px,rgba(216,107,95,0.16)_88px)]',
  }

  return tones[tone]
}

export default ManageGallery
