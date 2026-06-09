'use client'

import { useState } from 'react'
import { Shield, Users, Plus, Edit3, Trash2, Search, Mail, Phone, Key, UserCheck } from 'lucide-react'

const USERS_DATA = [
  { id: '1', name: 'Ahmad Ridho', email: 'ahmad@smks.id', role: 'siswa', kelas: 'XI IPA 2', status: 'active' },
  { id: '2', name: 'Siti Nurhaliza', email: 'siti@smks.id', role: 'kandidat', kelas: 'XII IPA 1', status: 'active' },
  { id: '3', name: 'Budi Santoso', email: 'budi@smks.id', role: 'kandidat', kelas: 'XII IPS 2', status: 'active' },
  { id: '4', name: 'Dewi Rahayu', email: 'dewi@smks.id', role: 'panitia', kelas: 'XII IPA 3', status: 'active' },
  { id: '5', name: 'Eko Prasetyo', email: 'eko@smks.id', role: 'ketua-kelas', kelas: 'XI IPS 1', status: 'active' },
  { id: '6', name: 'Fitri Amalia', email: 'fitri@smks.id', role: 'siswa', kelas: 'X IPA 1', status: 'active' },
]

const ROLE_CFG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  'super-admin': { label: 'Super Admin', color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20' },
  'panitia':     { label: 'Panitia',     color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
  'kandidat':    { label: 'Kandidat',    color: 'text-pink-400',   bg: 'bg-pink-500/10',   border: 'border-pink-500/20' },
  'ketua-kelas': { label: 'Ketua Kelas', color: 'text-cyan-400',   bg: 'bg-cyan-500/10',   border: 'border-cyan-500/20' },
  'siswa':       { label: 'Siswa',       color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20' },
}

export default function UsersPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Semua')

  const FILTERS = ['Semua', 'Super Admin', 'Panitia', 'Kandidat', 'Ketua Kelas', 'Siswa']

  const filtered = USERS_DATA.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'Semua' || ROLE_CFG[u.role]?.label === filter
    return matchSearch && matchFilter
  })

  const stats = [
    { label: 'Total User', value: USERS_DATA.length, color: 'from-blue-500 to-cyan-400', icon: Users },
    { label: 'Panitia', value: USERS_DATA.filter(u => u.role === 'panitia').length, color: 'from-violet-500 to-purple-400', icon: UserCheck },
    { label: 'Kandidat', value: USERS_DATA.filter(u => u.role === 'kandidat').length, color: 'from-pink-500 to-rose-400', icon: Shield },
    { label: 'Siswa', value: USERS_DATA.filter(u => u.role === 'siswa').length, color: 'from-green-500 to-emerald-400', icon: Users },
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
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Manajemen akun dan role pengguna sistem</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 shadow-lg hover:opacity-90 transition flex-shrink-0">
            <Plus className="w-4 h-4" /> Tambah User
          </button>
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
              <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{s.value}</p>
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
            placeholder="Cari nama atau email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition"
            style={{ background: 'var(--subtle-bg)', color: 'var(--text-primary)', border: '1px solid var(--subtle-border)' }}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium transition"
              style={filter === f
                ? { background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)' }
                : { background: 'var(--subtle-bg)', color: 'var(--text-muted)', border: '1px solid var(--subtle-border)' }
              }
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* User Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-5 py-3 flex items-center" style={{ borderBottom: '1px solid var(--subtle-border)' }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>
            {filtered.length} pengguna ditemukan
          </p>
        </div>
        <div className="divide-y" style={{ '--tw-divide-opacity': 1 } as any}>
          {filtered.map(u => {
            const r = ROLE_CFG[u.role] || ROLE_CFG['siswa']
            return (
              <div key={u.id} className="px-5 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition group">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm shadow">
                  {u.name.charAt(0)}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{u.name}</p>
                  <p className="text-xs truncate flex items-center gap-1.5 mt-0.5" style={{ color: 'var(--text-faint)' }}>
                    <Mail className="w-3 h-3" /> {u.email}
                  </p>
                </div>
                {/* Kelas */}
                <p className="text-xs hidden sm:block" style={{ color: 'var(--text-muted)' }}>{u.kelas}</p>
                {/* Role badge */}
                <span className={`px-2.5 py-1 rounded-xl text-xs font-semibold ${r.bg} ${r.color} border ${r.border} hidden md:inline-flex`}>
                  {r.label}
                </span>
                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button className="p-2 rounded-xl transition hover:bg-white/5" style={{ color: 'var(--text-muted)' }} title="Edit">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-2 rounded-xl transition hover:bg-white/5" style={{ color: 'var(--text-muted)' }} title="Reset Password">
                    <Key className="w-3.5 h-3.5" />
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
              <p className="text-sm" style={{ color: 'var(--text-faint)' }}>Tidak ada user yang ditemukan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
