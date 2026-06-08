'use client'

import { competitions, teams } from '@/lib/mockData'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { Calendar, MapPin, Clock, Users } from 'lucide-react'

export default function CompetitionsPage() {
  const { currentUser } = useAuth()

  // Group competitions by category
  const byCategory = competitions.reduce((acc, comp) => {
    if (!acc[comp.category]) acc[comp.category] = []
    acc[comp.category].push(comp)
    return acc
  }, {} as Record<string, typeof competitions>)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900">Daftar Kompetisi Classmeeting 2026</h1>
        <p className="text-gray-600 mt-2 text-lg">Pilih kompetisi dan daftarkan tim kelas Anda</p>
      </div>

      {/* Summary Cards */}
      {currentUser?.role === 'super-admin' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Total Kompetisi', value: competitions.length, color: 'from-blue-500 to-blue-600' },
            { label: 'Tim Terdaftar', value: teams.length, color: 'from-green-500 to-green-600' },
            { label: 'Kategori', value: Object.keys(byCategory).length, color: 'from-purple-500 to-purple-600' }
          ].map((metric, idx) => (
            <div key={idx} className="rounded-2xl card-premium overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${metric.color}`}></div>
              <div className="p-6 text-center">
                <p className="text-4xl font-black bg-gradient-to-br ${metric.color} bg-clip-text text-transparent mb-1">{metric.value}</p>
                <p className="text-gray-600 font-medium">{metric.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Competitions by Category */}
      {Object.entries(byCategory).map(([category, comps]) => (
        <div key={category} className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <span className={`px-4 py-2 rounded-full text-sm font-bold text-white ${
              category === 'Olahraga' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
              category === 'Akademik' ? 'bg-gradient-to-r from-green-500 to-green-600' :
              'bg-gradient-to-r from-purple-500 to-purple-600'
            }`}>
              {category}
            </span>
            <h2 className="text-2xl font-bold text-gray-900">{comps.length} Kompetisi</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {comps.map(comp => {
              const teamCount = teams.filter(t => t.competition === comp.id).length
              
              return (
                <Card key={comp.id} className="hover:shadow-lg transition">
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{comp.name}</h3>

                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(comp.date).toLocaleDateString('id-ID')}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {comp.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {comp.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {teamCount} tim terdaftar
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      {currentUser?.role === 'ketua-kelas' ? (
                        <Link href={`/dashboard/classmeeting/competitions/${comp.id}/register`}>
                          <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                            Daftarkan Tim
                          </Button>
                        </Link>
                      ) : currentUser?.role === 'super-admin' ? (
                        <Button variant="outline" className="w-full">
                          Kelola Pendaftaran
                        </Button>
                      ) : (
                        <Button variant="outline" className="w-full" disabled>
                          Lihat Detail
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      ))}

      {/* Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Syarat Pendaftaran</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-700 space-y-2">
          <p>• Setiap kelas dapat mendaftarkan satu tim per kategori</p>
          <p>• Tim harus memiliki minimal anggota sesuai dengan ketentuan kompetisi</p>
          <p>• Pendaftaran ditutup 3 hari sebelum hari pelaksanaan</p>
          <p>• Ketua kelas bertanggung jawab dalam pengelolaan tim</p>
        </CardContent>
      </Card>
    </div>
  )
}
