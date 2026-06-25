import { useState, useEffect } from 'react'

const VIEW_PREFIX = 'im_view_'

/**
 * 浏览热度追踪
 * 每个事件独立计数，localStorage 持久化
 */
export function useViewCount(eventId?: string) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!eventId) return

    // 读取当前计数
    const key = VIEW_PREFIX + eventId
    const stored = localStorage.getItem(key)
    const current = stored ? parseInt(stored, 10) : 0
    const newCount = current + 1

    // 更新
    localStorage.setItem(key, String(newCount))
    setCount(newCount)
  }, [eventId])

  /**
   * 获取指定事件的浏览量（静态读取，不触发计数）
   */
  const getCount = (id: string): number => {
    const stored = localStorage.getItem(VIEW_PREFIX + id)
    return stored ? parseInt(stored, 10) : 0
  }

  return { count, getCount }
}

/**
 * 批量获取所有已记录的浏览量
 */
export function getAllViewCounts(): Record<string, number> {
  const result: Record<string, number> = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith(VIEW_PREFIX)) {
      const id = key.slice(VIEW_PREFIX.length)
      result[id] = parseInt(localStorage.getItem(key) || '0', 10)
    }
  }
  return result
}
