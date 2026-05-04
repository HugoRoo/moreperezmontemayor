import { Link, useNavigate } from 'react-router-dom'
import { Globe, LogOut, Settings } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function AppNav() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = () => {
    signOut()
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-50 px-4 py-3 bg-black/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <Globe size={20} className="text-white" />
          <span
            className="text-white font-semibold text-lg"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            moreperezmontemayor
          </span>
          <span className="text-white/30 text-sm hidden sm:inline">Club de lectura</span>
        </Link>

        <div className="flex items-center gap-3">
          {profile?.role === 'admin' && (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 text-white/50 hover:text-white text-sm transition-colors liquid-glass rounded-full px-4 py-1.5"
            >
              <Settings size={14} />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          )}
          <span className="text-white/40 text-sm hidden sm:inline">{profile?.username}</span>
          <button
            onClick={handleSignOut}
            className="liquid-glass rounded-full p-2 text-white/60 hover:text-white transition-colors"
            title="Cerrar sesión"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </nav>
  )
}
