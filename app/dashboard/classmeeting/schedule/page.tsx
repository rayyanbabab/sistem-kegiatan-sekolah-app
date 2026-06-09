'use client'

import { Calendar, Clock, MapPin, CheckCircle2, Hourglass } from 'lucide-react'

const SCHEDULE = [
  { id: '1', name: 'Futsal Putra', category: 'Olahraga', date: '2026-06-20', time: '08:00', location: 'Lapangan Utama', icon: '⚽', color: 'from-blue-500 to-cyan-500' },
  { id: '2', name: 'Debat Bahasa Indonesia', category: 'Akademik', date: '2026-06-20', time: '10:00', location: 'Ruang Aula', icon: '🎤', color: 'from-violet-500 to-purple-500' },
  { id: '3', name: 'Volley Ball Putri', category: 'Olahraga', date: '2026-06-21', time: '09:00', location: 'GOR Sekolah', icon: '🏐', color: 'from-green-500 to-emerald-500' },
  { id: '4', name: 'Cerdas Cermat', category: 'Akademik', date: '2026-06-21', time: '13:00', location: 'Ruang 301', icon: '🧠', color: 'from-pink-500 to-rose-500' },
  { id: '5', name: 'Badminton Ganda', category: 'Olahraga', date: '2026-06-22', time: '08:00', location: 'Aula Olahraga', icon: '🏸', color: 'from-orange-500 to-amber-500' },
  { id: '6', name: 'Seni Tari Kreasi', category: 'Seni', date: '2026-06-23', time: '14:00', location: 'Panggung Utama', icon: '💃', color: 'from-amber-500 to-yellow-500' },
]

// Group by date
const groupByDate = (items: typeof SCHEDULE) => {
  const groups: Record<string, typeof SCHEDULE> = {}
  items.forEach(item => {
    if (!groups[item.date]) groups[item.date] = []
    groups[item.date].push(item)
  })
  return groups
}

export default function SchedulePage() {
  const sorted = [...SCHEDULE].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const grouped = groupByDate(sorted)
  const now = new Date()

  const getStatus = (date: string) => {
    const d = new Date(date)
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const dd = new Date(date); dd.setHours(0, 0, 0, 0)
    if (dd.getTime() === today.getTime()) return 'today'
    if (d < now) return 'past'
    return 'upcoming'
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Calendar className="w-4 h-4 text-blue-400" />
          <span className="text-xs text-blue-400 font-medium uppercase tracking-wider">Classmeeting 2026</span>
        </div>
        <h1 className="text-3xl font-bold text-white">Jadwal Kompetisi</h1>
        <p className="text-white/40 mt-1">Timeline lengkap semua pertandingan Classmeeting 2026</p>
      </div>

      {/* Legend */}
      <div className="flex gap-4 flex-wrap">
        {[
          { label: 'Hari Ini', dot: 'bg-blue-400' },
          { label: 'Mendatang', dot: 'bg-green-400' },
          { label: 'Selesai', dot: 'bg-white/20' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${l.dot}`} />
            <span className="text-xs text-white/50">{l.label}</span>
          </div>
        ))}
      </div>

      {/* Timeline grouped by date */}
      {Object.entries(grouped).map(([date, items]) => {
        const d = new Date(date)
        const status = getStatus(date)
        const dayLabel = d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

        return (
          <div key={date} className="space-y-3">
            {/* Date header */}
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-semibold ${
                status === 'today' ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' :
                status === 'past' ? 'bg-white/[0.03] border-white/[0.06] text-white/30' :
                'bg-green-500/10 border-green-500/20 text-green-400'
              }`}>
                {status === 'today' && <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />}
                {status === 'today' ? 'Hari Ini · ' : ''}{dayLabel}
              </div>
              <div className="flex-1 h-px bg-white/[0.06]" />
              <span className="text-xs text-white/30">{items.length} lomba</span>
            </div>

            {/* Items */}
            <div className="space-y-2 ml-2 pl-4 border-l border-white/[0.06]">
              {items.map(item => (
                <div key={item.id} className={`glass-card rounded-2xl p-4 hover:border-white/20 transition-all hover:-translate-y-0.5 ${status === 'past' ? 'opacity-50' : ''}`}>
                  <div className="flex items-center gap-4">
                    <span className="text-3xl flex-shrink-0">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white text-sm">{item.name}</h3>
                        {status === 'past' && <CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />}
                        {status === 'today' && <Hourglass className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-white/40">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{item.time} WIB</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{item.location}</span>
                      </div>
                    </div>
                    <div className={`h-8 w-1 rounded-full bg-gradient-to-b ${item.color} flex-shrink-0`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {/* Tips */}
      <div className="glass-card rounded-2xl p-5 border-amber-500/20 bg-amber-500/5">
        <p className="text-sm font-semibold text-amber-400 mb-3">💡 Tips Persiapan</p>
        <ul className="space-y-1.5 text-sm text-white/50">
          <li>• Pastikan tim sudah terdaftar sebelum hari pelaksanaan</li>
          <li>• Hadir tepat waktu minimal 15 menit sebelum jadwal</li>
          <li>• Bawa kelengkapan sesuai ketentuan kompetisi</li>
          <li>• Hubungi panitia jika ada kendala</li>
        </ul>
      </div>
    </div>
  )
}
