'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock, GraduationCap, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const [nis, setNis] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const router = useRouter()

  const roles = [
    { id: 'siswa', label: 'Siswa', description: 'Akses voting dan jadwal' },
    { id: 'ketua-kelas', label: 'Ketua Kelas', description: 'Kelola tim dan daftar lomba' },
    { id: 'panitia', label: 'Panitia Event', description: 'Kelola event tertentu' },
    { id: 'kandidat', label: 'Kandidat OSIS', description: 'Edit profil kampanye' },
    { id: 'super-admin', label: 'Super Admin', description: 'Kelola semua event' }
  ]

  const handleLogin = (e: React.FormEvent) => {
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
    login(nis, selectedRole as any)
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-200 to-blue-100 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-200 to-pink-100 rounded-full opacity-30 blur-3xl"></div>
      </div>

      {/* Back button */}
      <div className="absolute top-6 left-6 z-10">
        <Link href="/">
          <Button variant="ghost" className="gap-2 hover:bg-white/20 smooth-transition">
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Button>
        </Link>
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-xl">
                <span className="text-white font-black text-lg">SM</span>
              </div>
              <h1 className="text-4xl font-black text-gray-900">SMKS Digital</h1>
            </div>
            <p className="text-gray-600 text-sm">Sistem Manajemen Kegiatan Sekolah</p>
          </div>

          <div className="rounded-2xl card-premium backdrop-blur-xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 px-6 py-6 border-b border-white/20">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
                <Lock className="w-6 h-6 text-blue-600" />
                Login
              </h2>
              <p className="text-gray-600 text-sm mt-1">Masuk dengan NIS/NISN dan pilih role Anda</p>
            </div>

            <div className="p-6">
              <form onSubmit={handleLogin} className="space-y-6">
                {/* NIS Input */}
                <div className="space-y-2">
                  <label htmlFor="nis" className="block text-sm font-semibold text-gray-900">
                    NIS / NISN
                  </label>
                  <Input
                    id="nis"
                    type="text"
                    placeholder="Masukkan NIS atau NISN"
                    value={nis}
                    onChange={(e) => setNis(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white/50 backdrop-blur-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 smooth-transition"
                    autoFocus
                  />
                </div>

                {/* Role Selection */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-900">
                    Pilih Role
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {roles.map((role) => (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setSelectedRole(role.id)}
                        className={`p-4 rounded-xl border-2 smooth-transition text-left ${
                          selectedRole === role.id
                            ? 'border-blue-600 bg-gradient-to-r from-blue-50 to-purple-50 shadow-md'
                            : 'border-gray-200 bg-white/50 hover:border-blue-300 hover:bg-blue-50/30'
                        }`}
                      >
                        <p className="font-semibold text-gray-900">{role.label}</p>
                        <p className="text-xs text-gray-600 mt-0.5">{role.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl">
                    <p className="text-sm font-medium text-red-700">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full gradient-primary text-white font-semibold py-2.5 rounded-lg shadow-lg hover:shadow-xl smooth-transition"
                >
                  Masuk ke Dashboard
                </Button>
              </form>

              <div className="mt-6 p-4 bg-blue-50/60 backdrop-blur-sm rounded-lg border border-blue-200/50">
                <p className="text-xs text-gray-700 leading-relaxed">
                  <strong>Demo Mode:</strong> Gunakan NIS apapun untuk login. Sistem ini menggunakan mock data untuk demonstrasi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
