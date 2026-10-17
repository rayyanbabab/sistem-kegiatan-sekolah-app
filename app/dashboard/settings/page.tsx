'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Settings, Shield, RefreshCw, Save, CheckCircle2 } from 'lucide-react'
import { FormField, Input, SubmitButton, ImageUpload } from '@/components/ui/crud'

interface SchoolSettings {
  id: string
  schoolName: string
  logo: string | null
  updatedAt: string
}

export default function SettingsPage() {
  const { currentUser } = useAuth()
  const [settings, setSettings] = useState<SchoolSettings | null>(null)
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [success, setSuccess]   = useState('')
  const [error, setError]       = useState('')
  const [form, setForm] = useState({ schoolName: '', logo: null as string | null })

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await fetch('/api/settings', { credentials: 'include' })
      const json = await res.json()
      if (json.success) {
        setSettings(json.data)
        setForm({ schoolName: json.data.schoolName, logo: json.data.logo })
      }
    } catch {}
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  if (currentUser?.role !== 'SUPER_ADMIN') {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="surface-card rounded-xl p-12 text-center border border-border">
          <Shield className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
          <p className="font-semibold text-foreground">Akses Dibatasi: Khusus Super Admin</p>
          <p className="text-xs text-muted-foreground mt-1">Pengaturan identitas sekolah hanya dapat diubah oleh administrator sistem.</p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!form.schoolName) { setError('Nama sekolah wajib diisi'); return }
    setSaving(true); setError(''); setSuccess('')
    try {
      const res  = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (json.success) {
        setSettings(json.data)
        setSuccess('Pengaturan berhasil disimpan!')
        setTimeout(() => setSuccess(''), 4000)
      } else {
        setError(json.error || 'Gagal menyimpan')
      }
    } catch { setError('Gagal terhubung ke server') }
    setSaving(false)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-4">
        <div>
          <span className="academic-badge mb-2">Konfigurasi Sistem</span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Pengaturan Sekolah</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Konfigurasi nama institusi dan logo aplikasi kesiswaan.</p>
        </div>
        <button
          onClick={fetchData}
          className="self-start sm:self-auto flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Perbarui</span>
        </button>
      </div>

      {loading ? (
        <div className="surface-card rounded-xl p-8 animate-pulse space-y-4 bg-muted" />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Logo Upload */}
          <div className="surface-card rounded-xl p-6 border border-border space-y-4">
            <div>
              <h2 className="font-bold text-sm text-foreground">Logo Institusi Sekolah</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Tampil pada bilah samping (sidebar) dan kop pengumuman.</p>
            </div>
            <ImageUpload
              value={form.logo}
              onChange={logo => setForm(p => ({ ...p, logo }))}
              shape="square"
              size={88}
              placeholder="Upload logo sekolah (maks 500KB)"
              maxSizeKB={500}
            />
          </div>

          {/* Nama Sekolah */}
          <div className="surface-card rounded-xl p-6 border border-border space-y-4">
            <div>
              <h2 className="font-bold text-sm text-foreground">Identitas Resmi Sekolah</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Nama resmi yang tampil di header dan halaman login</p>
            </div>
            <FormField label="Nama Sekolah" required>
              <Input
                value={form.schoolName}
                onChange={e => setForm(p => ({ ...p, schoolName: e.target.value }))}
                placeholder="Contoh: SMKS Digital Nusantara"
                required
              />
            </FormField>
          </div>

          {/* Last updated */}
          {settings?.updatedAt && (
            <p className="text-xs text-center text-muted-foreground">
              Terakhir diperbarui: {new Date(settings.updatedAt).toLocaleString('id-ID')}
            </p>
          )}

          {/* Feedback */}
          {error && <p className="text-xs text-destructive bg-destructive/10 px-4 py-2.5 rounded-lg border border-destructive/20">{error}</p>}
          {success && (
            <p className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-4 py-2.5 rounded-lg border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>{success}</span>
            </p>
          )}

          <SubmitButton loading={saving} label="Simpan Pengaturan Sekolah" />
        </form>
      )}

      {/* Preview Card */}
      {!loading && (
        <div className="surface-card rounded-xl p-5 border border-border">
          <p className="text-xs font-semibold uppercase tracking-wider mb-4 text-muted-foreground">Pratinjau Identitas Sekolah</p>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border border-border">
            <div className="w-9 h-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden shadow-xs">
              {form.logo
                ? <img src={form.logo} alt="logo" className="w-full h-full object-cover" />
                : <span>{form.schoolName?.slice(0, 2).toUpperCase() || 'SM'}</span>}
            </div>
            <div>
              <p className="font-bold text-sm text-foreground">{form.schoolName || 'Nama Sekolah'}</p>
              <p className="text-[11px] text-muted-foreground">Manajemen Kegiatan</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
