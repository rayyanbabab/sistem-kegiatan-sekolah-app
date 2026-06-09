'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Trophy, Plus, Edit3, Trash2, RefreshCw, Calendar, Clock, MapPin, AlertTriangle } from 'lucide-react'
import { Modal, ConfirmDialog, FormField, Input, Select, SubmitButton } from '@/components/ui/crud'

interface Competition {
  id: string; name: string; category: string; date: string
  time: string; location: string
  event: { id: string; name: string }
  _count: { teams: number }
}
interface Event    { id: string; name: string }
interface Category { id: string; name: string; icon: string; color: string }

const COLOR_MAP: Record<string, { bg: string; color: string; border: string; grad: string }> = {
  blue:   { bg: 'bg-blue-500/10',   color: 'text-blue-400',   border: 'border-blue-500/20',   grad: 'from-blue-500 to-cyan-500' },
  violet: { bg: 'bg-violet-500/10', color: 'text-violet-400', border: 'border-violet-500/20', grad: 'from-violet-500 to-purple-500' },
  amber:  { bg: 'bg-amber-500/10',  color: 'text-amber-400',  border: 'border-amber-500/20',  grad: 'from-amber-500 to-yellow-500' },
  green:  { bg: 'bg-green-500/10',  color: 'text-green-400',  border: 'border-green-500/20',  grad: 'from-green-500 to-emerald-500' },
  pink:   { bg: 'bg-pink-500/10',   color: 'text-pink-400',   border: 'border-pink-500/20',   grad: 'from-pink-500 to-rose-500' },
  cyan:   { bg: 'bg-cyan-500/10',   color: 'text-cyan-400',   border: 'border-cyan-500/20',   grad: 'from-cyan-500 to-blue-400' },
  red:    { bg: 'bg-red-500/10',    color: 'text-red-400',    border: 'border-red-500/20',    grad: 'from-red-500 to-orange-500' },
  orange: { bg: 'bg-orange-500/10', color: 'text-orange-400', border: 'border-orange-500/20', grad: 'from-orange-500 to-amber-500' },
}

const FALLBACK_CFG = { bg: 'bg-blue-500/10', color: 'text-blue-400', border: 'border-blue-500/20', grad: 'from-blue-500 to-cyan-500' }

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

  // Helpers — lookup category metadata by name
  const getCatMeta = (catName: string) => {
    const cat = categories.find(c => c.name === catName)
    const colorCfg = COLOR_MAP[cat?.color || 'blue'] || FALLBACK_CFG
    return { icon: cat?.icon || '🏅', ...colorCfg }
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
      else setError(json.error || 'Gagal menyimpan')
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
  const catOpts    = categories.map(c => ({ value: c.name, label: `${c.icon} ${c.name}` }))
  const FILTERS    = [{ value: 'ALL', label: 'Semua' }, ...categories.map(c => ({ value: c.name, label: `${c.icon} ${c.name}` }))]

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1"><Trophy className="w-4 h-4 text-amber-400" /><span className="text-xs text-amber-400 font-medium uppercase tracking-wider">Classmeeting</span></div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Kompetisi</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{comps.length} kompetisi terdaftar</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchData} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition"
            style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)', color: 'var(--text-muted)' }}>
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          {isAdmin && (
            <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg hover:opacity-90 transition">
              <Plus className="w-4 h-4" /> Tambah Kompetisi
            </button>
          )}
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(f2 => (
          <button key={f2.value} onClick={() => setFilterCat(f2.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-medium transition"
            style={filterCat === f2.value
              ? { background: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)' }
              : { background: 'var(--subtle-bg)', color: 'var(--text-muted)', border: '1px solid var(--subtle-border)' }}>
            {f2.label}
          </button>
        ))}
      </div>

      {/* Peringatan jika belum ada kategori */}
      {!loading && categories.length === 0 && isAdmin && (
        <div className="glass-card rounded-2xl p-4 flex items-start gap-3" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Belum ada <strong style={{ color: 'var(--text-primary)' }}>kategori lomba</strong>.
            Buat kategori terlebih dahulu di menu <strong style={{ color: '#fbbf24' }}>Settings → Kategori Lomba</strong>.
          </p>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="glass-card rounded-2xl h-40 animate-pulse" style={{ background: 'var(--subtle-bg)' }} />)}
        </div>
      ) : displayed.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center">
          <Trophy className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-faint)' }} />
          <p className="font-medium" style={{ color: 'var(--text-muted)' }}>Belum ada kompetisi</p>
          {isAdmin && <button onClick={openCreate} className="mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 transition">Tambah Kompetisi</button>}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayed.map(comp => {
            const meta = getCatMeta(comp.category)
            return (
              <div key={comp.id} className="glass-card rounded-2xl overflow-hidden hover:border-white/20 transition-all hover:-translate-y-0.5 group">
                <div className={`h-1.5 bg-gradient-to-r ${meta.grad}`} />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{meta.icon}</span>
                      <div>
                        <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{comp.name}</h3>
                        <span className={`text-[10px] font-semibold ${meta.color}`}>{comp.event.name}</span>
                      </div>
                    </div>
                    {isAdmin && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition flex-shrink-0">
                        <button onClick={() => openEdit(comp)} className="p-1.5 rounded-lg hover:bg-white/5 transition" style={{ color: 'var(--text-muted)' }}><Edit3 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setDeleteTarget(comp)} className="p-1.5 rounded-lg hover:bg-red-500/10 transition text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1.5 text-xs" style={{ color: 'var(--text-faint)' }}>
                    <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" />{new Date(comp.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{comp.time} WIB</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" />{comp.location}</span>
                  </div>
                  <div className="mt-3 pt-3 flex items-center justify-between" style={{ borderTop: '1px solid var(--subtle-border)' }}>
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${meta.bg} ${meta.color} border ${meta.border}`}>{meta.icon} {comp.category}</span>
                    <span className="text-xs" style={{ color: 'var(--text-faint)' }}>{comp._count.teams} tim</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editTarget ? 'Edit Kompetisi' : 'Tambah Kompetisi'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Nama Kompetisi" required>
            <Input value={form.name} onChange={e => f('name')(e.target.value)} placeholder="cth. Futsal Putra" required />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Kategori" required>
              {catOpts.length === 0
                ? <p className="text-xs text-amber-400 py-2">Belum ada kategori. Buat di Settings.</p>
                : <Select value={form.category} onChange={e => f('category')(e.target.value)} options={catOpts} placeholder="Pilih kategori..." />}
            </FormField>
            <FormField label="Event Terkait" required>
              <Select value={form.eventId} onChange={e => f('eventId')(e.target.value)} options={eventOpts} placeholder="Pilih event..." />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Tanggal" required>
              <Input type="date" value={form.date} onChange={e => f('date')(e.target.value)} required />
            </FormField>
            <FormField label="Jam">
              <Input type="time" value={form.time} onChange={e => f('time')(e.target.value)} />
            </FormField>
          </div>
          <FormField label="Lokasi" required>
            <Input value={form.location} onChange={e => f('location')(e.target.value)} placeholder="cth. Lapangan Utama" required />
          </FormField>
          {error && <p className="text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>}
          <SubmitButton loading={saving} label={editTarget ? 'Simpan Perubahan' : 'Tambah Kompetisi'} />
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting}
        title="Hapus Kompetisi" message={`Hapus kompetisi "${deleteTarget?.name}"? Tim yang terdaftar juga akan dihapus.`} />
    </div>
  )
}
