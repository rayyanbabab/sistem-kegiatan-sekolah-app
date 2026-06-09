'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { Lock, ArrowLeft, Eye, EyeOff, GraduationCap } from 'lucide-react'
import Link from 'next/link'

const DEMO_ACCOUNTS = [
  { label: 'Super Admin', nis: '00000001' },
  { label: 'Panitia', nis: '00000002' },
  { label: 'Ketua Kelas', nis: '20240001' },
  { label: 'Siswa', nis: '20240002' },
  { label: 'Kandidat', nis: '20230001' },
]

export default function LoginPage() {
  const [nis, setNis] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nis.trim()) { setError('NIS/NISN harus diisi'); return }
    if (!password.trim()) { setError('Password harus diisi'); return }

    setError('')
    setIsLoading(true)

    const result = await login(nis.trim(), password)
    setIsLoading(false)

    if (result.success) {
      router.push('/dashboard')
    } else {
      setError(result.error || 'NIS atau password salah')
    }
  }

  const fillDemo = (demoNis: string) => {
    setNis(demoNis)
    setPassword('password123')
    setError('')
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-600/12 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-violet-600/12 rounded-full blur-3xl" />
      </div>

      {/* Back button + Theme toggle */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" className="gap-2 text-white/60 hover:text-white hover:bg-white/10 border-0">
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Button>
        </Link>
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md relative animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 mb-4 shadow-2xl shadow-blue-500/25">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>SMKS Digital</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>Sistem Manajemen Kegiatan Sekolah</p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-7">
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center">
              <Lock className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Masuk ke Dashboard</h2>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Login dengan NIS dan password Anda</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* NIS */}
            <div className="space-y-2">
              <label htmlFor="nis" className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                NIS / NISN
              </label>
              <Input
                id="nis"
                type="text"
                placeholder="Masukkan NIS atau NISN..."
                value={nis}
                onChange={(e) => { setNis(e.target.value); setError('') }}
                className="bg-white/[0.06] border-white/10 text-white placeholder:text-white/30 focus:border-blue-500/50 focus:bg-white/[0.08] h-11 rounded-xl"
                autoFocus
                autoComplete="username"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan password..."
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError('') }}
                  className="bg-white/[0.06] border-white/10 text-white placeholder:text-white/30 focus:border-blue-500/50 focus:bg-white/[0.08] h-11 rounded-xl pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'var(--text-faint)' }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white border-0 h-11 rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Memverifikasi...
                </div>
              ) : 'Masuk ke Dashboard'}
            </Button>
          </form>

          {/* Demo accounts */}
          <div className="mt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-px" style={{ background: 'var(--subtle-border)' }} />
              <span className="text-xs" style={{ color: 'var(--text-faint)' }}>Akun Demo</span>
              <div className="flex-1 h-px" style={{ background: 'var(--subtle-border)' }} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map(acc => (
                <button
                  key={acc.nis}
                  type="button"
                  onClick={() => fillDemo(acc.nis)}
                  className="px-3 py-2 rounded-xl text-xs font-medium transition-all text-left hover:-translate-y-0.5"
                  style={{
                    background: 'var(--subtle-bg)',
                    border: '1px solid var(--subtle-border)',
                    color: 'var(--text-muted)',
                  }}
                >
                  <p style={{ color: 'var(--text-secondary)' }} className="font-semibold">{acc.label}</p>
                  <p>NIS: {acc.nis}</p>
                </button>
              ))}
            </div>
            <p className="text-center text-xs mt-2" style={{ color: 'var(--text-faint)' }}>
              Password semua akun demo: <span style={{ color: 'var(--text-muted)' }}>password123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
