'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Shield, Users, Plus, Edit3, Trash2, Search, UserCheck, RefreshCw, Key } from 'lucide-react'
import { Modal, ConfirmDialog, FormField, Input, Select, SubmitButton } from '@/components/ui/crud'

interface User { id: string; name: string; nis: string; role: string; kelas: string | null; avatar: string | null }

const ROLE_CFG: Record<string, { label: string; color: string; bg: string; border: string; gradient: string }> = {
  SUPER_ADMIN:  { label: 'Super Admin', color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20',   gradient: 'from-blue-500 to-blue-400' },
  PANITIA:      { label: 'Panitia',     color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20', gradient: 'from-violet-500 to-purple-400' },
  KANDIDAT:     { label: 'Kandidat',    color: 'text-pink-400',   bg: 'bg-pink-500/10',   border: 'border-pink-500/20',   gradient: 'from-pink-500 to-rose-400' },
  KETUA_KELAS:  { label: 'Ketua Kelas', color: 'text-cyan-400',   bg: 'bg-cyan-500/10',   border: 'border-cyan-500/20',   gradient: 'from-cyan-500 to-blue-400' },
  SISWA:        { label: 'Siswa',       color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20',  gradient: 'from-green-500 to-emerald-400' },
}
const ROLE_OPTS = Object.entries(ROLE_CFG).map(([v, c]) => ({ value: v, label: c.label }))
const FILTER_ROLES = ['Semua', ...Object.values(ROLE_CFG).map(r => r.label)]
const KELAS_LIST = ['X IPA 1','X IPA 2','X IPA 3','X IPS 1','X IPS 2','XI IPA 1','XI IPA 2','XI IPA 3','XI IPS 1','XI IPS 2','XII IPA 1','XII IPA 2','XII IPA 3','XII IPS 1','XII IPS 2']
const KELAS_OPTS = KELAS_LIST.map(k => ({ value: k, label: k }))

const EMPTY_CREATE = { name: '', nis: '', password: '', role: 'SISWA', kelas: '' }
const EMPTY_EDIT   = { name: '', role: 'SISWA', kelas: '' }

export default function UsersPage() {
  const { currentUser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Semua')
  const [error, setError] = useState('')
  const [showCreate, setShowCreate]   = useState(false)
  const [showEdit, setShowEdit]       = useState(false)
  const [editTarget, setEditTarget]   = useState<User | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)
  const [createForm, setCreateForm] = useState(EMPTY_CREATE)
  const [editForm, setEditForm]     = useState(EMPTY_EDIT)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/users', { credentials: 'include' })
      const json = await res.json()
      if (json.success) setUsers(json.data)
    } catch { }
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  if (currentUser?.role !== 'SUPER_ADMIN') {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="glass-card rounded-2xl p-16 text-center">
          <Shield className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-faint)' }} />
          <p className="font-medium" style={{ color: 'var(--text-muted)' }}>Akses Ditolak — Hanya Super Admin</p>
        </div>
      </div>
    )
  }

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.nis.includes(search)
    const matchFilter = filter === 'Semua' || ROLE_CFG[u.role]?.label === filter
    return matchSearch && matchFilter
  })

  const stats = [
    { label: 'Total User', value: users.length, color: 'from-blue-500 to-cyan-400', icon: Users },
    { label: 'Panitia', value: users.filter(u => u.role === 'PANITIA').length, color: 'from-violet-500 to-purple-400', icon: UserCheck },
    { label: 'Kandidat', value: users.filter(u => u.role === 'KANDIDAT').length, color: 'from-pink-500 to-rose-400', icon: Shield },
    { label: 'Siswa', value: users.filter(u => u.role === 'SISWA').length, color: 'from-green-500 to-emerald-400', icon: Users },
  ]

  const openCreate = () => { setCreateForm(EMPTY_CREATE); setError(''); setShowCreate(true) }
  const openEdit = (u: User) => {
    setEditTarget(u)
    setEditForm({ name: u.name, role: u.role, kelas: u.kelas || '' })
    setError(''); setShowEdit(true)
  }

  const handleCreate = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!createForm.nis || !createForm.name || !createForm.password) { setError('NIS, nama, dan password wajib diisi'); return }
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(createForm) })
      const json = await res.json()
      if (json.success) { setShowCreate(false); fetchData() }
      else setError(json.error || 'Gagal membuat user')
    } catch { setError('Gagal terhubung ke server') }
    setSaving(false)
  }

  const handleEdit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!editTarget || !editForm.name) { setError('Nama wajib diisi'); return }
    setSaving(true); setError('')
    try {
      const res = await fetch(`/api/users/${editTarget.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(editForm) })
      const json = await res.json()
      if (json.success) { setShowEdit(false); fetchData() }
      else setError(json.error || 'Gagal menyimpan')
    } catch { setError('Gagal terhubung ke server') }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return; setDeleting(true)
    try {
      await fetch(`/api/users/${deleteTarget.id}`, { method: 'DELETE', credentials: 'include' })
      setDeleteTarget(null); fetchData()
    } catch { }
    setDeleting(false)
  }

  const fc = (k: string) => (v: string) => setCreateForm(p => ({ ...p, [k]: v }))
  const fe = (k: string) => (v: string) => setEditForm(p => ({ ...p, [k]: v }))

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1"><Shield className="w-4 h-4 text-blue-400" /><span className="text-xs text-blue-400 font-medium uppercase tracking-wider">Admin Panel</span></div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Kelola User</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{users.length} pengguna terdaftar</p>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchData} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs transition" style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)', color: 'var(--text-muted)' }}>
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 shadow-lg hover:opacity-90 transition flex-shrink-0">
              <Plus className="w-4 h-4" /> Tambah User
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="glass-card rounded-2xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center flex-shrink-0`}><s.icon className="w-5 h-5 text-white" /></div>
            <div><p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{loading ? '...' : s.value}</p><p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</p></div>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="glass-card rounded-2xl p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-faint)' }} />
          <input type="text" placeholder="Cari nama atau NIS..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition"
            style={{ background: 'var(--subtle-bg)', color: 'var(--text-primary)', border: '1px solid var(--subtle-border)' }} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {FILTER_ROLES.map(f2 => (
            <button key={f2} onClick={() => setFilter(f2)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium transition"
              style={filter === f2
                ? { background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)' }
                : { background: 'var(--subtle-bg)', color: 'var(--text-muted)', border: '1px solid var(--subtle-border)' }}>
              {f2}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-5 py-3" style={{ borderBottom: '1px solid var(--subtle-border)' }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>{loading ? 'Memuat...' : `${filtered.length} pengguna`}</p>
        </div>
        {loading ? (
          <div>{[1,2,3,4,5].map(i => (
            <div key={i} className="px-5 py-4 flex items-center gap-4 animate-pulse" style={{ borderBottom: '1px solid var(--subtle-border)' }}>
              <div className="w-10 h-10 rounded-xl flex-shrink-0" style={{ background: 'var(--subtle-bg)' }} />
              <div className="flex-1 space-y-2"><div className="h-3 rounded w-32" style={{ background: 'var(--subtle-bg)' }} /><div className="h-2.5 rounded w-48" style={{ background: 'var(--subtle-bg)' }} /></div>
            </div>
          ))}</div>
        ) : (
          <div>
            {filtered.map(u => {
              const r = ROLE_CFG[u.role] || ROLE_CFG['SISWA']
              return (
                <div key={u.id} className="px-5 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition group" style={{ borderBottom: '1px solid var(--subtle-border)' }}>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${r.gradient} flex items-center justify-center flex-shrink-0 overflow-hidden shadow`}>
                    {u.avatar ? <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" /> : <span className="text-white font-bold text-sm">{u.name.charAt(0)}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{u.name}</p>
                    <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-faint)' }}>NIS: {u.nis}{u.kelas ? ` · ${u.kelas}` : ''}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-xl text-xs font-semibold hidden md:inline-flex flex-shrink-0 ${r.bg} ${r.color} border ${r.border}`}>{r.label}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition flex-shrink-0">
                    <button onClick={() => openEdit(u)} className="p-2 rounded-xl transition hover:bg-white/5" style={{ color: 'var(--text-muted)' }} title="Edit"><Edit3 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setDeleteTarget(u)} className="p-2 rounded-xl transition hover:bg-red-500/10 text-red-400" title="Hapus"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              )
            })}
            {filtered.length === 0 && <div className="px-5 py-12 text-center"><p className="text-sm" style={{ color: 'var(--text-faint)' }}>Tidak ada user ditemukan</p></div>}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Tambah User Baru">
        <form onSubmit={handleCreate} className="space-y-4">
          <FormField label="Nama Lengkap" required><Input value={createForm.name} onChange={e => fc('name')(e.target.value)} placeholder="Nama lengkap..." required /></FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="NIS" required><Input value={createForm.nis} onChange={e => fc('nis')(e.target.value)} placeholder="cth. 12345678" required /></FormField>
            <FormField label="Password" required><Input type="password" value={createForm.password} onChange={e => fc('password')(e.target.value)} placeholder="Min. 6 karakter" required /></FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Role"><Select value={createForm.role} onChange={e => fc('role')(e.target.value)} options={ROLE_OPTS} /></FormField>
            <FormField label="Kelas"><Select value={createForm.kelas} onChange={e => fc('kelas')(e.target.value)} options={KELAS_OPTS} placeholder="Pilih kelas..." /></FormField>
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <SubmitButton loading={saving} label="Buat User" />
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title={`Edit: ${editTarget?.name}`}>
        <form onSubmit={handleEdit} className="space-y-4">
          <FormField label="Nama Lengkap" required><Input value={editForm.name} onChange={e => fe('name')(e.target.value)} placeholder="Nama lengkap..." required /></FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Role"><Select value={editForm.role} onChange={e => fe('role')(e.target.value)} options={ROLE_OPTS} /></FormField>
            <FormField label="Kelas"><Select value={editForm.kelas} onChange={e => fe('kelas')(e.target.value)} options={KELAS_OPTS} placeholder="Tanpa kelas" /></FormField>
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <SubmitButton loading={saving} label="Simpan Perubahan" />
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting}
        title="Hapus User" message={`Hapus user "${deleteTarget?.name}" (NIS: ${deleteTarget?.nis})? Tindakan ini tidak dapat dibatalkan.`} />
    </div>
  )
}
