import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent, ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import newsApi from '../news/api/news.api'
import type { NewsCategory } from '../news/types/news.types'
import {
  adminNewsInputClass,
  adminNewsTextareaClass,
  categoryBadgeClass,
  categoryLabel,
  EMPTY_NEWS_FORM,
  NEWS_LAYOUT_OPTIONS,
  NEWS_CATEGORY_OPTIONS,
  NEWS_FILTERS,
  statusBadgeClass,
  type AdminNewsArticle,
  type AdminNewsStatus,
  type NewsFilter,
  type NewsFormState,
} from './constants/adminNews.constants'
import { adminNewsQuery, queryKeys } from '../../lib/queryOptions'

function ManageNews() {
  const queryClient = useQueryClient()
  const [articles, setArticles] = useState<AdminNewsArticle[]>([])
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<NewsFilter>('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<NewsFormState>(EMPTY_NEWS_FORM)
  const [formError, setFormError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [searchParams, setSearchParams] = useSearchParams()

  const imageInputRef = useRef<HTMLInputElement | null>(null)
  const formPanelRef = useRef<HTMLElement | null>(null)
  const titleInputRef = useRef<HTMLInputElement | null>(null)

  const filteredArticles = useMemo(() => {
    const searchValue = search.trim().toLowerCase()

    return articles.filter(article => {
      const articleText = [
        article.title,
        article.excerpt,
        article.category,
        article.status,
      ]
        .join(' ')
        .toLowerCase()

      const matchesSearch = articleText.includes(searchValue)
      const matchesFilter =
        activeFilter === 'all' || article.category === activeFilter

      return matchesSearch && matchesFilter
    })
  }, [articles, search, activeFilter])

  const stats = useMemo(() => {
    return {
      total: articles.length,
      published: articles.filter(article => article.status === 'published')
        .length,
      drafts: articles.filter(article => article.status === 'draft').length,
      reports: articles.filter(article => article.category === 'match-report')
        .length,
    }
  }, [articles])

  const updateForm = (
    field: keyof NewsFormState,
    value: string | File | null
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
      featuredImageFile: file,
      featuredImagePreviewUrl: previewUrl,
    }))

    setFormError('')
  }

  const removeImage = () => {
    setForm(current => ({
      ...current,
      featuredImageFile: null,
      featuredImagePreviewUrl: '',
    }))

    if (imageInputRef.current) {
      imageInputRef.current.value = ''
    }
  }

  const resetForm = () => {
    setForm(EMPTY_NEWS_FORM)
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
      titleInputRef.current?.focus()
    }, 350)
  }

  const loadArticles = useCallback(() => {
    setIsLoading(true)

    queryClient
      .fetchQuery(adminNewsQuery)
      .then(data => {
        setArticles(data as AdminNewsArticle[])
        setFormError('')
      })
      .catch(() => {
        setFormError('Could not load news articles.')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [queryClient])

  useEffect(() => {
    const timeoutId = window.setTimeout(loadArticles, 0)

    return () => window.clearTimeout(timeoutId)
  }, [loadArticles])

  useEffect(() => {
    if (searchParams.get('action') !== 'create') return

    const timeoutId = window.setTimeout(() => {
      setForm(EMPTY_NEWS_FORM)
      setEditingId(null)
      setFormError('')

      if (imageInputRef.current) {
        imageInputRef.current.value = ''
      }

      formPanelRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })

      window.setTimeout(() => {
        titleInputRef.current?.focus()
      }, 350)

      setSearchParams({}, { replace: true })
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [searchParams, setSearchParams])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!form.title.trim()) {
      setFormError('Article title is required')
      return
    }

    if (!form.excerpt.trim()) {
      setFormError('Article excerpt is required')
      return
    }

    if (!form.content.trim()) {
      setFormError('Article content is required')
      return
    }

    const featuredImage = form.featuredImagePreviewUrl.trim()

    const payload = {
      title: form.title.trim(),
      excerpt: form.excerpt.trim(),
      content: form.content.trim(),
      category: form.category,
      layout: form.layout,
      author: form.author.trim() || "Top G's CC",
      featuredImage: /^https?:\/\//i.test(featuredImage) ? featuredImage : '',
      status: form.status,
    }

    try {
      setIsSaving(true)

      const savedArticle = editingId
        ? await newsApi.updateAdmin(editingId, payload)
        : await newsApi.createAdmin(payload)

      setArticles(current =>
        editingId
          ? current.map(article =>
              article.id === savedArticle.id
                ? (savedArticle as AdminNewsArticle)
                : article
            )
          : [savedArticle as AdminNewsArticle, ...current]
      )
      void queryClient.invalidateQueries({ queryKey: queryKeys.adminNews })
      void queryClient.invalidateQueries({ queryKey: queryKeys.news })

      resetForm()
    } catch {
      setFormError('Something went wrong while saving this article.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (article: AdminNewsArticle) => {
    setEditingId(article.id)

    setForm({
      title: article.title,
      category: article.category,
      layout: article.layout,
      excerpt: article.excerpt,
      content: article.content,
      featuredImageFile: null,
      featuredImagePreviewUrl: article.featuredImage ?? '',
      author: article.author,
      status: article.status,
    })

    setFormError('')

    if (imageInputRef.current) {
      imageInputRef.current.value = ''
    }

    focusForm()
  }

  const handleDelete = async (articleId: string) => {
    try {
      await newsApi.deleteAdmin(articleId)
      setArticles(current =>
        current.filter(article => article.id !== articleId)
      )
      void queryClient.invalidateQueries({ queryKey: queryKeys.adminNews })
      void queryClient.invalidateQueries({ queryKey: queryKeys.news })

      if (editingId === articleId) {
        resetForm()
      }
    } catch {
      setFormError('Something went wrong while deleting this article.')
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
              Club Publishing
            </div>

            <h2 className="font-display text-[38px] leading-none tracking-[1px] text-white sm:text-[48px]">
              Manage News.
            </h2>

            <p className="mt-4 max-w-[620px] font-body text-sm font-light leading-[1.8] text-muted">
              Create match reports, announcements and club stories. Image upload
              is UI-only for now and will connect to Cloudinary later.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 min-[520px]:grid-cols-4 min-[901px]:w-[520px]">
            <StatCard label="Articles" value={stats.total} />
            <StatCard label="Published" value={stats.published} />
            <StatCard label="Drafts" value={stats.drafts} />
            <StatCard label="Reports" value={stats.reports} />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 sm:gap-6 min-[1180px]:grid-cols-[minmax(0,1fr)_430px]">
        <section className="overflow-hidden rounded border border-white/[0.1] bg-[#161616]">
          <div className="border-b border-white/[0.10] p-5 sm:p-6">
            <div className="flex flex-col gap-4 min-[901px]:flex-row min-[901px]:items-center min-[901px]:justify-between">
              <div>
                <p className="font-heading text-[10px] font-bold uppercase tracking-[3px] text-gold">
                  Article List
                </p>

                <h3 className="mt-1 font-display text-2xl tracking-[1px] text-white">
                  {isLoading
                    ? 'Loading Articles'
                    : `${filteredArticles.length} Articles`}
                </h3>
              </div>

              <div className="flex flex-col gap-3 min-[641px]:flex-row">
                <input
                  type="search"
                  value={search}
                  placeholder="Search title, category..."
                  onChange={event => setSearch(event.target.value)}
                  className="h-11 rounded border border-white/[0.12] bg-white/[0.045] px-4 font-heading text-sm font-semibold tracking-[0.5px] text-white outline-none placeholder:text-muted focus:border-gold/40 min-[641px]:w-[280px]"
                />

                <div className="flex overflow-x-auto rounded border border-white/[0.12] bg-white/[0.035] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {NEWS_FILTERS.map(filter => {
                    const isActive = activeFilter === filter.value

                    return (
                      <button
                        key={filter.value}
                        type="button"
                        onClick={() => setActiveFilter(filter.value)}
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
                  <TableHead>Article</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </tr>
              </thead>

              <tbody>
                {filteredArticles.map(article => (
                  <tr
                    key={article.id}
                    className="border-b border-white/[0.09] transition-colors last:border-b-0 hover:bg-white/[0.055]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-4">
                        <ArticleThumb article={article} />

                        <div className="min-w-0">
                          <h4 className="line-clamp-1 font-heading text-sm font-bold text-white">
                            {article.title}
                          </h4>

                          <p className="mt-1 line-clamp-2 font-body text-xs font-light leading-[1.6] text-muted">
                            {article.excerpt}
                          </p>

                          <p className="mt-2 font-heading text-[9px] font-bold uppercase tracking-[2px] text-muted">
                            {article.readTime}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <CategoryBadge category={article.category} />
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={article.status} />
                    </td>

                    <td className="px-5 py-4 font-heading text-xs font-bold uppercase tracking-[1.5px] text-muted">
                      {formatDate(article.updatedAt)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(article)}
                          className="rounded border border-white/[0.08] px-3 py-2 font-heading text-[10px] font-bold uppercase tracking-[2px] text-muted transition-colors hover:border-gold/30 hover:text-gold"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(article.id)}
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
            {filteredArticles.map(article => (
              <article key={article.id} className="bg-[#161616] p-5">
                <div className="mb-4">
                  <ArticleThumb article={article} mobile />

                  <div className="mt-4 flex flex-wrap gap-2">
                    <CategoryBadge category={article.category} />
                    <StatusBadge status={article.status} />
                  </div>

                  <h4 className="mt-4 font-heading text-base font-bold leading-[1.35] text-white">
                    {article.title}
                  </h4>

                  <p className="mt-2 font-body text-xs font-light leading-[1.7] text-muted">
                    {article.excerpt}
                  </p>
                </div>

                <div className="grid grid-cols-3 border-y border-white/[0.10] py-4 text-center">
                  <MiniStat label="Author" value={article.author} />
                  <MiniStat label="Read" value={article.readTime} />
                  <MiniStat
                    label="Date"
                    value={formatShortDate(article.updatedAt)}
                  />
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(article)}
                    className="flex-1 rounded border border-white/[0.08] px-3 py-2.5 font-heading text-[10px] font-bold uppercase tracking-[2px] text-muted transition-colors hover:border-gold/30 hover:text-gold"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(article.id)}
                    className="flex-1 rounded border border-[#d86b5f]/20 px-3 py-2.5 font-heading text-[10px] font-bold uppercase tracking-[2px] text-[#ff9b8f] transition-colors hover:bg-[#d86b5f]/10"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="p-10 text-center">
              <p className="font-display text-2xl tracking-[1px] text-white">
                No articles found.
              </p>

              <p className="mt-2 font-body text-sm font-light text-muted">
                Try changing the search or category filter.
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
              {editingId ? 'Edit Article' : 'Create Article'}
            </p>

            <h3 className="mt-1 font-display text-2xl tracking-[1px] text-white">
              {editingId ? 'Update Story' : 'Write News'}
            </h3>

            <p className="mt-2 font-body text-xs font-light leading-[1.7] text-muted">
              Save real club news to the backend. Paste an image URL for now;
              Cloudinary upload can replace this later.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AdminField label="Title" required>
              <input
                ref={titleInputRef}
                type="text"
                value={form.title}
                placeholder="e.g. Season 2026 Registrations Are Open"
                onChange={event => updateForm('title', event.target.value)}
                className={adminNewsInputClass}
              />
            </AdminField>

            <div className="grid grid-cols-1 gap-3 min-[520px]:grid-cols-2">
              <AdminField label="Category">
                <select
                  value={form.category}
                  onChange={event =>
                    updateForm('category', event.target.value as NewsCategory)
                  }
                  className={adminNewsInputClass}
                >
                  {NEWS_CATEGORY_OPTIONS.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </AdminField>

              <AdminField label="Status">
                <select
                  value={form.status}
                  onChange={event =>
                    updateForm('status', event.target.value as AdminNewsStatus)
                  }
                  className={adminNewsInputClass}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </AdminField>
            </div>

            <div className="grid grid-cols-1 gap-3 min-[520px]:grid-cols-2">
              <AdminField label="Layout">
                <select
                  value={form.layout}
                  onChange={event => updateForm('layout', event.target.value)}
                  className={adminNewsInputClass}
                >
                  {NEWS_LAYOUT_OPTIONS.map(layout => (
                    <option key={layout.value} value={layout.value}>
                      {layout.label}
                    </option>
                  ))}
                </select>
              </AdminField>

              <AdminField label="Author">
                <input
                  type="text"
                  value={form.author}
                  placeholder="Top G's CC"
                  onChange={event => updateForm('author', event.target.value)}
                  className={adminNewsInputClass}
                />
              </AdminField>
            </div>

            <AdminField label="Featured Image URL">
              <input
                type="url"
                value={
                  /^https?:\/\//i.test(form.featuredImagePreviewUrl)
                    ? form.featuredImagePreviewUrl
                    : ''
                }
                placeholder="https://res.cloudinary.com/..."
                onChange={event =>
                  updateForm('featuredImagePreviewUrl', event.target.value)
                }
                className={adminNewsInputClass}
              />
            </AdminField>

            <AdminField label="Excerpt" required>
              <textarea
                value={form.excerpt}
                placeholder="Short summary shown on cards..."
                onChange={event => updateForm('excerpt', event.target.value)}
                className={`${adminNewsTextareaClass} min-h-[96px]`}
              />
            </AdminField>

            <AdminField label="Content" required>
              <textarea
                value={form.content}
                placeholder="Write the full article content..."
                onChange={event => updateForm('content', event.target.value)}
                className={`${adminNewsTextareaClass} min-h-[180px]`}
              />
            </AdminField>

            <div>
              <span className="mb-2 block font-heading text-[10px] font-bold uppercase tracking-[2.5px] text-muted">
                Featured Image
              </span>

              <div className="overflow-hidden rounded border border-white/[0.12] bg-white/[0.035]">
                {form.featuredImagePreviewUrl ? (
                  <div className="relative">
                    <img
                      src={form.featuredImagePreviewUrl}
                      alt="Article preview"
                      className="h-52 w-full object-cover"
                    />

                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-black/70 px-4 py-3 backdrop-blur-sm">
                      <div className="min-w-0">
                        <p className="truncate font-heading text-xs font-bold text-white">
                          {form.featuredImageFile?.name ??
                            'Current featured image'}
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
                      Upload Featured Image
                    </span>

                    <span className="mt-2 max-w-[260px] font-body text-xs font-light leading-[1.6] text-muted">
                      Choose JPG, PNG or WebP. Later this will upload to
                      Cloudinary through backend.
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

            {formError && (
              <div className="rounded border border-[#d86b5f]/25 bg-[#d86b5f]/[0.08] px-4 py-3 font-body text-xs text-[#ff9b8f]">
                {formError}
              </div>
            )}

            <div className="flex flex-col gap-3 min-[420px]:flex-row">
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 rounded bg-gold px-5 py-3.5 font-heading text-[11px] font-bold uppercase tracking-[2.5px] text-black transition-colors hover:bg-gold/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving
                  ? 'Saving...'
                  : editingId
                    ? 'Save Changes'
                    : 'Create Article'}
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

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-AU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatShortDate(date: string) {
  return new Date(date).toLocaleDateString('en-AU', {
    day: '2-digit',
    month: 'short',
  })
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

interface CategoryBadgeProps {
  category: NewsCategory
}

function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <span
      className={`inline-flex rounded border px-2.5 py-1.5 font-heading text-[9px] font-bold uppercase tracking-[2px] ${categoryBadgeClass[category]}`}
    >
      {categoryLabel[category]}
    </span>
  )
}

interface StatusBadgeProps {
  status: AdminNewsStatus
}

function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded border px-2.5 py-1.5 font-heading text-[9px] font-bold uppercase tracking-[2px] ${statusBadgeClass[status]}`}
    >
      {status}
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
      <div className="truncate px-1 font-display text-base leading-none text-white">
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

interface ArticleThumbProps {
  article: AdminNewsArticle
  mobile?: boolean
}

function ArticleThumb({ article, mobile = false }: ArticleThumbProps) {
  if (article.featuredImage) {
    return (
      <img
        src={article.featuredImage}
        alt={article.title}
        className={
          mobile
            ? 'h-44 w-full rounded border border-white/[0.12] object-cover'
            : 'h-16 w-24 shrink-0 rounded border border-white/[0.12] object-cover'
        }
      />
    )
  }

  return (
    <div
      className={
        mobile
          ? 'flex h-44 w-full items-center justify-center rounded border border-white/[0.12] bg-gold/[0.06] font-heading text-[10px] font-bold uppercase tracking-[2px] text-gold'
          : 'flex h-16 w-24 shrink-0 items-center justify-center rounded border border-white/[0.12] bg-gold/[0.06] font-heading text-[9px] font-bold uppercase tracking-[2px] text-gold'
      }
    >
      {categoryLabel[article.category]}
    </div>
  )
}

export default ManageNews
