'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import {
  Tag, Plus, Edit3, Trash2, RefreshCw, Shield, Info, AlertCircle,
  Trophy, Dumbbell, Palette, Music, BookOpen, Target, Award, Layers, LucideIcon
} from 'lucide-react'
import { Modal, ConfirmDialog, FormField, Input, Select, SubmitButton } from '@/components/ui/crud'

interface Category {
  id: string
  name: string
  icon: string
  color: string
  createdAt: string
}

const COLOR_OPTS = [
  { value: 'blue',   label: 'Biru Akademik' },
  { value: 'amber',  label: 'Kuning Amber (Juara)' },
  { value: 'green',  label: 'Hijau Emerald' },
  { value: 'violet', label: 'Ungu Indigo' },
  { value: 'pink',   label: 'Merah Muda' },
  { value: 'orange', label: 'Oranye Hangat' },
]

const COLOR_CFG: Record<string, { bg: string; color: string; border: string }> = {
  blue:   { bg: 'bg-primary/10',    color: 'text-primary',          border: 'border-primary/25' },
  amber:  { bg: 'bg-amber-500/15',  color: 'text-amber-600 dark:text-amber-400',   border: 'border-amber-500/30' },
  green:  { bg: 'bg-emerald-500/15',color: 'text-emerald-600 dark:text-emerald-400',border: 'border-emerald-500/30' },
  violet: { bg: 'bg-indigo-500/15', color: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-500/30' },
  pink:   { bg: 'bg-rose-500/15',   color: 'text-rose-600 dark:text-rose-400',     border: 'border-rose-500/30' },
  orange: { bg: 'bg-orange-500/15', color: 'text-orange-600 dark:text-orange-400', border: 'border-orange-500/30' },
}

export const ICON_OPTIONS: { id: string; label: string; icon: LucideIcon }[] = [
  { id: 'trophy',    label: 'Piala / Juara',      icon: Trophy },
  { id: 'olahraga',  label: 'Olahraga & Atletik', icon: Dumbbell },
  { id: 'seni',      label: 'Seni & Budaya',      icon: Palette },
  { id: 'akademik',  label: 'Akademik & Sains',   icon: BookOpen },
  { id: 'musik',     label: 'Musik & Vokal',      icon: Music },
  { id: 'target',    label: 'E-Sport & Lomba',    icon: Target },
  { id: 'award',     label: 'Penghargaan',        icon: Award },
  { id: 'kompetisi', label: 'Umum & Turnamen',    icon: Layers },
]

export function renderCategoryIcon(iconName: string, className = "w-4 h-4") {
  const key = iconName?.toLowerCase() || ''
  if (key === 'olahraga' || key === 'dumbbell' || key === '⚽' || key === '🏀' || key === '🏐' || key === '🏸') {
    return <Dumbbell className={className} strokeWidth={1.75} />
  }
  if (key === 'seni' || key === 'palette' || key === '🎨' || key === '🎭') {
    return <Palette className={className} strokeWidth={1.75} />
  }
  if (key === 'musik' || key === 'music' || key === '🎸' || key === '🎹' || key === '🥁' || key === '🎤') {
    return <Music className={className} strokeWidth={1.75} />
  }
  if (key === 'akademik' || key === 'bookopen' || key === '📚' || key === '🔬') {
    return <BookOpen className={className} strokeWidth={1.75} />
  }
  if (key === 'target' || key === '🎮' || key === '♟️' || key === '🎯') {
    return <Target className={className} strokeWidth={1.75} />
  }
  if (key === 'award' || key === 'prestasi') {
    return <Award className={className} strokeWidth={1.75} />
  }
  if (key === 'kompetisi' || key === 'layers') {
    return <Layers className={className} strokeWidth={1.75} />
  }
  return <Trophy className={className} strokeWidth={1.75} />
}

const EMPTY = { name: '', icon: 'trophy', color: 'blue' }

export default function CategoriesPage() {
  const { currentUser } = useAuth()
  const isAdmin = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'PANITIA'

  const [cats, setCats] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState<Category | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)
  const [form, setForm] = useState(EMPTY)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/categories', { credentials: 'include' })
      const json = await res.json()
      if (json.success) setCats(json.data)
    } catch {}
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  if (!isAdmin) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="surface-card rounded-xl p-12 text-center border border-border">
          <Shield className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
          <h2 className="font-bold text-base text-foreground">Akses Dibatasi: Khusus Panitia & Admin</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Konfigurasi kategori cabang lomba hanya dapat diakses oleh Panitia atau Admin.
          </p>
        </div>
      </div>
    )
  }

  const openCreate = () => {
    setEditTarget(null)
    setForm(EMPTY)
    setError('')
    setShowModal(true)
  }

  const openEdit = (c: Category) => {
    setEditTarget(c)
    setForm({ name: c.name, icon: c.icon, color: c.color })
    setError('')
    setShowModal(true)
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!form.name.trim()) {
      setError('Nama kategori wajib diisi')
      return
    }
    setSaving(true)
    setError('')
    try {
      const url = editTarget ? `/api/categories/${editTarget.id}` : '/api/categories'
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
        setError(json.error || 'Gagal menyimpan kategori')
      }
    } catch {
      setError('Gagal menghubungi server')
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/categories/${deleteTarget.id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      const json = await res.json()
      if (json.success) {
        setDeleteTarget(null)
        fetchData()
      } else {
        alert(json.error || 'Gagal menghapus kategori')
        setDeleteTarget(null)
      }
    } catch {}
    setDeleting(false)
  }

  const f = (k: string) => (v: string) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-4">
        <div>
          <span className="academic-badge mb-2">Konfigurasi Modul</span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Kategori Cabang Lomba
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Grup klasifikasi kompetisi seperti Olahraga, Seni & Budaya, serta Olimpiade Akademik.
          </p>
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
            <span>Tambah Kategori</span>
          </button>
        </div>
      </div>

      {/* Info notice */}
      <div className="surface-card rounded-xl p-4 border border-border bg-muted/20 flex items-start gap-3">
        <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          Kategori yang dibuat di sini akan menjadi pilihan filter dan label di halaman <strong>Daftar Lomba</strong> dan <strong>Jadwal Pertandingan</strong>. Kategori yang sudah memiliki cabang lomba aktif tidak dapat dihapus.
        </p>
      </div>

      {/* Grid of categories */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="surface-card rounded-xl h-28 bg-muted animate-pulse" />)}
        </div>
      ) : cats.length === 0 ? (
        <div className="surface-card rounded-xl p-12 text-center border border-dashed border-border">
          <Tag className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Belum Ada Kategori Cabang</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Buat kategori baru untuk mengelompokkan cabang lomba Classmeeting.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cats.map(cat => {
            const cfg = COLOR_CFG[cat.color] || COLOR_CFG.blue

            return (
              <div
                key={cat.id}
                className="surface-card p-4 rounded-xl border border-border flex items-center justify-between gap-3 hover:border-primary/40 transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-secondary border border-border flex items-center justify-center text-foreground/80 shrink-0">
                    {renderCategoryIcon(cat.icon, "w-4 h-4 text-foreground/80")}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-foreground truncate">{cat.name}</h3>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mt-1 border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                      {cat.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(cat)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    title="Edit kategori"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(cat)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    title="Hapus kategori"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editTarget ? `Edit Kategori: ${editTarget.name}` : 'Tambah Kategori Lomba'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Nama Kategori" hint="Contoh: Olahraga, Seni & Tari, Olimpiade Sains" required>
            <Input
              value={form.name}
              onChange={e => f('name')(e.target.value)}
              placeholder="Contoh: Olahraga"
              required
            />
          </FormField>

          <FormField label="Warna Aksen Badge">
            <Select
              value={form.color}
              onChange={e => f('color')(e.target.value)}
              options={COLOR_OPTS}
            />
          </FormField>

          <FormField label="Pilih Ikon Kategori (SVG)">
            <div className="grid grid-cols-2 gap-2 p-2 rounded-lg bg-muted/40 border border-border">
              {ICON_OPTIONS.map(opt => {
                const OptIcon = opt.icon
                const isSelected = form.icon === opt.id || (form.icon === 'trophy' && opt.id === 'trophy')
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => f('icon')(opt.id)}
                    className={`flex items-center gap-2 p-2 rounded-md text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-primary text-primary-foreground shadow-xs'
                        : 'bg-background hover:bg-muted text-foreground border border-border/60'
                    }`}
                  >
                    <OptIcon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                    <span className="truncate">{opt.label}</span>
                  </button>
                )
              })}
            </div>
          </FormField>

          {/* Pratinjau Tampilan */}
          {form.name && (
            <div className="p-3.5 rounded-lg bg-muted/30 border border-border">
              <p className="text-[11px] font-semibold text-muted-foreground mb-2">Pratinjau Badge:</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-secondary border border-border flex items-center justify-center text-foreground/80 shrink-0">
                  {renderCategoryIcon(form.icon, "w-4 h-4 text-foreground/80")}
                </div>
                <div>
                  <p className="font-semibold text-xs text-foreground">{form.name}</p>
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mt-0.5 border ${
                    COLOR_CFG[form.color]?.bg || 'bg-primary/10'
                  } ${
                    COLOR_CFG[form.color]?.color || 'text-primary'
                  } ${
                    COLOR_CFG[form.color]?.border || 'border-primary/20'
                  }`}>
                    {form.name}
                  </span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <SubmitButton loading={saving} label={editTarget ? 'Simpan Perubahan' : 'Buat Kategori'} />
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Hapus Kategori Lomba"
        message={`Hapus kategori "${deleteTarget?.name}"? Jika ada cabang lomba yang terdaftar menggunakan kategori ini, sistem akan menolak penghapusan.`}
        confirmLabel="Hapus Kategori"
      />
    </div>
  )
}
