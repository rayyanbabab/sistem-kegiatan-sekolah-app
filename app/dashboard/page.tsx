'use client'

import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import {
  Trophy, Vote, Calendar, Megaphone, Users, BarChart3,
  CheckCircle, Clock, ArrowRight, TrendingUp, Shield, Star, Zap
} from 'lucide-react'

function StatCard({ icon: Icon, value, label, color, sub }: {
  icon: any; value: string | number; label: string; color: string; sub?: string
}) {
  return (
    <div className="glass-card rounded-2xl p-5 flex items-center gap-4 hover:border-white/20 transition-all">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-sm text-white/50">{label}</p>
        {sub && <p className="text-xs text-white/30 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

function QuickActionCard({ href, icon: Icon, title, desc, color, badge }: {
  href: string; icon: any; title: string; desc: string; color: string; badge?: string
}) {
  return (
    <Link href={href}>
      <div className={`glass-card rounded-2xl p-5 border hover:border-white/20 transition-all hover:-translate-y-1 cursor-pointer group relative overflow-hidden`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity`} />
        {badge && (
          <span className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30 rounded-full">
            {badge}
          </span>
        )}
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <p className="font-semibold text-white text-sm">{title}</p>
        <p className="text-xs text-white/40 mt-1 flex items-center gap-1">
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
      <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2">
        <Icon className="w-4 h-4 text-white/40" />
        <h3 className="font-semibold text-white text-sm">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

export default function DashboardPage() {
  const { currentUser } = useAuth()
  const role = currentUser?.role

  // ── Super Admin ────────────────────────────────────────
  if (role === 'super-admin') {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-5 h-5 text-blue-400" />
            <span className="text-xs text-blue-400 font-medium uppercase tracking-wider">Super Admin</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-white/40 mt-1">Kelola semua aspek sistem manajemen kegiatan sekolah</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Users} value="9" label="Total User" color="from-blue-500 to-blue-400" />
          <StatCard icon={Calendar} value="5" label="Total Event" sub="2 aktif" color="from-green-500 to-emerald-400" />
          <StatCard icon={Trophy} value="4" label="Kompetisi" color="from-amber-500 to-orange-400" />
          <StatCard icon={Vote} value="450" label="Total Pemilih" sub="Voting OSIS" color="from-violet-500 to-purple-400" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard href="/dashboard/events" icon={Calendar} title="Kelola Event" desc="5 event tersedia" color="from-blue-600 to-blue-400" />
          <QuickActionCard href="/dashboard/users" icon={Users} title="Kelola User" desc="9 pengguna aktif" color="from-violet-600 to-violet-400" />
          <QuickActionCard href="/dashboard/classmeeting/competitions" icon={Trophy} title="Classmeeting" desc="4 lomba aktif" color="from-amber-600 to-orange-400" />
          <QuickActionCard href="/dashboard/pemilu/real-count" icon={BarChart3} title="Real Count" desc="Lihat hasil voting" color="from-pink-600 to-pink-400" badge="LIVE" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <SectionCard title="Event Aktif" icon={Calendar}>
            <div className="space-y-2">
              {[
                { name: 'Classmeeting 2026', date: '20 Jun 2026', status: 'active' },
                { name: 'Pemilu OSIS 2026', date: '20 Jun 2026', status: 'active' },
                { name: 'MPLS 2026', date: '15 Jul 2026', status: 'upcoming' },
              ].map((ev, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition">
                  <div>
                    <p className="text-sm font-medium text-white">{ev.name}</p>
                    <p className="text-xs text-white/40">{ev.date}</p>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-lg ${ev.status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 'bg-blue-500/20 text-blue-400 border border-blue-500/20'}`}>
                    {ev.status === 'active' ? 'Aktif' : 'Segera'}
                  </span>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Statistik Voting" icon={Vote}>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Total Pemilih</span>
                <span className="font-semibold text-white">450</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Sudah Memilih</span>
                <span className="font-semibold text-green-400">0</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-white/40">
                  <span>Partisipasi</span>
                  <span>0%</span>
                </div>
                <div className="w-full bg-white/[0.06] rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-violet-500 h-2 rounded-full" style={{ width: '0%' }} />
                </div>
              </div>
              <Link href="/dashboard/pemilu/real-count">
                <button className="w-full mt-2 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/[0.05] text-sm transition">
                  Lihat Real Count →
                </button>
              </Link>
            </div>
          </SectionCard>
        </div>
      </div>
    )
  }

  // ── Siswa ────────────────────────────────────────
  if (role === 'siswa') {
    return (
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div>
          <p className="text-white/40 text-sm mb-1">Selamat datang kembali 👋</p>
          <h1 className="text-3xl font-bold text-white">Halo, {currentUser?.name?.split(' ')[0]}!</h1>
          <p className="text-white/40 mt-1">{currentUser?.kelas} · Sistem Manajemen Kegiatan Sekolah</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <QuickActionCard href="/dashboard/pemilu/voting" icon={Vote} title="Voting OSIS" desc="Pilih kandidatmu" color="from-violet-600 to-violet-400" badge="BUKA" />
          <QuickActionCard href="/dashboard/classmeeting/schedule" icon={Clock} title="Jadwal Lomba" desc="Lihat pertandingan" color="from-blue-600 to-cyan-400" />
          <QuickActionCard href="/dashboard/pengumuman" icon={Megaphone} title="Pengumuman" desc="Info terbaru" color="from-amber-600 to-orange-400" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <SectionCard title="Classmeeting 2026" icon={Trophy}>
            <div className="space-y-3">
              <p className="text-white/50 text-sm">Ikuti kompetisi dan tunjukkan potensi kelas Anda!</p>
              {[
                { name: 'Futsal Putra', status: 'Berlangsung' },
                { name: 'Volley Ball', status: 'Segera' },
                { name: 'Debat Bahasa', status: 'Segera' },
              ].map((comp, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-sm text-white">{comp.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-lg ${comp.status === 'Berlangsung' ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/40'}`}>{comp.status}</span>
                </div>
              ))}
              <Link href="/dashboard/classmeeting/leaderboard">
                <button className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-500/20 text-amber-400 hover:border-amber-500/40 text-sm transition">
                  Lihat Leaderboard →
                </button>
              </Link>
            </div>
          </SectionCard>

          <SectionCard title="Pemilu OSIS 2026" icon={Vote}>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-green-400 font-medium">Voting Sedang Dibuka</span>
                </div>
                <p className="text-sm text-white/60">Gunakan hak suaramu untuk memilih ketua OSIS!</p>
              </div>
              <Link href="/dashboard/pemilu/voting">
                <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-sm font-semibold transition shadow-lg shadow-violet-500/20">
                  Mulai Voting →
                </button>
              </Link>
              <Link href="/dashboard/pemilu/candidates">
                <button className="w-full py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/[0.05] text-sm transition">
                  Lihat Semua Kandidat
                </button>
              </Link>
            </div>
          </SectionCard>
        </div>
      </div>
    )
  }

  // ── Ketua Kelas ────────────────────────────────────────
  if (role === 'ketua-kelas') {
    return (
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-cyan-400 font-medium uppercase tracking-wider">Ketua Kelas</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Dashboard Ketua Kelas</h1>
          <p className="text-white/40 mt-1">Kelola tim dan pendaftaran kelas Anda</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <StatCard icon={Users} value="25" label="Anggota Kelas" color="from-blue-500 to-blue-400" />
          <StatCard icon={Trophy} value="3" label="Tim Terdaftar" color="from-green-500 to-emerald-400" />
          <StatCard icon={CheckCircle} value="2" label="Tim Disetujui" color="from-amber-500 to-orange-400" />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <QuickActionCard href="/dashboard/classmeeting/competitions" icon={Trophy} title="Daftar Lomba" desc="Lihat & daftar kompetisi" color="from-amber-600 to-orange-400" />
          <QuickActionCard href="/dashboard/classmeeting/my-teams" icon={Users} title="Tim Kelas" desc="Kelola anggota tim" color="from-blue-600 to-cyan-400" />
          <QuickActionCard href="/dashboard/classmeeting/schedule" icon={Clock} title="Jadwal" desc="Lihat pertandingan" color="from-green-600 to-emerald-400" />
          <QuickActionCard href="/dashboard/pengumuman" icon={Megaphone} title="Pengumuman" desc="Info dari panitia" color="from-orange-600 to-amber-400" />
        </div>
      </div>
    )
  }

  // ── Kandidat ────────────────────────────────────────
  if (role === 'kandidat') {
    return (
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-4 h-4 text-pink-400" />
            <span className="text-xs text-pink-400 font-medium uppercase tracking-wider">Kandidat OSIS</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Dashboard Kandidat</h1>
          <p className="text-white/40 mt-1">Monitor kampanye dan perolehan suara Anda</p>
        </div>

        <div className="p-5 glass-card rounded-2xl border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-purple-500/5">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs text-violet-400 font-medium">Status Kampanye</span>
              <h2 className="text-xl font-bold text-white mt-1">{currentUser?.name}</h2>
              <p className="text-white/50 text-sm mt-1">Menciptakan OSIS yang inklusif dan responsif</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
              <Vote className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <StatCard icon={BarChart3} value="0" label="Perolehan Suara" color="from-violet-500 to-violet-400" />
          <StatCard icon={Users} value="450" label="Total Pemilih" color="from-blue-500 to-blue-400" />
          <StatCard icon={TrendingUp} value="0%" label="Persentase" color="from-green-500 to-emerald-400" />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <QuickActionCard href="/dashboard/pemilu/profile" icon={Star} title="Edit Profil Kampanye" desc="Update visi misi & video" color="from-violet-600 to-pink-400" />
          <QuickActionCard href="/dashboard/pemilu/real-count" icon={BarChart3} title="Lihat Real Count" desc="Monitor perolehan suara" color="from-blue-600 to-cyan-400" badge="LIVE" />
        </div>
      </div>
    )
  }

  // ── Panitia (default) ────────────────────────────────────────
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle className="w-4 h-4 text-violet-400" />
          <span className="text-xs text-violet-400 font-medium uppercase tracking-wider">Panitia Event</span>
        </div>
        <h1 className="text-3xl font-bold text-white">Dashboard Panitia</h1>
        <p className="text-white/40 mt-1">Kelola event dan verifikasi peserta</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard icon={Calendar} value="5" label="Event Aktif" color="from-blue-500 to-blue-400" />
        <StatCard icon={Users} value="12" label="Peserta Terdaftar" color="from-green-500 to-emerald-400" />
        <StatCard icon={CheckCircle} value="8" label="Terverifikasi" color="from-amber-500 to-orange-400" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <QuickActionCard href="/dashboard/classmeeting/teams" icon={Users} title="Verifikasi Tim" desc="Periksa pendaftaran" color="from-blue-600 to-cyan-400" />
        <QuickActionCard href="/dashboard/classmeeting/results" icon={Trophy} title="Input Hasil" desc="Masukkan hasil lomba" color="from-amber-600 to-orange-400" />
        <QuickActionCard href="/dashboard/classmeeting/competitions" icon={Zap} title="Daftar Lomba" desc="Kelola kompetisi" color="from-violet-600 to-violet-400" />
        <QuickActionCard href="/dashboard/pengumuman" icon={Megaphone} title="Pengumuman" desc="Kirim info ke siswa" color="from-green-600 to-emerald-400" />
      </div>
    </div>
  )
}
