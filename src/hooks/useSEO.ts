import { useEffect } from 'react'

const SITE_NAME = '互联网记忆'

/**
 * SEO 元标签管理
 * 设置页面标题 + meta description + OG tags
 */
export function useSEO(title?: string, description?: string) {
  useEffect(() => {
    const fullTitle = title
      ? `${title} — ${SITE_NAME}`
      : `${SITE_NAME} — 记录互联网上的重要社会事件`

    document.title = fullTitle

    // meta description
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.setAttribute('name', 'description')
      document.head.appendChild(metaDesc)
    }

    const desc = description || '一个由 AI 辅助维护的社会事件时间线记录站，记录事件的经过、进展、结果。'
    metaDesc.setAttribute('content', desc.slice(0, 200))

    // Open Graph
    const setOG = (prop: string, content: string) => {
      let el = document.querySelector(`meta[property="${prop}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute('property', prop)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    setOG('og:title', fullTitle)
    setOG('og:description', desc.slice(0, 200))
    setOG('og:type', 'article')
    setOG('og:site_name', SITE_NAME)
  }, [title, description])
}
