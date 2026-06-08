'use client'

import { announcements } from '@/lib/mockData'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MessageCircle, Trophy, Vote, School } from 'lucide-react'

export default function PengumumanPage() {
  // Sort by date (newest first)
  const sortedAnnouncements = [...announcements].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sekolah':
        return <School className="w-5 h-5" />
      case 'lomba':
        return <Trophy className="w-5 h-5" />
      case 'pemilu':
        return <Vote className="w-5 h-5" />
      case 'juara':
        return <Trophy className="w-5 h-5" />
      default:
        return <MessageCircle className="w-5 h-5" />
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'sekolah':
        return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Sekolah' }
      case 'lomba':
        return { bg: 'bg-green-100', text: 'text-green-700', label: 'Lomba' }
      case 'pemilu':
        return { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Pemilu' }
      case 'juara':
        return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Juara' }
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Pengumuman' }
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Pengumuman</h1>
        <p className="text-gray-600 mt-2">Informasi penting tentang kegiatan sekolah</p>
      </div>

      {/* Filter Tags */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
          Semua
        </Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
          Sekolah
        </Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
          Lomba
        </Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
          Pemilu
        </Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
          Juara
        </Badge>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {sortedAnnouncements.map((announcement, index) => {
          const typeBadge = getTypeBadge(announcement.type)
          const announcementDate = new Date(announcement.date)
          const isNew = (new Date().getTime() - announcementDate.getTime()) < (7 * 24 * 60 * 60 * 1000)

          return (
            <Card key={announcement.id} className="hover:shadow-lg transition">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${typeBadge.bg} ${typeBadge.text}`}>
                    {getTypeIcon(announcement.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{announcement.title}</h3>
                        {isNew && (
                          <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-medium">
                            BARU
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {announcement.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Badge className={`${typeBadge.bg} ${typeBadge.text}`}>
                          {typeBadge.label}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Calendar className="w-3 h-3" />
                          {announcementDate.toLocaleDateString('id-ID')}
                        </div>
                      </div>
                      <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                        Baca Selengkapnya →
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Empty State */}
      {sortedAnnouncements.length === 0 && (
        <Card>
          <CardContent className="pt-12 pb-12">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Tidak ada pengumuman</p>
              <p className="text-gray-400 text-sm">Cek kembali nanti untuk update terbaru</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card className="mt-8 bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900 text-base">Tips</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-700 space-y-2">
          <p>• Baca semua pengumuman dengan cermat</p>
          <p>• Aktifkan notifikasi untuk mendapat update terbaru</p>
          <p>• Jika ada pertanyaan, hubungi panitia yang bersangkutan</p>
        </CardContent>
      </Card>
    </div>
  )
}
