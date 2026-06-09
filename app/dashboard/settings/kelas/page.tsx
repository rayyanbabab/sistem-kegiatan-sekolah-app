'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { BookOpen, Plus, Edit3, Trash2, RefreshCw, Shield, Users } from 'lucide-react'
import { Modal, ConfirmDialog, FormField, Input, Select, SubmitButton } from '@/components/ui/crud'

interface Kelas { id: string; name: string; tingkat: string; jurusan: string; createdAt: string }

const TINGKAT_OPTS = [
  { value: 'X',   label: 'X (Kelas 1)' },
  { value: 'XI',  label: 'XI (Kelas 2)' },
  { value: 'XII', label: 'XII (Kelas 3)' },
]

const JURUSAN_OPTS = [
  { value: 'IPA',      label: 'IPA' },
  { value: 'IPS',      label: 'IPS' },
  { value: 'RPL',      label: 'RPL (Rekayasa Perangkat Lunak)' },
  { value: 'TKJ',      label: 'TKJ (Teknik Komputer & Jaringan)' },
  { value: 'MM',       label: 'MM (Multimedia)' },
  { value: 'AK',       label: 'AK (Akuntansi)' },
  { value: 'AP',       label: 'AP (Administrasi Perkantoran)' },
  { value: 'PM',       label: 'PM (Pemasaran)' },
  { value: 'Lainnya',  label: 'Lainnya' },
]

const TINGKAT_COLOR: Record<string, string> = {
  X:   'from-blue-500 to-cyan-400',
  XI:  'from-violet-500 to-purple-400',
  XII: 'from-amber-500 to-orange-400',
}

const EMPTY = { name: '', tingkat: 'X', jurusan: 'IPA' }

