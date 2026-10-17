'use client'

import { useEffect, useState, useCallback } from 'react'
import { BarChart3, TrendingUp, Users, Trophy, RefreshCw, Vote, CheckCircle2 } from 'lucide-react'

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

const RANK_BADGES = [
  'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25 font-bold',
  'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/25 font-bold',
  'bg-amber-700/10 text-amber-700 dark:text-amber-500 border border-amber-700/25 font-bold',
  'bg-secondary text-muted-foreground border border-border font-semibold',
]

export default function RealCountPage() {
  const [data, setData] = useState<ResultData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/voting/results', { credentials: 'include' })
      const json = await res.json()
      if (json.success) setData(json.data)
    } catch { }
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
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="academic-badge">Pemilu OSIS 2026</span>
            {ses?.status === 'OPEN' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full chip-active text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Sesi Pemilihan Aktif</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full chip-ended text-xs font-semibold">
                <span>Sesi Ditutup</span>
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Rekapitulasi Suara (Real Count)
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Hasil penghitungan suara sah Pemilihan Ketua OSIS secara langsung dan transparan.
          </p>
        </div>
        <button
          onClick={fetchData}
          className="self-start sm:self-auto flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Perbarui Data</span>
        </button>
      </div>

      {/* Session stats */}
      {ses && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="surface-card p-4 sm:p-5 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-secondary text-foreground/80 flex items-center justify-center shrink-0 border border-border">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-foreground leading-tight">{ses.totalVoters}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Daftar Pemilih</p>
            </div>
          </div>

          <div className="surface-card p-4 sm:p-5 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-secondary text-foreground/80 flex items-center justify-center shrink-0 border border-border">
              <Vote className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-foreground leading-tight">{ses.votedCount}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Suara Masuk</p>
            </div>
          </div>

          <div className="surface-card p-4 sm:p-5 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-secondary text-foreground/80 flex items-center justify-center shrink-0 border border-border">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-foreground leading-tight">{ses.participationRate}%</p>
              <p className="text-xs text-muted-foreground mt-0.5">Partisipasi</p>
            </div>
          </div>
        </div>
      )}

      {/* Partisipasi progress */}
      {ses && (
        <div className="surface-card p-5 space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Progres Partisipasi Seluruh Siswa</span>
            <span className="font-bold text-foreground">{ses.votedCount} dari {ses.totalVoters} siswa ({ses.participationRate}%)</span>
          </div>
          <div className="w-full rounded-full h-2.5 bg-muted overflow-hidden">
            <div
              className="bg-primary h-2.5 rounded-full transition-all duration-700"
              style={{ width: `${ses.participationRate}%` }}
            />
          </div>
        </div>
      )}

      {/* Candidates hasil */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="surface-card rounded-xl h-24 animate-pulse bg-muted" />)}
        </div>
      ) : !data || data.candidates.length === 0 ? (
        <div className="surface-card rounded-xl p-12 text-center border border-dashed border-border">
          <BarChart3 className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
          <p className="font-semibold text-foreground">Belum ada data perolehan suara</p>
          <p className="text-xs text-muted-foreground mt-1">Data akan otomatis terupdate saat pemilih memberikan suara.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Peringkat Perolehan Suara Kandidat</h2>
          {data.ranked.map((c, rank) => {
            const barWidth = maxVotes > 0 ? (c.votes / maxVotes) * 100 : 0
            const badgeStyle = RANK_BADGES[rank] || RANK_BADGES[3]

            return (
              <div key={c.id} className="surface-card rounded-xl p-4 sm:p-5 hover:border-primary/40 transition-colors">
                <div className="flex items-center gap-3.5 sm:gap-4">
                  {/* Rank Number */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs shadow-xs ${badgeStyle}`}>
                    {rank + 1}
                  </div>

                  {/* Candidate Avatar */}
                  <div className="w-11 h-11 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center shrink-0 overflow-hidden font-bold text-sm border border-border">
                    {(c.avatar || c.photo) ? (
                      <img src={c.photo || c.avatar!} alt={c.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{c.number}</span>
                    )}
                  </div>

                  {/* Candidate Info and Vote Bars */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5 gap-2">
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-foreground truncate">{c.name}</p>
                        <p className="text-xs text-muted-foreground">Paslon #{c.number} • Kelas {c.kelas || '-'}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-lg font-extrabold text-foreground leading-tight">{c.votes} suara</p>
                        <p className="text-xs font-semibold text-primary">{c.percentage}%</p>
                      </div>
                    </div>

                    {/* Clean Progress Bar */}
                    <div className="w-full rounded-full h-2 bg-muted overflow-hidden">
                      <div
                        className="h-2 rounded-full bg-primary transition-all duration-700"
                        style={{ width: `${barWidth}%` }}
                      />
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
