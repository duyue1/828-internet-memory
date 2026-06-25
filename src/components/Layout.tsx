import { Link, useLocation } from 'react-router-dom'
import { useDarkMode } from '../hooks/useDarkMode'
import { SITE_NAME, SITE_TAGLINE } from '../utils/constants'

interface Props {
  children: React.ReactNode
}

function ThemeToggle({ isDark, toggle }: { isDark: boolean; toggle: () => void }) {
  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-dark-border dark:hover:text-dark-text transition-all"
      aria-label={isDark ? '切换亮色模式' : '切换暗色模式'}
      title={isDark ? '切换亮色模式' : '切换暗色模式'}
    >
      {isDark ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  )
}

export default function Layout({ children }: Props) {
  const location = useLocation()
  const { isDark, toggle } = useDarkMode()
  const isHome = location.pathname === '/' || location.pathname === '/828-internet-memory/'

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      {/* 头部导航 */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-dark-card/90 backdrop-blur-lg border-b border-gray-100/80 dark:border-dark-border/50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <span className="text-white text-sm font-bold">记</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-800 dark:text-dark-text group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {SITE_NAME}
              </h1>
              <p className="text-[10px] text-gray-400 dark:text-dark-muted -mt-0.5 hidden sm:block tracking-wide">
                {SITE_TAGLINE}
              </p>
            </div>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              to="/"
              className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                isHome
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium'
                  : 'text-gray-500 dark:text-dark-muted hover:text-gray-800 dark:hover:text-dark-text hover:bg-gray-50 dark:hover:bg-dark-border'
              }`}
            >
              首页
            </Link>
            <ThemeToggle isDark={isDark} toggle={toggle} />
            <a
              href="https://github.com/duyue1/828-internet-memory"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-gray-400 dark:text-dark-muted hover:text-gray-600 dark:hover:text-dark-text hover:bg-gray-50 dark:hover:bg-dark-border transition-all"
              title="GitHub"
            >
              <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </nav>
        </div>
      </header>

      {/* 主体 */}
      <main className="flex-1">
        {children}
      </main>

      {/* 底部 */}
      <footer className="border-t border-gray-100 dark:border-dark-border/50 bg-white/50 dark:bg-dark-card/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">记</span>
            </div>
            <span className="text-xs font-semibold text-gray-500 dark:text-dark-muted">{SITE_NAME}</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-dark-muted/70 leading-relaxed max-w-md mx-auto">
            记录互联网上的重要社会事件，保留数字记忆。<br />
            数据来源均为公开信息 · 仅供参考
          </p>
          <p className="mt-3 text-[11px] text-gray-300 dark:text-dark-muted/50">
            <a href="https://github.com/duyue1/828-internet-memory" className="hover:text-gray-500 dark:hover:text-dark-text transition-colors">
              参与贡献
            </a>
            {' · '}开放数据 · 自由浏览
          </p>
        </div>
      </footer>
    </div>
  )
}