export default function KelasPage() {
  const { currentUser } = useAuth()
  const [kelas, setKelas]       = useState<Kelas[]>([])
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError]       = useState('')
  const [showModal, setShowModal]     = useState(false)
  const [editTarget, setEditTarget]   = useState<Kelas | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Kelas | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [filterTingkat, setFilterTingkat] = useState('SEMUA')

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/kelas', { credentials: 'include' })
      const json = await res.json()
      if (json.success) setKelas(json.data)
    } catch {}
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

  const filtered = filterTingkat === 'SEMUA' ? kelas : kelas.filter(k => k.tingkat === filterTingkat)

  const openCreate = () => { setEditTarget(null); setForm(EMPTY); setError(''); setShowModal(true) }
  const openEdit = (k: Kelas) => {
    setEditTarget(k)
    setForm({ name: k.name, tingkat: k.tingkat, jurusan: k.jurusan })
    setError(''); setShowModal(true)
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!form.name || !form.tingkat || !form.jurusan) { setError('Semua field wajib diisi'); return }
    setSaving(true); setError('')
    try {
      const url    = editTarget ? `/api/kelas/${editTarget.id}` : '/api/kelas'
      const method = editTarget ? 'PUT' : 'POST'
      const res  = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(form) })
      const json = await res.json()
      if (json.success) { setShowModal(false); fetchData() }
      else setError(json.error || 'Gagal menyimpan')
    } catch { setError('Gagal terhubung ke server') }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return; setDeleting(true)
    try {
      const res  = await fetch(`/api/kelas/${deleteTarget.id}`, { method: 'DELETE', credentials: 'include' })
      const json = await res.json()
      if (json.success) { setDeleteTarget(null); fetchData() }
      else { alert(json.error || 'Gagal menghapus'); setDeleteTarget(null) }
    } catch {}
    setDeleting(false)
  }

  const f = (k: string) => (v: string) => setForm(p => ({ ...p, [k]: v }))

  const grouped = ['X', 'XI', 'XII'].map(t => ({
    tingkat: t,
    count: kelas.filter(k => k.tingkat === t).length,
  }))

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-cyan-400 font-medium uppercase tracking-wider">Manajemen Sekolah</span>
          </div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Kelola Kelas</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{kelas.length} kelas terdaftar</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchData} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition"
            style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)', color: 'var(--text-muted)' }}>
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg hover:opacity-90 transition">
            <Plus className="w-4 h-4" /> Tambah Kelas
          </button>
        </div>
      </div>

      {/* Stats per tingkat */}
      <div className="grid grid-cols-3 gap-4">
        {grouped.map(g => (
          <div key={g.tingkat} className="glass-card rounded-2xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${TINGKAT_COLOR[g.tingkat]} flex items-center justify-center flex-shrink-0`}>
              <span className="text-white font-bold text-sm">{g.tingkat}</span>
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{loading ? '...' : g.count}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Kelas Tingkat {g.tingkat}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tingkat */}
      <div className="flex gap-2 flex-wrap">
        {['SEMUA', 'X', 'XI', 'XII'].map(t => (
          <button key={t} onClick={() => setFilterTingkat(t)}
            className="px-3 py-1.5 rounded-xl text-xs font-medium transition"
            style={filterTingkat === t
              ? { background: 'rgba(6,182,212,0.15)', color: '#22d3ee', border: '1px solid rgba(6,182,212,0.3)' }
              : { background: 'var(--subtle-bg)', color: 'var(--text-muted)', border: '1px solid var(--subtle-border)' }}>
            {t === 'SEMUA' ? 'Semua Tingkat' : `Kelas ${t}`}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-5 py-3" style={{ borderBottom: '1px solid var(--subtle-border)' }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>
            {loading ? 'Memuat...' : `${filtered.length} kelas`}
          </p>
        </div>
        {loading ? (
          <div>{[1,2,3,4,5].map(i => (
            <div key={i} className="px-5 py-4 flex items-center gap-4 animate-pulse" style={{ borderBottom: '1px solid var(--subtle-border)' }}>
              <div className="w-10 h-10 rounded-xl flex-shrink-0" style={{ background: 'var(--subtle-bg)' }} />
              <div className="flex-1 space-y-2">
                <div className="h-3 rounded w-24" style={{ background: 'var(--subtle-bg)' }} />
                <div className="h-2.5 rounded w-40" style={{ background: 'var(--subtle-bg)' }} />
              </div>
            </div>
          ))}</div>
        ) : filtered.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-faint)' }} />
            <p className="font-medium" style={{ color: 'var(--text-muted)' }}>Belum ada kelas</p>
            <button onClick={openCreate} className="mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 transition">
              Tambah Kelas Pertama
            </button>
          </div>
        ) : (
          <div>
            {filtered.map(k => {
              const grad = TINGKAT_COLOR[k.tingkat] || 'from-blue-500 to-cyan-400'
              return (
                <div key={k.id} className="px-5 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition group"
                  style={{ borderBottom: '1px solid var(--subtle-border)' }}>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center flex-shrink-0 shadow`}>
                    <span className="text-white font-bold text-xs">{k.tingkat}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{k.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-faint)' }}>Tingkat {k.tingkat} · Jurusan {k.jurusan}</p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition flex-shrink-0">
                    <button onClick={() => openEdit(k)} className="p-2 rounded-xl transition hover:bg-white/5" style={{ color: 'var(--text-muted)' }} title="Edit">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setDeleteTarget(k)} className="p-2 rounded-xl transition hover:bg-red-500/10 text-red-400" title="Hapus">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal Tambah/Edit */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editTarget ? `Edit Kelas: ${editTarget.name}` : 'Tambah Kelas Baru'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Nama Kelas" required hint="Contoh: X IPA 1, XI RPL 2, XII IPS 3">
            <Input value={form.name} onChange={e => f('name')(e.target.value)} placeholder="cth. X IPA 1" required />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Tingkat" required>
              <Select value={form.tingkat} onChange={e => f('tingkat')(e.target.value)} options={TINGKAT_OPTS} />
            </FormField>
            <FormField label="Jurusan" required>
              <Select value={form.jurusan} onChange={e => f('jurusan')(e.target.value)} options={JURUSAN_OPTS} />
            </FormField>
          </div>
          {error && <p className="text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>}
          <SubmitButton loading={saving} label={editTarget ? 'Simpan Perubahan' : 'Tambah Kelas'} />
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Hapus Kelas"
        message={`Hapus kelas "${deleteTarget?.name}"? Jika ada user di kelas ini, penghapusan akan ditolak.`}
      />
    </div>
  )
}
