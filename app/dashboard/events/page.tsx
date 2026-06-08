'use client'

import { events } from '@/lib/mockData'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/context/AuthContext'
import { Calendar, Plus, Edit2, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'

export default function EventsPage() {
  const { currentUser } = useAuth()

  // Only Super Admin can access
  if (currentUser?.role !== 'super-admin') {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="rounded-2xl card-premium overflow-hidden">
          <div className="py-16 px-6">
            <div className="text-center">
              <p className="text-gray-600 font-bold text-lg">Akses Ditolak</p>
              <p className="text-gray-500 mt-2">Hanya Super Admin yang dapat mengakses halaman ini</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const activeEvents = events.filter(e => e.status === 'active')
  const upcomingEvents = events.filter(e => e.status === 'upcoming')

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900">Manajemen Event</h1>
          <p className="text-gray-600 mt-2 text-lg">Kelola semua event sekolah</p>
        </div>
        <Button className="gradient-primary text-white shadow-lg hover:shadow-xl smooth-transition gap-2">
          <Plus className="w-5 h-5" />
          Event Baru
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Total Event', value: events.length, color: 'from-blue-500 to-blue-600' },
          { label: 'Event Aktif', value: activeEvents.length, color: 'from-green-500 to-green-600' },
          { label: 'Event Mendatang', value: upcomingEvents.length, color: 'from-purple-500 to-purple-600' }
        ].map((stat, idx) => (
          <div key={idx} className="rounded-2xl card-premium overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${stat.color}`}></div>
            <div className="p-6 text-center">
              <p className="text-4xl font-black bg-gradient-to-br ${stat.color} bg-clip-text text-transparent mb-1">{stat.value}</p>
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Event List */}
      <div className="space-y-4">
        {/* Active Events */}
        {activeEvents.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-600"></span>
              Event Aktif
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
              {activeEvents.map(event => (
                <Card key={event.id} className="hover:shadow-lg transition">
                  <CardContent className="pt-6">
                    <div className="flex gap-4 mb-4">
                      <div className="w-24 h-24 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden">
                        <img
                          src={event.banner}
                          alt={event.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-gray-900">{event.name}</h3>
                          <Badge className="bg-green-100 text-green-700">Aktif</Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                          {event.description}
                        </p>
                        <p className="text-xs text-gray-600 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(event.date).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-gray-200">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-3 h-3 mr-1" />
                        Lihat
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit2 className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 text-red-600 border-red-200 hover:bg-red-50">
                        <Trash2 className="w-3 h-3 mr-1" />
                        Hapus
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-600"></span>
              Event Mendatang
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {upcomingEvents.map(event => (
                <Card key={event.id} className="hover:shadow-lg transition">
                  <CardContent className="pt-6">
                    <div className="flex gap-4 mb-4">
                      <div className="w-24 h-24 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden">
                        <img
                          src={event.banner}
                          alt={event.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-gray-900">{event.name}</h3>
                          <Badge className="bg-blue-100 text-blue-700">Segera</Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                          {event.description}
                        </p>
                        <p className="text-xs text-gray-600 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(event.date).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-gray-200">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-3 h-3 mr-1" />
                        Lihat
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit2 className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 text-red-600 border-red-200 hover:bg-red-50">
                        <Trash2 className="w-3 h-3 mr-1" />
                        Hapus
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Help */}
      <Card className="mt-8 bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900 text-base">Panduan Manajemen Event</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-700 space-y-2">
          <p>• Klik "Event Baru" untuk membuat event baru</p>
          <p>• Edit event untuk mengubah detail dan konfigurasi</p>
          <p>• Status event akan berubah otomatis sesuai tanggal</p>
          <p>• Data terkait event akan disimpan dalam sistem</p>
        </CardContent>
      </Card>
    </div>
  )
}
