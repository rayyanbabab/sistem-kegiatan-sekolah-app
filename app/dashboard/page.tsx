'use client'

import { useAuth } from '@/context/AuthContext'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Trophy, Vote, Calendar, Megaphone, Users, BarChart3,
  CheckCircle, Clock, ArrowRight, TrendingUp, Shield, Star, Zap, RefreshCw
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Stats {
  users: { total: number; siswa: number }
  events: { total: number; active: number }
  competitions: { total: number }
  teams: { total: number; approved: number; pending: number }
  candidates: { total: number }
  announcements: { total: number }
  voting: { sessionActive: boolean; totalVoters: number; votedCount: number; participationRate: number }
  results: { total: number }
}
interface Event { id: string; name: string; date: string; status: string; type: string }

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatCard({ icon: Icon, value, label, color, sub }: { icon: any; value: string | number; label: string; color: string; sub?: string }) {
  return (
    <div className="glass-card rounded-2xl p-5 flex items-center gap-4 hover:border-white/20 transition-all">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</p>
        {sub && <p className="text-xs mt-0.5" style={{ color: 'var(--text-faint)' }}>{sub}</p>}
      </div>
    </div>
  )
}

function QuickActionCard({ href, icon: Icon, title, desc, color, badge }: { href: string; icon: any; title: string; desc: string; color: string; badge?: string }) {
  return (
    <Link href={href}>
      <div className="glass-card rounded-2xl p-5 border hover:border-white/20 transition-all hover:-translate-y-1 cursor-pointer group relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity`} />
        {badge && <span className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30 rounded-full">{badge}</span>}
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{title}</p>
        <p className="text-xs mt-1 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
          {desc}
          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </p>
      </div>
    </Link>
  )
}

function SectionCard({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="px-5 py-4 flex items-center gap-2" style={{ borderBottom: '1px solid var(--subtle-border)' }}>
        <Icon className="w-4 h-4" style={{ color: 'var(--text-faint)' }} />
        <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function Skeleton() {
  return <div className="h-6 rounded-lg animate-pulse" style={{ background: 'var(--subtle-bg)', width: '60%' }} />
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { currentUser } = useAuth()
  const role = currentUser?.role

  const [stats, setStats] = useState<Stats | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [statsRes, eventsRes] = await Promise.all([
        fetch('/api/stats', { credentials: 'include' }),
        fetch('/api/events', { credentials: 'include' }),
      ])
      if (statsRes.ok) { const j = await statsRes.json(); if (j.success) setStats(j.data) }
      if (eventsRes.ok) { const j = await eventsRes.json(); if (j.success) setEvents(j.data) }
    } catch { /* ignore */ }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const activeEvents = events.filter(e => e.status === 'ACTIVE')
  const s = stats

  const statusBadge = (status: string) => {
    if (status === 'ACTIVE') return 'bg-green-500/20 text-green-400 border border-green-500/20'
    if (status === 'UPCOMING') return 'bg-blue-500/20 text-blue-400 border border-blue-500/20'
    return 'bg-white/10 text-white/40'
  }
  const statusLabel = (status: string) => ({ ACTIVE: 'Aktif', UPCOMING: 'Segera', ENDED: 'Selesai' }[status] || status)

  // ── SUPER ADMIN ────────────────────────────────────────
  if (role === 'SUPER_ADMIN') return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-5 h-5 text-blue-400" />
            <span className="text-xs text-blue-400 font-medium uppercase tracking-wider">Super Admin</span>
          </div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Admin Dashboard</h1>
          <p className="mt-1" style={{ color: 'var(--text-muted)' }}>Kelola semua aspek sistem manajemen kegiatan sekolah</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition" style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)', color: 'var(--text-muted)' }}>
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} value={loading ? '...' : s?.users.total ?? 0} label="Total User" color="from-blue-500 to-blue-400" />
        <StatCard icon={Calendar} value={loading ? '...' : s?.events.total ?? 0} label="Total Event" sub={`${s?.events.active ?? 0} aktif`} color="from-green-500 to-emerald-400" />
        <StatCard icon={Trophy} value={loading ? '...' : s?.competitions.total ?? 0} label="Kompetisi" color="from-amber-500 to-orange-400" />
        <StatCard icon={Vote} value={loading ? '...' : s?.voting.totalVoters ?? 0} label="Total Pemilih" sub="Voting OSIS" color="from-violet-500 to-purple-400" />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickActionCard href="/dashboard/events" icon={Calendar} title="Kelola Event" desc={`${s?.events.total ?? 0} event tersedia`} color="from-blue-600 to-blue-400" />
        <QuickActionCard href="/dashboard/users" icon={Users} title="Kelola User" desc={`${s?.users.total ?? 0} pengguna aktif`} color="from-violet-600 to-violet-400" />
        <QuickActionCard href="/dashboard/classmeeting/competitions" icon={Trophy} title="Classmeeting" desc={`${s?.competitions.total ?? 0} lomba`} color="from-amber-600 to-orange-400" />
        <QuickActionCard href="/dashboard/pemilu/real-count" icon={BarChart3} title="Real Count" desc="Lihat hasil voting" color="from-pink-600 to-pink-400" badge={s?.voting.sessionActive ? 'LIVE' : undefined} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <SectionCard title="Event Aktif" icon={Calendar}>
          {loading ? <div className="space-y-2">{[1,2,3].map(i => <Skeleton key={i}/>)}</div> :
            activeEvents.length > 0 ? (
              <div className="space-y-2">
                {activeEvents.map(ev => (
                  <div key={ev.id} className="flex items-center justify-between p-3 rounded-xl transition" style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)' }}>
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{ev.name}</p>
                      <p className="text-xs" style={{ color: 'var(--text-faint)' }}>{new Date(ev.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-lg ${statusBadge(ev.status)}`}>{statusLabel(ev.status)}</span>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm" style={{ color: 'var(--text-faint)' }}>Tidak ada event aktif</p>
          }
        </SectionCard>

        <SectionCard title="Statistik Voting" icon={Vote}>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span style={{ color: 'var(--text-muted)' }}>Total Pemilih</span>
              <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{loading ? '...' : s?.voting.totalVoters ?? 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: 'var(--text-muted)' }}>Sudah Memilih</span>
              <span className="font-semibold text-green-400">{loading ? '...' : s?.voting.votedCount ?? 0}</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs" style={{ color: 'var(--text-faint)' }}>
                <span>Partisipasi</span>
                <span>{loading ? '...' : `${s?.voting.participationRate ?? 0}%`}</span>
              </div>
              <div className="w-full rounded-full h-2" style={{ background: 'var(--subtle-bg)' }}>
                <div className="bg-gradient-to-r from-blue-500 to-violet-500 h-2 rounded-full transition-all" style={{ width: `${s?.voting.participationRate ?? 0}%` }} />
              </div>
            </div>
            <Link href="/dashboard/pemilu/real-count">
              <button className="w-full mt-2 py-2.5 rounded-xl border text-sm transition" style={{ borderColor: 'var(--subtle-border)', color: 'var(--text-muted)' }}>
                Lihat Real Count →
              </button>
            </Link>
          </div>
        </SectionCard>
      </div>
    </div>
  )

  // ── SISWA ────────────────────────────────────────
  if (role === 'SISWA') return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Selamat datang kembali 👋</p>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Halo, {currentUser?.name?.split(' ')[0]}!</h1>
        <p className="mt-1" style={{ color: 'var(--text-muted)' }}>{currentUser?.kelas} · Sistem Manajemen Kegiatan Sekolah</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <QuickActionCard href="/dashboard/pemilu/voting" icon={Vote} title="Voting OSIS" desc="Pilih kandidatmu" color="from-violet-600 to-violet-400" badge={s?.voting.sessionActive ? 'BUKA' : undefined} />
        <QuickActionCard href="/dashboard/classmeeting/schedule" icon={Clock} title="Jadwal Lomba" desc="Lihat pertandingan" color="from-blue-600 to-cyan-400" />
        <QuickActionCard href="/dashboard/pengumuman" icon={Megaphone} title="Pengumuman" desc={`${s?.announcements.total ?? 0} info baru`} color="from-amber-600 to-orange-400" />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <SectionCard title="Event Aktif" icon={Calendar}>
          {loading ? <div className="space-y-2">{[1,2].map(i => <Skeleton key={i}/>)}</div> :
            activeEvents.map(ev => (
              <div key={ev.id} className="flex items-center justify-between p-3 rounded-xl mb-2 last:mb-0" style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)' }}>
                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{ev.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-lg ${statusBadge(ev.status)}`}>{statusLabel(ev.status)}</span>
              </div>
            ))
          }
        </SectionCard>
        <SectionCard title="Pemilu OSIS 2026" icon={Vote}>
          <div className="space-y-4">
            <div className={`p-4 rounded-xl ${s?.voting.sessionActive ? 'bg-violet-500/10 border border-violet-500/20' : 'bg-white/[0.03] border border-white/[0.06]'}`}>
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-2 h-2 rounded-full ${s?.voting.sessionActive ? 'bg-green-400 animate-pulse' : 'bg-white/20'}`} />
                <span className={`text-xs font-medium ${s?.voting.sessionActive ? 'text-green-400' : ''}`} style={!s?.voting.sessionActive ? { color: 'var(--text-faint)' } : {}}>
                  {s?.voting.sessionActive ? 'Voting Sedang Dibuka' : 'Voting Belum Dibuka'}
                </span>
              </div>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{s?.voting.sessionActive ? 'Gunakan hak suaramu!' : 'Tunggu info dari panitia.'}</p>
            </div>
            <Link href="/dashboard/pemilu/voting"><button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold transition">Mulai Voting →</button></Link>
          </div>
        </SectionCard>
      </div>
    </div>
  )

  // ── KETUA KELAS ────────────────────────────────────────
  if (role === 'KETUA_KELAS') return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1"><Star className="w-4 h-4 text-cyan-400" /><span className="text-xs text-cyan-400 font-medium uppercase tracking-wider">Ketua Kelas</span></div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Halo, {currentUser?.name?.split(' ')[0]}!</h1>
        <p className="mt-1" style={{ color: 'var(--text-muted)' }}>{currentUser?.kelas} · Kelola tim dan pendaftaran kelas</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <StatCard icon={Trophy} value={loading ? '...' : s?.competitions.total ?? 0} label="Total Kompetisi" color="from-amber-500 to-orange-400" />
        <StatCard icon={Users} value={loading ? '...' : s?.teams.total ?? 0} label="Tim Terdaftar" color="from-blue-500 to-blue-400" />
        <StatCard icon={CheckCircle} value={loading ? '...' : s?.teams.approved ?? 0} label="Tim Disetujui" color="from-green-500 to-emerald-400" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <QuickActionCard href="/dashboard/classmeeting/competitions" icon={Trophy} title="Daftar Lomba" desc="Lihat & daftar kompetisi" color="from-amber-600 to-orange-400" />
        <QuickActionCard href="/dashboard/classmeeting/my-teams" icon={Users} title="Tim Kelas" desc="Kelola anggota tim" color="from-blue-600 to-cyan-400" />
        <QuickActionCard href="/dashboard/classmeeting/schedule" icon={Clock} title="Jadwal" desc="Lihat pertandingan" color="from-green-600 to-emerald-400" />
        <QuickActionCard href="/dashboard/pengumuman" icon={Megaphone} title="Pengumuman" desc="Info dari panitia" color="from-orange-600 to-amber-400" />
      </div>
    </div>
  )

  // ── KANDIDAT ────────────────────────────────────────
  if (role === 'KANDIDAT') return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1"><Trophy className="w-4 h-4 text-pink-400" /><span className="text-xs text-pink-400 font-medium uppercase tracking-wider">Kandidat OSIS</span></div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Dashboard Kandidat</h1>
        <p className="mt-1" style={{ color: 'var(--text-muted)' }}>Monitor kampanye dan perolehan suara Anda</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <StatCard icon={BarChart3} value={loading ? '...' : s?.voting.votedCount ?? 0} label="Total Suara Masuk" color="from-violet-500 to-violet-400" />
        <StatCard icon={Users} value={loading ? '...' : s?.voting.totalVoters ?? 0} label="Total Pemilih" color="from-blue-500 to-blue-400" />
        <StatCard icon={TrendingUp} value={loading ? '...' : `${s?.voting.participationRate ?? 0}%`} label="Partisipasi" color="from-green-500 to-emerald-400" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <QuickActionCard href="/dashboard/pemilu/profile" icon={Star} title="Edit Profil Kampanye" desc="Update visi misi & video" color="from-violet-600 to-pink-400" />
        <QuickActionCard href="/dashboard/pemilu/real-count" icon={BarChart3} title="Lihat Real Count" desc="Monitor perolehan suara" color="from-blue-600 to-cyan-400" badge={s?.voting.sessionActive ? 'LIVE' : undefined} />
      </div>
    </div>
  )

  // ── PANITIA (default) ────────────────────────────────────────
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1"><CheckCircle className="w-4 h-4 text-violet-400" /><span className="text-xs text-violet-400 font-medium uppercase tracking-wider">Panitia Event</span></div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Dashboard Panitia</h1>
        <p className="mt-1" style={{ color: 'var(--text-muted)' }}>Kelola event dan verifikasi peserta</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <StatCard icon={Calendar} value={loading ? '...' : s?.events.active ?? 0} label="Event Aktif" color="from-blue-500 to-blue-400" />
        <StatCard icon={Users} value={loading ? '...' : s?.teams.total ?? 0} label="Tim Terdaftar" color="from-green-500 to-emerald-400" />
        <StatCard icon={CheckCircle} value={loading ? '...' : s?.teams.approved ?? 0} label="Tim Disetujui" color="from-amber-500 to-orange-400" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <QuickActionCard href="/dashboard/classmeeting/teams" icon={Users} title="Verifikasi Tim" desc={`${s?.teams.pending ?? 0} menunggu`} color="from-blue-600 to-cyan-400" />
        <QuickActionCard href="/dashboard/classmeeting/results" icon={Trophy} title="Input Hasil" desc="Masukkan hasil lomba" color="from-amber-600 to-orange-400" />
        <QuickActionCard href="/dashboard/classmeeting/competitions" icon={Zap} title="Daftar Lomba" desc="Kelola kompetisi" color="from-violet-600 to-violet-400" />
        <QuickActionCard href="/dashboard/pengumuman" icon={Megaphone} title="Pengumuman" desc="Kirim info ke siswa" color="from-green-600 to-emerald-400" />
      </div>
    </div>
  )
}
