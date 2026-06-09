'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { Trophy, Users, Plus, CheckCircle, Clock, AlertCircle, ChevronRight, RefreshCw } from 'lucide-react'

interface TeamMember { id: string; name: string }
interface Team {
  id: string; name: string; kelas: string; status: string
  competition: { id: string; name: string; category: string }
  members: TeamMember[]
}
interface Competition { id: string; name: string; category: string; date: string; time: string; location: string; _count: { teams: number } }

const STATUS_CFG: Record<string, { label: string; Icon: any; text: string; bg: string; border: string; bar: string }> = {
  APPROVED:   { label: 'Disetujui',  Icon: CheckCircle, text: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', bar: 'bg-green-400' },
  REGISTERED: { label: 'Menunggu',   Icon: Clock,       text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', bar: 'bg-amber-400' },
  REJECTED:   { label: 'Ditolak',    Icon: AlertCircle, text: 'text-red-400',   bg: 'bg-red-500/10',   border: 'border-red-500/20',   bar: 'bg-red-400'   },
}
const CAT_ICON: Record<string, string> = { OLAHRAGA: '⚽', AKADEMIK: '🎤', SENI: '🎨' }
const CAT_GRAD: Record<string, string> = { OLAHRAGA: 'from-blue-500 to-cyan-500', AKADEMIK: 'from-violet-500 to-purple-500', SENI: 'from-amber-500 to-yellow-500' }

export default function MyTeamsPage() {
  const { currentUser } = useAuth()
  const [myTeams, setMyTeams] = useState<Team[]>([])
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [teamsRes, compsRes] = await Promise.all([
        fetch(`/api/teams?kelas=${encodeURIComponent(currentUser?.kelas || '')}`, { credentials: 'include' }),
        fetch('/api/competitions', { credentials: 'include' }),
      ])
      if (teamsRes.ok) { const j = await teamsRes.json(); if (j.success) setMyTeams(j.data) }
      if (compsRes.ok) { const j = await compsRes.json(); if (j.success) setCompetitions(j.data) }
    } catch { /* ignore */ }
    setLoading(false)
  }, [currentUser?.kelas])

  useEffect(() => { if (currentUser?.kelas) fetchData() }, [fetchData, currentUser?.kelas])

  // Kompetisi yang belum didaftarkan kelas ini
  const registeredCompIds = new Set(myTeams.map(t => t.competition.id))
  const available = competitions.filter(c => !registeredCompIds.has(c.id))

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1"><Trophy className="w-4 h-4 text-amber-400" /><span className="text-xs text-amber-400 font-medium uppercase tracking-wider">Classmeeting 2026</span></div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Tim Kelas Saya</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Kelola pendaftaran tim untuk kelas {currentUser?.kelas}</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition" style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)', color: 'var(--text-muted)' }}>
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2].map(i => <div key={i} className="glass-card rounded-2xl h-40 animate-pulse" style={{ background: 'var(--subtle-bg)' }} />)}</div>
      ) : (
        <>
          {/* Tim terdaftar */}
          {myTeams.length > 0 && (
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>Tim Terdaftar ({myTeams.length})</p>
              {myTeams.map(team => {
                const s = STATUS_CFG[team.status] || STATUS_CFG.REGISTERED
                const grad = CAT_GRAD[team.competition.category] || 'from-blue-500 to-violet-500'
                return (
                  <div key={team.id} className="glass-card rounded-2xl overflow-hidden hover:border-white/20 transition-all">
                    <div className={`h-1.5 bg-gradient-to-r ${grad}`} />
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center text-2xl shadow-lg`}>
                            {CAT_ICON[team.competition.category] || '🏆'}
                          </div>
                          <div>
                            <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>{team.name}</h3>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{team.competition.name}</p>
                          </div>
                        </div>
                        <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold flex-shrink-0 ${s.bg} ${s.text} border ${s.border}`}>
                          <s.Icon className="w-3.5 h-3.5" /> {s.label}
                        </span>
                      </div>

                      {/* Members */}
                      <div className="p-3 rounded-xl" style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)' }}>
                        <p className="text-xs font-semibold mb-2 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                          <Users className="w-3 h-3" /> Anggota ({team.members.length})
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {team.members.map(m => (
                            <span key={m.id} className="px-2.5 py-1 rounded-lg text-xs" style={{ background: 'var(--glass-bg)', color: 'var(--text-secondary)', border: '1px solid var(--glass-border)' }}>{m.name}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Lomba tersedia */}
          {available.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>Lomba Tersedia ({available.length})</p>
              {available.map(comp => {
                const grad = CAT_GRAD[comp.category] || 'from-blue-500 to-violet-500'
                return (
                  <div key={comp.id} className="glass-card rounded-2xl p-4 flex items-center gap-4 hover:border-white/20 transition-all">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 bg-gradient-to-br ${grad}`}>
                      {CAT_ICON[comp.category] || '🏆'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{comp.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-faint)' }}>
                        {new Date(comp.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} · {comp.location} · {comp._count.teams} tim
                      </p>
                    </div>
                    <Link href={`/dashboard/classmeeting/competitions/${comp.id}/register`}>
                      <button className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r ${grad} hover:opacity-90 transition flex-shrink-0`}>
                        <Plus className="w-3.5 h-3.5" /> Daftar
                      </button>
                    </Link>
                  </div>
                )
              })}
            </div>
          )}

          {myTeams.length === 0 && available.length === 0 && (
            <div className="glass-card rounded-2xl p-16 text-center">
              <Trophy className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-faint)' }} />
              <p className="font-medium" style={{ color: 'var(--text-muted)' }}>Belum ada kompetisi tersedia</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
