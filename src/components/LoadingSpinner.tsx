interface Props {
  text?: string
  variant?: 'spinner' | 'skeleton'
}

/** 骨架屏卡片列表 */
function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
          <div className="skeleton h-9 w-full rounded-none" />
          <div className="p-4 space-y-3">
            <div className="flex gap-2">
              <div className="skeleton h-4 w-14 rounded-full" />
              <div className="skeleton h-4 w-10 rounded-full" />
            </div>
            <div className="skeleton h-5 w-3/4 rounded" />
            <div className="skeleton h-3 w-full rounded" />
            <div className="skeleton h-3 w-4/5 rounded" />
            <div className="flex gap-1.5">
              <div className="skeleton h-3.5 w-14 rounded-full" />
              <div className="skeleton h-3.5 w-16 rounded-full" />
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-50">
              <div className="skeleton h-3 w-28 rounded" />
              <div className="skeleton h-3 w-16 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function LoadingSpinner({ text = '加载中...', variant = 'skeleton' }: Props) {
  if (variant === 'skeleton') {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
        {/* 标题骨架 */}
        <div className="mb-6">
          <div className="skeleton h-8 w-48 rounded-lg mb-2" />
          <div className="skeleton h-4 w-72 rounded" />
        </div>
        {/* 搜索骨架 */}
        <div className="skeleton h-10 w-full max-w-xl rounded-xl mb-4" />
        {/* 筛选面板骨架 */}
        <div className="skeleton h-20 w-full rounded-xl mb-6" />
        {/* 卡片列表骨架 */}
        <SkeletonGrid />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 border-[3px] border-gray-100 rounded-full" />
        <div className="absolute inset-0 border-[3px] border-transparent border-t-primary-400 rounded-full animate-spin" />
      </div>
      <p className="mt-4 text-sm text-gray-400">{text}</p>
    </div>
  )
}
