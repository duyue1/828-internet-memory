/* ===== 事件状态（三级主标签） ===== */
export type EventStatus = 'ongoing' | 'resolved' | 'unresolved'

export const STATUS_LABELS: Record<EventStatus, string> = {
  ongoing: '进行中',
  resolved: '已解决',
  unresolved: '悬而未决',
}

export const STATUS_COLORS: Record<EventStatus, { bg: string; text: string; border: string; icon: string }> = {
  ongoing: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-300', icon: '🔴' },
  resolved: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-300', icon: '✅' },
  unresolved: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300', icon: '⚪' },
}

/** 辅助标签 */
export type SubLabel = 'watching' | 'partial_resolved' | null

export const SUB_LABEL_MAP: Record<string, string> = {
  watching: '持续关注中',
  partial_resolved: '阶段性解决',
}

/* ===== 节点类型 ===== */
export type NodeType = 'trigger' | 'progress' | 'turn' | 'result'

export const NODE_TYPE_CONFIG: Record<NodeType, { icon: string; label: string }> = {
  trigger: { icon: '🔴', label: '事发' },
  progress: { icon: '🔄', label: '进展' },
  turn: { icon: '⚡', label: '转折' },
  result: { icon: '✅', label: '结果' },
}

/* ===== 来源标注类型 ===== */
export type SourceLabel = 'official' | 'media' | 'party'

export const SOURCE_LABEL_CONFIG: Record<SourceLabel, { icon: string; label: string; trust: number }> = {
  official: { icon: '📜', label: '官方通报', trust: 3 },
  media: { icon: '📰', label: '媒体报道', trust: 2 },
  party: { icon: '🗣️', label: '当事人透露', trust: 1 },
}

/* ===== 时间线条目（对应 PRD TimelineNode） ===== */
export interface TimelineEntry {
  id: string
  date: string           // "YYYY-MM-DD"
  time?: string          // optional "HH:mm"
  type: NodeType
  title: string          // ≤30字
  description: string    // ≤500字
  sourceUrl: string
  sourceLabel: SourceLabel
  mediaName?: string     // 来源媒体名称 e.g. "新华社"
  author?: string        // 录入人
  sortOrder: number
  aiGenerated?: boolean
}

/* ===== 来源对象 ===== */
export interface Source {
  title: string
  url: string
  date?: string
}

/* ===== 事件 ===== */
export interface Event {
  id: string
  title: string
  summary: string
  status: EventStatus
  subLabel?: SubLabel
  category: string
  tags: string[]
  keywords?: string[]        // AI 搜索关键词
  startDate: string           // "YYYY-MM-DD"
  endDate?: string            // null 表示未完结
  location?: string
  relatedPeople?: string[]
  sources: Source[]           // 事件整体参考来源
  timeline: TimelineEntry[]
  updatesCount: number
  credibility?: 'verified' | 'multi_source' | 'single_source' | 'unverified'
  aiGenerated?: boolean
  createdAt: string
  updatedAt: string
  relatedEventIds?: string[]
}

/* ===== 筛选参数 ===== */
export interface FilterParams {
  keyword: string
  status: EventStatus | ''
  category: string
  tags: string[]
  sortBy: 'date' | 'updated' | 'title'
  sortOrder: 'asc' | 'desc'
}

/* ===== 应用数据 ===== */
export interface AppData {
  events: Event[]
  categories: string[]
  tags: string[]
  lastUpdated: string
  version: string
}
