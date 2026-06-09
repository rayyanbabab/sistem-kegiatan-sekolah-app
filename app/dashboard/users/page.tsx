'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Shield, Users, Plus, Edit3, Trash2, Search, UserCheck, RefreshCw } from 'lucide-react'

interface User {
  id: string; name: string; nis: string
  role: string; kelas: string | null; avatar: string | null
}

const ROLE_CFG: Record<string, { label: string; color: string; bg: string; border: string; gradient: string }> = {
  SUPER_ADMIN:  { label: 'Super Admin', color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20',   gradient: 'from-blue-500 to-blue-400' },
  PANITIA:      { label: 'Panitia',     color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20', gradient: 'from-violet-500 to-purple-400' },
  KANDIDAT:     { label: 'Kandidat',    color: 'text-pink-400',   bg: 'bg-pink-500/10',   border: 'border-pink-500/20',   gradient: 'from-pink-500 to-rose-400' },
  KETUA_KELAS:  { label: 'Ketua Kelas', color: 'text-cyan-400',   bg: 'bg-cyan-500/10',   border: 'border-cyan-500/20',   gradient: 'from-cyan-500 to-blue-400' },
  SISWA:        { label: 'Siswa',       color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20',  gradient: 'from-green-500 to-emerald-400' },
}

const FILTER_ROLES = ['Semua', 'Super Admin', 'Panitia', 'Kandidat', 'Ketua Kelas', 'Siswa']

export default function UsersPage() {
  const { currentUser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Semua')

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/users', { credentials: 'include' })
      const json = await res.json()
      if (json.success) setUsers(json.data)
    } catch { /* ignore */ }
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  if (currentUser?.role !== 'SUPER_ADMIN') {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="glass-card rounded-2xl p-16 text-center">
          <Shield className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-faint)' }} />
          <p className="font-medium" style={{ color: 'var(--text-muted)' }}>Akses Ditolak</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-faint)' }}>Hanya Super Admin yang dapat mengakses halaman ini</p>
        </div>
      </div>
    )
  }

  const filtered = users.filter(u => {
    const name = u.name.toLowerCase()
    const q = search.toLowerCase()
    const matchSearch = name.includes(q) || u.nis.includes(q)
    const matchFilter = filter === 'Semua' || ROLE_CFG[u.role]?.label === filter
    return matchSearch && matchFilter
  })

  const stats = [
    { label: 'Total User', value: users.length, color: 'from-blue-500 to-cyan-400', icon: Users },
    { label: 'Panitia', value: users.filter(u => u.role === 'PANITIA').length, color: 'from-violet-500 to-purple-400', icon: UserCheck },
    { label: 'Kandidat', value: users.filter(u => u.role === 'KANDIDAT').length, color: 'from-pink-500 to-rose-400', icon: Shield },
    { label: 'Siswa', value: users.filter(u => u.role === 'SISWA').length, color: 'from-green-500 to-emerald-400', icon: Users },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-4 h-4 text-blue-400" />
          <span className="text-xs text-blue-400 font-medium uppercase tracking-wider">Admin Panel</span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Kelola User</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{users.length} pengguna terdaftar</p>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchData} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs transition" style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)', color: 'var(--text-muted)' }}>
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 shadow-lg hover:opacity-90 transition flex-shrink-0">
              <Plus className="w-4 h-4" /> Tambah User
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="glass-card rounded-2xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center flex-shrink-0`}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{loading ? '...' : s.value}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="glass-card rounded-2xl p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-faint)' }} />
          <input
            type="text"
            placeholder="Cari nama, NIS, atau email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition"
            style={{ background: 'var(--subtle-bg)', color: 'var(--text-primary)', border: '1px solid var(--subtle-border)' }}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {FILTER_ROLES.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium transition"
              style={filter === f
                ? { background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)' }
                : { background: 'var(--subtle-bg)', color: 'var(--text-muted)', border: '1px solid var(--subtle-border)' }
              }>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* User Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--subtle-border)' }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>
            {loading ? 'Memuat...' : `${filtered.length} pengguna ditemukan`}
          </p>
        </div>
        <div>
          {loading ? (
            <div className="divide-y" style={{ borderColor: 'var(--subtle-border)' }}>
              {[1,2,3,4,5].map(i => (
                <div key={i} className="px-5 py-4 flex items-center gap-4 animate-pulse">
                  <div className="w-10 h-10 rounded-xl flex-shrink-0" style={{ background: 'var(--subtle-bg)' }} />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 rounded w-32" style={{ background: 'var(--subtle-bg)' }} />
                    <div className="h-2.5 rounded w-48" style={{ background: 'var(--subtle-bg)' }} />
                  </div>
                  <div className="h-6 w-20 rounded-xl" style={{ background: 'var(--subtle-bg)' }} />
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y" style={{ '--tw-divide-color': 'var(--subtle-border)' } as any}>
              {filtered.map(u => {
                const r = ROLE_CFG[u.role] || ROLE_CFG['SISWA']
                return (
                  <div key={u.id} className="px-5 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition group" style={{ borderBottom: '1px solid var(--subtle-border)' }}>
                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${r.gradient} flex items-center justify-center flex-shrink-0 overflow-hidden shadow`}>
                      {u.avatar
                        ? <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                        : <span className="text-white font-bold text-sm">{u.name.charAt(0)}</span>}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{u.name}</p>
                      <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-faint)' }}>
                        NIS: {u.nis}
                      </p>
                    </div>
                    {/* Kelas */}
                    <p className="text-xs hidden sm:block flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{u.kelas || '—'}</p>
                    {/* Role badge */}
                    <span className={`px-2.5 py-1 rounded-xl text-xs font-semibold hidden md:inline-flex flex-shrink-0 ${r.bg} ${r.color} border ${r.border}`}>
                      {r.label}
                    </span>
                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition flex-shrink-0">
                      <button className="p-2 rounded-xl transition hover:bg-white/5" style={{ color: 'var(--text-muted)' }} title="Edit">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-2 rounded-xl transition hover:bg-red-500/10 text-red-400" title="Hapus">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )
              })}
              {filtered.length === 0 && (
                <div className="px-5 py-12 text-center">
                  <Users className="w-10 h-10 mx-auto mb-2" style={{ color: 'var(--text-faint)' }} />
                  <p className="text-sm" style={{ color: 'var(--text-faint)' }}>Tidak ada user yang ditemukan</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
