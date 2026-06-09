'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Tag, Plus, Edit3, Trash2, RefreshCw, Shield, Info } from 'lucide-react'
import { Modal, ConfirmDialog, FormField, Input, Select, SubmitButton } from '@/components/ui/crud'

interface Category { id: string; name: string; icon: string; color: string; createdAt: string }

const COLOR_OPTS = [
  { value: 'blue',   label: 'Biru' },
  { value: 'violet', label: 'Ungu' },
  { value: 'amber',  label: 'Kuning' },
  { value: 'green',  label: 'Hijau' },
  { value: 'pink',   label: 'Pink' },
  { value: 'cyan',   label: 'Cyan' },
  { value: 'red',    label: 'Merah' },
  { value: 'orange', label: 'Oranye' },
]

const COLOR_CFG: Record<string, { bg: string; color: string; border: string; grad: string }> = {
  blue:   { bg: 'bg-blue-500/10',   color: 'text-blue-400',   border: 'border-blue-500/20',   grad: 'from-blue-500 to-cyan-500' },
  violet: { bg: 'bg-violet-500/10', color: 'text-violet-400', border: 'border-violet-500/20', grad: 'from-violet-500 to-purple-500' },
  amber:  { bg: 'bg-amber-500/10',  color: 'text-amber-400',  border: 'border-amber-500/20',  grad: 'from-amber-500 to-yellow-500' },
  green:  { bg: 'bg-green-500/10',  color: 'text-green-400',  border: 'border-green-500/20',  grad: 'from-green-500 to-emerald-500' },
  pink:   { bg: 'bg-pink-500/10',   color: 'text-pink-400',   border: 'border-pink-500/20',   grad: 'from-pink-500 to-rose-500' },
  cyan:   { bg: 'bg-cyan-500/10',   color: 'text-cyan-400',   border: 'border-cyan-500/20',   grad: 'from-cyan-500 to-blue-400' },
  red:    { bg: 'bg-red-500/10',    color: 'text-red-400',    border: 'border-red-500/20',    grad: 'from-red-500 to-orange-500' },
  orange: { bg: 'bg-orange-500/10', color: 'text-orange-400', border: 'border-orange-500/20', grad: 'from-orange-500 to-amber-500' },
}

const ICON_SUGGESTIONS = ['⚽', '🏀', '🏐', '🎾', '🏓', '🎨', '🎤', '🎭', '📚', '🔬', '💡', '🎯', '🏆', '🎮', '🎲', '🏅', '🥊', '🎸', '🎹', '🖼️', '✍️', '🏊', '🤸', '🎳', '🎻']

const EMPTY = { name: '', icon: '🏅', color: 'blue' }

