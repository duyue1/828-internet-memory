import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import DetailPage from './pages/DetailPage'

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
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/event/:id" element={<DetailPage />} />
          <Route path="*" element={
            <div className="max-w-3xl mx-auto px-4 py-24 text-center">
              <div className="text-5xl mb-4">🤔</div>
              <h2 className="text-lg font-semibold text-gray-700 dark:text-dark-text mb-2">页面不存在</h2>
              <a href="/" className="text-sm text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 underline">
                返回首页
              </a>
            </div>
          } />
        </Routes>
      </PageTransition>
    </Layout>
  )
}
