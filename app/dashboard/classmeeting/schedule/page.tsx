'use client'

import { useEffect, useState, useCallback } from 'react'
import { Calendar, Clock, MapPin, CheckCircle2, Hourglass, RefreshCw } from 'lucide-react'

interface Competition {
  id: string; name: string; category: string; date: string
  time: string; location: string
  event: { id: string; name: string }
}

const CAT_CFG: Record<string, { icon: string; color: string }> = {
  OLAHRAGA: { icon: '⚽', color: 'from-blue-500 to-cyan-500' },
  AKADEMIK:  { icon: '🎤', color: 'from-violet-500 to-purple-500' },
  SENI:      { icon: '🎨', color: 'from-amber-500 to-yellow-500' },
}

const groupByDate = (items: Competition[]) => {
  const groups: Record<string, Competition[]> = {}
  items.forEach(item => {
    const dateKey = item.date.split('T')[0]
    if (!groups[dateKey]) groups[dateKey] = []
    groups[dateKey].push(item)
  })
  return groups
}

const getDateStatus = (dateStr: string) => {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const d = new Date(dateStr); d.setHours(0, 0, 0, 0)
  if (d.getTime() === today.getTime()) return 'today'
  if (d < today) return 'past'
  return 'upcoming'
}

export default function SchedulePage() {
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/competitions', { credentials: 'include' })
      const json = await res.json()
      if (json.success) {
        const sorted = [...json.data].sort((a: Competition, b: Competition) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
        )
        setCompetitions(sorted)
      }
    } catch { /* ignore */ }
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const grouped = groupByDate(competitions)

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-blue-400 font-medium uppercase tracking-wider">Classmeeting 2026</span>
          </div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Jadwal Kompetisi</h1>
          <p className="mt-1" style={{ color: 'var(--text-muted)' }}>Timeline lengkap semua pertandingan Classmeeting 2026</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition" style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)', color: 'var(--text-muted)' }}>
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
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
            <span className="text-xs" style={{ color: 'var(--text-faint)' }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-2">
              <div className="h-8 w-48 rounded-xl animate-pulse" style={{ background: 'var(--subtle-bg)' }} />
              <div className="ml-6 space-y-2">
                {[1, 2].map(j => <div key={j} className="glass-card rounded-2xl h-16 animate-pulse" style={{ background: 'var(--subtle-bg)' }} />)}
              </div>
            </div>
          ))}
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center">
          <Calendar className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-faint)' }} />
          <p className="font-medium" style={{ color: 'var(--text-muted)' }}>Belum ada jadwal kompetisi</p>
        </div>
      ) : (
        /* Timeline grouped by date */
        Object.entries(grouped).map(([date, items]) => {
          const status = getDateStatus(date)
          const dayLabel = new Date(date).toLocaleDateString('id-ID', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
          })
          return (
            <div key={date} className="space-y-3">
              {/* Date header */}
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-semibold ${
                  status === 'today'    ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' :
                  status === 'past'     ? 'border-white/[0.06] text-white/30' :
                  'bg-green-500/10 border-green-500/20 text-green-400'
                }`} style={status === 'past' ? { background: 'var(--subtle-bg)' } : {}}>
                  {status === 'today' && <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />}
                  {status === 'today' ? 'Hari Ini · ' : ''}{dayLabel}
                </div>
                <div className="flex-1 h-px" style={{ background: 'var(--subtle-border)' }} />
                <span className="text-xs" style={{ color: 'var(--text-faint)' }}>{items.length} lomba</span>
              </div>

              {/* Items */}
              <div className="space-y-2 ml-2 pl-4" style={{ borderLeft: '1px solid var(--subtle-border)' }}>
                {items.map(item => {
                  const cfg = CAT_CFG[item.category] || CAT_CFG.OLAHRAGA
                  return (
                    <div key={item.id} className={`glass-card rounded-2xl p-4 hover:border-white/20 transition-all hover:-translate-y-0.5 ${status === 'past' ? 'opacity-50' : ''}`}>
                      <div className="flex items-center gap-4">
                        <span className="text-3xl flex-shrink-0">{cfg.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{item.name}</h3>
                            {status === 'past' && <CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />}
                            {status === 'today' && <Hourglass className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 animate-pulse" />}
                          </div>
                          <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-faint)' }}>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{item.time} WIB</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{item.location}</span>
                          </div>
                        </div>
                        <div className={`h-10 w-1 rounded-full bg-gradient-to-b ${cfg.color} flex-shrink-0`} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })
      )}

      {/* Tips */}
      {!loading && (
        <div className="glass-card rounded-2xl p-5" style={{ borderColor: 'rgba(245,158,11,0.2)', background: 'rgba(245,158,11,0.03)' }}>
          <p className="text-sm font-semibold text-amber-400 mb-3">💡 Tips Persiapan</p>
          <ul className="space-y-1.5 text-sm" style={{ color: 'var(--text-muted)' }}>
            <li>• Pastikan tim sudah terdaftar sebelum hari pelaksanaan</li>
            <li>• Hadir tepat waktu minimal 15 menit sebelum jadwal</li>
            <li>• Bawa kelengkapan sesuai ketentuan kompetisi</li>
            <li>• Hubungi panitia jika ada kendala</li>
          </ul>
        </div>
      )}
    </div>
  )
}
