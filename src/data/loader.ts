import type { AppData, Event } from '../types'

const DATA_URL = '/828-internet-memory/data/events.json'

let cachedData: AppData | null = null
let loadPromise: Promise<AppData> | null = null

/**
 * 加载全部事件数据（带缓存 + 并发去重）
 */
export async function loadEvents(): Promise<AppData> {
  if (cachedData) return cachedData
  if (loadPromise) return loadPromise

  loadPromise = fetch(DATA_URL)
    .then(res => {
      if (!res.ok) throw new Error(`加载数据失败: ${res.status}`)
      return res.json()
    })
    .then((data: AppData) => {
      // 计算 updatesCount（兼容冗余字段）
      for (const event of data.events) {
        if (!event.updatesCount && event.timeline) {
          event.updatesCount = event.timeline.length
        }
      }
      cachedData = data
      return data
    })
    .finally(() => {
      loadPromise = null
    })

  return loadPromise
}

export async function getEventById(id: string): Promise<Event | undefined> {
  const data = await loadEvents()
  return data.events.find(e => e.id === id)
}

export async function getCategories(): Promise<string[]> {
  const data = await loadEvents()
  return data.categories
}

export async function getTags(): Promise<string[]> {
  const data = await loadEvents()
  return data.tags
}

export function clearCache() {
  cachedData = null
}
