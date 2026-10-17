'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { BookOpen, Plus, Edit3, Trash2, RefreshCw, Shield, Users, Search, GraduationCap } from 'lucide-react'
import { Modal, ConfirmDialog, FormField, Input, Select, SubmitButton } from '@/components/ui/crud'

interface Kelas {
  id: string
  name: string
  tingkat: string
  jurusan: string
  createdAt: string
}

const TINGKAT_OPTS = [
  { value: 'X',   label: 'X (Kelas 10)' },
  { value: 'XI',  label: 'XI (Kelas 11)' },
  { value: 'XII', label: 'XII (Kelas 12)' },
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

const EMPTY = { name: '', tingkat: 'X', jurusan: 'RPL' }

export default function KelasPage() {
  const { currentUser } = useAuth()
  const [kelas, setKelas] = useState<Kelas[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState<Kelas | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Kelas | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [filterTingkat, setFilterTingkat] = useState('SEMUA')
  const [search, setSearch] = useState('')

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
        <div className="surface-card rounded-xl p-12 text-center border border-border">
          <Shield className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
          <h2 className="font-bold text-base text-foreground">Akses Dibatasi: Khusus Super Admin</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Data rombel kelas hanya dapat dikonfigurasi oleh administrator sistem.
          </p>
        </div>
      </div>
    )
  }

  const filtered = kelas.filter(k => {
    const matchesSearch = k.name.toLowerCase().includes(search.toLowerCase()) ||
      k.jurusan.toLowerCase().includes(search.toLowerCase())
    if (!matchesSearch) return false
    if (filterTingkat === 'SEMUA') return true
    return k.tingkat === filterTingkat
  })

  const openCreate = () => {
    setEditTarget(null)
    setForm(EMPTY)
    setError('')
    setShowModal(true)
  }

  const openEdit = (k: Kelas) => {
    setEditTarget(k)
    setForm({ name: k.name, tingkat: k.tingkat, jurusan: k.jurusan })
    setError('')
    setShowModal(true)
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!form.name || !form.tingkat || !form.jurusan) {
      setError('Semua field wajib diisi')
      return
    }
    setSaving(true)
    setError('')
    try {
      const url = editTarget ? `/api/kelas/${editTarget.id}` : '/api/kelas'
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
        setError(json.error || 'Gagal menyimpan kelas')
      }
    } catch {
      setError('Gagal terhubung ke server')
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/kelas/${deleteTarget.id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      const json = await res.json()
      if (json.success) {
        setDeleteTarget(null)
        fetchData()
      }
    } catch {}
    setDeleting(false)
  }

  const f = (k: string) => (v: string) => setForm(p => ({ ...p, [k]: v }))

  const grouped = [
    { tingkat: 'X', count: kelas.filter(k => k.tingkat === 'X').length },
    { tingkat: 'XI', count: kelas.filter(k => k.tingkat === 'XI').length },
    { tingkat: 'XII', count: kelas.filter(k => k.tingkat === 'XII').length },
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-4">
        <div>
          <span className="academic-badge mb-2">Master Data Sekolah</span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Kelola Rombongan Belajar
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Daftar kelas resmi untuk pengelompokan akun siswa dan pendaftaran delegasi turnamen.
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
            <span>Tambah Kelas</span>
          </button>
        </div>
      </div>

      {/* Stats per tingkat */}
      <div className="grid grid-cols-3 gap-4">
        {grouped.map(g => (
          <div key={g.tingkat} className="surface-card p-4 sm:p-5 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-secondary text-foreground/80 border border-border flex items-center justify-center font-bold text-sm shrink-0">
              {g.tingkat}
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
                {loading ? '...' : g.count}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Kelas Tingkat {g.tingkat}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex gap-1.5 flex-wrap">
          {['SEMUA', 'X', 'XI', 'XII'].map(t => (
            <button
              key={t}
              onClick={() => setFilterTingkat(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                filterTingkat === t
                  ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                  : 'bg-muted/40 text-muted-foreground border-border hover:bg-muted hover:text-foreground'
              }`}
            >
              {t === 'SEMUA' ? 'Semua Tingkat' : `Tingkat ${t}`}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-60">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari nama rombel..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-background border border-input text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Table list */}
      <div className="surface-card rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border bg-muted/20 flex items-center justify-between">
          <span className="text-xs font-bold text-foreground uppercase tracking-wider">
            {loading ? 'Memuat data...' : `Daftar Rombel (${filtered.length} Kelas)`}
          </span>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-10 rounded-md bg-muted animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center border-t border-border">
            <GraduationCap className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-semibold text-foreground">
              {search ? 'Tidak ada kelas sesuai pencarian' : 'Belum Ada Kelas Terdaftar'}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Tambahkan data rombel kelas untuk menghubungkan pendaftar lomba dan siswa.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map(k => (
              <div
                key={k.id}
                className="px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-muted/30 transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-secondary text-foreground/80 border border-border flex items-center justify-center font-bold text-xs shrink-0">
                    {k.tingkat}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">{k.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Tingkat {k.tingkat} • Jurusan {k.jurusan}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => openEdit(k)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    title="Ubah data kelas"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(k)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    title="Hapus rombel"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Form */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editTarget ? 'Edit Data Kelas' : 'Tambah Rombel Kelas'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Nama Rombel / Kelas" hint="Contoh: XII RPL 1, X DKV 2" required>
            <Input
              value={form.name}
              onChange={e => f('name')(e.target.value)}
              placeholder="Contoh: XII RPL 1"
              required
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Tingkat" required>
              <Select
                value={form.tingkat}
                onChange={e => f('tingkat')(e.target.value)}
                options={TINGKAT_OPTS}
              />
            </FormField>

            <FormField label="Program Jurusan" required>
              <Select
                value={form.jurusan}
                onChange={e => f('jurusan')(e.target.value)}
                options={JURUSAN_OPTS}
              />
            </FormField>
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}
          <SubmitButton loading={saving} label={editTarget ? 'Simpan Perubahan' : 'Tambah Kelas'} />
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Hapus Rombel Kelas"
        message={`Hapus kelas "${deleteTarget?.name}"? Tindakan ini dapat berdampak pada akun siswa yang terhubung dengan kelas ini.`}
        confirmLabel="Hapus Kelas"
      />
    </div>
  )
}
