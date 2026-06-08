'use client'

import { competitions } from '@/lib/mockData'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, MapPin } from 'lucide-react'

export default function SchedulePage() {
  // Sort by date
  const sortedCompetitions = [...competitions].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900">Jadwal Classmeeting 2026</h1>
        <p className="text-gray-600 mt-2 text-lg">Lihat jadwal lengkap semua kompetisi</p>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {sortedCompetitions.map((comp, index) => {
          const isToday = new Date(comp.date).toDateString() === new Date().toDateString()
          const isPast = new Date(comp.date) < new Date()
          const isFuture = new Date(comp.date) > new Date()

          return (
            <div 
              key={comp.id} 
              className={`rounded-2xl card-premium overflow-hidden border-l-4 smooth-transition ${
                isToday ? 'border-l-blue-600 bg-blue-50/50' :
                isPast ? 'border-l-gray-400 opacity-60' :
                'border-l-green-600 bg-green-50/30'
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  {/* Main Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{comp.name}</h3>
                      <Badge className={`${
                        isToday ? 'bg-blue-100 text-blue-700' :
                        isPast ? 'bg-gray-100 text-gray-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {isToday ? 'Hari Ini' : isPast ? 'Selesai' : 'Mendatang'}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(comp.date).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{comp.time} WIB</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{comp.location}</span>
                      </div>
                    </div>

                    <div className="inline-block">
                      <Badge variant="outline" className="text-xs">
                        {comp.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Day Number */}
                  <div className="text-right flex-shrink-0">
                    <div className="text-3xl font-bold text-gray-300">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <Card className="mt-8 bg-gray-50">
        <CardHeader>
          <CardTitle className="text-base">Keterangan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-600"></div>
              <span className="text-sm text-gray-700">Hari Ini</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-600"></div>
              <span className="text-sm text-gray-700">Mendatang</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gray-400"></div>
              <span className="text-sm text-gray-700">Selesai</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="mt-6 bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="text-yellow-900 text-base">Tips</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-700 space-y-2">
          <p>• Pastikan tim Anda sudah terdaftar sebelum hari pelaksanaan</p>
          <p>• Hadir tepat waktu sebelum jadwal yang ditentukan</p>
          <p>• Bawa kelengkapan sesuai dengan ketentuan kompetisi</p>
          <p>• Hubungi panitia jika ada kendala atau pertanyaan</p>
        </CardContent>
      </Card>
    </div>
  )
}
