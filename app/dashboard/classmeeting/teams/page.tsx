'use client'

import { useAuth } from '@/context/AuthContext'
import { Users, CheckCircle, Clock, AlertCircle, Edit2, Trash2, Trophy } from 'lucide-react'

const TEAMS = [
  { id: '1', name: 'Tim Futsal XII IPA 1', competition: 'Futsal Putra', kelas: 'XII IPA 1', status: 'approved', members: ['Andi Pratama', 'Budi Santoso', 'Candra Wijaya', 'Deni Kusuma', 'Eko Prasetyo'] },
  { id: '2', name: 'Tim Volley XII IPS 1', competition: 'Volley Ball Putri', kelas: 'XII IPS 1', status: 'registered', members: ['Fitri Amalia', 'Gita Rahayu', 'Hana Putri', 'Indah Sari', 'Jessi Kurnia'] },
  { id: '3', name: 'Tim Debat XI IPA 2', competition: 'Debat Bahasa Indonesia', kelas: 'XI IPA 2', status: 'rejected', members: ['Kevin Alfarizi', 'Lina Mariska', 'Mia Rahmawati'] },
  { id: '4', name: 'Tim Cerdas Cermat X IPA 3', competition: 'Cerdas Cermat', kelas: 'X IPA 3', status: 'registered', members: ['Nanda Firdaus', 'Oscar Wijaya', 'Putri Amalia'] },
]

const STATUS = {
  approved:   { label: 'Disetujui',          bg: 'bg-green-500/10',  text: 'text-green-400',  border: 'border-green-500/20', icon: CheckCircle, bar: 'bg-green-400' },
  registered: { label: 'Menunggu Verifikasi', bg: 'bg-amber-500/10',  text: 'text-amber-400',  border: 'border-amber-500/20', icon: Clock,        bar: 'bg-amber-400' },
  rejected:   { label: 'Ditolak',            bg: 'bg-red-500/10',    text: 'text-red-400',    border: 'border-red-500/20',   icon: AlertCircle,  bar: 'bg-red-400' },
}

export default function TeamsPage() {
  const { currentUser } = useAuth()
  const isAdmin = currentUser?.role === 'super-admin' || currentUser?.role === 'panitia'

  const approved   = TEAMS.filter(t => t.status === 'approved')
  const registered = TEAMS.filter(t => t.status === 'registered')
  const rejected   = TEAMS.filter(t => t.status === 'rejected')

  const TeamCard = ({ team }: { team: typeof TEAMS[0] }) => {
    const s = STATUS[team.status as keyof typeof STATUS]
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
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{team.competition}</p>
              </div>
            </div>
            <span className={`flex-shrink-0 px-2.5 py-1 rounded-xl text-xs font-semibold ${s.bg} ${s.text} border ${s.border}`}>
              {s.label}
            </span>
          </div>

          {/* Members */}
          <div className="mb-4 p-3 rounded-xl" style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)' }}>
            <p className="text-xs font-semibold mb-2 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
              <Users className="w-3 h-3" /> Anggota Tim ({team.members.length})
            </p>
            <div className="space-y-1">
              {team.members.map((m, i) => (
                <p key={i} className="text-xs flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                  <span className="w-1 h-1 rounded-full bg-blue-400 flex-shrink-0" />
                  {m}
                </p>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-3" style={{ borderTop: '1px solid var(--subtle-border)' }}>
            {isAdmin ? (
              team.status === 'registered' ? (
                <>
                  <button className="flex-1 py-1.5 rounded-xl text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition">
                    ✓ Setujui
                  </button>
                  <button className="flex-1 py-1.5 rounded-xl text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition">
                    ✗ Tolak
                  </button>
                </>
              ) : (
                <button className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-medium transition" style={{ background: 'var(--subtle-bg)', color: 'var(--text-muted)', border: '1px solid var(--subtle-border)' }}>
                  <Edit2 className="w-3 h-3" /> Edit
                </button>
              )
            ) : (
              <>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-medium transition" style={{ background: 'var(--subtle-bg)', color: 'var(--text-muted)', border: '1px solid var(--subtle-border)' }}>
                  <Edit2 className="w-3 h-3" /> Edit
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition">
                  <Trash2 className="w-3 h-3" /> Hapus
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  const Section = ({ title, icon: Icon, iconClass, items }: { title: string; icon: any; iconClass: string; items: typeof TEAMS }) => (
    items.length > 0 ? (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Icon className={`w-4 h-4 ${iconClass}`} />
          <h2 className="text-base font-semibold" style={{ color: 'var(--text-secondary)' }}>{title}</h2>
          <div className="flex-1 h-px" style={{ background: 'var(--subtle-border)' }} />
          <span className="text-xs" style={{ color: 'var(--text-faint)' }}>{items.length} tim</span>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {items.map(t => <TeamCard key={t.id} team={t} />)}
        </div>
      </div>
    ) : null
  )

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-amber-400 font-medium uppercase tracking-wider">Classmeeting 2026</span>
        </div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Manajemen Tim</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          {isAdmin ? 'Verifikasi dan kelola pendaftaran tim' : 'Kelola tim kelas Anda'}
        </p>
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
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{s.value}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Sections */}
      <Section title="Tim Disetujui" icon={CheckCircle} iconClass="text-green-400" items={approved} />
      <Section title="Menunggu Verifikasi" icon={Clock} iconClass="text-amber-400" items={registered} />
      <Section title="Tim Ditolak" icon={AlertCircle} iconClass="text-red-400" items={rejected} />

      {TEAMS.length === 0 && (
        <div className="glass-card rounded-2xl p-16 text-center">
          <Users className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-faint)' }} />
          <p className="font-medium" style={{ color: 'var(--text-muted)' }}>Tidak ada tim</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-faint)' }}>Belum ada tim yang terdaftar</p>
        </div>
      )}
    </div>
  )
}
