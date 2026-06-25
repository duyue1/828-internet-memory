import type { TimelineEntry } from '../types'
import { NODE_TYPE_CONFIG, SOURCE_LABEL_CONFIG } from '../types'

interface Props {
  entry: TimelineEntry
  isLast: boolean
  index: number
  keyword?: string
}

const TYPE_BG: Record<string, string> = {
  trigger: 'bg-gradient-to-br from-red-100 to-red-50 shadow-red-200/30 dark:from-red-900/30 dark:to-red-800/20 dark:shadow-red-900/20',
  progress: 'bg-gradient-to-br from-blue-100 to-blue-50 shadow-blue-200/30 dark:from-blue-900/30 dark:to-blue-800/20 dark:shadow-blue-900/20',
  turn: 'bg-gradient-to-br from-amber-100 to-amber-50 shadow-amber-200/30 dark:from-amber-900/30 dark:to-amber-800/20 dark:shadow-amber-900/20',
  result: 'bg-gradient-to-br from-green-100 to-green-50 shadow-green-200/30 dark:from-green-900/30 dark:to-green-800/20 dark:shadow-green-900/20',
}

const TYPE_TAG: Record<string, string> = {
  trigger: 'bg-red-50 text-red-600 ring-red-200/50 dark:bg-red-900/30 dark:text-red-300 dark:ring-red-800/30',
  progress: 'bg-blue-50 text-blue-600 ring-blue-200/50 dark:bg-blue-900/30 dark:text-blue-300 dark:ring-blue-800/30',
  turn: 'bg-amber-50 text-amber-700 ring-amber-200/50 dark:bg-amber-900/30 dark:text-amber-300 dark:ring-amber-800/30',
  result: 'bg-green-50 text-green-600 ring-green-200/50 dark:bg-green-900/30 dark:text-green-300 dark:ring-green-800/30',
}

/** 高亮搜索关键词 */
function highlightText(text: string, keyword: string) {
  if (!keyword.trim()) return text
  const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  return parts.map((part, i) =>
    regex.test(part)
      ? `<mark class="search-highlight">${part}</mark>`
      : part
  ).join('')
}

export default function TimelineNode({ entry, isLast, index, keyword = '' }: Props) {
  const typeCfg = NODE_TYPE_CONFIG[entry.type]
  const sourceCfg = SOURCE_LABEL_CONFIG[entry.sourceLabel]
  const anchorId = `tl-${entry.id}`

  return (
    <div
      id={anchorId}
      className="relative flex gap-3 sm:gap-4 pb-6 sm:pb-8 animate-fade-in-up scroll-mt-20"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex flex-col items-center flex-shrink-0">
        <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-sm shadow-sm ring-2 ring-white dark:ring-dark-card ${TYPE_BG[entry.type]}`}>
          {typeCfg.icon}
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-gradient-to-b from-gray-200 dark:from-dark-border via-gray-100 dark:via-dark-border/50 to-transparent mt-1.5" />}
      </div>

      <div className="flex-1 min-w-0 pb-1">
        <div className="flex items-center gap-2 mb-2">
          <time className="text-[11px] text-gray-400 dark:text-dark-muted font-mono tracking-wide">
            {entry.date}{entry.time ? ` ${entry.time}` : ''}
          </time>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ring-1 ${TYPE_TAG[entry.type]}`}>
            {typeCfg.label}
          </span>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-dark-border p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-200 dark:hover:border-gray-600">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-dark-text mb-2 leading-snug">
            {keyword ? <span dangerouslySetInnerHTML={{ __html: highlightText(entry.title, keyword) }} /> : entry.title}
          </h4>

          <p className="text-xs sm:text-sm text-gray-600 dark:text-dark-muted leading-relaxed whitespace-pre-line">
            {keyword ? <span dangerouslySetInnerHTML={{ __html: highlightText(entry.description, keyword) }} /> : entry.description}
          </p>

          <div className="mt-3 pt-3 border-t border-gray-50 dark:border-dark-border/50">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-50 dark:bg-dark-border/50 text-gray-500 dark:text-dark-muted ring-1 ring-gray-100 dark:ring-dark-border">
                {sourceCfg.icon} {sourceCfg.label}
              </span>
              {entry.mediaName && <span className="text-gray-400 dark:text-dark-muted">｜{entry.mediaName}</span>}
              <a
                href={entry.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 hover:underline ml-auto text-[11px] truncate max-w-[160px] sm:max-w-[240px]"
              >
                <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span className="truncate">{entry.sourceUrl.replace(/^https?:\/\//, '').split('/')[0]}</span>
              </a>
            </div>
            <div className="mt-1.5 flex items-center gap-1">
              {[...Array(sourceCfg.trust)].map((_, i) => <span key={i} className="text-[10px]">⭐</span>)}
              <span className="text-[10px] text-gray-300 dark:text-dark-muted/50 ml-0.5">信源可信度</span>
            </div>
          </div>

          {entry.author && (
            <div className="mt-1 text-[10px] text-gray-300 dark:text-dark-muted/50 flex items-center gap-1">
              <span>✍️</span> 录入：{entry.author}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
