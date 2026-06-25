import { useState, useEffect, useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Event, FilterParams } from '../types'
import { loadEvents } from '../data/loader'

function filtersFromParams(params: URLSearchParams): Partial<FilterParams> {
  const f: Partial<FilterParams> = {}
  const kw = params.get('q')
  if (kw) f.keyword = kw
  const st = params.get('status')
  if (st === 'ongoing' || st === 'resolved' || st === 'unresolved') f.status = st
  const cat = params.get('category')
  if (cat) f.category = cat
  const sortBy = params.get('sortBy')
  if (sortBy === 'date' || sortBy === 'updated' || sortBy === 'title') f.sortBy = sortBy
  const sortOrder = params.get('order')
  if (sortOrder === 'asc' || sortOrder === 'desc') f.sortOrder = sortOrder
  return f
}

const DEFAULT_FILTERS: FilterParams = {
  keyword: '',
  status: '',
  category: '',
  tags: [],
  sortBy: 'updated',
  sortOrder: 'desc',
}

export function useEvents() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [events, setEvents] = useState<Event[]>([])
  const [allEvents, setAllEvents] = useState<Event[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<FilterParams>(() => ({
    ...DEFAULT_FILTERS,
    ...filtersFromParams(searchParams),
  }))
  const [displayCount, setDisplayCount] = useState(12)

  // 初始数据加载
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    loadEvents()
      .then(data => {
        if (cancelled) return
        setEvents(data.events)
        setAllEvents(data.events)
        setCategories(data.categories)
        setTags(data.tags)
        setLoading(false)
      })
      .catch(err => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : '加载数据失败')
        setLoading(false)
      })

    return () => { cancelled = true }
  }, [])

  // 筛选 + 排序逻辑
  const filteredEvents = useMemo(() => {
    let result = [...events]

    if (filters.keyword.trim()) {
      const kw = filters.keyword.trim().toLowerCase()
      result = result.filter(e =>
        e.title.toLowerCase().includes(kw) ||
        e.summary.toLowerCase().includes(kw) ||
        e.tags.some(t => t.toLowerCase().includes(kw)) ||
        (e.keywords && e.keywords.some(k => k.toLowerCase().includes(kw))) ||
        e.timeline.some(t =>
          t.title.toLowerCase().includes(kw) ||
          t.description.toLowerCase().includes(kw)
        )
      )
    }

    if (filters.status) {
      result = result.filter(e => e.status === filters.status)
    }

    if (filters.category) {
      result = result.filter(e => e.category === filters.category)
    }

    if (filters.tags.length > 0) {
      result = result.filter(e => filters.tags.some(t => e.tags.includes(t)))
    }

    result.sort((a, b) => {
      let cmp = 0
      switch (filters.sortBy) {
        case 'date': cmp = a.startDate.localeCompare(b.startDate); break
        case 'updated': cmp = a.updatedAt.localeCompare(b.updatedAt); break
        case 'title': cmp = a.title.localeCompare(b.title, 'zh-CN'); break
      }
      return filters.sortOrder === 'desc' ? -cmp : cmp
    })

    return result
  }, [events, filters])

  // 同步 URL 参数
  const syncUrl = useCallback((f: FilterParams) => {
    const params = new URLSearchParams()
    if (f.keyword) params.set('q', f.keyword)
    if (f.status) params.set('status', f.status)
    if (f.category) params.set('category', f.category)
    if (f.sortBy !== 'updated') params.set('sortBy', f.sortBy)
    if (f.sortOrder !== 'desc') params.set('order', f.sortOrder)
    const str = params.toString()
    setSearchParams(str, { replace: true })
  }, [setSearchParams])

  const updateFilter = useCallback((partial: Partial<FilterParams>) => {
    setDisplayCount(12)
    setFilters(prev => {
      const next = { ...prev, ...partial }
      syncUrl(next)
      return next
    })
  }, [syncUrl])

  const resetFilters = useCallback(() => {
    setDisplayCount(12)
    setFilters(DEFAULT_FILTERS)
    setSearchParams({}, { replace: true })
  }, [setSearchParams])

  const loadMore = useCallback(() => {
    setDisplayCount(prev => prev + 12)
  }, [])

  const hasMore = displayCount < filteredEvents.length

  return {
    events: filteredEvents.slice(0, displayCount),
    allEvents: filteredEvents,
    totalCount: filteredEvents.length,
    categories,
    tags,
    loading,
    error,
    filters,
    updateFilter,
    resetFilters,
    loadMore,
    hasMore,
  }
}
