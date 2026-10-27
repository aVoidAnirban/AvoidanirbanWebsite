import { Routes, Route } from 'react-router-dom'
import { useState, useEffect, memo } from 'react'
import Layout from './components/Layout'
import StructuredData from './components/StructuredData'
import HomePage from './pages/HomePage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'
import AdminPage from './pages/AdminPage'

function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark'
    return localStorage.getItem('theme') || 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lowCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4
    if (reduced || lowCores) {
      document.documentElement.classList.add('perf-lite')
    }
  }, [])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return (
    <>
      <StructuredData />
      <Routes>
        <Route element={<Layout theme={theme} onToggleTheme={toggleTheme} />}>
          <Route index element={<HomePage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/:slug" element={<BlogPostPage />} />
        </Route>
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </>
  )
}

export default memo(App)
