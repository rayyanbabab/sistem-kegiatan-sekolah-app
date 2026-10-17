'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Trophy, Plus, Edit3, Trash2, RefreshCw, Calendar, Clock, MapPin, AlertTriangle } from 'lucide-react'
import { Modal, ConfirmDialog, FormField, Input, Select, SubmitButton } from '@/components/ui/crud'
import { renderCategoryIcon } from '@/app/dashboard/settings/categories/page'

interface Competition {
  id: string; name: string; category: string; date: string
  time: string; location: string
  event: { id: string; name: string }
  _count: { teams: number }
}
interface Event    { id: string; name: string }
interface Category { id: string; name: string; icon: string; color: string }

const COLOR_MAP: Record<string, { bg: string; color: string; border: string }> = {
  blue:   { bg: 'bg-primary/10',    color: 'text-primary',          border: 'border-primary/20' },
  violet: { bg: 'bg-indigo-500/10', color: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-500/20' },
  amber:  { bg: 'bg-amber-500/10',  color: 'text-amber-600 dark:text-amber-400',   border: 'border-amber-500/20' },
  green:  { bg: 'bg-emerald-500/10',color: 'text-emerald-600 dark:text-emerald-400',border: 'border-emerald-500/20' },
  pink:   { bg: 'bg-rose-500/10',   color: 'text-rose-600 dark:text-rose-400',     border: 'border-rose-500/20' },
  cyan:   { bg: 'bg-sky-500/10',    color: 'text-sky-600 dark:text-sky-400',       border: 'border-sky-500/20' },
  red:    { bg: 'bg-red-500/10',    color: 'text-red-600 dark:text-red-400',       border: 'border-red-500/20' },
  orange: { bg: 'bg-orange-500/10', color: 'text-orange-600 dark:text-orange-400', border: 'border-orange-500/20' },
}

const FALLBACK_CFG = { bg: 'bg-primary/10', color: 'text-primary', border: 'border-primary/20' }

const EMPTY = { name: '', category: '', date: '', time: '08:00', location: '', eventId: '' }

export default function CompetitionsPage() {
  const { currentUser } = useAuth()
  const isAdmin = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'PANITIA'

  const [comps, setComps]         = useState<Competition[]>([])
  const [events, setEvents]       = useState<Event[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [deleting, setDeleting]   = useState(false)
  const [error, setError]         = useState('')
  const [filterCat, setFilterCat] = useState('ALL')
  const [showModal, setShowModal]       = useState(false)
  const [editTarget, setEditTarget]     = useState<Competition | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Competition | null>(null)
  const [form, setForm] = useState(EMPTY)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [c, e, cat] = await Promise.all([
        fetch('/api/competitions', { credentials: 'include' }),
        fetch('/api/events',       { credentials: 'include' }),
        fetch('/api/categories',   { credentials: 'include' }),
      ])
      const cj = await c.json();   if (cj.success)   setComps(cj.data)
      const ej = await e.json();   if (ej.success)   setEvents(ej.data)
      const catj = await cat.json(); if (catj.success) setCategories(catj.data)
    } catch {}
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  // Lookup category metadata by name
  const getCatMeta = (catName: string) => {
    const cat = categories.find(c => c.name === catName)
    const colorCfg = COLOR_MAP[cat?.color || 'blue'] || FALLBACK_CFG
    return { icon: cat?.icon || 'trophy', ...colorCfg }
  }

  const openCreate = () => {
    setEditTarget(null)
    setForm({ ...EMPTY, eventId: events[0]?.id || '', category: categories[0]?.name || '' })
    setError(''); setShowModal(true)
  }
  const openEdit = (c: Competition) => {
    setEditTarget(c)
    setForm({ name: c.name, category: c.category, date: c.date.split('T')[0], time: c.time, location: c.location, eventId: c.event.id })
    setError(''); setShowModal(true)
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!form.name || !form.date || !form.location || !form.eventId) { setError('Semua field wajib diisi'); return }
    setSaving(true); setError('')
    try {
      const url    = editTarget ? `/api/competitions/${editTarget.id}` : '/api/competitions'
      const method = editTarget ? 'PUT' : 'POST'
      const res  = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(form) })
      const json = await res.json()
      if (json.success) { setShowModal(false); fetchData() }
      else setError(json.error || 'Gagal menyimpan kompetisi')
    } catch { setError('Gagal terhubung ke server') }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return; setDeleting(true)
    try {
      await fetch(`/api/competitions/${deleteTarget.id}`, { method: 'DELETE', credentials: 'include' })
      setDeleteTarget(null); fetchData()
    } catch {}
    setDeleting(false)
  }

  const f = (k: string) => (v: string) => setForm(p => ({ ...p, [k]: v }))

  const displayed  = filterCat === 'ALL' ? comps : comps.filter(c => c.category === filterCat)
  const eventOpts  = events.map(e => ({ value: e.id, label: e.name }))
  const catOpts    = categories.map(c => ({ value: c.name, label: c.name }))
  const FILTERS    = [{ value: 'ALL', label: 'Semua Kategori' }, ...categories.map(c => ({ value: c.name, label: c.name }))]

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-4">
        <div>
          <span className="academic-badge mb-2">Pekan Classmeeting</span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Daftar Cabang Lomba</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{comps.length} cabang kompetisi siap ditandingkan.</p>
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
              <span>Tambah Lomba</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-1.5 flex-wrap">
        {FILTERS.map(f2 => (
          <button
            key={f2.value}
            onClick={() => setFilterCat(f2.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
              filterCat === f2.value
                ? 'bg-primary text-primary-foreground border-primary font-semibold shadow-xs'
                : 'bg-muted/40 text-muted-foreground border-border hover:bg-muted hover:text-foreground'
            }`}
          >
            {f2.label}
          </button>
        ))}
      </div>

      {/* Peringatan jika belum ada kategori */}
      {!loading && categories.length === 0 && isAdmin && (
        <div className="surface-card rounded-xl p-4 flex items-start gap-3 border border-amber-500/30 bg-amber-500/5">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
          <p className="text-xs sm:text-sm text-foreground">
            Belum ada kategori cabang lomba. Buat kategori terlebih dahulu di menu <strong>Pengaturan &gt; Kategori Lomba</strong>.
          </p>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="surface-card rounded-xl h-44 animate-pulse bg-muted" />)}
        </div>
      ) : displayed.length === 0 ? (
        <div className="surface-card rounded-xl p-12 text-center border border-dashed border-border">
          <Trophy className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
          <p className="font-semibold text-foreground">Belum ada cabang lomba di kategori ini</p>
          <p className="text-xs text-muted-foreground mt-1">Tambahkan cabang lomba baru untuk membuka registrasi tim delegasi kelas.</p>
          {isAdmin && (
            <button
              onClick={openCreate}
              className="mt-4 px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Tambah Cabang Lomba
            </button>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayed.map(comp => {
            const meta = getCatMeta(comp.category)
            return (
              <div key={comp.id} className="surface-card rounded-xl p-5 hover:border-primary/40 transition-colors flex flex-col justify-between group">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-secondary border border-border flex items-center justify-center text-foreground/80 shrink-0">
                        {renderCategoryIcon(meta.icon, "w-4 h-4 text-foreground/80")}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm text-foreground truncate">{comp.name}</h3>
                        <span className={`text-[11px] font-semibold ${meta.color}`}>{comp.event.name}</span>
                      </div>
                    </div>
                    {isAdmin && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button
                          onClick={() => openEdit(comp)}
                          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          title="Edit lomba"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(comp)}
                          className="p-1.5 rounded-md hover:bg-destructive/10 text-destructive transition-colors"
                          title="Hapus lomba"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5 text-xs text-muted-foreground pt-1">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                      {new Date(comp.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                      {comp.time} WIB
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                      {comp.location}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${meta.bg} ${meta.color} ${meta.border}`}>
                    {comp.category}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {comp._count.teams} tim terdaftar
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editTarget ? 'Edit Cabang Lomba' : 'Tambah Cabang Lomba'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Nama Cabang Lomba" required>
            <Input value={form.name} onChange={e => f('name')(e.target.value)} placeholder="Contoh: Futsal Putra Antarkelas" required />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Kategori" required>
              {catOpts.length === 0 ? (
                <p className="text-xs text-destructive py-2">Belum ada kategori lomba.</p>
              ) : (
                <Select value={form.category} onChange={e => f('category')(e.target.value)} options={catOpts} placeholder="Pilih kategori..." />
              )}
            </FormField>
            <FormField label="Event Terkait" required>
              <Select value={form.eventId} onChange={e => f('eventId')(e.target.value)} options={eventOpts} placeholder="Pilih event..." />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Tanggal Pelaksanaan" required>
              <Input type="date" value={form.date} onChange={e => f('date')(e.target.value)} required />
            </FormField>
            <FormField label="Waktu Tanding">
              <Input type="time" value={form.time} onChange={e => f('time')(e.target.value)} />
            </FormField>
          </div>
          <FormField label="Lokasi Pertandingan" required>
            <Input value={form.location} onChange={e => f('location')(e.target.value)} placeholder="Contoh: Lapangan Utama Sekolah" required />
          </FormField>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <SubmitButton loading={saving} label={editTarget ? 'Simpan Perubahan' : 'Tambah Kompetisi'} />
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Hapus Cabang Lomba"
        message={`Apakah Anda yakin ingin menghapus cabang lomba "${deleteTarget?.name}"? Seluruh data pendaftaran tim kelas terkait akan ikut terhapus.`}
      />
    </div>
  )
}
