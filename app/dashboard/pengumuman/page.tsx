'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Megaphone, Plus, Edit3, Trash2, RefreshCw, Trophy, Vote, AlertTriangle, LucideIcon } from 'lucide-react'
import { Modal, ConfirmDialog, FormField, Input, Select, Textarea, SubmitButton } from '@/components/ui/crud'

interface Announcement {
  id: string; title: string; description: string; type: string
  image: string | null; createdAt: string
  creator: { id: string; name: string }
}

const TYPE_OPTS = [
  { value: 'UMUM', label: 'Umum' },
  { value: 'CLASSMEETING', label: 'Classmeeting' },
  { value: 'PEMILU', label: 'Pemilu OSIS' },
  { value: 'URGENT', label: 'Penting' },
]

const TYPE_CFG: Record<string, { color: string; bg: string; border: string; icon: LucideIcon }> = {
  UMUM:         { color: 'text-primary',          bg: 'bg-primary/10',          border: 'border-primary/20',          icon: Megaphone },
  CLASSMEETING: { color: 'text-amber-600 dark:text-amber-400',   bg: 'bg-amber-500/10',        border: 'border-amber-500/20',        icon: Trophy },
  PEMILU:       { color: 'text-indigo-600 dark:text-indigo-400',  bg: 'bg-indigo-500/10',       border: 'border-indigo-500/20',       icon: Vote },
  URGENT:       { color: 'text-destructive',      bg: 'bg-destructive/10',      border: 'border-destructive/20',      icon: AlertTriangle },
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
    if (!form.title || !form.description) { setError('Judul dan isi pengumuman wajib diisi'); return }
    setSaving(true); setError('')
    try {
      const url = editTarget ? `/api/announcements/${editTarget.id}` : '/api/announcements'
      const method = editTarget ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(form) })
      const json = await res.json()
      if (json.success) { setShowModal(false); fetchData() }
      else setError(json.error || 'Gagal menyimpan pengumuman')
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
  const FILTERS = [{ value: 'ALL', label: 'Semua Kategori' }, ...TYPE_OPTS]

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-4">
        <div>
          <span className="academic-badge mb-2">Pusat Informasi</span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Papan Pengumuman Sekolah</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Pemberitahuan resmi terkait kegiatan dan kesiswaan.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Perbarui</span>
          </button>
          {isAdmin && (
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Pengumuman</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-1.5 flex-wrap">
        {FILTERS.map(f2 => (
          <button
            key={f2.value}
            onClick={() => setFilterType(f2.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
              filterType === f2.value
                ? 'bg-primary text-primary-foreground border-primary font-semibold shadow-xs'
                : 'bg-muted/40 text-muted-foreground border-border hover:bg-muted hover:text-foreground'
            }`}
          >
            {f2.label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="surface-card rounded-xl h-24 animate-pulse bg-muted" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="surface-card rounded-xl p-12 text-center border border-dashed border-border">
          <Megaphone className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
          <p className="font-semibold text-foreground">Belum ada pengumuman pada kategori ini</p>
          <p className="text-xs text-muted-foreground mt-1">Pengumuman yang dipublikasikan akan muncul di dashboard siswa dan panitia.</p>
          {isAdmin && (
            <button
              onClick={openCreate}
              className="mt-4 px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Rilis Pengumuman Pertama
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(a => {
            const cfg = TYPE_CFG[a.type] || TYPE_CFG.UMUM
            return (
              <div key={a.id} className="surface-card rounded-xl p-5 hover:border-foreground/30 transition-colors group flex gap-4">
                <div className="w-9 h-9 rounded-lg bg-secondary border border-border flex items-center justify-center shrink-0 text-foreground/80">
                  <cfg.icon className="w-4 h-4 text-foreground/80" strokeWidth={1.75} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-bold text-sm text-foreground">{a.title}</h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-secondary text-secondary-foreground border border-border">
                          {a.type}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {a.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
                        <span>Penulis: {a.creator.name}</span>
                        <span>•</span>
                        <span>{new Date(a.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                    </div>
                    {isAdmin && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button
                          onClick={() => openEdit(a)}
                          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(a)}
                          className="p-1.5 rounded-md hover:bg-destructive/10 text-destructive transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editTarget ? 'Edit Pengumuman' : 'Buat Pengumuman Baru'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Judul Pengumuman" required>
            <Input value={form.title} onChange={e => f('title')(e.target.value)} placeholder="Contoh: Jadwal Pembagian Hadiah Classmeeting" required />
          </FormField>
          <FormField label="Kategori Pengumuman">
            <Select value={form.type} onChange={e => f('type')(e.target.value)} options={TYPE_OPTS} />
          </FormField>
          <FormField label="Isi Pesan Pengumuman" required>
            <Textarea rows={5} value={form.description} onChange={e => f('description')(e.target.value)} placeholder="Tuliskan isi pengumuman secara lengkap dan jelas..." required />
          </FormField>
          <FormField label="Tautan Gambar Lampiran" hint="Tautan gambar opsional">
            <Input value={form.image} onChange={e => f('image')(e.target.value)} placeholder="https://..." />
          </FormField>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <SubmitButton loading={saving} label={editTarget ? 'Simpan Perubahan' : 'Publikasikan Pengumuman'} />
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Hapus Pengumuman"
        message={`Apakah Anda yakin ingin menghapus pengumuman "${deleteTarget?.title}"?`}
      />
    </div>
  )
}
