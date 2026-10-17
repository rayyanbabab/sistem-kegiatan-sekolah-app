'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { Trophy, Users, Plus, CheckCircle, Clock, AlertCircle, RefreshCw, Dumbbell, Mic2, Palette, Calendar, MapPin, LucideIcon } from 'lucide-react'

interface TeamMember {
  id: string
  name: string
}

interface Team {
  id: string
  name: string
  kelas: string
  status: string
  competition: { id: string; name: string; category: string }
  members: TeamMember[]
}

interface Competition {
  id: string
  name: string
  category: string
  date: string
  time: string
  location: string
  _count: { teams: number }
}

const STATUS_CFG: Record<string, { label: string; chipClass: string }> = {
  APPROVED:   { label: 'Disetujui',           chipClass: 'chip-active' },
  REGISTERED: { label: 'Menunggu Verifikasi', chipClass: 'chip-upcoming' },
  REJECTED:   { label: 'Ditolak',             chipClass: 'chip-ended' },
}

const CAT_ICON: Record<string, LucideIcon> = {
  OLAHRAGA: Dumbbell,
  AKADEMIK: Mic2,
  SENI: Palette,
}

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
      if (teamsRes.ok) {
        const j = await teamsRes.json()
        if (j.success) setMyTeams(j.data)
      }
      if (compsRes.ok) {
        const j = await compsRes.json()
        if (j.success) setCompetitions(j.data)
      }
    } catch { /* ignore */ }
    setLoading(false)
  }, [currentUser?.kelas])

  useEffect(() => {
    if (currentUser?.kelas) fetchData()
  }, [fetchData, currentUser?.kelas])

  const registeredCompIds = new Set(myTeams.map(t => t.competition.id))
  const available = competitions.filter(c => !registeredCompIds.has(c.id))

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-4">
        <div>
          <span className="academic-badge mb-2">Delegasi Kelas</span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Tim Kelas Saya ({currentUser?.kelas || 'Siswa'})
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Pantau status verifikasi berkas delegasi kelas dan daftarkan tim pada cabang yang masih dibuka.
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

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="surface-card rounded-xl h-36 bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Section: Tim Terdaftar */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
                Tim Kelas yang Sudah Terdaftar ({myTeams.length})
              </h2>
            </div>

            {myTeams.length === 0 ? (
              <div className="surface-card rounded-xl p-8 text-center border border-dashed border-border">
                <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-semibold text-foreground">Belum Ada Tim yang Didaftarkan</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Pilih salah satu cabang lomba di bawah ini untuk mendaftarkan nama siswa perwakilan kelas.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {myTeams.map(team => {
                  const sc = STATUS_CFG[team.status] || STATUS_CFG.REGISTERED
                  const Icon = CAT_ICON[team.competition.category] || Trophy

                  return (
                    <div
                      key={team.id}
                      className="surface-card p-5 rounded-xl border border-border flex flex-col justify-between hover:border-primary/40 transition-colors"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-lg bg-secondary text-foreground/80 border border-border flex items-center justify-center shrink-0">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <h3 className="font-bold text-sm text-foreground leading-tight">
                                {team.name}
                              </h3>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {team.competition.name}
                              </p>
                            </div>
                          </div>

                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold shrink-0 ${sc.chipClass}`}>
                            {sc.label}
                          </span>
                        </div>

                        {/* Members */}
                        <div className="p-3 rounded-lg bg-muted/40 border border-border/80">
                          <p className="text-[11px] font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                            <Users className="w-3 h-3 text-muted-foreground" />
                            <span>Anggota Tim ({team.members.length} Siswa):</span>
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {team.members.map(m => (
                              <span
                                key={m.id}
                                className="px-2 py-0.5 rounded text-xs bg-background border border-border text-foreground"
                              >
                                {m.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Section: Lomba Tersedia */}
          {available.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
                  Cabang Lomba Terbuka untuk Didaftarkan ({available.length})
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-3.5">
                {available.map(comp => {
                  const Icon = CAT_ICON[comp.category] || Trophy

                  return (
                    <div
                      key={comp.id}
                      className="surface-card p-4 rounded-xl border border-border flex items-center justify-between gap-3 hover:border-primary/40 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-secondary text-foreground/80 border border-border flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-sm text-foreground truncate">
                            {comp.name}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">
                            {comp.location} • {comp._count.teams} Tim Terdaftar
                          </p>
                        </div>
                      </div>

                      <Link href={`/dashboard/classmeeting/competitions/${comp.id}/register`}>
                        <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shrink-0 shadow-xs">
                          <Plus className="w-3.5 h-3.5" />
                          <span>Daftar</span>
                        </button>
                      </Link>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
