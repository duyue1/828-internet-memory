import type { EventStatus, SubLabel } from '../types'
import { STATUS_LABELS, SUB_LABEL_MAP } from '../types'

const STATUS_STYLES: Record<EventStatus, { bg: string; text: string; ring: string; dot: string; darkBg: string; darkText: string; darkRing: string; darkDot: string }> = {
  ongoing: {
    bg: 'bg-red-50', text: 'text-red-700', ring: 'ring-red-200/50', dot: 'bg-red-500',
    darkBg: 'dark:bg-red-900/30', darkText: 'dark:text-red-300', darkRing: 'dark:ring-red-800/30', darkDot: 'dark:bg-red-400',
  },
  resolved: {
    bg: 'bg-green-50', text: 'text-green-700', ring: 'ring-green-200/50', dot: 'bg-green-500',
    darkBg: 'dark:bg-green-900/30', darkText: 'dark:text-green-300', darkRing: 'dark:ring-green-800/30', darkDot: 'dark:bg-green-400',
  },
  unresolved: {
    bg: 'bg-gray-50', text: 'text-gray-500', ring: 'ring-gray-200/50', dot: 'bg-gray-400',
    darkBg: 'dark:bg-gray-800/50', darkText: 'dark:text-gray-400', darkRing: 'dark:ring-gray-700/30', darkDot: 'dark:bg-gray-500',
  },
}

const STATUS_ICONS: Record<EventStatus, string> = {
  ongoing: '🔴', resolved: '✅', unresolved: '⚪',
}

interface Props {
  status: EventStatus
  subLabel?: SubLabel
  size?: 'sm' | 'md'
}

export default function StatusBadge({ status, subLabel, size = 'md' }: Props) {
  const s = STATUS_STYLES[status]
  const sizeClass = size === 'sm' ? 'px-1.5 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className={`inline-flex items-center gap-1 rounded-lg font-medium ring-1 ${s.bg} ${s.text} ${s.ring} ${s.darkBg} ${s.darkText} ${s.darkRing} ${sizeClass}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${s.darkDot} animate-pulse-dot`} />
        {STATUS_ICONS[status]} {STATUS_LABELS[status]}
      </span>
      {subLabel && SUB_LABEL_MAP[subLabel] && (
        <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 ring-1 ring-blue-200/50 dark:ring-blue-800/30 font-medium">
          [{SUB_LABEL_MAP[subLabel]}]
        </span>
      )}
    </div>
  )
}