export default function CategoriesPage() {
  const { currentUser } = useAuth()
  const isAdmin = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'PANITIA'

  const [cats, setCats]         = useState<Category[]>([])
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError]       = useState('')
  const [showModal, setShowModal]       = useState(false)
  const [editTarget, setEditTarget]     = useState<Category | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)
  const [form, setForm] = useState(EMPTY)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await fetch('/api/categories', { credentials: 'include' })
      const json = await res.json()
      if (json.success) setCats(json.data)
    } catch {}
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  if (!isAdmin) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="glass-card rounded-2xl p-16 text-center">
          <Shield className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-faint)' }} />
          <p className="font-medium" style={{ color: 'var(--text-muted)' }}>Akses Ditolak — Hanya Admin & Panitia</p>
        </div>
      </div>
    )
  }

  const openCreate = () => { setEditTarget(null); setForm(EMPTY); setError(''); setShowModal(true) }
  const openEdit = (c: Category) => {
    setEditTarget(c)
    setForm({ name: c.name, icon: c.icon, color: c.color })
    setError(''); setShowModal(true)
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!form.name) { setError('Nama kategori wajib diisi'); return }
    setSaving(true); setError('')
    try {
      const url    = editTarget ? `/api/categories/${editTarget.id}` : '/api/categories'
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
      const res  = await fetch(`/api/categories/${deleteTarget.id}`, { method: 'DELETE', credentials: 'include' })
      const json = await res.json()
      if (json.success) { setDeleteTarget(null); fetchData() }
      else { alert(json.error || 'Gagal menghapus'); setDeleteTarget(null) }
    } catch {}
    setDeleting(false)
  }

  const f = (k: string) => (v: string) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Tag className="w-4 h-4 text-violet-400" />
            <span className="text-xs text-violet-400 font-medium uppercase tracking-wider">Manajemen Lomba</span>
          </div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Kategori Lomba</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{cats.length} kategori tersedia</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchData} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition"
            style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)', color: 'var(--text-muted)' }}>
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600 shadow-lg hover:opacity-90 transition">
            <Plus className="w-4 h-4" /> Tambah Kategori
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="glass-card rounded-2xl p-4 flex items-start gap-3" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
        <Info className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Kategori yang dibuat di sini akan muncul sebagai pilihan saat membuat kompetisi.
          Kategori yang sedang digunakan oleh kompetisi <strong style={{ color: 'var(--text-primary)' }}>tidak bisa dihapus</strong>.
        </p>
      </div>

      {/* Grid Kategori */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="glass-card rounded-2xl h-28 animate-pulse" style={{ background: 'var(--subtle-bg)' }} />)}
        </div>
      ) : cats.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center">
          <Tag className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-faint)' }} />
          <p className="font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Belum ada kategori lomba</p>
          <p className="text-xs mb-5" style={{ color: 'var(--text-faint)' }}>Buat kategori pertama seperti Olahraga, Seni, Akademik, dll.</p>
          <button onClick={openCreate} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-90 transition">
            Buat Kategori Pertama
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cats.map(cat => {
            const cfg = COLOR_CFG[cat.color] || COLOR_CFG.blue
            return (
              <div key={cat.id} className="glass-card rounded-2xl overflow-hidden hover:border-white/20 transition-all hover:-translate-y-0.5 group">
                <div className={`h-1.5 bg-gradient-to-r ${cfg.grad}`} />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cfg.grad} flex items-center justify-center text-2xl shadow-lg flex-shrink-0`}>
                        {cat.icon}
                      </div>
                      <div>
                        <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>{cat.name}</h3>
                        <span className={`text-[10px] font-semibold uppercase ${cfg.color}`}>{cat.color}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition flex-shrink-0">
                      <button onClick={() => openEdit(cat)} className="p-1.5 rounded-lg hover:bg-white/5 transition" style={{ color: 'var(--text-muted)' }}>
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteTarget(cat)} className="p-1.5 rounded-lg hover:bg-red-500/10 transition text-red-400">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--subtle-border)' }}>
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
                      {cat.name}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editTarget ? `Edit Kategori: ${editTarget.name}` : 'Tambah Kategori Baru'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Nama Kategori" required hint="Contoh: Olahraga, Seni, Akademik, Musik">
            <Input value={form.name} onChange={e => f('name')(e.target.value)} placeholder="cth. Olahraga" required />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Warna Tema">
              <Select value={form.color} onChange={e => f('color')(e.target.value)} options={COLOR_OPTS} />
            </FormField>
            <FormField label="Icon (emoji)">
              <Input value={form.icon} onChange={e => f('icon')(e.target.value)} placeholder="🏅" maxLength={4} />
            </FormField>
          </div>

          {/* Icon Picker */}
          <FormField label="Pilih Icon Cepat">
            <div className="flex flex-wrap gap-1.5">
              {ICON_SUGGESTIONS.map(ic => (
                <button key={ic} type="button"
                  onClick={() => f('icon')(ic)}
                  className="w-9 h-9 rounded-lg text-xl flex items-center justify-center transition hover:scale-110"
                  style={{
                    background: form.icon === ic ? 'rgba(139,92,246,0.2)' : 'var(--subtle-bg)',
                    border: form.icon === ic ? '1px solid rgba(139,92,246,0.5)' : '1px solid var(--subtle-border)',
                  }}>
                  {ic}
                </button>
              ))}
            </div>
          </FormField>

          {/* Preview */}
          {form.name && (
            <div className="p-3 rounded-xl" style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)' }}>
              <p className="text-xs mb-2" style={{ color: 'var(--text-faint)' }}>Preview:</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${COLOR_CFG[form.color]?.grad || 'from-blue-500 to-cyan-500'} flex items-center justify-center text-xl`}>
                  {form.icon}
                </div>
                <div>
                  <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{form.name}</span>
                  <div className="mt-0.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${COLOR_CFG[form.color]?.bg} ${COLOR_CFG[form.color]?.color} border ${COLOR_CFG[form.color]?.border}`}>
                      {form.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && <p className="text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>}
          <SubmitButton loading={saving} label={editTarget ? 'Simpan Perubahan' : 'Tambah Kategori'} />
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Hapus Kategori"
        message={`Hapus kategori "${deleteTarget?.name}"? Jika ada kompetisi yang menggunakan kategori ini, penghapusan akan ditolak.`}
      />
    </div>
  )
}
