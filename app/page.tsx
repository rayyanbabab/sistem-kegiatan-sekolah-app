'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock, GraduationCap } from 'lucide-react'

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <GraduationCap className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">SMKS Digital</h1>
          </div>
          <p className="text-gray-600">Sistem Manajemen Kegiatan Sekolah</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Login
            </CardTitle>
            <CardDescription>
              Masuk dengan NIS/NISN dan pilih role Anda
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              {/* NIS Input */}
              <div className="space-y-2">
                <label htmlFor="nis" className="block text-sm font-medium text-gray-700">
                  NIS / NISN
                </label>
                <Input
                  id="nis"
                  type="text"
                  placeholder="Masukkan NIS atau NISN"
                  value={nis}
                  onChange={(e) => setNis(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Role Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Pilih Role
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={`p-3 rounded-lg border-2 transition text-left ${
                        selectedRole === role.id
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-medium text-gray-900">{role.label}</p>
                      <p className="text-xs text-gray-600">{role.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2"
              >
                Masuk ke Dashboard
              </Button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-xs text-gray-600">
                <strong>Demo Mode:</strong> Gunakan NIS apapun untuk login. System ini menggunakan mock data untuk demonstrasi.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
