'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Megaphone, Plus, Edit3, Trash2, RefreshCw, Filter } from 'lucide-react'
import { Modal, ConfirmDialog, FormField, Input, Select, Textarea, SubmitButton } from '@/components/ui/crud'

interface Announcement {
  id: string; title: string; description: string; type: string
  image: string | null; createdAt: string
  creator: { id: string; name: string }
}

const TYPE_OPTS = [
  { value: 'UMUM', label: 'Umum' }, { value: 'CLASSMEETING', label: 'Classmeeting' },
  { value: 'PEMILU', label: 'Pemilu' }, { value: 'URGENT', label: 'Urgent' },
]
const TYPE_CFG: Record<string, { color: string; bg: string; border: string; icon: string }> = {
  UMUM:        { color: 'text-blue-400',  bg: 'bg-blue-500/10',  border: 'border-blue-500/20',  icon: '📢' },
  CLASSMEETING:{ color: 'text-violet-400',bg: 'bg-violet-500/10',border: 'border-violet-500/20',icon: '🏆' },
  PEMILU:      { color: 'text-pink-400',  bg: 'bg-pink-500/10',  border: 'border-pink-500/20',  icon: '🗳️' },
  URGENT:      { color: 'text-red-400',   bg: 'bg-red-500/10',   border: 'border-red-500/20',   icon: '🚨' },
}
const EMPTY = { title: '', description: '', type: 'UMUM', image: '' }

export default function PengumumanPage() {
  const { currentUser } = useAuth()
  const isAdmin = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'PANITIA'

  const [items, setItems] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [filterType, setFilterType] = useState('ALL')
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState<Announcement | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Announcement | null>(null)
  const [form, setForm] = useState(EMPTY)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const url = filterType !== 'ALL' ? `/api/announcements?type=${filterType}` : '/api/announcements'
      const res = await fetch(url, { credentials: 'include' })
      const json = await res.json()
      if (json.success) setItems(json.data)
    } catch { }
    setLoading(false)
  }, [filterType])

  useEffect(() => { fetchData() }, [fetchData])

  const openCreate = () => { setEditTarget(null); setForm(EMPTY); setError(''); setShowModal(true) }
  const openEdit = (a: Announcement) => {
    setEditTarget(a)
    setForm({ title: a.title, description: a.description, type: a.type, image: a.image || '' })
    setError(''); setShowModal(true)
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!form.title || !form.description) { setError('Judul dan isi wajib diisi'); return }
    setSaving(true); setError('')
    try {
      const url = editTarget ? `/api/announcements/${editTarget.id}` : '/api/announcements'
      const method = editTarget ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(form) })
      const json = await res.json()
      if (json.success) { setShowModal(false); fetchData() }
      else setError(json.error || 'Gagal menyimpan')
    } catch { setError('Gagal terhubung ke server') }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return; setDeleting(true)
    try {
      await fetch(`/api/announcements/${deleteTarget.id}`, { method: 'DELETE', credentials: 'include' })
      setDeleteTarget(null); fetchData()
    } catch { }
    setDeleting(false)
  }

  const f = (k: string) => (v: string) => setForm(p => ({ ...p, [k]: v }))
  const FILTERS = [{ value: 'ALL', label: 'Semua' }, ...TYPE_OPTS]

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1"><Megaphone className="w-4 h-4 text-violet-400" /><span className="text-xs text-violet-400 font-medium uppercase tracking-wider">Pengumuman</span></div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Pengumuman</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{items.length} pengumuman</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchData} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition" style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)', color: 'var(--text-muted)' }}>
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          {isAdmin && (
            <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-pink-600 shadow-lg hover:opacity-90 transition">
              <Plus className="w-4 h-4" /> Buat Pengumuman
            </button>
          )}
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(f2 => (
          <button key={f2.value} onClick={() => setFilterType(f2.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-medium transition"
            style={filterType === f2.value
              ? { background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)' }
              : { background: 'var(--subtle-bg)', color: 'var(--text-muted)', border: '1px solid var(--subtle-border)' }}>
            {f2.label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="glass-card rounded-2xl h-24 animate-pulse" style={{ background: 'var(--subtle-bg)' }} />)}</div>
      ) : items.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center">
          <Megaphone className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-faint)' }} />
          <p className="font-medium" style={{ color: 'var(--text-muted)' }}>Belum ada pengumuman</p>
          {isAdmin && <button onClick={openCreate} className="mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-pink-600 hover:opacity-90 transition">Buat Pertama</button>}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(a => {
            const cfg = TYPE_CFG[a.type] || TYPE_CFG.UMUM
            return (
              <div key={a.id} className="glass-card rounded-2xl p-5 hover:border-white/20 transition-all group flex gap-4">
                <span className="text-2xl flex-shrink-0">{cfg.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{a.title}</h3>
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${cfg.bg} ${cfg.color} border ${cfg.border}`}>{a.type}</span>
                      </div>
                      <p className="text-sm line-clamp-2" style={{ color: 'var(--text-muted)' }}>{a.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs" style={{ color: 'var(--text-faint)' }}>
                        <span>Oleh: {a.creator.name}</span>
                        <span>{new Date(a.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>
                    {isAdmin && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition flex-shrink-0">
                        <button onClick={() => openEdit(a)} className="p-2 rounded-xl hover:bg-white/5 transition" style={{ color: 'var(--text-muted)' }}><Edit3 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setDeleteTarget(a)} className="p-2 rounded-xl hover:bg-red-500/10 transition text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editTarget ? 'Edit Pengumuman' : 'Buat Pengumuman'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Judul" required>
            <Input value={form.title} onChange={e => f('title')(e.target.value)} placeholder="Judul pengumuman..." required />
          </FormField>
          <FormField label="Tipe">
            <Select value={form.type} onChange={e => f('type')(e.target.value)} options={TYPE_OPTS} />
          </FormField>
          <FormField label="Isi Pengumuman" required>
            <Textarea rows={5} value={form.description} onChange={e => f('description')(e.target.value)} placeholder="Tulis isi pengumuman di sini..." required />
          </FormField>
          <FormField label="URL Gambar" hint="Opsional">
            <Input value={form.image} onChange={e => f('image')(e.target.value)} placeholder="https://..." />
          </FormField>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <SubmitButton loading={saving} label={editTarget ? 'Simpan Perubahan' : 'Publikasikan'} />
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting}
        title="Hapus Pengumuman" message={`Hapus pengumuman "${deleteTarget?.title}"?`} />
    </div>
  )
}
