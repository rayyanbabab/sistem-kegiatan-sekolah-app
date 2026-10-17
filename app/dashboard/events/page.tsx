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
  { value: 'ACTIVE', label: 'Aktif' },
  { value: 'UPCOMING', label: 'Akan Datang' },
  { value: 'COMPLETED', label: 'Selesai' },
  { value: 'CANCELLED', label: 'Dibatalkan' },
]
const TYPE_OPTS = [
  { value: 'CLASSMEETING', label: 'Classmeeting' },
  { value: 'PEMILU', label: 'Pemilu OSIS' },
  { value: 'LOMBA_KEMERDEKAAN', label: 'Lomba Kemerdekaan' },
  { value: 'PENTAS_SENI', label: 'Pentas Seni' },
  { value: 'MPLS', label: 'MPLS' },
  { value: 'LAINNYA', label: 'Lainnya' },
]
const STATUS_CFG: Record<string, { label: string; chipClass: string }> = {
  ACTIVE:    { label: 'Aktif',       chipClass: 'chip-active' },
  UPCOMING:  { label: 'Akan Datang', chipClass: 'chip-upcoming' },
  COMPLETED: { label: 'Selesai',     chipClass: 'chip-ended' },
  CANCELLED: { label: 'Dibatalkan',  chipClass: 'chip-ended' },
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
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form)
      })
      const json = await res.json()
      if (json.success) {
        setShowModal(false)
        fetchData()
      } else {
        setError(json.error || 'Gagal menyimpan event')
      }
    } catch {
      setError('Terjadi kesalahan jaringan')
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/events/${deleteTarget.id}`, { method: 'DELETE', credentials: 'include' })
      const json = await res.json()
      if (json.success) {
        setDeleteTarget(null)
        fetchData()
      } else {
        alert(json.error || 'Gagal menghapus event')
      }
    } catch {
      alert('Terjadi kesalahan jaringan')
    }
    setDeleting(false)
  }

  const f = (k: keyof typeof EMPTY) => (v: string) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-4">
        <div>
          <span className="academic-badge mb-2">Manajemen Agenda</span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Kelola Event Sekolah</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Daftar kegiatan kesiswaan, classmeeting, dan agenda pemilihan.</p>
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
              <span>Tambah Event</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="surface-card rounded-xl h-48 animate-pulse bg-muted" />)}
        </div>
      ) : events.length === 0 ? (
        <div className="surface-card rounded-xl p-12 text-center border border-dashed border-border">
          <Calendar className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
          <p className="font-semibold text-sm text-foreground">Belum ada agenda event yang dibuat</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
            Event digunakan sebagai wadah kompetisi Classmeeting, Pemilu OSIS, atau perayaan sekolah lainnya.
          </p>
          {isAdmin && (
            <button
              onClick={openCreate}
              className="mt-4 px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Buat Event Pertama
            </button>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map(ev => {
            const s = STATUS_CFG[ev.status] || STATUS_CFG.UPCOMING
            const Icon = TYPE_ICON[ev.type] || Calendar

            return (
              <div key={ev.id} className="surface-card rounded-xl overflow-hidden hover:border-primary/40 transition-colors flex flex-col justify-between group">
                <div>
                  {/* Banner / Header Visual */}
                  <div className="h-28 bg-muted relative overflow-hidden flex items-center justify-center border-b border-border">
                    {ev.banner ? (
                      <img src={ev.banner} alt={ev.name} className="w-full h-full object-cover" />
                    ) : (
                      <Icon className="w-10 h-10 text-muted-foreground/40" />
                    )}
                    {isAdmin && (
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(ev)}
                          className="w-7 h-7 rounded-md bg-background/90 text-foreground border border-border shadow-xs flex items-center justify-center hover:bg-background transition-colors"
                          aria-label="Edit event"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(ev)}
                          className="w-7 h-7 rounded-md bg-destructive text-destructive-foreground shadow-xs flex items-center justify-center hover:bg-destructive/90 transition-colors"
                          aria-label="Hapus event"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-sm text-foreground leading-tight">{ev.name}</h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${s.chipClass}`}>
                        {s.label}
                      </span>
                    </div>
                    {ev.description && (
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
                        {ev.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t border-border pt-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-primary" />
                      {new Date(ev.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      {ev._count.competitions} lomba • {ev._count.candidates} paslon
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editTarget ? 'Perbarui Agenda Event' : 'Buka Agenda Event Baru'} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Nama Agenda Event" required>
            <Input value={form.name} onChange={e => f('name')(e.target.value)} placeholder="Contoh: Classmeeting Semester Ganjil 2026" required />
          </FormField>
          <FormField label="Deskripsi Kegiatan">
            <Textarea rows={3} value={form.description} onChange={e => f('description')(e.target.value)} placeholder="Tuliskan petunjuk umum atau deskripsi kegiatan..." />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Tanggal Mulai" required>
              <Input type="date" value={form.date} onChange={e => f('date')(e.target.value)} required />
            </FormField>
            <FormField label="Tipe Kegiatan">
              <Select value={form.type} onChange={e => f('type')(e.target.value)} options={TYPE_OPTS} />
            </FormField>
          </div>
          <FormField label="Status Pelaksanaan">
            <Select value={form.status} onChange={e => f('status')(e.target.value)} options={STATUS_OPTS} />
          </FormField>
          <FormField label="URL Gambar Banner" hint="Tautan gambar banner kegiatan (opsional)">
            <Input value={form.banner} onChange={e => f('banner')(e.target.value)} placeholder="https://..." />
          </FormField>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <SubmitButton loading={saving} label={editTarget ? 'Simpan Perubahan' : 'Buat Event'} />
        </form>
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Konfirmasi Hapus Event"
        loading={deleting}
        message={`Apakah Anda yakin ingin menghapus agenda "${deleteTarget?.name}"? Seluruh cabang lomba dan data pendaftaran yang terhubung akan ikut terhapus.`}
      />
    </div>
  )
}
