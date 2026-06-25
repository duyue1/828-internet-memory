import { Link } from 'react-router-dom'
import type { Event } from '../types'
import StatusBadge from './StatusBadge'
import { formatDuration, daysAgo, highlightText } from '../utils/constants'

interface Props {
  event: Event
  index?: number
  keyword?: string
}

export default function EventCard({ event, index = 0, keyword = '' }: Props) {
  const timeline = event.timeline
  const lastEntry = timeline[timeline.length - 1]
  const timeSpan = event.endDate
    ? `${event.startDate} ~ ${event.endDate}`
    : `${event.startDate} ~ 至今`

  const duration = formatDuration(event.startDate, event.endDate)
  const lastUpdateDays = daysAgo(event.updatedAt)
  const isStale = lastUpdateDays.includes('个月') || lastUpdateDays.includes('年前')

  // 跳到详情页的最新节点锚点
  const anchorId = lastEntry ? `tl-${lastEntry.id}` : undefined

  const highlightConfig = (() => {
    if (event.status === 'resolved') {
      return {
        bg: 'bg-gradient-to-r from-green-50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/10',
        border: 'border-green-100 dark:border-green-800/30',
        dot: 'bg-green-500 dark:bg-green-400',
        icon: '✅',
        text: 'text-green-700 dark:text-green-300',
      }
    }
    if (isStale) {
      return {
        bg: 'bg-gray-50 dark:bg-gray-800/30',
        border: 'border-gray-100 dark:border-gray-700/30',
        dot: 'bg-gray-400 dark:bg-gray-500',
        icon: '⏸️',
        text: 'text-gray-500 dark:text-gray-400',
      }
    }
    return {
      bg: 'bg-gradient-to-r from-amber-50 to-yellow-50/50 dark:from-amber-900/20 dark:to-yellow-900/10',
      border: 'border-amber-100 dark:border-amber-800/30',
      dot: 'bg-amber-500 dark:bg-amber-400',
      icon: '💡',
      text: 'text-amber-800 dark:text-amber-300',
    }
  })()

  return (
    <Link
      to={`/event/${event.id}${anchorId ? `#${anchorId}` : ''}`}
      className={`
        block bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-dark-border
        shadow-sm hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-700
        transition-all duration-300 hover:-translate-y-0.5
        overflow-hidden group animate-fade-in-up
      `}
      style={{ animationDelay: `${(index % 12) * 50}ms` }}
    >
      {/* 最新进展高亮条 */}
      {lastEntry && (
        <div className={`px-4 py-2.5 text-xs leading-relaxed border-b ${highlightConfig.bg} ${highlightConfig.border}`}>
          <div className="flex items-start gap-1.5">
            <span className="mt-0.5 flex-shrink-0">{highlightConfig.icon}</span>
            <div className="min-w-0">
              <span className={`font-medium ${highlightConfig.text}`}>
                {event.status === 'resolved' ? '最终结果：' : '最新进展：'}
              </span>
              <span className={`${highlightConfig.text} opacity-85`}>
                {lastEntry.description.slice(0, 70)}{lastEntry.description.length > 70 ? '...' : ''}
              </span>
              <span className="ml-1.5 text-gray-400 dark:text-dark-muted whitespace-nowrap">· {lastUpdateDays}</span>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 pt-3.5">
        <div className="flex items-center gap-1.5 mb-2.5 flex-wrap">
          <StatusBadge status={event.status} subLabel={event.subLabel} size="sm" />
          <span className="text-[11px] text-gray-400 dark:text-dark-muted bg-gray-50 dark:bg-dark-border/50 px-2 py-0.5 rounded-md border border-gray-50 dark:border-dark-border">
            {event.category}
          </span>
          {event.location && (
            <span className="text-[11px] text-gray-400 dark:text-dark-muted truncate max-w-[100px]">
              📍 {event.location.split('·')[0] || event.location}
            </span>
          )}
        </div>

        <h3 className="text-[15px] font-semibold text-gray-900 dark:text-dark-text group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-1.5 leading-snug line-clamp-2">
          {keyword ? highlightText(event.title, keyword) : event.title}
        </h3>

        <p className="text-xs text-gray-500 dark:text-dark-muted leading-relaxed mb-3 line-clamp-2">
          {keyword ? highlightText(event.summary, keyword) : event.summary}
        </p>

        {event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {event.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-[10px] bg-gray-50 dark:bg-dark-border/50 text-gray-400 dark:text-dark-muted px-1.5 py-0.5 rounded border border-gray-50 dark:border-dark-border">
                #{tag}
              </span>
            ))}
            {event.tags.length > 3 && <span className="text-[10px] text-gray-300 dark:text-dark-muted/50">+{event.tags.length - 3}</span>}
          </div>
        )}

        <div className="flex items-center justify-between text-[11px] text-gray-400 dark:text-dark-muted border-t border-gray-50 dark:border-dark-border/50 pt-2.5 mt-1">
          <span className="truncate">📅 {timeSpan}</span>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span>{duration}</span>
            <span className="text-gray-200 dark:text-dark-border">·</span>
            <span>{event.updatesCount || timeline.length} 条</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

/* 骨架屏 */
export function EventCardSkeleton() {
  return (
    <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-dark-border overflow-hidden">
      <div className="skeleton h-9 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <div className="flex gap-2"><div className="skeleton-badge" /><div className="skeleton h-4 w-12 rounded-full" /></div>
        <div className="skeleton-title" />
        <div className="skeleton-text w-full" /><div className="skeleton-text w-4/5" />
        <div className="flex gap-1.5"><div className="skeleton h-4 w-14 rounded-full" /><div className="skeleton h-4 w-16 rounded-full" /></div>
        <div className="flex justify-between pt-2 border-t border-gray-50 dark:border-dark-border"><div className="skeleton h-3 w-28" /><div className="skeleton h-3 w-16" /></div>
      </div>
    </div>
  )
}
