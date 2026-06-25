import { useState } from 'react'
import type { FilterParams } from '../types'
import { STATUS_OPTIONS, SORT_OPTIONS } from '../utils/constants'

interface Props {
  filters: FilterParams
  categories: string[]
  tags: string[]
  onFilterChange: (partial: Partial<FilterParams>) => void
  onReset: () => void
  resultCount: number
}

export default function FilterPanel({
  filters,
  categories,
  tags,
  onFilterChange,
  onReset,
  resultCount,
}: Props) {
  const [showTags, setShowTags] = useState(false)
  const hasActiveFilters = filters.status || filters.category || filters.tags.length > 0
  const hasFilters = filters.status || filters.category || filters.tags.length > 0 || filters.keyword

  const btnBase = (active: boolean) =>
    `px-2.5 py-1.5 text-xs rounded-lg border transition-all whitespace-nowrap ${
      active
        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 border-primary-200 dark:border-primary-700 font-medium shadow-sm'
        : 'bg-white dark:bg-dark-card text-gray-500 dark:text-dark-muted border-gray-100 dark:border-dark-border hover:border-gray-200 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-dark-border/50'
    }`

  return (
    <div className="bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-dark-border shadow-sm">
      <div className="p-3.5 space-y-3">
        {/* 第一行：状态 Tab */}
        <div className="flex flex-wrap gap-1">
          {STATUS_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => onFilterChange({ status: opt.value as FilterParams['status'] })}
              className={btnBase(filters.status === opt.value || (!filters.status && !opt.value))}
            >
              <span>{opt.icon}</span> {opt.label}
            </button>
          ))}
        </div>

        {/* 第二行：分类按钮组 + 排序 */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => onFilterChange({ category: '' })}
              className={btnBase(!filters.category)}
            >
              全部分类
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => onFilterChange({ category: filters.category === cat ? '' : cat })}
                className={btnBase(filters.category === cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:ml-auto">
            <select
              value={filters.sortBy}
              onChange={e => onFilterChange({ sortBy: e.target.value as FilterParams['sortBy'] })}
              className="text-xs border border-gray-200 dark:border-dark-border rounded-lg px-2.5 py-1.5 bg-white dark:bg-dark-card text-gray-600 dark:text-dark-muted focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-800/30 focus:border-primary-300 dark:focus:border-primary-600 focus:outline-none transition-colors"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <button
              onClick={() => onFilterChange({ sortOrder: filters.sortOrder === 'desc' ? 'asc' : 'desc' })}
              className="px-2.5 py-1.5 text-xs border border-gray-200 dark:border-dark-border rounded-lg hover:bg-gray-50 dark:hover:bg-dark-border/50 text-gray-500 dark:text-dark-muted transition-colors"
            >
              {filters.sortOrder === 'desc' ? '↓ 最新' : '↑ 最早'}
            </button>
          </div>
        </div>

        {/* 标签展开区 */}
        {tags.length > 0 && (
          <div>
            <button
              onClick={() => setShowTags(!showTags)}
              className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-dark-muted hover:text-gray-600 dark:hover:text-dark-text transition-colors"
            >
              {showTags ? '收起' : '展开'}标签筛选
              <svg className={`w-3 h-3 transition-transform ${showTags ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              {filters.tags.length > 0 && <span className="ml-1 text-primary-500">（{filters.tags.length}）</span>}
            </button>
            {showTags && (
              <div className="flex flex-wrap gap-1.5 mt-2 animate-slide-down">
                {tags.map(tag => {
                  const selected = filters.tags.includes(tag)
                  return (
                    <button
                      key={tag}
                      onClick={() => {
                        const next = selected ? filters.tags.filter(t => t !== tag) : [...filters.tags, tag]
                        onFilterChange({ tags: next })
                      }}
                      className={`text-[11px] px-2 py-0.5 rounded-md border transition-all ${
                        selected
                          ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 border-primary-200 dark:border-primary-700'
                          : 'bg-gray-50 dark:bg-dark-border/50 text-gray-400 dark:text-dark-muted border-gray-100 dark:border-dark-border hover:border-gray-200 dark:hover:border-gray-600 hover:text-gray-600 dark:hover:text-dark-text'
                      }`}
                    >
                      #{tag}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 底部 */}
      {hasFilters && (
        <div className="flex items-center justify-between px-3.5 py-2 border-t border-gray-50 dark:border-dark-border/50 bg-gray-50/50 dark:bg-dark-card/30 rounded-b-xl">
          <span className="text-[11px] text-gray-400 dark:text-dark-muted">
            找到 <strong className="text-gray-600 dark:text-dark-text">{resultCount}</strong> 个事件
          </span>
          {hasActiveFilters && (
            <button onClick={onReset} className="text-[11px] text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 hover:underline transition-colors">
              清除筛选
            </button>
          )}
        </div>
      )}
    </div>
  )
}
