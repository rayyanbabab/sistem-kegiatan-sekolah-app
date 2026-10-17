'use client'

import { useEffect, useState, useCallback } from 'react'
import { Calendar, Clock, MapPin, CheckCircle2, Hourglass, RefreshCw, Dumbbell, Mic2, Palette, Search, Layers, LucideIcon } from 'lucide-react'

interface Competition {
  id: string
  name: string
  category: string
  date: string
  time: string
  location: string
  event: { id: string; name: string }
}

const CAT_CFG: Record<string, { icon: LucideIcon; label: string }> = {
  OLAHRAGA: { icon: Dumbbell, label: 'Olahraga' },
  AKADEMIK: { icon: Mic2, label: 'Akademik' },
  SENI: { icon: Palette, label: 'Seni & Budaya' },
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
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const d = new Date(dateStr)
  d.setHours(0, 0, 0, 0)
  if (d.getTime() === today.getTime()) return 'today'
  if (d < today) return 'past'
  return 'upcoming'
}

export default function SchedulePage() {
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('ALL')

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

  const filtered = competitions.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase())
    if (!matchesSearch) return false
    if (filterCat === 'ALL') return true
    return c.category === filterCat
  })

  const grouped = groupByDate(filtered)

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-4">
        <div>
          <span className="academic-badge mb-2">Classmeeting 2026</span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Jadwal Pertandingan
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Waktu pelaksanaan, lokasi arena pertandingan, dan status giliran tanding setiap cabang.
          </p>
        </div>
        <button
          onClick={fetchData}
          className="self-start sm:self-auto flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Perbarui Jadwal</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {['ALL', 'OLAHRAGA', 'AKADEMIK', 'SENI'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                filterCat === cat
                  ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                  : 'bg-muted/40 text-muted-foreground border-border hover:bg-muted hover:text-foreground'
              }`}
            >
              {cat === 'ALL' ? 'Semua Kategori' : CAT_CFG[cat]?.label || cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-60">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari lomba atau lokasi..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-background border border-input text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-2">
              <div className="h-6 w-40 rounded-md bg-muted animate-pulse" />
              <div className="surface-card rounded-xl h-20 bg-muted animate-pulse" />
            </div>
          ))}
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="surface-card rounded-xl p-12 text-center border border-dashed border-border">
          <Calendar className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">
            {search ? 'Tidak ada jadwal sesuai pencarian' : 'Belum Ada Jadwal Pertandingan'}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Jadwal tanding akan dipublikasikan oleh panitia setelah bagan undian pertandingan selesai disusun.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, items]) => {
            const status = getDateStatus(date)
            const dayLabel = new Date(date).toLocaleDateString('id-ID', {
              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
            })

            return (
              <div key={date} className="space-y-3">
                {/* Date Group Header */}
                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1 rounded-md text-xs font-semibold inline-flex items-center gap-2 border ${
                    status === 'today'
                      ? 'chip-active border-emerald-500/30'
                      : status === 'past'
                      ? 'chip-ended'
                      : 'chip-upcoming'
                  }`}>
                    {status === 'today' && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                    <span>{status === 'today' ? `Hari Ini • ${dayLabel}` : dayLabel}</span>
                  </div>
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground font-medium">
                    {items.length} Pertandingan
                  </span>
                </div>

                {/* Match Cards */}
                <div className="grid sm:grid-cols-2 gap-3.5">
                  {items.map(item => {
                    const cfg = CAT_CFG[item.category] || { icon: Layers, label: item.category }
                    const CatIcon = cfg.icon

                    return (
                      <div
                        key={item.id}
                        className={`surface-card p-4 sm:p-5 rounded-xl border border-border flex flex-col justify-between hover:border-primary/40 transition-colors ${
                          status === 'past' ? 'opacity-75' : ''
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-3 mb-2.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-lg bg-secondary text-foreground/80 border border-border flex items-center justify-center shrink-0">
                                <CatIcon className="w-4 h-4" />
                              </div>
                              <div>
                                <h3 className="font-bold text-sm text-foreground leading-tight">
                                  {item.name}
                                </h3>
                                <p className="text-[11px] text-muted-foreground mt-0.5">
                                  {cfg.label} • {item.event?.name}
                                </p>
                              </div>
                            </div>

                            {status === 'past' ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold chip-ended shrink-0">
                                Selesai
                              </span>
                            ) : status === 'today' ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold chip-active shrink-0">
                                Berlangsung
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold chip-upcoming shrink-0">
                                Terjadwal
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-border flex items-center justify-between gap-2 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-primary" />
                            <span>{item.time} WIB</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 truncate">
                            <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="truncate">{item.location}</span>
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Helpful Info Notice */}
      <div className="surface-card rounded-xl p-4 border border-border bg-muted/20 text-xs text-muted-foreground flex items-center gap-3">
        <Clock className="w-4 h-4 text-primary shrink-0" />
        <p>
          Peserta diharapkan hadir di lokasi pertandingan paling lambat <strong>15 menit</strong> sebelum jadwal dimulai untuk registrasi kehadiran oleh panitia.
        </p>
      </div>
    </div>
  )
}
