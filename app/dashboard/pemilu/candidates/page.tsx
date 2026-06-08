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
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900">Kandidat OSIS 2026</h1>
        <p className="text-gray-600 mt-2 text-lg">Lihat profil dan kampanye setiap kandidat</p>
      </div>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {sortedCandidates.map((candidate) => (
          <div key={candidate.id} className="rounded-2xl card-premium overflow-hidden group">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2"></div>
            <div className="p-6">
              <div className="flex gap-4 mb-4">
                {/* Photo */}
                <div className="flex-shrink-0">
                  <div className="w-28 h-28 rounded-xl bg-gray-200 overflow-hidden group-hover:scale-105 smooth-transition">
                    <img
                      src={candidate.photo}
                      alt={candidate.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-gray-900">{candidate.name}</h3>
                      </div>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-bold rounded-full inline-block">
                        #{candidate.number}
                      </span>
                      <p className="text-sm text-gray-600 font-medium mt-2">{candidate.kelas}</p>
                    </div>
                  </div>

                  {/* Vote Count */}
                  <div className="mb-4 p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                    <p className="text-3xl font-black bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">{candidate.votes}</p>
                    <p className="text-xs text-gray-600 font-semibold">suara</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-auto">
                    <Link href={`/dashboard/pemilu/candidate/${candidate.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full font-semibold smooth-transition">
                        Detail
                      </Button>
                    </Link>
                    {currentUser?.role === 'siswa' && (
                      <Link href="/dashboard/pemilu/voting" className="flex-1">
                        <Button size="sm" className="w-full gradient-primary text-white font-semibold smooth-transition">
                          Pilih
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
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
