import type { EventStatus } from '../types'

export const SITE_NAME = '互联网记忆'
export const SITE_TAGLINE = '记录互联网上的重要社会事件，保留数字记忆'
export const SITE_DESC = '一个由 AI 辅助维护的社会事件时间线记录站，记录事件的经过、进展、结果，让用户像翻档案一样追溯社会事件。'
export const GITHUB_URL = 'https://github.com/duyue1/828-internet-memory'
export const PAGE_SIZE = 12

export const STATUS_OPTIONS: { value: EventStatus | ''; label: string; icon: string }[] = [
  { value: '', label: '全部', icon: '📋' },
  { value: 'ongoing', label: '进行中', icon: '🔴' },
  { value: 'resolved', label: '已解决', icon: '✅' },
  { value: 'unresolved', label: '悬而未决', icon: '⚪' },
]

export const SORT_OPTIONS = [
  { value: 'date', label: '按时间' },
  { value: 'updated', label: '按更新时间' },
  { value: 'title', label: '按标题' },
] as const

/**
 * 计算事件持续时间文本
 */
export function formatDuration(startDate: string, endDate?: string): string {
  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : new Date()
  const days = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

  if (days < 1) return '1天内'
  if (days < 30) return `已持续 ${days} 天`
  const months = Math.floor(days / 30)
  if (months < 12) return `已持续 ${months} 个月`
  const years = Math.floor(months / 12)
  const remainMonths = months % 12
  return remainMonths > 0 ? `已持续 ${years} 年 ${remainMonths} 个月` : `已持续 ${years} 年`
}

/**
 * 计算距离今天多少天
 */
export function daysAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 30) return `${days} 天前`
  if (days < 365) return `${Math.floor(days / 30)} 个月前`
  return `${Math.floor(days / 365)} 年前`
}

/**
 * 高亮搜索关键词（返回 JSX 安全的 HTML 字符串）
 * 在 React 中使用 dangerouslySetInnerHTML 渲染
 */
export function highlightText(text: string, keyword: string): string {
  if (!keyword.trim()) return text
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'gi')
  return text.replace(regex, '<mark class="search-highlight">$1</mark>')
}
