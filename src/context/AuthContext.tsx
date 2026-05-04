import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { api } from '../lib/api'
import type { Profile } from '../types'

interface AuthContextValue {
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { setLoading(false); return }

    api.get<Profile>('/auth/me')
      .then(setProfile)
      .catch(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      })
      .finally(() => setLoading(false))
  }, [])

  async function signIn(email: string, password: string) {
    try {
      const { token, user } = await api.post<{ token: string; user: Profile }>(
        '/auth/login',
        { email, password },
      )
      localStorage.setItem('token', token)
      setProfile(user)
      return { error: null }
    } catch (err) {
      return { error: (err as Error).message }
    }
  }

  function signOut() {
    localStorage.removeItem('token')
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{ profile, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
