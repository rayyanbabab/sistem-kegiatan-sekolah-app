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
        <div className="glass-card rounded-2xl p-16 text-center">
          <Shield className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-faint)' }} />
          <p className="font-medium" style={{ color: 'var(--text-muted)' }}>Akses Ditolak — Hanya Super Admin</p>
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
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Settings className="w-4 h-4 text-green-400" />
            <span className="text-xs text-green-400 font-medium uppercase tracking-wider">Manajemen Sekolah</span>
          </div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Pengaturan Sekolah</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Konfigurasi identitas dan tampilan aplikasi</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition"
          style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)', color: 'var(--text-muted)' }}>
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="glass-card rounded-2xl p-8 animate-pulse space-y-4">
          <div className="h-20 w-20 rounded-full" style={{ background: 'var(--subtle-bg)' }} />
          <div className="h-4 rounded w-48" style={{ background: 'var(--subtle-bg)' }} />
          <div className="h-4 rounded w-64" style={{ background: 'var(--subtle-bg)' }} />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Logo Upload */}
          <div className="glass-card rounded-2xl p-6 space-y-5">
            <div>
              <h2 className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>Logo Sekolah</h2>
              <p className="text-xs" style={{ color: 'var(--text-faint)' }}>Tampil di sidebar aplikasi menggantikan inisial "SM"</p>
            </div>
            <ImageUpload
              value={form.logo}
              onChange={logo => setForm(p => ({ ...p, logo }))}
              shape="square"
              size={96}
              placeholder="Upload logo sekolah (maks 500KB)"
              maxSizeKB={500}
            />
          </div>

          {/* Nama Sekolah */}
          <div className="glass-card rounded-2xl p-6 space-y-5">
            <div>
              <h2 className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>Identitas Sekolah</h2>
              <p className="text-xs" style={{ color: 'var(--text-faint)' }}>Nama sekolah yang tampil di sidebar dan halaman login</p>
            </div>
            <FormField label="Nama Sekolah" required>
              <Input
                value={form.schoolName}
                onChange={e => setForm(p => ({ ...p, schoolName: e.target.value }))}
                placeholder="cth. SMKS Digital Nusantara"
                required
              />
            </FormField>
          </div>

          {/* Last updated */}
          {settings?.updatedAt && (
            <p className="text-xs text-center" style={{ color: 'var(--text-faint)' }}>
              Terakhir diperbarui: {new Date(settings.updatedAt).toLocaleString('id-ID')}
            </p>
          )}

          {/* Feedback */}
          {error   && <p className="text-xs text-red-400 bg-red-500/10 px-4 py-2.5 rounded-xl">{error}</p>}
          {success && <p className="flex items-center gap-2 text-xs text-green-400 bg-green-500/10 px-4 py-2.5 rounded-xl"><CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />{success}</p>}

          <SubmitButton loading={saving} label="Simpan Pengaturan" />
        </form>
      )}

      {/* Preview Card */}
      {!loading && (
        <div className="glass-card rounded-2xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-faint)' }}>Preview Sidebar</p>
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--subtle-bg)' }}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0 overflow-hidden">
              {form.logo
                ? <img src={form.logo} alt="logo" className="w-full h-full object-cover" />
                : <span className="text-white font-bold text-sm">{form.schoolName?.slice(0, 2).toUpperCase() || 'SM'}</span>}
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{form.schoolName || 'Nama Sekolah'}</p>
              <p className="text-[10px]" style={{ color: 'var(--text-faint)' }}>Manajemen Kegiatan</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
