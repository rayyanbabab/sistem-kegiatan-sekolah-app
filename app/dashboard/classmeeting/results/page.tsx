'use client'

import { useAuth } from '@/context/AuthContext'
import { Trophy, Star, Medal, Upload, CheckCircle, Clock, Edit3 } from 'lucide-react'

const RESULTS = [
  {
    competition: 'Futsal Putra',
    type: 'LOMBA',
    matches: [
      { round: 'Final', team1: 'XII IPA 1', team2: 'XII IPS 2', score: '3-1', winner: 'XII IPA 1', status: 'done' },
      { round: 'Semifinal', team1: 'XII IPA 1', team2: 'XI IPA 2', score: '2-0', winner: 'XII IPA 1', status: 'done' },
      { round: 'Semifinal', team1: 'XII IPS 2', team2: 'X IPA 3', score: '1-0', winner: 'XII IPS 2', status: 'done' },
    ]
  },
  {
    competition: 'Volley Ball Putri',
    type: 'LOMBA',
    matches: [
      { round: 'Final', team1: 'XII IPS 1', team2: 'XI IPA 1', score: '-', winner: '-', status: 'upcoming' },
      { round: 'Semifinal', team1: 'XII IPS 1', team2: 'X IPS 2', score: '3-0', winner: 'XII IPS 1', status: 'done' },
    ]
  },
]

const COMPETITIONS_PODIUM = [
  { competition: 'Futsal Putra', rank1: 'XII IPA 1', rank2: 'XII IPS 2', rank3: 'XI IPA 2', color: 'from-amber-500 to-orange-400' },
  { competition: 'Debat B. Indonesia', rank1: 'XII IPA 2', rank2: 'XI IPS 1', rank3: 'X IPA 1', color: 'from-blue-500 to-cyan-400' },
]

export default function ResultsPage() {
  const { currentUser } = useAuth()
  const isAdmin = currentUser?.role === 'super-admin' || currentUser?.role === 'panitia'

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-amber-400 font-medium uppercase tracking-wider">Classmeeting 2026</span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Input Hasil Pertandingan</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              {isAdmin ? 'Input dan kelola hasil setiap pertandingan' : 'Hasil pertandingan classmeeting'}
            </p>
          </div>
          {isAdmin && (
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg hover:opacity-90 transition flex-shrink-0">
              <Upload className="w-4 h-4" /> Input Hasil
            </button>
          )}
        </div>
      </div>

      {/* Podium / Juara Section */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Medal className="w-4 h-4 text-amber-400" />
          <h2 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Podium Sementara</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {COMPETITIONS_PODIUM.map(c => (
            <div key={c.competition} className="rounded-xl p-4" style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)' }}>
              <p className="text-xs font-semibold mb-3 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                <Trophy className="w-3 h-3 text-amber-400" /> {c.competition}
              </p>
              <div className="flex items-end gap-3 justify-center">
                {/* Rank 2 */}
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-400/20 border border-slate-400/30 flex items-center justify-center">
                    <Medal className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="h-12 w-16 rounded-t-lg bg-slate-400/15 border border-slate-400/20 flex items-end justify-center pb-1">
                    <span className="text-[10px] font-bold text-slate-400">2</span>
                  </div>
                  <p className="text-[10px] text-center font-medium max-w-16 leading-tight" style={{ color: 'var(--text-muted)' }}>{c.rank2}</p>
                </div>
                {/* Rank 1 */}
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center shadow-lg`}>
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div className="h-20 w-16 rounded-t-lg bg-amber-400/15 border border-amber-400/20 flex items-end justify-center pb-1">
                    <span className="text-[10px] font-bold text-amber-400">1</span>
                  </div>
                  <p className="text-[10px] text-center font-medium max-w-16 leading-tight" style={{ color: 'var(--text-primary)' }}>{c.rank1}</p>
                </div>
                {/* Rank 3 */}
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-10 h-10 rounded-xl bg-orange-400/20 border border-orange-400/30 flex items-center justify-center">
                    <Medal className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="h-8 w-16 rounded-t-lg bg-orange-400/15 border border-orange-400/20 flex items-end justify-center pb-1">
                    <span className="text-[10px] font-bold text-orange-400">3</span>
                  </div>
                  <p className="text-[10px] text-center font-medium max-w-16 leading-tight" style={{ color: 'var(--text-muted)' }}>{c.rank3}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Match Results */}
      {RESULTS.map(r => (
        <div key={r.competition} className="glass-card rounded-2xl overflow-hidden">
          <div className="px-5 py-4 flex items-center gap-2" style={{ borderBottom: '1px solid var(--subtle-border)' }}>
            <Trophy className="w-4 h-4 text-amber-400" />
            <h2 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{r.competition}</h2>
          </div>
          <div className="p-5 space-y-3">
            {r.matches.map((m, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl" style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)' }}>
                <span className="text-[10px] font-bold uppercase tracking-wider w-20 flex-shrink-0" style={{ color: 'var(--text-faint)' }}>{m.round}</span>
                <div className="flex-1 flex items-center justify-between gap-3 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  <span className="truncate">{m.team1}</span>
                  <span className="px-3 py-1 rounded-xl text-xs font-bold" style={{ background: m.status === 'done' ? 'rgba(59,130,246,0.12)' : 'var(--subtle-bg)', color: m.status === 'done' ? '#60a5fa' : 'var(--text-faint)', border: '1px solid', borderColor: m.status === 'done' ? 'rgba(59,130,246,0.2)' : 'var(--subtle-border)' }}>
                    {m.status === 'done' ? m.score : 'vs'}
                  </span>
                  <span className="truncate text-right">{m.team2}</span>
                </div>
                <div className="flex-shrink-0 flex items-center gap-2">
                  {m.status === 'done' ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-400" />
                  )}
                  {isAdmin && m.status !== 'done' && (
                    <button className="p-1.5 rounded-lg hover:bg-white/5 transition" style={{ color: 'var(--text-muted)' }}>
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
