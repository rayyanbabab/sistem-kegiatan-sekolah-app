'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Calendar, Plus, Edit2, Trash2, RefreshCw, Shield, CheckCircle, Clock } from 'lucide-react'

interface Event {
  id: string; name: string; description: string; date: string
  status: string; type: string; banner: string | null
  _count: { competitions: number; candidates: number }
}

const STATUS_CFG: Record<string, { label: string; cls: string }> = {
  ACTIVE:   { label: 'Aktif',   cls: 'bg-green-500/20 text-green-400 border border-green-500/30' },
  UPCOMING: { label: 'Segera',  cls: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
  ENDED:    { label: 'Selesai', cls: 'bg-white/10 text-white/40 border border-white/10' },
}

const TYPE_LABEL: Record<string, string> = {
  CLASSMEETING: 'Classmeeting', PEMILU: 'Pemilu OSIS', MPLS: 'MPLS',
  PENTAS_SENI: 'Pentas Seni', LOMBA_KEMERDEKAAN: 'Lomba Kemerdekaan'
}

export default function EventsPage() {
  const { currentUser } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/events', { credentials: 'include' })
      const json = await res.json()
      if (json.success) setEvents(json.data)
    } catch { /* ignore */ }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  if (currentUser?.role !== 'SUPER_ADMIN') {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="glass-card rounded-2xl p-16 text-center">
          <Shield className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-faint)' }} />
          <p className="font-medium" style={{ color: 'var(--text-muted)' }}>Akses Ditolak</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-faint)' }}>Hanya Super Admin yang dapat mengakses halaman ini</p>
        </div>
      </div>
    )
  }

  const active   = events.filter(e => e.status === 'ACTIVE')
  const upcoming = events.filter(e => e.status === 'UPCOMING')
  const ended    = events.filter(e => e.status === 'ENDED')

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-blue-400 font-medium uppercase tracking-wider">Super Admin</span>
          </div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Manajemen Event</h1>
          <p className="mt-1" style={{ color: 'var(--text-muted)' }}>{events.length} event tersedia</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchData} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs transition" style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)', color: 'var(--text-muted)' }}>
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-blue-500/20">
            <Plus className="w-4 h-4" /> Event Baru
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Event', value: events.length, color: 'from-blue-500 to-blue-400', icon: Calendar },
          { label: 'Event Aktif', value: active.length, color: 'from-green-500 to-emerald-400', icon: CheckCircle },
          { label: 'Mendatang', value: upcoming.length, color: 'from-amber-500 to-orange-400', icon: Clock },
        ].map(s => (
          <div key={s.label} className="glass-card rounded-2xl p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center`}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{loading ? '...' : s.value}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Events list */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="glass-card rounded-2xl h-36 animate-pulse" style={{ background: 'var(--subtle-bg)' }} />)}
        </div>
      ) : (
        [
          { label: 'Event Aktif', dot: 'bg-green-400', items: active },
          { label: 'Event Mendatang', dot: 'bg-blue-400', items: upcoming },
          { label: 'Event Selesai', dot: 'bg-white/20', items: ended },
        ].filter(g => g.items.length > 0).map(group => (
          <div key={group.label} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full ${group.dot} flex-shrink-0`} />
              <h2 className="text-base font-semibold" style={{ color: 'var(--text-secondary)' }}>{group.label}</h2>
              <div className="flex-1 h-px" style={{ background: 'var(--subtle-border)' }} />
              <span className="text-xs" style={{ color: 'var(--text-faint)' }}>{group.items.length} event</span>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {group.items.map(event => {
                const cfg = STATUS_CFG[event.status] || STATUS_CFG.UPCOMING
                return (
                  <div key={event.id} className="glass-card rounded-2xl overflow-hidden hover:border-white/20 transition-all hover:-translate-y-0.5 group">
                    <div className="flex">
                      {event.banner && (
                        <div className="w-28 h-36 flex-shrink-0 overflow-hidden">
                          <img src={event.banner} alt={event.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                      )}
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between mb-2 gap-2">
                          <div>
                            <p className="text-[10px] font-medium mb-0.5" style={{ color: 'var(--text-faint)' }}>{TYPE_LABEL[event.type] || event.type}</p>
                            <h3 className="font-bold text-sm leading-snug" style={{ color: 'var(--text-primary)' }}>{event.name}</h3>
                          </div>
                          <span className={`flex-shrink-0 px-2 py-0.5 rounded-lg text-xs font-medium ${cfg.cls}`}>{cfg.label}</span>
                        </div>
                        <p className="text-xs line-clamp-2 mb-3 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{event.description}</p>
                        <div className="flex items-center gap-1 text-xs mb-3" style={{ color: 'var(--text-faint)' }}>
                          <Calendar className="w-3 h-3" />
                          {new Date(event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                        <div className="flex gap-1.5 pt-2" style={{ borderTop: '1px solid var(--subtle-border)' }}>
                          <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs transition" style={{ background: 'var(--subtle-bg)', color: 'var(--text-muted)' }}>
                            <Edit2 className="w-3 h-3" /> Edit
                          </button>
                          <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs transition bg-red-500/10 text-red-400/70 hover:text-red-400 hover:bg-red-500/20">
                            <Trash2 className="w-3 h-3" /> Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
