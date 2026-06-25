import { useRef } from 'react'

interface Props {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function SearchBar({
  value,
  onChange,
  placeholder = '搜索事件、关键词...',
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const hasValue = value.length > 0

  return (
    <div className="relative group w-full max-w-xl">
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-100/50 to-blue-100/50 dark:from-primary-800/20 dark:to-blue-800/20 opacity-0 group-focus-within:opacity-100 transition-opacity blur-sm" />
      <div className="relative flex items-center">
        <svg
          className="absolute left-3.5 w-4 h-4 text-gray-400 dark:text-dark-muted pointer-events-none transition-colors group-focus-within:text-primary-400"
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="
            w-full pl-10 pr-9 py-2.5 text-sm
            bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm
            border border-gray-200 dark:border-dark-border rounded-xl
            placeholder-gray-400 dark:placeholder-dark-muted/50
            text-gray-900 dark:text-dark-text
            focus:outline-none focus:border-primary-300 dark:focus:border-primary-600 focus:bg-white dark:focus:bg-dark-card focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-800/30
            transition-all duration-200
          "
        />

        {hasValue && (
          <button
            onClick={() => { onChange(''); inputRef.current?.focus() }}
            className="absolute right-2.5 p-1 rounded-lg text-gray-400 dark:text-dark-muted hover:text-gray-600 dark:hover:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-border transition-all"
            aria-label="清除搜索"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
