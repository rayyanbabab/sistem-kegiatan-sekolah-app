'use client'

import { candidates } from '@/lib/mockData'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'

export default function CandidatesPage() {
  const { currentUser } = useAuth()
  const sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Kandidat OSIS 2026</h1>
        <p className="text-gray-600 mt-2">Lihat profil dan kampanye setiap kandidat</p>
      </div>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {sortedCandidates.map((candidate) => (
          <Card key={candidate.id} className="hover:shadow-lg transition">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                {/* Photo */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-lg bg-gray-200 overflow-hidden">
                    <img
                      src={candidate.photo}
                      alt={candidate.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-gray-900">{candidate.name}</h3>
                        <Badge className="bg-purple-100 text-purple-700 font-bold">
                          #{candidate.number}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">{candidate.kelas}</p>
                    </div>
                  </div>

                  {/* Vote Count */}
                  <div className="mb-3 p-2 bg-purple-50 rounded">
                    <p className="text-2xl font-bold text-purple-600">{candidate.votes}</p>
                    <p className="text-xs text-gray-600">suara</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link href={`/dashboard/pemilu/candidate/${candidate.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        Lihat Detail
                      </Button>
                    </Link>
                    {currentUser?.role === 'siswa' && (
                      <Link href="/dashboard/pemilu/voting" className="flex-1">
                        <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700">
                          Pilih
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Vote Information */}
      <Card className="mt-8 bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Informasi Pemilihan</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              Setiap siswa hanya bisa memilih satu kandidat
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              Voting dilakukan secara anonim untuk menjaga privasi
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              Tidak dapat memilih dua kali atau mengubah pilihan setelah dikonfirmasi
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              Hasil real-time dapat dilihat di halaman Real Count
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
