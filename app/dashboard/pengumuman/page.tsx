'use client'

import { useEffect, useState } from 'react'
import { Megaphone, Clock, RefreshCw } from 'lucide-react'

interface Announcement {
  id: string
  title: string
  description: string
  type: string
  image: string | null
  createdAt: string
  creator: { name: string }
}

const TYPE_CFG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  SEKOLAH: { label: 'Sekolah', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  LOMBA:   { label: 'Lomba',   color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  PEMILU:  { label: 'Pemilu',  color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
  JUARA:   { label: 'Juara',   color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
}

const TYPE_ICON: Record<string, string> = { SEKOLAH: '🏫', LOMBA: '🏆', PEMILU: '🗳️', JUARA: '🥇' }

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 60) return `${m} menit lalu`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} jam lalu`
  return `${Math.floor(h / 24)} hari lalu`
}

export default function PengumumanPage() {
  const [items, setItems] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('ALL')

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/announcements', { credentials: 'include' })
      const json = await res.json()
      if (json.success) setItems(json.data)
    } catch { /* ignore */ }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const filters = ['ALL', 'SEKOLAH', 'LOMBA', 'PEMILU', 'JUARA']
  const filtered = filter === 'ALL' ? items : items.filter(a => a.type === filter)

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Megaphone className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-amber-400 font-medium uppercase tracking-wider">Informasi</span>
          </div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Pengumuman</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>{items.length} pengumuman tersedia</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition" style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)', color: 'var(--text-muted)' }}>
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${filter === f ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg' : ''}`}
            style={filter !== f ? { background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)', color: 'var(--text-muted)' } : {}}>
            {f === 'ALL' ? 'Semua' : TYPE_CFG[f]?.label ?? f}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="glass-card rounded-2xl p-5 space-y-3 animate-pulse">
              <div className="h-4 rounded w-1/3" style={{ background: 'var(--subtle-bg)' }} />
              <div className="h-5 rounded w-2/3" style={{ background: 'var(--subtle-bg)' }} />
              <div className="h-3 rounded" style={{ background: 'var(--subtle-bg)' }} />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center">
          <Megaphone className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-faint)' }} />
          <p className="font-medium" style={{ color: 'var(--text-muted)' }}>Belum ada pengumuman</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(item => {
            const cfg = TYPE_CFG[item.type] || TYPE_CFG.SEKOLAH
            return (
              <div key={item.id} className="glass-card rounded-2xl overflow-hidden hover:border-white/20 transition-all hover:-translate-y-0.5">
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-xl ${cfg.bg} border ${cfg.border} flex items-center justify-center text-xl flex-shrink-0`}>
                      {TYPE_ICON[item.type] || '📢'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-semibold ${cfg.bg} ${cfg.color} border ${cfg.border}`}>{cfg.label}</span>
                        <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-faint)' }}>
                          <Clock className="w-3 h-3" /> {timeAgo(item.createdAt)}
                        </span>
                      </div>
                      <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                      <p className="text-sm mt-1.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.description}</p>
                      <p className="text-xs mt-2" style={{ color: 'var(--text-faint)' }}>— {item.creator.name}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
