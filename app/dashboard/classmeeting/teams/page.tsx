'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Users, CheckCircle, Clock, AlertCircle, Trophy, RefreshCw } from 'lucide-react'

interface TeamMember { id: string; name: string }
interface Team {
  id: string; name: string; kelas: string; status: string
  competition: { id: string; name: string; category: string }
  registrar: { name: string }
  members: TeamMember[]
}

const STATUS: Record<string, { label: string; bg: string; text: string; border: string; icon: any; bar: string }> = {
  APPROVED:   { label: 'Disetujui',            bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', icon: CheckCircle, bar: 'bg-green-400' },
  REGISTERED: { label: 'Menunggu Verifikasi',  bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', icon: Clock,        bar: 'bg-amber-400' },
  REJECTED:   { label: 'Ditolak',              bg: 'bg-red-500/10',   text: 'text-red-400',   border: 'border-red-500/20',   icon: AlertCircle,  bar: 'bg-red-400'   },
}

export default function TeamsPage() {
  const { currentUser } = useAuth()
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const isAdmin = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'PANITIA'

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/teams', { credentials: 'include' })
      const json = await res.json()
      if (json.success) setTeams(json.data)
    } catch { /* ignore */ }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

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

  const approved   = teams.filter(t => t.status === 'APPROVED')
  const registered = teams.filter(t => t.status === 'REGISTERED')
  const rejected   = teams.filter(t => t.status === 'REJECTED')

  const TeamCard = ({ team }: { team: Team }) => {
    const s = STATUS[team.status] || STATUS.REGISTERED
    const StatusIcon = s.icon
    return (
      <div className="glass-card rounded-2xl overflow-hidden hover:border-white/20 transition-all hover:-translate-y-0.5">
        <div className={`h-1 ${s.bar}`} />
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} border ${s.border} flex items-center justify-center flex-shrink-0`}>
                <StatusIcon className={`w-5 h-5 ${s.text}`} />
              </div>
              <div>
                <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{team.name}</h3>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{team.competition.name} · {team.kelas}</p>
              </div>
            </div>
            <span className={`flex-shrink-0 px-2.5 py-1 rounded-xl text-xs font-semibold ${s.bg} ${s.text} border ${s.border}`}>{s.label}</span>
          </div>

          {/* Members */}
          <div className="mb-4 p-3 rounded-xl" style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)' }}>
            <p className="text-xs font-semibold mb-2 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
              <Users className="w-3 h-3" /> Anggota ({team.members.length})
            </p>
            <div className="flex flex-wrap gap-1.5">
              {team.members.map(m => (
                <span key={m.id} className="px-2.5 py-1 rounded-lg text-xs" style={{ background: 'var(--glass-bg)', color: 'var(--text-secondary)', border: '1px solid var(--glass-border)' }}>{m.name}</span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-3" style={{ borderTop: '1px solid var(--subtle-border)' }}>
            {isAdmin && team.status === 'REGISTERED' ? (
              <>
                <button
                  onClick={() => handleStatus(team.id, 'APPROVED')}
                  disabled={actionLoading === team.id + 'APPROVED'}
                  className="flex-1 py-1.5 rounded-xl text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition disabled:opacity-50">
                  {actionLoading === team.id + 'APPROVED' ? '...' : '✓ Setujui'}
                </button>
                <button
                  onClick={() => handleStatus(team.id, 'REJECTED')}
                  disabled={actionLoading === team.id + 'REJECTED'}
                  className="flex-1 py-1.5 rounded-xl text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition disabled:opacity-50">
                  {actionLoading === team.id + 'REJECTED' ? '...' : '✗ Tolak'}
                </button>
              </>
            ) : (
              <div className="flex-1 text-xs text-center py-1.5" style={{ color: 'var(--text-faint)' }}>
                Didaftarkan oleh {team.registrar.name}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const Section = ({ title, icon: Icon, iconClass, items }: { title: string; icon: any; iconClass: string; items: Team[] }) =>
    items.length > 0 ? (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Icon className={`w-4 h-4 ${iconClass}`} />
          <h2 className="text-base font-semibold" style={{ color: 'var(--text-secondary)' }}>{title}</h2>
          <div className="flex-1 h-px" style={{ background: 'var(--subtle-border)' }} />
          <span className="text-xs" style={{ color: 'var(--text-faint)' }}>{items.length} tim</span>
        </div>
        <div className="grid md:grid-cols-2 gap-4">{items.map(t => <TeamCard key={t.id} team={t} />)}</div>
      </div>
    ) : null

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1"><Trophy className="w-4 h-4 text-amber-400" /><span className="text-xs text-amber-400 font-medium uppercase tracking-wider">Classmeeting</span></div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Manajemen Tim</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>{isAdmin ? 'Verifikasi dan kelola pendaftaran tim' : 'Kelola tim kelas Anda'}</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition" style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)', color: 'var(--text-muted)' }}>
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Disetujui', value: approved.length, color: 'from-green-500 to-emerald-400', icon: CheckCircle },
          { label: 'Menunggu', value: registered.length, color: 'from-amber-500 to-orange-400', icon: Clock },
          { label: 'Ditolak', value: rejected.length, color: 'from-red-500 to-rose-400', icon: AlertCircle },
        ].map(s => (
          <div key={s.label} className="glass-card rounded-2xl p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center flex-shrink-0`}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{loading ? '...' : s.value}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[1,2,3].map(i => <div key={i} className="glass-card rounded-2xl p-5 h-40 animate-pulse" style={{ background: 'var(--subtle-bg)' }} />)}
        </div>
      ) : teams.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center">
          <Users className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-faint)' }} />
          <p className="font-medium" style={{ color: 'var(--text-muted)' }}>Belum ada tim terdaftar</p>
        </div>
      ) : (
        <>
          <Section title="Tim Disetujui" icon={CheckCircle} iconClass="text-green-400" items={approved} />
          <Section title="Menunggu Verifikasi" icon={Clock} iconClass="text-amber-400" items={registered} />
          <Section title="Tim Ditolak" icon={AlertCircle} iconClass="text-red-400" items={rejected} />
        </>
      )}
    </div>
  )
}
