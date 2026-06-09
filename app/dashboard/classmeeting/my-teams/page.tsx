'use client'

import { useAuth } from '@/context/AuthContext'
import { Trophy, Users, Plus, CheckCircle, Clock, AlertCircle, ChevronRight } from 'lucide-react'

const MY_TEAMS = [
  {
    id: '1',
    competition: 'Futsal Putra',
    icon: '⚽',
    color: 'from-blue-500 to-cyan-500',
    status: 'approved',
    members: ['Andi Pratama', 'Budi Santoso', 'Candra Wijaya', 'Deni Kusuma', 'Eko Prasetyo'],
    maxMembers: 7,
    deadline: '18 Juni 2026',
  },
  {
    id: '2',
    competition: 'Cerdas Cermat',
    icon: '🧠',
    color: 'from-violet-500 to-purple-500',
    status: 'registered',
    members: ['Nanda Firdaus', 'Oscar Wijaya', 'Putri Amalia'],
    maxMembers: 3,
    deadline: '18 Juni 2026',
  },
]

const AVAILABLE = [
  { name: 'Volley Ball Putra', icon: '🏐', deadline: '18 Juni 2026', maxMembers: 6 },
  { name: 'Badminton Ganda Putra', icon: '🏸', deadline: '18 Juni 2026', maxMembers: 2 },
  { name: 'Tarik Tambang', icon: '💪', deadline: '18 Juni 2026', maxMembers: 10 },
]

const STATUS_CFG = {
  approved:   { label: 'Disetujui',    icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
  registered: { label: 'Menunggu',     icon: Clock,       color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  rejected:   { label: 'Ditolak',      icon: AlertCircle, color: 'text-red-400',   bg: 'bg-red-500/10',   border: 'border-red-500/20' },
}

export default function MyTeamsPage() {
  const { currentUser } = useAuth()

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-amber-400 font-medium uppercase tracking-wider">Classmeeting 2026</span>
        </div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Tim Kelas Saya</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Kelola pendaftaran tim untuk kelas {currentUser?.kelas || 'kamu'}
        </p>
      </div>

      {/* My Teams */}
      {MY_TEAMS.length > 0 && (
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>
            Tim Terdaftar ({MY_TEAMS.length})
          </p>
          {MY_TEAMS.map(team => {
            const s = STATUS_CFG[team.status as keyof typeof STATUS_CFG]
            const StatusIcon = s.icon
            return (
              <div key={team.id} className="glass-card rounded-2xl overflow-hidden hover:border-white/20 transition-all">
                <div className={`h-1 bg-gradient-to-r ${team.color}`} />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${team.color} flex items-center justify-center text-2xl shadow-lg`}>
                        {team.icon}
                      </div>
                      <div>
                        <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>{team.competition}</h3>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-faint)' }}>Deadline: {team.deadline}</p>
                      </div>
                    </div>
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${s.bg} ${s.color} border ${s.border}`}>
                      <StatusIcon className="w-3.5 h-3.5" /> {s.label}
                    </span>
                  </div>

                  {/* Members */}
                  <div className="p-3 rounded-xl mb-4" style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                        <Users className="w-3 h-3" /> Anggota
                      </p>
                      <span className="text-xs" style={{ color: 'var(--text-faint)' }}>
                        {team.members.length}/{team.maxMembers}
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full h-1.5 rounded-full mb-3" style={{ background: 'var(--subtle-border)' }}>
                      <div className={`h-1.5 rounded-full bg-gradient-to-r ${team.color}`} style={{ width: `${(team.members.length / team.maxMembers) * 100}%` }} />
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {team.members.map((m, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg text-xs" style={{ background: 'var(--glass-bg)', color: 'var(--text-secondary)', border: '1px solid var(--glass-border)' }}>
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition" style={{ background: 'var(--subtle-bg)', color: 'var(--text-muted)', border: '1px solid var(--subtle-border)' }}>
                      <Plus className="w-3.5 h-3.5" /> Tambah Anggota
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium text-red-400 border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 transition">
                      Batalkan Pendaftaran
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Available */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>
          Lomba Tersedia untuk Didaftarkan
        </p>
        {AVAILABLE.map(a => (
          <div key={a.name} className="glass-card rounded-2xl p-4 flex items-center gap-4 hover:border-white/20 transition-all cursor-pointer hover:-translate-y-0.5">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)' }}>
              {a.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{a.name}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-faint)' }}>Max {a.maxMembers} anggota · Deadline {a.deadline}</p>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:opacity-90 transition flex-shrink-0">
              <Plus className="w-3.5 h-3.5" /> Daftar
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
