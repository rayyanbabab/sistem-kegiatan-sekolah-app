'use client'

import { useEffect, useState, useCallback } from 'react'
import { Trophy, Medal, BarChart3, RefreshCw, Search, Award, Filter, AlertCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface LeaderboardItem {
  rank: number
  kelas: string
  points: number
  medals: { gold: number; silver: number; bronze: number }
}

interface Event {
  id: string
  name: string
  status: string
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="surface-card rounded-lg p-3 border border-border shadow-md">
        <p className="font-semibold text-xs text-foreground">{label}</p>
        <p className="text-amber-600 dark:text-amber-400 font-bold text-sm mt-0.5">
          {payload[0].value} Poin
        </p>
      </div>
    )
  }
  return null
}

export default function LeaderboardPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEventId, setSelectedEventId] = useState<string>('')
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterTingkat, setFilterTingkat] = useState('SEMUA')

  // Fetch events list first
  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch('/api/events', { credentials: 'include' })
      const json = await res.json()
      if (json.success && json.data.length > 0) {
        setEvents(json.data)
        const active = json.data.find((e: Event) => e.status === 'ACTIVE')
        setSelectedEventId(active ? active.id : json.data[0].id)
      } else {
        setLoading(false)
      }
    } catch {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  // Fetch leaderboard when event changes
  const fetchLeaderboard = useCallback(async () => {
    if (!selectedEventId) {
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/results?eventId=${selectedEventId}`, { credentials: 'include' })
      const json = await res.json()
      if (json.success) {
        setLeaderboard(json.data)
      }
    } catch { }
    setLoading(false)
  }, [selectedEventId])

  useEffect(() => {
    if (selectedEventId) {
      fetchLeaderboard()
    }
  }, [selectedEventId, fetchLeaderboard])

  const filtered = leaderboard.filter(item => {
    const matchesSearch = item.kelas.toLowerCase().includes(search.toLowerCase())
    if (!matchesSearch) return false
    if (filterTingkat === 'SEMUA') return true
    return item.kelas.startsWith(filterTingkat)
  })

  const top3 = leaderboard.slice(0, 3)

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-4">
        <div>
          <span className="academic-badge mb-2">Pekan Olahraga & Seni</span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Klasemen Poin Antarkelas
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Akumulasi skor dan perolehan medali juara umum kegiatan Classmeeting.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {events.length > 0 && (
            <select
              value={selectedEventId}
              onChange={e => setSelectedEventId(e.target.value)}
              className="px-3 py-2 rounded-lg text-xs font-semibold bg-background border border-input text-foreground outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              {events.map(ev => (
                <option key={ev.id} value={ev.id}>
                  {ev.name} {ev.status === 'ACTIVE' ? '(Aktif)' : ''}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={fetchLeaderboard}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Perbarui</span>
          </button>
        </div>
      </div>

      {/* Podium Card (Top 3) */}
      {top3.length > 0 && (
        <div className="surface-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Trophy className="w-4 h-4 text-amber-500" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Tiga Besar Juara Umum
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-2xl mx-auto items-end pt-4">
            {/* Rank 2 */}
            {top3[1] ? (
              <div className="flex flex-col items-center text-center">
                <div className="w-9 h-9 rounded-full bg-slate-400/20 text-slate-700 dark:text-slate-300 border border-slate-400/40 flex items-center justify-center font-bold text-sm mb-2">
                  2
                </div>
                <p className="font-bold text-xs sm:text-sm text-foreground truncate max-w-full">
                  {top3[1].kelas}
                </p>
                <p className="text-xs text-muted-foreground font-semibold mt-0.5">
                  {top3[1].points} Poin
                </p>
                <div className="w-full h-20 sm:h-24 rounded-t-lg bg-muted/60 border-t-2 border-slate-400 mt-3 flex items-center justify-center">
                  <span className="text-xs font-bold text-muted-foreground">Perak</span>
                </div>
              </div>
            ) : <div />}

            {/* Rank 1 */}
            {top3[0] ? (
              <div className="flex flex-col items-center text-center -mt-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold text-lg mb-2 shadow-xs">
                  1
                </div>
                <p className="font-bold text-sm sm:text-base text-foreground truncate max-w-full">
                  {top3[0].kelas}
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400 font-bold mt-0.5">
                  {top3[0].points} Poin
                </p>
                <div className="w-full h-28 sm:h-32 rounded-t-lg bg-amber-500/10 border-t-2 border-amber-500 mt-3 flex items-center justify-center">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Piala Bergilir</span>
                </div>
              </div>
            ) : <div />}

            {/* Rank 3 */}
            {top3[2] ? (
              <div className="flex flex-col items-center text-center">
                <div className="w-9 h-9 rounded-full bg-orange-500/20 text-orange-700 dark:text-orange-400 border border-orange-500/40 flex items-center justify-center font-bold text-sm mb-2">
                  3
                </div>
                <p className="font-bold text-xs sm:text-sm text-foreground truncate max-w-full">
                  {top3[2].kelas}
                </p>
                <p className="text-xs text-muted-foreground font-semibold mt-0.5">
                  {top3[2].points} Poin
                </p>
                <div className="w-full h-16 sm:h-20 rounded-t-lg bg-muted/40 border-t-2 border-orange-500 mt-3 flex items-center justify-center">
                  <span className="text-xs font-bold text-muted-foreground">Perunggu</span>
                </div>
              </div>
            ) : <div />}
          </div>
        </div>
      )}

      {/* Interactive Controls & Chart */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Chart View */}
        <div className="surface-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-primary" />
            <h2 className="font-bold text-sm text-foreground">Grafik Distribusi Poin Kelas</h2>
          </div>

          {leaderboard.length === 0 ? (
            <div className="h-56 flex items-center justify-center border border-dashed border-border rounded-lg text-xs text-muted-foreground">
              Belum ada perolehan skor pertandingan
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leaderboard.slice(0, 8)} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                  <XAxis
                    dataKey="kelas"
                    tick={{ fill: 'currentColor', fontSize: 11 }}
                    className="text-muted-foreground"
                    angle={-20}
                    textAnchor="end"
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: 'currentColor', fontSize: 11 }}
                    className="text-muted-foreground"
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="points" radius={[4, 4, 0, 0]} className="fill-primary" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Medals Summary Information */}
        <div className="surface-card rounded-xl border border-border p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-4 h-4 text-amber-500" />
              <h2 className="font-bold text-sm text-foreground">Sistem Akumulasi Poin</h2>
            </div>
            <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
              <div className="p-3 rounded-lg bg-muted/40 border border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="font-semibold text-foreground">Juara 1 (Medali Emas)</span>
                </div>
                <span className="font-bold text-foreground">100 Poin</span>
              </div>
              <div className="p-3 rounded-lg bg-muted/40 border border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  <span className="font-semibold text-foreground">Juara 2 (Medali Perak)</span>
                </div>
                <span className="font-bold text-foreground">60 Poin</span>
              </div>
              <div className="p-3 rounded-lg bg-muted/40 border border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  <span className="font-semibold text-foreground">Juara 3 (Medali Perunggu)</span>
                </div>
                <span className="font-bold text-foreground">30 Poin</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20 text-xs text-muted-foreground">
            Peringkat dihitung secara otomatis ketika panitia mencatat hasil pertandingan pada menu <strong>Input Hasil Lomba</strong>.
          </div>
        </div>
      </div>

      {/* Filter and Rankings Table */}
      <div className="surface-card rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-foreground uppercase tracking-wider">
              Tabel Klasemen ({filtered.length} Kelas)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Tingkat */}
            <div className="flex items-center bg-muted p-1 rounded-lg border border-border/80">
              {['SEMUA', 'X', 'XI', 'XII'].map(t => (
                <button
                  key={t}
                  onClick={() => setFilterTingkat(t)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                    filterTingkat === t
                      ? 'bg-card text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t === 'SEMUA' ? 'Semua' : `Kelas ${t}`}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari kelas..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg text-xs bg-background border border-input text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary w-36 sm:w-44"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 space-y-3">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-10 rounded-md bg-muted animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-semibold text-foreground">
                {search ? 'Tidak ada kelas sesuai kata kunci' : 'Belum Ada Data Klasemen'}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Nilai dan medali akan tercatat setelah hasil pertandingan cabang lomba diselesaikan.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="px-5 py-3">Peringkat</th>
                  <th className="px-5 py-3">Rombel Kelas</th>
                  <th className="px-5 py-3 text-center">Emas</th>
                  <th className="px-5 py-3 text-center">Perak</th>
                  <th className="px-5 py-3 text-center">Perunggu</th>
                  <th className="px-5 py-3 text-right">Total Poin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(item => (
                  <tr key={item.kelas} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-xs">
                      {item.rank === 1 ? (
                        <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-extrabold text-xs inline-flex items-center justify-center border border-amber-500/40">
                          1
                        </span>
                      ) : item.rank === 2 ? (
                        <span className="w-6 h-6 rounded-full bg-slate-400/20 text-slate-700 dark:text-slate-300 font-extrabold text-xs inline-flex items-center justify-center border border-slate-400/40">
                          2
                        </span>
                      ) : item.rank === 3 ? (
                        <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-700 dark:text-orange-400 font-extrabold text-xs inline-flex items-center justify-center border border-orange-500/40">
                          3
                        </span>
                      ) : (
                        <span className="text-muted-foreground pl-1.5">#{item.rank}</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-foreground text-xs sm:text-sm">
                      {item.kelas}
                    </td>
                    <td className="px-5 py-3.5 text-center text-xs font-semibold text-amber-600 dark:text-amber-400">
                      {item.medals.gold}
                    </td>
                    <td className="px-5 py-3.5 text-center text-xs font-semibold text-slate-600 dark:text-slate-400">
                      {item.medals.silver}
                    </td>
                    <td className="px-5 py-3.5 text-center text-xs font-semibold text-orange-600 dark:text-orange-400">
                      {item.medals.bronze}
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-foreground text-xs sm:text-sm">
                      {item.points} Poin
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
