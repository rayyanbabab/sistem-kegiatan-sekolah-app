'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Users, CheckCircle, Clock, AlertCircle, Trophy, RefreshCw, Search, Check, X } from 'lucide-react'

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
  registrar: { name: string }
  members: TeamMember[]
}

const STATUS_CFG: Record<string, { label: string; chipClass: string }> = {
  APPROVED:   { label: 'Disetujui',           chipClass: 'chip-active' },
  REGISTERED: { label: 'Menunggu Verifikasi', chipClass: 'chip-upcoming' },
  REJECTED:   { label: 'Ditolak',             chipClass: 'chip-ended' },
}

export default function TeamsPage() {
  const { currentUser } = useAuth()
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'REGISTERED' | 'APPROVED' | 'REJECTED'>('ALL')

  const isAdmin = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'PANITIA'

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/teams', { credentials: 'include' })
      const json = await res.json()
      if (json.success) setTeams(json.data)
    } catch { /* ignore */ }
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const handleStatus = async (teamId: string, status: 'APPROVED' | 'REJECTED') => {
    setActionLoading(teamId + status)
    try {
      const res = await fetch(`/api/teams/${teamId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      })
      if (res.ok) fetchData()
    } catch { /* ignore */ }
    setActionLoading(null)
  }

  const approved = teams.filter(t => t.status === 'APPROVED')
  const registered = teams.filter(t => t.status === 'REGISTERED')
  const rejected = teams.filter(t => t.status === 'REJECTED')

  const filteredTeams = teams.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.kelas.toLowerCase().includes(search.toLowerCase()) ||
      t.competition.name.toLowerCase().includes(search.toLowerCase())
    if (!matchesSearch) return false
    if (filterStatus === 'ALL') return true
    return t.status === filterStatus
  })

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-4">
        <div>
          <span className="academic-badge mb-2">Classmeeting 2026</span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Verifikasi & Delegasi Tim
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {isAdmin
              ? 'Validasi keabsahan data anggota tim pendaftar dari masing-masing ketua kelas.'
              : 'Daftar tim delegasi perwakilan kelas untuk cabang kompetisi.'}
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

      {/* KPI Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="surface-card p-4 sm:p-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
              {loading ? '...' : approved.length}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Tim Disetujui</p>
          </div>
        </div>

        <div className="surface-card p-4 sm:p-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
              {loading ? '...' : registered.length}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Menunggu Verifikasi</p>
          </div>
        </div>

        <div className="surface-card p-4 sm:p-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
              {loading ? '...' : rejected.length}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Berkas Ditolak</p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'ALL', label: 'Semua Tim' },
            { id: 'REGISTERED', label: 'Menunggu' },
            { id: 'APPROVED', label: 'Disetujui' },
            { id: 'REJECTED', label: 'Ditolak' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                filterStatus === tab.id
                  ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                  : 'bg-muted/40 text-muted-foreground border-border hover:bg-muted hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari nama tim, kelas, cabang..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-background border border-input text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Teams Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="surface-card rounded-xl h-44 bg-muted animate-pulse" />)}
        </div>
      ) : filteredTeams.length === 0 ? (
        <div className="surface-card rounded-xl p-12 text-center border border-dashed border-border">
          <Users className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">
            {search ? 'Tidak ada tim sesuai pencarian' : 'Belum Ada Tim Terdaftar'}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Ketua kelas dapat mendaftarkan delegasi siswa melalui menu Registrasi Tim Lomba.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredTeams.map(team => {
            const sc = STATUS_CFG[team.status] || STATUS_CFG.REGISTERED

            return (
              <div
                key={team.id}
                className="surface-card p-5 rounded-xl border border-border flex flex-col justify-between hover:border-primary/40 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-[11px] font-semibold text-primary block mb-0.5">
                        {team.competition.name}
                      </span>
                      <h2 className="font-bold text-base text-foreground leading-tight">
                        {team.name}
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Kelas {team.kelas} • Pendaftar: {team.registrar.name}
                      </p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold shrink-0 ${sc.chipClass}`}>
                      {sc.label}
                    </span>
                  </div>

                  {/* Members list */}
                  <div className="p-3 rounded-lg bg-muted/40 border border-border/80 mb-4">
                    <p className="text-[11px] font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                      <Users className="w-3 h-3 text-muted-foreground" />
                      <span>Susunan Anggota Tim ({team.members.length} Siswa):</span>
                    </p>
                    <div className="flex flex-wrap gap-1.5">
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

                {/* Actions for Panitia / Admin */}
                <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                  {isAdmin && team.status === 'REGISTERED' ? (
                    <div className="flex items-center gap-2 w-full">
                      <button
                        onClick={() => handleStatus(team.id, 'APPROVED')}
                        disabled={actionLoading === team.id + 'APPROVED'}
                        className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Setujui Berkas</span>
                      </button>
                      <button
                        onClick={() => handleStatus(team.id, 'REJECTED')}
                        disabled={actionLoading === team.id + 'REJECTED'}
                        className="flex-1 py-1.5 rounded-lg text-xs font-semibold border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Tolak</span>
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Status Terverifikasi Sistem
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
