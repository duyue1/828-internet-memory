import { Link } from 'react-router-dom'
import { useEffect } from 'react'

export default function NotFound() {
  useEffect(() => {
    document.title = '页面未找到 — 互联网记忆'
  }, [])

  return (
    <div className="max-w-lg mx-auto px-4 py-20 sm:py-28 text-center">
      <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm p-8 sm:p-12 animate-fade-in-up">
        {/* 404 视觉 */}
        <div className="text-7xl sm:text-8xl font-bold gradient-text mb-2">404</div>
        <div className="text-4xl mb-6">🔍</div>

        <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-text mb-2">
          ｜ 页面不存在 ｜
        </h2>
        <p className="text-sm text-gray-400 dark:text-dark-muted mb-6 leading-relaxed">
          你访问的链接可能已失效，或者地址拼写有误。<br />
          但互联网的记忆还在这里。
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            回到首页
          </Link>

          <a
            href="https://github.com/duyue1/828-internet-memory"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm text-gray-500 dark:text-dark-muted bg-gray-50 dark:bg-dark-border/50 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-border transition-colors border border-gray-100 dark:border-dark-border"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub 仓库
          </a>
        </div>
      </div>

      <p className="mt-6 text-xs text-gray-300 dark:text-dark-muted/50">
        <Link to="/" className="hover:text-gray-500 transition-colors">互联网记忆</Link>
        {' · '}保留数字记忆
      </p>
    </div>
  )
}
