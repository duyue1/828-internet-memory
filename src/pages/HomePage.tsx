import { useState, useEffect } from 'react'
import { useEvents } from '../hooks/useEvents'
import EventCard from '../components/EventCard'
import SearchBar from '../components/SearchBar'
import FilterPanel from '../components/FilterPanel'
import LoadingSpinner from '../components/LoadingSpinner'
import { SITE_NAME, SITE_TAGLINE, SITE_DESC } from '../utils/constants'

/** 回到顶部按钮 */
function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-40 w-10 h-10 rounded-xl bg-white/90 dark:bg-dark-card/90 backdrop-blur-sm border border-gray-200 dark:border-dark-border shadow-lg flex items-center justify-center text-gray-400 dark:text-dark-muted hover:text-primary-500 dark:hover:text-primary-400 hover:border-primary-200 dark:hover:border-primary-700 transition-all animate-scale-in"
      aria-label="回到顶部"
    >
      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    </button>
  )
}

export default function HomePage() {
  const {
    events,
    allEvents,
    totalCount,
    categories,
    tags,
    loading,
    error,
    filters,
    updateFilter,
    resetFilters,
    loadMore,
    hasMore,
  } = useEvents()

  if (loading) {
    return <LoadingSpinner text="正在加载事件数据..." variant="skeleton" />
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-24 text-center">
        <div className="text-5xl mb-4">😵</div>
        <h2 className="text-lg font-semibold text-gray-700 dark:text-dark-text mb-2">数据加载失败</h2>
        <p className="text-sm text-gray-400 dark:text-dark-muted mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 text-sm bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-xl border border-primary-200 dark:border-primary-700 hover:bg-primary-100 dark:hover:bg-primary-800/20 transition-colors"
        >
          重新加载
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
      {/* 品牌区 */}
      <section className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center shadow-md">
            <span className="text-white text-lg font-bold">记</span>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-dark-text">{SITE_NAME}</h1>
            <p className="text-xs sm:text-sm text-gray-400 dark:text-dark-muted mt-0.5">{SITE_TAGLINE}</p>
          </div>
          <span className="ml-auto text-[11px] text-gray-300 dark:text-dark-muted/50 bg-gray-50 dark:bg-dark-border/50 px-2 py-1 rounded-md border border-gray-50 dark:border-dark-border hidden sm:inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-dot" />
            {totalCount} 个事件
          </span>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-dark-muted leading-relaxed max-w-2xl">{SITE_DESC}</p>
      </section>

      {/* 搜索 */}
      <section className="mb-3">
        <SearchBar value={filters.keyword} onChange={kw => updateFilter({ keyword: kw })} />
      </section>

      {/* 筛选 */}
      <section className="mb-5">
        <FilterPanel
          filters={filters}
          categories={categories}
          tags={tags}
          onFilterChange={updateFilter}
          onReset={resetFilters}
          resultCount={totalCount}
        />
      </section>

      {/* 卡片列表 / 无结果兜底 */}
      {events.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-gray-500 dark:text-dark-muted text-sm mb-2">没有找到匹配的事件</p>
          <button onClick={resetFilters} className="px-4 py-2 text-sm bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-xl border border-primary-200 dark:border-primary-700 hover:bg-primary-100 dark:hover:bg-primary-800/20 transition-colors">
            清除筛选条件
          </button>

          {/* 无结果时推荐热门事件 */}
          {filters.keyword && allEvents.length > 0 && (
            <div className="mt-10 text-left max-w-xl mx-auto">
              <p className="text-xs text-gray-400 dark:text-dark-muted mb-3 text-center">—— 你可能感兴趣 ——</p>
              <div className="space-y-2">
                {allEvents.slice(0, 3).map(e => (
                  <a key={e.id} href={`/event/${e.id}`}
                    className="block text-sm text-gray-600 dark:text-dark-muted hover:text-primary-600 dark:hover:text-primary-400 bg-gray-50 dark:bg-dark-border/30 rounded-lg px-4 py-3 border border-gray-100 dark:border-dark-border hover:border-primary-100 dark:hover:border-primary-700 transition-all"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs">{e.status === 'ongoing' ? '🔴' : e.status === 'resolved' ? '✅' : '⚪'}</span>
                      <span className="font-medium">{e.title}</span>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-dark-muted/70 line-clamp-1">{e.summary}</p>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-gray-400 dark:text-dark-muted">
              显示 <strong className="text-gray-500 dark:text-dark-text">{events.length}</strong> / {totalCount} 个事件
            </p>
            <span className="text-[11px] text-gray-300 dark:text-dark-muted/50">
              按{filters.sortBy === 'updated' ? '更新时间' : filters.sortBy === 'date' ? '起始时间' : '标题'}
              {filters.sortOrder === 'desc' ? '降序' : '升序'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {events.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} keyword={filters.keyword} />
            ))}
          </div>

          {hasMore && (
            <div className="mt-8 text-center">
              <button onClick={loadMore}
                className="px-8 py-3 text-sm font-medium bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl text-gray-500 dark:text-dark-muted hover:text-gray-800 dark:hover:text-dark-text hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm transition-all hover:-translate-y-0.5"
              >
                加载更多（{events.length} / {totalCount}）
              </button>
            </div>
          )}

          {!hasMore && totalCount > 0 && (
            <div className="mt-8 text-center text-xs text-gray-300 dark:text-dark-muted/50">— 已显示全部 {totalCount} 个事件 —</div>
          )}
        </>
      )}

      <BackToTop />
    </div>
  )
}
