import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { Globe } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { signIn, profile, loading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  if (profile) return <Navigate to="/dashboard" replace />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    const { error } = await signIn(email, password)
    if (error) {
      setError(error)
      setSubmitting(false)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-10">
          <Globe size={32} className="text-white mb-4" />
          <h1
            className="text-white text-3xl"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            moreperezmontemayor
          </h1>
          <p className="text-white/40 text-sm mt-1 tracking-widest uppercase">
            Club de lectura
          </p>
        </div>

        <div className="liquid-glass rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="text-white/50 text-xs tracking-widest uppercase block mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
                placeholder="tu@correo.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm outline-none focus:border-white/30 transition-colors"
              />
            </div>

            <div>
              <label className="text-white/50 text-xs tracking-widest uppercase block mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm outline-none focus:border-white/30 transition-colors"
              />
            </div>

            {error && (
              <p className="text-red-400/80 text-sm text-center leading-relaxed">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="bg-white text-black font-medium rounded-full py-3 hover:bg-white/90 transition-colors disabled:opacity-50 mt-1"
            >
              {submitting ? 'Ingresando...' : 'Ingresar al club'}
            </button>
          </form>
        </div>

        <p className="text-white/20 text-xs text-center mt-6">
          ¿No tienes acceso? Contacta al administrador del club.
        </p>
      </div>
    </div>
  )
}
