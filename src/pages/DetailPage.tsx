import { useState, useEffect, useMemo, useRef } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import type { Event } from '../types'
import { NODE_TYPE_CONFIG } from '../types'
import { getEventById } from '../data/loader'
import StatusBadge from '../components/StatusBadge'
import TimelineNode from '../components/TimelineNode'
import LoadingSpinner from '../components/LoadingSpinner'
import { formatDuration, daysAgo, highlightText } from '../utils/constants'

export default function DetailPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const keyword = searchParams.get('q') || ''
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const scrolled = useRef(false)

  useEffect(() => {
    if (!id) {
      setError('缺少事件 ID')
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)
    scrolled.current = false

    getEventById(id)
      .then(data => {
        if (cancelled) return
        if (!data) setError('未找到该事件')
        else setEvent(data)
        setLoading(false)
      })
      .catch(err => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : '加载失败')
        setLoading(false)
      })

    return () => { cancelled = true }
  }, [id])

  // 锚点跳转：从首页最新进展高亮条点击进来时，滚动到对应节点
  useEffect(() => {
    if (loading || scrolled.current) return
    const hash = window.location.hash
    if (hash) {
      const el = document.querySelector(hash)
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          scrolled.current = true
        }, 300)
      }
    }
  }, [loading])

  const { sortedTimeline, typeCounts } = useMemo(() => {
    if (!event) return { sortedTimeline: [], typeCounts: {} as Record<string, number> }
    const sorted = [...event.timeline].sort((a, b) =>
      a.date.localeCompare(b.date) || (a.sortOrder - b.sortOrder)
    )
    const counts: Record<string, number> = {}
    sorted.forEach(t => { counts[t.type] = (counts[t.type] || 0) + 1 })
    return { sortedTimeline: sorted, typeCounts: counts }
  }, [event])

  if (loading) return <LoadingSpinner text="正在加载事件详情..." variant="skeleton" />

  if (error || !event) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <div className="text-5xl mb-4">📭</div>
        <h2 className="text-lg font-semibold text-gray-700 dark:text-dark-text mb-2">{error || '未找到该事件'}</h2>
        <Link to="/" className="inline-block mt-4 text-sm text-primary-500 hover:text-primary-600 underline">返回首页</Link>
      </div>
    )
  }

  const timeSpan = event.endDate ? `${event.startDate} ~ ${event.endDate}` : `${event.startDate} ~ 至今`
  const duration = formatDuration(event.startDate, event.endDate)

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
      {/* 面包屑 */}
      <nav className="text-xs text-gray-400 dark:text-dark-muted mb-6 flex items-center gap-1.5">
        <Link to="/" className="hover:text-primary-500 transition-colors">首页</Link>
        <svg className="w-3 h-3 text-gray-300 dark:text-dark-muted/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-gray-500 dark:text-dark-muted truncate">{event.title}</span>
      </nav>

      {/* 事件头部 */}
      <section className="mb-8">
        <StatusBadge status={event.status} subLabel={event.subLabel} size="md" />
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-dark-text mt-3 mb-3 leading-snug">
          {keyword ? <span dangerouslySetInnerHTML={{ __html: highlightText(event.title, keyword) }} /> : event.title}
        </h1>
        <p className="text-sm text-gray-600 dark:text-dark-muted leading-relaxed mb-5">
          {keyword ? <span dangerouslySetInnerHTML={{ __html: highlightText(event.summary, keyword) }} /> : event.summary}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-gray-500 dark:text-dark-muted bg-gradient-to-br from-gray-50 to-white dark:from-dark-card dark:to-dark-bg rounded-xl p-3.5 border border-gray-100 dark:border-dark-border">
          <div className="flex items-center gap-1.5"><span>📂</span> {event.category}</div>
          {event.location && <div className="flex items-center gap-1.5"><span>📍</span> {event.location}</div>}
          <div className="flex items-center gap-1.5"><span>📅</span> {timeSpan}</div>
          <div className="flex items-center gap-1.5"><span>⏱️</span> {duration}</div>
          <div className="flex items-center gap-1.5"><span>🕐</span> {daysAgo(event.updatedAt)}更新</div>
          <div className="flex items-center gap-1.5"><span>📌</span> {sortedTimeline.length} 条记录</div>
        </div>

        {event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {event.tags.map(tag => (
              <span key={tag} className="text-[11px] bg-gray-50 dark:bg-dark-border/50 text-gray-400 dark:text-dark-muted px-2 py-0.5 rounded-md border border-gray-100 dark:border-dark-border">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {event.relatedPeople && event.relatedPeople.length > 0 && (
          <div className="mt-3 text-xs text-gray-400 dark:text-dark-muted bg-gray-50 dark:bg-dark-border/30 rounded-lg px-3 py-2 inline-block">
            👤 {event.relatedPeople.join('、')}
          </div>
        )}
      </section>

      {/* 节点类型统计 */}
      {Object.keys(typeCounts).length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {Object.entries(typeCounts).map(([type, count]) => (
            <span key={type} className="text-[11px] bg-gray-50 dark:bg-dark-border/50 px-2.5 py-1 rounded-md border border-gray-100 dark:border-dark-border text-gray-500 dark:text-dark-muted flex items-center gap-1">
              {NODE_TYPE_CONFIG[type as keyof typeof NODE_TYPE_CONFIG]?.icon} {NODE_TYPE_CONFIG[type as keyof typeof NODE_TYPE_CONFIG]?.label} ×{count}
            </span>
          ))}
        </div>
      )}

      {/* 时间线 */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-dark-border to-transparent" />
        <span className="text-xs font-semibold text-gray-400 dark:text-dark-muted tracking-widest flex-shrink-0">时 间 线</span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-dark-border to-transparent" />
      </div>

      {sortedTimeline.length === 0 ? (
        <div className="text-center py-12 text-sm text-gray-400">暂无时间线记录</div>
      ) : (
        <section className="relative pl-0">
          <div className="space-y-0">
            {sortedTimeline.map((entry, i) => (
              <TimelineNode key={entry.id} entry={entry} isLast={i === sortedTimeline.length - 1} index={i} keyword={keyword} />
            ))}
          </div>
        </section>
      )}

      {/* 全部来源列表 */}
      {event.sources && event.sources.length > 0 && (
        <section className="mt-10 pt-6 border-t border-gray-100 dark:border-dark-border/50">
          <h3 className="text-xs font-semibold text-gray-400 dark:text-dark-muted mb-3 tracking-wider flex items-center gap-1.5">
            <span>📚</span> 参考来源（{event.sources.length}）
          </h3>
          <div className="space-y-1.5">
            {event.sources.map((src, i) => (
              <a key={i} href={src.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-xs text-gray-400 dark:text-dark-muted hover:text-primary-600 dark:hover:text-primary-400 bg-gray-50/50 dark:bg-dark-border/30 rounded-lg px-3 py-2 border border-gray-50 dark:border-dark-border hover:border-primary-100 dark:hover:border-primary-700 hover:bg-primary-50/30 dark:hover:bg-primary-900/10 transition-all"
              >
                <span className="text-gray-300 dark:text-dark-muted/50 font-mono w-5 text-right">[{i + 1}]</span>
                <span className="flex-1 truncate">{src.title}</span>
                {src.date && <span className="text-gray-300 dark:text-dark-muted/50 flex-shrink-0">{src.date}</span>}
                <svg className="w-3 h-3 flex-shrink-0 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* 当前状态 */}
      <section className="mt-8 pt-6 border-t border-gray-100 dark:border-dark-border/50">
        <h3 className="text-xs font-semibold text-gray-400 dark:text-dark-muted mb-3 tracking-wider flex items-center gap-1.5">
          <span>📋</span> 当前状态
        </h3>
        <div className="bg-gradient-to-br from-gray-50 to-white dark:from-dark-card dark:to-dark-bg rounded-xl p-4 border border-gray-100 dark:border-dark-border">
          <div className="flex items-center gap-2 mb-2">
            <StatusBadge status={event.status} subLabel={event.subLabel} size="sm" />
            <span className="text-xs text-gray-400 dark:text-dark-muted">{timeSpan} · {duration}</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-dark-muted leading-relaxed">
            {event.status === 'resolved' ? '该事件已有明确结果，时间线已完整收录。'
              : event.status === 'ongoing' ? '该事件仍在发展中，将持续关注并更新时间线。'
              : '该事件已超过 90 天无更新，暂无明确结论。'}
            {' '}共收录 {sortedTimeline.length} 条时间线记录。
          </p>
        </div>
      </section>

      {/* 可信度 */}
      {event.credibility && (
        <section className="mt-3">
          <span className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md ring-1 ${
            event.credibility === 'verified' ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 ring-green-200/50 dark:ring-green-800/30' : ''
          }${
            event.credibility === 'multi_source' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 ring-blue-200/50 dark:ring-blue-800/30' : ''
          }${
            event.credibility === 'single_source' ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 ring-amber-200/50 dark:ring-amber-800/30' : ''
          }${
            event.credibility === 'unverified' ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 ring-red-200/50 dark:ring-red-800/30' : ''
          }`}>
            {event.credibility === 'verified' && '✅ 已验证'}
            {event.credibility === 'multi_source' && '🔄 多方来源'}
            {event.credibility === 'single_source' && '⚠️ 单方来源'}
            {event.credibility === 'unverified' && '❓ 待核实'}
          </span>
        </section>
      )}

      {/* 相关事件 */}
      {event.relatedEventIds && event.relatedEventIds.length > 0 && (
        <section className="mt-8 pt-6 border-t border-gray-100 dark:border-dark-border/50">
          <h3 className="text-xs font-semibold text-gray-400 dark:text-dark-muted mb-3 tracking-wider">🔗 相关事件</h3>
          <div className="flex flex-wrap gap-2">
            {event.relatedEventIds.map(rid => (
              <Link key={rid} to={`/event/${rid}`}
                className="text-xs text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2.5 py-1.5 rounded-lg border border-primary-100 dark:border-primary-800/30 hover:bg-primary-100/50 dark:hover:bg-primary-800/20 transition-all"
              >
                #{rid}
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-10 text-center">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-gray-400 dark:text-dark-muted hover:text-primary-500 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          返回事件列表
        </Link>
      </div>
    </div>
  )
}
