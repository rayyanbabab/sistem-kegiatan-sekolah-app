'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Trophy, Star, Medal, RefreshCw } from 'lucide-react'

interface Result {
  id: string; position: number; points: number; medal: string | null
  team: { id: string; name: string; kelas: string }
  competition: { id: string; name: string; category: string }
}

const MEDAL_CFG: Record<string, { label: string; icon: string; color: string; bar: string; height: string }> = {
  GOLD:   { label: 'Juara 1', icon: '🥇', color: 'bg-amber-400/15 border-amber-400/30 text-amber-400', bar: 'from-amber-500 to-yellow-400', height: 'h-20' },
  SILVER: { label: 'Juara 2', icon: '🥈', color: 'bg-slate-400/15 border-slate-400/30 text-slate-400',  bar: 'from-slate-400 to-slate-300',   height: 'h-12' },
  BRONZE: { label: 'Juara 3', icon: '🥉', color: 'bg-orange-400/15 border-orange-400/30 text-orange-400', bar: 'from-orange-500 to-amber-500', height: 'h-8' },
}

const CAT_ICON: Record<string, string> = { OLAHRAGA: '⚽', AKADEMIK: '🎤', SENI: '🎨' }
const CAT_GRAD: Record<string, string> = { OLAHRAGA: 'from-blue-500 to-cyan-500', AKADEMIK: 'from-violet-500 to-purple-500', SENI: 'from-amber-500 to-yellow-500' }

export default function ResultsPage() {
  const { currentUser } = useAuth()
  const isAdmin = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'PANITIA'
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/results', { credentials: 'include' })
      const json = await res.json()
      if (json.success) setResults(json.data)
    } catch { /* ignore */ }
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  // Group results by competition
  const byComp: Record<string, Result[]> = {}
  results.forEach(r => {
    if (!byComp[r.competition.id]) byComp[r.competition.id] = []
    byComp[r.competition.id].push(r)
  })
  // Sort each competition's results by position
  Object.values(byComp).forEach(arr => arr.sort((a, b) => a.position - b.position))

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-amber-400 font-medium uppercase tracking-wider">Classmeeting 2026</span>
          </div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {isAdmin ? 'Input Hasil Pertandingan' : 'Hasil Pertandingan'}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {isAdmin ? 'Kelola dan tampilkan hasil setiap pertandingan' : 'Hasil klasemen pertandingan classmeeting'}
          </p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition" style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)', color: 'var(--text-muted)' }}>
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="glass-card rounded-2xl h-48 animate-pulse" style={{ background: 'var(--subtle-bg)' }} />)}
        </div>
      ) : results.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center">
          <Trophy className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-faint)' }} />
          <p className="font-medium" style={{ color: 'var(--text-muted)' }}>Belum ada hasil pertandingan</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-faint)' }}>Hasil akan muncul setelah panitia menginputkan data</p>
        </div>
      ) : (
        <>
          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Kompetisi Selesai', value: Object.keys(byComp).length, color: 'from-amber-500 to-orange-400', icon: Trophy },
              { label: 'Medali Emas', value: results.filter(r => r.medal === 'GOLD').length, color: 'from-yellow-500 to-amber-400', icon: Star },
              { label: 'Total Tim Juara', value: results.length, color: 'from-blue-500 to-cyan-400', icon: Medal },
            ].map(s => (
              <div key={s.label} className="glass-card rounded-2xl p-5 flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center flex-shrink-0`}>
                  <s.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{s.value}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Podium by competition */}
          <div className="grid md:grid-cols-2 gap-5">
            {Object.values(byComp).map(compResults => {
              const comp = compResults[0].competition
              const grad = CAT_GRAD[comp.category] || 'from-blue-500 to-violet-500'
              const icon = CAT_ICON[comp.category] || '🏆'
              const gold   = compResults.find(r => r.medal === 'GOLD' || r.position === 1)
              const silver = compResults.find(r => r.medal === 'SILVER' || r.position === 2)
              const bronze = compResults.find(r => r.medal === 'BRONZE' || r.position === 3)

              return (
                <div key={comp.id} className="glass-card rounded-2xl overflow-hidden hover:border-white/20 transition-all">
                  <div className={`h-1.5 bg-gradient-to-r ${grad}`} />
                  <div className="p-5">
                    {/* Competition header */}
                    <div className="flex items-center gap-3 mb-5">
                      <span className="text-2xl">{icon}</span>
                      <div>
                        <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{comp.name}</h3>
                        <p className="text-xs" style={{ color: 'var(--text-faint)' }}>{comp.category.toLowerCase()}</p>
                      </div>
                    </div>

                    {/* Podium */}
                    <div className="flex items-end gap-3 justify-center">
                      {/* 2nd place */}
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-slate-400/15 border border-slate-400/30 flex items-center justify-center text-lg">🥈</div>
                        <div className="h-12 w-20 rounded-t-xl bg-slate-400/10 border border-slate-400/20 flex items-end justify-center pb-1.5">
                          <span className="text-xs font-bold text-slate-400">2nd</span>
                        </div>
                        <p className="text-[11px] text-center font-medium leading-tight w-20" style={{ color: 'var(--text-muted)' }}>
                          {silver ? silver.team.kelas : '—'}
                        </p>
                      </div>
                      {/* 1st place */}
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-xl shadow-lg`}>⭐</div>
                        <div className="h-20 w-20 rounded-t-xl bg-amber-400/10 border border-amber-400/20 flex items-end justify-center pb-1.5">
                          <span className="text-xs font-bold text-amber-400">1st</span>
                        </div>
                        <p className="text-[11px] text-center font-semibold leading-tight w-20" style={{ color: 'var(--text-primary)' }}>
                          {gold ? gold.team.kelas : '—'}
                        </p>
                      </div>
                      {/* 3rd place */}
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-orange-400/15 border border-orange-400/30 flex items-center justify-center text-lg">🥉</div>
                        <div className="h-8 w-20 rounded-t-xl bg-orange-400/10 border border-orange-400/20 flex items-end justify-center pb-1.5">
                          <span className="text-xs font-bold text-orange-400">3rd</span>
                        </div>
                        <p className="text-[11px] text-center font-medium leading-tight w-20" style={{ color: 'var(--text-muted)' }}>
                          {bronze ? bronze.team.kelas : '—'}
                        </p>
                      </div>
                    </div>

                    {/* Full list */}
                    <div className="mt-4 pt-4 space-y-1.5" style={{ borderTop: '1px solid var(--subtle-border)' }}>
                      {compResults.map(r => {
                        const mcfg = r.medal ? MEDAL_CFG[r.medal] : null
                        return (
                          <div key={r.id} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm" style={{ background: 'var(--subtle-bg)' }}>
                            <span className="text-base w-6 text-center">{mcfg?.icon || `#${r.position}`}</span>
                            <span className="flex-1 font-medium truncate" style={{ color: 'var(--text-secondary)' }}>{r.team.name}</span>
                            <span className="text-xs" style={{ color: 'var(--text-faint)' }}>{r.team.kelas}</span>
                            <span className="text-xs font-semibold text-amber-400">{r.points} pts</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
