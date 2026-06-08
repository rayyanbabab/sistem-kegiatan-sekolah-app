'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { User, Role, userVotingHistory } from '@/lib/mockData'

interface AuthContextType {
  currentUser: User | null
  isAuthenticated: boolean
  login: (nis: string, role: Role) => void
  logout: () => void
  switchRole: (role: Role) => void
  hasVoted: boolean
  setHasVoted: (voted: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [hasVoted, setHasVoted] = useState(false)

  const login = useCallback((nis: string, role: Role) => {
    // Mock login - in real app this would verify credentials
    const user: User = {
      id: '1',
      name: role === 'super-admin' ? 'Admin Sekolah' : 
            role === 'panitia' ? 'Panitia OSIS' :
            role === 'kandidat' ? 'Siti Nurhaliza' :
            role === 'ketua-kelas' ? 'Ketua Kelas XI IPA 2' :
            'Ahmad Ridho',
      nis: nis,
      role: role,
      kelas: role === 'super-admin' ? '-' : 'XI IPA 2',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${role}`
    }
    setCurrentUser(user)
    setHasVoted(!!userVotingHistory[nis])
  }, [])

  const logout = useCallback(() => {
    setCurrentUser(null)
    setHasVoted(false)
  }, [])

  const switchRole = useCallback((role: Role) => {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        role
      })
    }
  }, [currentUser])

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        logout,
        switchRole,
        hasVoted,
        setHasVoted
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
