import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import LandingPage    from './pages/LandingPage'
import Login          from './pages/Login'
import Dashboard      from './pages/Dashboard'
import BookForum      from './pages/BookForum'
import AdminPanel     from './pages/AdminPanel'
import Blog           from './pages/Blog'
import ArticleDetail  from './pages/ArticleDetail'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/"          element={<LandingPage />} />
          <Route path="/login"     element={<Login />} />
          <Route path="/blog"      element={<Blog />} />
          <Route path="/blog/:slug" element={<ArticleDetail />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/libro/:id" element={<ProtectedRoute><BookForum /></ProtectedRoute>} />
          <Route path="/admin"     element={<ProtectedRoute requireAdmin><AdminPanel /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
