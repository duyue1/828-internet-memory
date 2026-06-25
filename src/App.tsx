import { Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect, useState } from 'react'
import Layout from './components/Layout'
import LoadingSpinner from './components/LoadingSpinner'

// 路由级懒加载：首页代码随首页加载，详情页代码仅在访问详情页时加载
const HomePage = lazy(() => import('./pages/HomePage'))
const DetailPage = lazy(() => import('./pages/DetailPage'))
const NotFound = lazy(() => import('./pages/NotFound'))

/** 页面过渡包装 */
function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const [display, setDisplay] = useState(children)
  const [transition, setTransition] = useState('')

  useEffect(() => {
    setTransition('opacity-0')
    const timer = setTimeout(() => {
      setDisplay(children)
      setTransition('opacity-100')
    }, 100)
    return () => clearTimeout(timer)
  }, [location.pathname, children])

  return (
    <div className={`transition-opacity duration-200 ${transition}`}>
      {display}
    </div>
  )
}

export default function App() {
  return (
    <Layout>
      <PageTransition>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/event/:id" element={<DetailPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </PageTransition>
    </Layout>
  )
}
