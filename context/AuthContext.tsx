'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────
export type DBRole = 'SUPER_ADMIN' | 'PANITIA' | 'KANDIDAT' | 'KETUA_KELAS' | 'SISWA'

export interface CurrentUser {
  id: string
  nis: string
  name: string
  role: DBRole
  kelas: string | null
  avatar: string | null
}

interface AuthContextType {
  currentUser: CurrentUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (nis: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  // legacy compat (masih dipakai di beberapa tempat, tapi noop)
  hasVoted: boolean
  setHasVoted: (v: boolean) => void
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [isLoading, setIsLoading] = useState(true) // true saat pertama kali load
  const [hasVoted, setHasVoted] = useState(false)

  // ── Restore session dari cookie saat pertama mount ──────────────────────────
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' })
        if (res.ok) {
          const json = await res.json()
          if (json.success) setCurrentUser(json.data)
        }
      } catch {
        // no session
      } finally {
        setIsLoading(false)
      }
    }
    restoreSession()
  }, [])

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = useCallback(async (nis: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ nis, password }),
      })
      const json = await res.json()
      if (json.success) {
        setCurrentUser(json.data.user)
        return { success: true }
      }
      return { success: false, error: json.error || 'NIS atau password salah' }
    } catch {
      return { success: false, error: 'Gagal terhubung ke server' }
    }
  }, [])

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    } catch { /* ignore */ }
    setCurrentUser(null)
    setHasVoted(false)
  }, [])

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated: !!currentUser,
      isLoading,
      login,
      logout,
      hasVoted,
      setHasVoted,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) throw new Error('useAuth must be used within AuthProvider')
  return context
}
