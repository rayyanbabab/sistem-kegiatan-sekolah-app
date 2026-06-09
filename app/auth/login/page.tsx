'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { Lock, ArrowLeft, Shield, CheckCircle, Star, Trophy, Users, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const [nis, setNis] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const roles = [
    { id: 'siswa', label: 'Siswa', description: 'Akses voting & jadwal', icon: Users, color: 'from-green-600 to-emerald-500' },
    { id: 'ketua-kelas', label: 'Ketua Kelas', description: 'Kelola tim & daftar lomba', icon: Star, color: 'from-cyan-600 to-cyan-400' },
    { id: 'panitia', label: 'Panitia Event', description: 'Kelola event tertentu', icon: CheckCircle, color: 'from-violet-600 to-violet-400' },
    { id: 'kandidat', label: 'Kandidat OSIS', description: 'Edit profil kampanye', icon: Trophy, color: 'from-pink-600 to-pink-400' },
    { id: 'super-admin', label: 'Super Admin', description: 'Kelola semua event', icon: Shield, color: 'from-blue-600 to-blue-400' },
  ]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!nis.trim()) {
      setError('NIS/NISN harus diisi')
      return
    }
    if (!selectedRole) {
      setError('Pilih role terlebih dahulu')
      return
    }

    setError('')
    setIsLoading(true)
    
    // Simulate loading
    await new Promise(r => setTimeout(r, 600))
    login(nis, selectedRole as any)
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl" />
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

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 mb-4 shadow-2xl shadow-blue-500/30">
            <span className="text-white font-bold text-xl">SM</span>
          </div>
          <h1 className="text-3xl font-bold text-white">SMKS Digital</h1>
          <p className="text-white/40 mt-1 text-sm">Sistem Manajemen Kegiatan Sekolah</p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-7">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <Lock className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Masuk ke Dashboard</h2>
              <p className="text-xs text-white/40">Login dengan NIS dan pilih role Anda</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* NIS Input */}
            <div className="space-y-2">
              <label htmlFor="nis" className="text-sm font-medium text-white/70">
                NIS / NISN
              </label>
              <Input
                id="nis"
                type="text"
                placeholder="Masukkan NIS atau NISN..."
                value={nis}
                onChange={(e) => setNis(e.target.value)}
                className="bg-white/[0.06] border-white/10 text-white placeholder:text-white/30 focus:border-blue-500/50 focus:bg-white/[0.08] h-11 rounded-xl"
                autoFocus
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-white/70">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/[0.06] border-white/10 text-white placeholder:text-white/30 focus:border-blue-500/50 focus:bg-white/[0.08] h-11 rounded-xl pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Pilih Role</label>
              <div className="grid grid-cols-1 gap-2">
                {roles.map((role) => {
                  const Icon = role.icon
                  const isSelected = selectedRole === role.id
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                        isSelected
                          ? 'border-blue-500/50 bg-blue-500/10'
                          : 'border-white/[0.07] bg-white/[0.03] hover:border-white/15 hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${role.color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white text-sm">{role.label}</p>
                        <p className="text-xs text-white/40">{role.description}</p>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white border-0 h-11 rounded-xl font-semibold shadow-lg shadow-blue-500/25 transition-all"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Memproses...
                </div>
              ) : (
                'Masuk ke Dashboard'
              )}
            </Button>
          </form>

          <div className="mt-5 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <p className="text-xs text-amber-400/80">
              <span className="font-semibold text-amber-400">Demo:</span> NIS: 00000001 / Password: password123 (Admin)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
