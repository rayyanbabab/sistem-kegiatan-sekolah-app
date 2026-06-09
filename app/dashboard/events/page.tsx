'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Calendar, Plus, Edit3, Trash2, RefreshCw, Globe, Trophy, Vote, Flag, Music, BookOpen, LucideIcon } from 'lucide-react'
import { Modal, ConfirmDialog, FormField, Input, Select, Textarea, SubmitButton } from '@/components/ui/crud'

interface Event {
  id: string; name: string; description: string | null; date: string
  banner: string | null; status: string; type: string
  creator: { id: string; name: string }
  _count: { competitions: number; candidates: number }
}

const STATUS_OPTS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'UPCOMING', label: 'Upcoming' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
]
const TYPE_OPTS = [
  { value: 'CLASSMEETING', label: 'Classmeeting' },
  { value: 'PEMILU', label: 'Pemilu OSIS' },
  { value: 'LOMBA_KEMERDEKAAN', label: 'Lomba Kemerdekaan' },
  { value: 'PENTAS_SENI', label: 'Pentas Seni' },
  { value: 'MPLS', label: 'MPLS' },
  { value: 'LAINNYA', label: 'Lainnya' },
]
const STATUS_CFG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  ACTIVE:    { label: 'Aktif',    color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20' },
  UPCOMING:  { label: 'Akan Datang', color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20' },
  COMPLETED: { label: 'Selesai',  color: 'text-gray-400',   bg: 'bg-gray-500/10',   border: 'border-gray-500/20' },
  CANCELLED: { label: 'Dibatalkan', color: 'text-red-400',  bg: 'bg-red-500/10',    border: 'border-red-500/20' },
}
const TYPE_ICON: Record<string, LucideIcon> = {
  CLASSMEETING: Trophy, PEMILU: Vote, LOMBA_KEMERDEKAAN: Flag, PENTAS_SENI: Music, MPLS: BookOpen, LAINNYA: Calendar,
}

const EMPTY = { name: '', description: '', date: '', banner: '', status: 'UPCOMING', type: 'CLASSMEETING' }

export default function EventsPage() {
  const { currentUser } = useAuth()
  const isAdmin = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'PANITIA'

  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState<Event | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null)
  const [form, setForm] = useState(EMPTY)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/events', { credentials: 'include' })
      const json = await res.json()
      if (json.success) setEvents(json.data)
    } catch { }
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const openCreate = () => { setEditTarget(null); setForm(EMPTY); setError(''); setShowModal(true) }
  const openEdit   = (e: Event) => {
    setEditTarget(e)
    setForm({ name: e.name, description: e.description || '', date: e.date.split('T')[0], banner: e.banner || '', status: e.status, type: e.type })
    setError(''); setShowModal(true)
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault(); if (!form.name || !form.date) { setError('Nama dan tanggal wajib diisi'); return }
    setSaving(true); setError('')
    try {
      const url  = editTarget ? `/api/events/${editTarget.id}` : '/api/events'
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
      const res = await fetch(`/api/events/${deleteTarget.id}`, { method: 'DELETE', credentials: 'include' })
      const json = await res.json()
      if (json.success) { setDeleteTarget(null); fetchData() }
    } catch { }
    setDeleting(false)
  }

  const f = (k: string) => (v: string) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1"><Calendar className="w-4 h-4 text-blue-400" /><span className="text-xs text-blue-400 font-medium uppercase tracking-wider">Manajemen</span></div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Events</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{events.length} event terdaftar</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchData} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition" style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)', color: 'var(--text-muted)' }}>
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          {isAdmin && (
            <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 shadow-lg hover:opacity-90 transition">
              <Plus className="w-4 h-4" /> Tambah Event
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="glass-card rounded-2xl h-48 animate-pulse" style={{ background: 'var(--subtle-bg)' }} />)}
        </div>
      ) : events.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center">
          <Calendar className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-faint)' }} />
          <p className="font-medium" style={{ color: 'var(--text-muted)' }}>Belum ada event</p>
          {isAdmin && <button onClick={openCreate} className="mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:opacity-90 transition">Tambah Event Pertama</button>}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map(ev => {
            const s = STATUS_CFG[ev.status] || STATUS_CFG.UPCOMING
            return (
              <div key={ev.id} className="glass-card rounded-2xl overflow-hidden hover:border-white/20 transition-all hover:-translate-y-0.5 group">
                {/* Banner */}
                <div className="h-28 bg-gradient-to-br from-blue-600/30 to-violet-600/30 relative overflow-hidden">
                  {ev.banner && <img src={ev.banner} alt="" className="w-full h-full object-cover opacity-60" />}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {(() => { const Icon = TYPE_ICON[ev.type] || Calendar; return <Icon className="w-12 h-12 text-white/50" /> })()
                    }
                  </div>
                  {isAdmin && (
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button onClick={() => openEdit(ev)} className="w-8 h-8 rounded-lg bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition"><Edit3 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setDeleteTarget(ev)} className="w-8 h-8 rounded-lg bg-red-500/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-red-500/80 transition"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-sm leading-tight" style={{ color: 'var(--text-primary)' }}>{ev.name}</h3>
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex-shrink-0 ${s.bg} ${s.color} border ${s.border}`}>{s.label}</span>
                  </div>
                  {ev.description && <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--text-muted)' }}>{ev.description}</p>}
                  <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-faint)' }}>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(ev.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{ev._count.competitions} lomba · {ev._count.candidates} kandidat</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editTarget ? 'Edit Event' : 'Tambah Event Baru'} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Nama Event" required>
            <Input value={form.name} onChange={e => f('name')(e.target.value)} placeholder="cth. Classmeeting 2026" required />
          </FormField>
          <FormField label="Deskripsi">
            <Textarea rows={3} value={form.description} onChange={e => f('description')(e.target.value)} placeholder="Deskripsi event..." />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Tanggal" required>
              <Input type="date" value={form.date} onChange={e => f('date')(e.target.value)} required />
            </FormField>
            <FormField label="Tipe">
              <Select value={form.type} onChange={e => f('type')(e.target.value)} options={TYPE_OPTS} />
            </FormField>
          </div>
          <FormField label="Status">
            <Select value={form.status} onChange={e => f('status')(e.target.value)} options={STATUS_OPTS} />
          </FormField>
          <FormField label="URL Banner" hint="Link gambar banner (opsional)">
            <Input value={form.banner} onChange={e => f('banner')(e.target.value)} placeholder="https://..." />
          </FormField>
          {error && <p className="text-xs text-red-400 px-1">{error}</p>}
          <SubmitButton loading={saving} label={editTarget ? 'Simpan Perubahan' : 'Tambah Event'} />
        </form>
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Hapus Event" loading={deleting}
        message={`Apakah kamu yakin ingin menghapus event "${deleteTarget?.name}"? Semua data terkait akan ikut terhapus.`}
      />
    </div>
  )
}
