'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Shield, Users, Plus, Edit3, Trash2, Search, UserCheck, RefreshCw } from 'lucide-react'
import { Modal, ConfirmDialog, FormField, Input, Select, SubmitButton, ImageUpload } from '@/components/ui/crud'

interface User { id: string; name: string; nis: string; role: string; kelas: string | null; avatar: string | null }
interface Kelas { id: string; name: string; tingkat: string; jurusan: string }

const ROLE_CFG: Record<string, { label: string; badgeClass: string }> = {
  SUPER_ADMIN:  { label: 'Super Admin', badgeClass: 'bg-primary/15 text-primary border-primary/25' },
  PANITIA:      { label: 'Panitia',     badgeClass: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/25' },
  KANDIDAT:     { label: 'Kandidat',    badgeClass: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/25' },
  KETUA_KELAS:  { label: 'Ketua Kelas', badgeClass: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/25' },
  SISWA:        { label: 'Siswa',       badgeClass: 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/25' },
}
const ROLE_OPTS = Object.entries(ROLE_CFG).map(([v, c]) => ({ value: v, label: c.label }))
const FILTER_ROLES = ['Semua', ...Object.values(ROLE_CFG).map(r => r.label)]

const EMPTY_CREATE = { name: '', nis: '', password: '', role: 'SISWA', kelas: '', avatar: null as string | null }
const EMPTY_EDIT   = { name: '', role: 'SISWA', kelas: '', avatar: null as string | null }

export default function UsersPage() {
  const { currentUser } = useAuth()
  const [users, setUsers]   = useState<User[]>([])
  const [kelasList, setKelasList] = useState<Kelas[]>([])
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState('Semua')
  const [error, setError]     = useState('')
  const [showCreate, setShowCreate]     = useState(false)
  const [showEdit, setShowEdit]         = useState(false)
  const [editTarget, setEditTarget]     = useState<User | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)
  const [createForm, setCreateForm] = useState(EMPTY_CREATE)
  const [editForm, setEditForm]     = useState(EMPTY_EDIT)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [ur, kr] = await Promise.all([
        fetch('/api/users',  { credentials: 'include' }),
        fetch('/api/kelas',  { credentials: 'include' }),
      ])
      const uj = await ur.json(); if (uj.success) setUsers(uj.data)
      const kj = await kr.json(); if (kj.success) setKelasList(kj.data)
    } catch {}
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  if (currentUser?.role !== 'SUPER_ADMIN') {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="surface-card rounded-xl p-12 text-center border border-border">
          <Shield className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
          <p className="font-semibold text-foreground">Akses Dibatasi: Khusus Super Admin</p>
          <p className="text-xs text-muted-foreground mt-1">Halaman manajemen pengguna hanya dapat diakses oleh akun Pembina atau Administrator utama.</p>
        </div>
      </div>
    )
  }

  const kelasOpts = kelasList.map(k => ({ value: k.name, label: k.name }))

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.nis.includes(search)
    const matchFilter = filter === 'Semua' || ROLE_CFG[u.role]?.label === filter
    return matchSearch && matchFilter
  })

  const stats = [
    { label: 'Total Pengguna', value: users.length, icon: Users, accent: 'bg-secondary text-foreground/80 border-border' },
    { label: 'Panitia Event',  value: users.filter(u => u.role === 'PANITIA').length, icon: UserCheck, accent: 'bg-secondary text-foreground/80 border-border' },
    { label: 'Kandidat Paslon', value: users.filter(u => u.role === 'KANDIDAT').length, icon: Shield, accent: 'bg-secondary text-foreground/80 border-border' },
    { label: 'Siswa Aktif',    value: users.filter(u => u.role === 'SISWA').length, icon: Users, accent: 'bg-secondary text-foreground/80 border-border' },
  ]

  const openCreate = () => { setCreateForm(EMPTY_CREATE); setError(''); setShowCreate(true) }
  const openEdit = (u: User) => {
    setEditTarget(u)
    setEditForm({ name: u.name, role: u.role, kelas: u.kelas || '', avatar: u.avatar || null })
    setError(''); setShowEdit(true)
  }

  const handleCreate = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!createForm.nis || !createForm.name || !createForm.password) { setError('NIS, nama, dan kata sandi wajib diisi'); return }
    setSaving(true); setError('')
    try {
      const res  = await fetch('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(createForm) })
      const json = await res.json()
      if (json.success) { setShowCreate(false); fetchData() }
      else setError(json.error || 'Gagal mendaftarkan user')
    } catch { setError('Gagal terhubung ke server') }
    setSaving(false)
  }

  const handleEdit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!editTarget || !editForm.name) { setError('Nama lengkap wajib diisi'); return }
    setSaving(true); setError('')
    try {
      const res  = await fetch(`/api/users/${editTarget.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(editForm) })
      const json = await res.json()
      if (json.success) { setShowEdit(false); fetchData() }
      else setError(json.error || 'Gagal menyimpan perubahan')
    } catch { setError('Gagal terhubung ke server') }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return; setDeleting(true)
    try {
      await fetch(`/api/users/${deleteTarget.id}`, { method: 'DELETE', credentials: 'include' })
      setDeleteTarget(null); fetchData()
    } catch {}
    setDeleting(false)
  }

  const fc = (k: string) => (v: string) => setCreateForm(p => ({ ...p, [k]: v }))
  const fe = (k: string) => (v: string) => setEditForm(p => ({ ...p, [k]: v }))

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-4">
        <div>
          <span className="academic-badge mb-2">Administrasi Pengguna</span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Kelola Data Pengguna</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{users.length} akun terdaftar dalam sistem sekolah.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Perbarui</span>
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah User</span>
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="surface-card p-4 flex items-center gap-3.5">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${s.accent}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground leading-tight">{loading ? '...' : s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Role Filters */}
      <div className="surface-card p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama atau NIS..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg text-xs sm:text-sm bg-background border border-input text-foreground placeholder:text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {FILTER_ROLES.map(f2 => (
            <button
              key={f2}
              onClick={() => setFilter(f2)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                filter === f2
                  ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/60'
              }`}
            >
              {f2}
            </button>
          ))}
        </div>
      </div>

      {/* User Table / List */}
      <div className="surface-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-muted/20">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {loading ? 'Memuat data pengguna...' : `${filtered.length} pengguna ditemukan`}
          </p>
        </div>
        {loading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-muted" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 bg-muted rounded w-32" />
                  <div className="h-3 bg-muted rounded w-48" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-xs text-muted-foreground">Tidak ada data pengguna yang sesuai dengan pencarian atau filter.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map(u => {
              const r = ROLE_CFG[u.role] || ROLE_CFG['SISWA']
              return (
                <div key={u.id} className="px-5 py-3.5 flex items-center gap-3.5 hover:bg-muted/30 transition-colors group">
                  <div className="w-9 h-9 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center shrink-0 overflow-hidden font-bold text-xs border border-border">
                    {u.avatar ? (
                      <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{u.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-xs sm:text-sm text-foreground truncate">{u.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                      NIS: {u.nis}{u.kelas ? ` • ${u.kelas}` : ''}
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border hidden sm:inline-flex shrink-0 ${r.badgeClass}`}>
                    {r.label}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={() => openEdit(u)}
                      className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title="Edit user"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(u)}
                      className="p-1.5 rounded-md hover:bg-destructive/10 text-destructive transition-colors"
                      title="Hapus user"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Pendaftaran User Baru" size="lg">
        <form onSubmit={handleCreate} className="space-y-4">
          <FormField label="Foto Profil Pengguna">
            <ImageUpload
              value={createForm.avatar}
              onChange={v => setCreateForm(p => ({ ...p, avatar: v }))}
              shape="circle"
              size={72}
              placeholder="Pilih foto profil user"
              maxSizeKB={400}
            />
          </FormField>
          <FormField label="Nama Lengkap" required>
            <Input value={createForm.name} onChange={e => fc('name')(e.target.value)} placeholder="Contoh: Ahmad Fauzi" required />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Nomor Induk Siswa (NIS)" required>
              <Input value={createForm.nis} onChange={e => fc('nis')(e.target.value)} placeholder="Contoh: 20240015" required />
            </FormField>
            <FormField label="Kata Sandi Awal" required>
              <Input type="password" value={createForm.password} onChange={e => fc('password')(e.target.value)} placeholder="Minimal 6 karakter" required />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Peran Pengguna">
              <Select value={createForm.role} onChange={e => fc('role')(e.target.value)} options={ROLE_OPTS} />
            </FormField>
            <FormField label="Kelas">
              <Select value={createForm.kelas} onChange={e => fc('kelas')(e.target.value)} options={kelasOpts} placeholder="Pilih kelas..." />
            </FormField>
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <SubmitButton loading={saving} label="Daftarkan Pengguna" />
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Perbarui Data Pengguna" size="md">
        <form onSubmit={handleEdit} className="space-y-4">
          <FormField label="Foto Profil">
            <ImageUpload
              value={editForm.avatar}
              onChange={v => setEditForm(p => ({ ...p, avatar: v }))}
              shape="circle"
              size={72}
              placeholder="Pilih foto profil user"
              maxSizeKB={400}
            />
          </FormField>
          <FormField label="Nama Lengkap" required>
            <Input value={editForm.name} onChange={e => fe('name')(e.target.value)} required />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Peran">
              <Select value={editForm.role} onChange={e => fe('role')(e.target.value)} options={ROLE_OPTS} />
            </FormField>
            <FormField label="Kelas">
              <Select value={editForm.kelas || ''} onChange={e => fe('kelas')(e.target.value)} options={kelasOpts} placeholder="Pilih kelas..." />
            </FormField>
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <SubmitButton loading={saving} label="Simpan Perubahan" />
        </form>
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Konfirmasi Hapus Pengguna"
        loading={deleting}
        message={`Apakah Anda yakin ingin menghapus akun "${deleteTarget?.name}" (NIS: ${deleteTarget?.nis})? Tindakan ini tidak dapat dibatalkan.`}
      />
    </div>
  )
}
