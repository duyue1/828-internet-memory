/**
 * GitHub Pages SPA 路由支持
 * 当从 404.html 跳转过来时，恢复原始路径
 */
export function restoreSPARoute(): string | null {
  const params = new URLSearchParams(window.location.search)
  const p = params.get('p')
  if (p) {
    // 清理 query string 并用 history.replaceState 恢复路径
    const cleanUrl = window.location.origin + window.location.pathname.replace(/\/+$/, '') + '#'
    history.replaceState(null, '', cleanUrl)
    return p
  }
  return null
}
