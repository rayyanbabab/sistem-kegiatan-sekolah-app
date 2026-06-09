'use client'

import { useEffect, useState, useCallback } from 'react'
import { BarChart3, TrendingUp, Users, Trophy, RefreshCw } from 'lucide-react'

interface CandidateResult {
  id: string; number: number; name: string; kelas: string | null
  avatar: string | null; photo: string | null; visiMisi: string
  votes: number; percentage: number
}
interface VotingSessionInfo {
  id: string; status: string; startTime: string; endTime: string
  totalVoters: number; votedCount: number; participationRate: number
}
interface ResultData {
  candidates: CandidateResult[]; ranked: CandidateResult[]
  votingSession: VotingSessionInfo | null
}

const GRADIENTS = ['from-amber-500 to-yellow-400', 'from-slate-400 to-slate-300', 'from-orange-600 to-amber-500', 'from-blue-500 to-cyan-400']
const RANK_ICONS = ['🥇', '🥈', '🥉', '4️⃣']

export default function RealCountPage() {
  const [data, setData] = useState<ResultData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/voting/results', { credentials: 'include' })
      const json = await res.json()
      if (json.success) setData(json.data)
    } catch { /* ignore */ }
    setLoading(false)
  }, [])

  // Auto-refresh setiap 15 detik jika voting terbuka
  useEffect(() => {
    fetchData()
    const interval = setInterval(() => {
      if (data?.votingSession?.status === 'OPEN') fetchData()
    }, 15000)
    return () => clearInterval(interval)
  }, [fetchData, data?.votingSession?.status])

  const ses = data?.votingSession
  const maxVotes = data?.candidates.reduce((mx, c) => Math.max(mx, c.votes), 1) || 1

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-4 h-4 text-pink-400" />
            <span className="text-xs text-pink-400 font-medium uppercase tracking-wider">Pemilu OSIS 2026</span>
            {ses?.status === 'OPEN' && (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-green-500/15 border border-green-500/25 text-xs text-green-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> LIVE
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Real Count</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>Perolehan suara real-time</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition" style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)', color: 'var(--text-muted)' }}>
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Session stats */}
      {ses && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Users, label: 'Total Pemilih', value: ses.totalVoters, color: 'from-blue-500 to-blue-400' },
            { icon: Trophy, label: 'Sudah Memilih', value: ses.votedCount, color: 'from-violet-500 to-purple-400' },
            { icon: TrendingUp, label: 'Partisipasi', value: `${ses.participationRate}%`, color: 'from-green-500 to-emerald-400' },
          ].map(s => (
            <div key={s.label} className="glass-card rounded-2xl p-5 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center flex-shrink-0`}>
                <s.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{loading ? '...' : s.value}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Partisipasi progress */}
      {ses && (
        <div className="glass-card rounded-2xl p-5">
          <div className="flex justify-between text-xs mb-2" style={{ color: 'var(--text-faint)' }}>
            <span>Tingkat Partisipasi</span>
            <span className="font-semibold text-green-400">{ses.participationRate}%</span>
          </div>
          <div className="w-full rounded-full h-3" style={{ background: 'var(--subtle-bg)' }}>
            <div className="bg-gradient-to-r from-blue-500 to-violet-500 h-3 rounded-full transition-all duration-1000" style={{ width: `${ses.participationRate}%` }} />
          </div>
        </div>
      )}

      {/* Candidates hasil */}
      {loading ? (
        <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="glass-card rounded-2xl h-24 animate-pulse" style={{ background: 'var(--subtle-bg)' }} />)}</div>
      ) : !data || data.candidates.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center">
          <BarChart3 className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-faint)' }} />
          <p className="font-medium" style={{ color: 'var(--text-muted)' }}>Belum ada data voting</p>
        </div>
      ) : (
        <>
          <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Peringkat Kandidat</p>
          <div className="space-y-3">
            {data.ranked.map((c, rank) => {
              const barWidth = maxVotes > 0 ? (c.votes / maxVotes) * 100 : 0
              return (
                <div key={c.id} className="glass-card rounded-2xl p-5 hover:border-white/20 transition-all">
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <span className="text-2xl flex-shrink-0 w-9 text-center">{RANK_ICONS[rank] || `${rank + 1}`}</span>

                    {/* Avatar */}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${GRADIENTS[rank] || 'from-blue-500 to-violet-500'} flex items-center justify-center flex-shrink-0 overflow-hidden shadow-lg`}>
                      {(c.avatar || c.photo) ? <img src={c.photo || c.avatar!} alt={c.name} className="w-full h-full object-cover" /> : <span className="text-white font-bold">{c.number}</span>}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <div>
                          <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{c.name}</p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Kandidat #{c.number} · {c.kelas}</p>
                        </div>
                        <div className="text-right flex-shrink-0 ml-4">
                          <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{c.votes}</p>
                          <p className="text-xs text-blue-400 font-semibold">{c.percentage}%</p>
                        </div>
                      </div>
                      {/* Progress bar */}
                      <div className="w-full rounded-full h-2" style={{ background: 'var(--subtle-bg)' }}>
                        <div
                          className={`h-2 rounded-full bg-gradient-to-r ${GRADIENTS[rank] || 'from-blue-500 to-violet-500'} transition-all duration-1000`}
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
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
