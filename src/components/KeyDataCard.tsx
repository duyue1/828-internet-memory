import type { Event } from '../types'

/** 关键数据项 */
export interface KeyDataItem {
  label: string
  value: string
  icon: string
  highlight?: boolean
}

/** 从事件中解析关键数据 */
export function extractKeyData(event: Event): KeyDataItem[] {
  const items: KeyDataItem[] = []

  // 通用字段
  if (event.location) {
    items.push({ label: '地点', value: event.location, icon: '📍' })
  }

  // 时间信息
  const startYear = event.startDate.slice(0, 4)
  const endYear = event.endDate?.slice(0, 4)
  if (endYear && endYear !== startYear) {
    items.push({ label: '时间跨度', value: `${startYear}—${endYear}`, icon: '📅' })
  } else {
    items.push({ label: '起始年份', value: startYear, icon: '📅' })
  }

  // 状态标签映射
  const statusMap: Record<string, string> = {
    ongoing: '🔴 进行中',
    resolved: '✅ 已解决',
    unresolved: '⚪ 悬而未决',
  }
  items.push({ label: '当前状态', value: statusMap[event.status] || event.status, icon: '📊' })

  // 热度
  const timelineCount = event.timeline.length
  items.push({ label: '时间线节点', value: `${timelineCount} 条`, icon: '📌' })

  // 相关人物/组织
  if (event.relatedPeople && event.relatedPeople.length > 0) {
    items.push({
      label: '相关人物/组织',
      value: event.relatedPeople.slice(0, 3).join('、') + (event.relatedPeople.length > 3 ? ' 等' : ''),
      icon: '👤',
    })
  }

  // 分类
  items.push({ label: '分类', value: event.category, icon: '📂' })

  // 可信度
  if (event.credibility) {
    const credMap: Record<string, string> = {
      verified: '✅ 已多方验证',
      multi_source: '🔄 多方来源',
      single_source: '⚠️ 单方来源',
      unverified: '❓ 待核实',
    }
    items.push({ label: '信息可信度', value: credMap[event.credibility] || event.credibility, icon: '🔒' })
  }

  return items
}

interface Props {
  event: Event
}

export default function KeyDataCard({ event }: Props) {
  const items = extractKeyData(event)

  if (items.length === 0) return null

  return (
    <div className="mb-8 animate-fade-in-up">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-dark-border to-transparent" />
        <span className="text-xs font-semibold text-gray-400 dark:text-dark-muted tracking-widest flex-shrink-0">关 键 数 据</span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-dark-border to-transparent" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {items.map((item, i) => (
          <div
            key={i}
            className={`
              bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-dark-border
              p-3 shadow-sm hover:shadow-md transition-all duration-200
              ${item.highlight
                ? 'ring-2 ring-primary-200 dark:ring-primary-700 bg-gradient-to-br from-primary-50/50 to-white dark:from-primary-900/10 dark:to-dark-card'
                : ''
              }
            `}
          >
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-dark-muted mb-1">
              <span>{item.icon}</span>
              <span className="truncate">{item.label}</span>
            </div>
            <div className={`text-sm leading-snug ${item.highlight ? 'font-semibold text-primary-600 dark:text-primary-400' : 'font-medium text-gray-700 dark:text-dark-text'}`}>
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
