'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { Lock, ArrowLeft, Eye, EyeOff, GraduationCap, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

const DEMO_ACCOUNTS = [
  { label: 'Super Admin', role: 'Pembina / Admin', nis: '00000001' },
  { label: 'Panitia Event', role: 'OSIS / Kesiswaan', nis: '00000002' },
  { label: 'Ketua Kelas', role: 'Delegasi Lomba', nis: '20240001' },
  { label: 'Siswa', role: 'Pemilih / Peserta', nis: '20240002' },
  { label: 'Kandidat', role: 'Paslon OSIS', nis: '20230001' },
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
    if (!nis.trim()) { setError('Nomor Induk Siswa (NIS/NISN) wajib diisi'); return }
    if (!password.trim()) { setError('Kata sandi wajib diisi'); return }

    setError('')
    setIsLoading(true)

    const result = await login(nis.trim(), password)
    setIsLoading(false)

    if (result.success) {
      router.push('/dashboard')
    } else {
      setError(result.error || 'NIS atau kata sandi tidak cocok')
    }
  }

  const fillDemo = (demoNis: string) => {
    setNis(demoNis)
    setPassword('password123')
    setError('')
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 relative">
      {/* Top Header Bar */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground hover:bg-muted border border-border/60">
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Button>
        </Link>
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md pt-12 pb-8">
        {/* Institutional Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-primary-foreground mb-3 font-bold text-lg shadow-sm">
            SM
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">SMKS Digital</h1>
          <p className="mt-1 text-xs text-muted-foreground">Portal Akses Kegiatan & Kesiswaan Sekolah</p>
        </div>

        {/* Login Card */}
        <div className="surface-card rounded-xl p-6 sm:p-8 border border-border shadow-sm">
          <div className="flex items-center gap-3 pb-5 mb-5 border-b border-border">
            <div className="w-9 h-9 rounded-lg bg-secondary text-foreground flex items-center justify-center shrink-0 border border-border">
              <Lock className="w-4 h-4 text-muted-foreground" strokeWidth={1.75} />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Masuk Akun</h2>
              <p className="text-xs text-muted-foreground">Gunakan NIS dan kata sandi Anda</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* NIS */}
            <div className="space-y-1.5">
              <label htmlFor="nis" className="text-xs font-semibold text-foreground uppercase tracking-wider block">
                Nomor Induk Siswa (NIS / NISN)
              </label>
              <Input
                id="nis"
                type="text"
                placeholder="Contoh: 20240002"
                value={nis}
                onChange={(e) => { setNis(e.target.value); setError('') }}
                className="bg-background border-input text-foreground placeholder:text-muted-foreground h-10 rounded-lg text-sm"
                autoFocus
                autoComplete="username"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-semibold text-foreground uppercase tracking-wider block">
                  Kata Sandi
                </label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan kata sandi..."
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError('') }}
                  className="bg-background border-input text-foreground placeholder:text-muted-foreground h-10 rounded-lg pr-10 text-sm"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-xs font-medium">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 rounded-lg font-semibold text-sm transition-colors mt-2"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span>Memverifikasi akun...</span>
                </div>
              ) : 'Masuk ke Dashboard'}
            </Button>
          </form>

          {/* Quick Demo Switcher */}
          <div className="mt-6 pt-5 border-t border-border">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2.5">
              Pilihan Akun Demo (Uji Coba Sistem)
            </span>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map(acc => (
                <button
                  key={acc.nis}
                  type="button"
                  onClick={() => fillDemo(acc.nis)}
                  className={`p-2.5 rounded-lg text-left border transition-all text-xs ${
                    nis === acc.nis
                      ? 'border-primary bg-primary/5 text-primary font-semibold'
                      : 'border-border bg-muted/40 hover:bg-muted text-foreground'
                  }`}
                >
                  <p className="font-semibold leading-tight">{acc.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">NIS: {acc.nis}</p>
                </button>
              ))}
            </div>
            <p className="text-center text-[11px] text-muted-foreground mt-3">
              Kata sandi semua akun demo: <span className="font-mono text-foreground font-medium">password123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
