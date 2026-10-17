'use client'

import { useAuth } from '@/context/AuthContext'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Trophy, Vote, Calendar, Megaphone, Users, BarChart3,
  CheckCircle, Clock, Shield, Star, RefreshCw, AlertCircle
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
function StatCard({
  icon: Icon,
  value,
  label,
  sub,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  value: string | number
  label: string
  sub?: string
  accent?: string
}) {
  return (
    <div className="surface-card p-4 sm:p-5 flex items-start justify-between">
      <div className="min-w-0 flex-1 pr-3">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mt-1 leading-tight">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-1 truncate">{sub}</p>}
      </div>
      <div className="w-9 h-9 rounded-lg bg-secondary text-foreground/80 flex items-center justify-center shrink-0 border border-border">
        <Icon className="w-4 h-4 text-muted-foreground" strokeWidth={1.75} />
      </div>
    </div>
  )
}

function QuickActionCard({
  href,
  icon: Icon,
  title,
  desc,
  badge,
}: {
  href: string
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  title: string
  desc: string
  badge?: string
  accent?: string
}) {
  return (
    <Link href={href} className="group block h-full">
      <div className="surface-card p-4 sm:p-5 h-full relative flex flex-col justify-between hover:border-foreground/30 hover:shadow-xs transition-all">
        {badge && (
          <span className="absolute top-3.5 right-3.5 px-2 py-0.5 text-[10px] font-bold rounded-md chip-active">
            {badge}
          </span>
        )}
        <div>
          <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center mb-3 border border-border group-hover:bg-primary/10 group-hover:border-primary/30 transition-colors">
            <Icon className="w-4 h-4 text-foreground/80 group-hover:text-primary transition-colors" strokeWidth={1.75} />
          </div>
          <p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{title}</p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{desc}</p>
        </div>
      </div>
    </Link>
  )
}

function SectionCard({
  title,
  icon: Icon,
  children
}: {
  title: string
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  children: React.ReactNode
}) {
  return (
    <div className="surface-card overflow-hidden">
      <div className="px-5 py-3.5 flex items-center gap-2.5 border-b border-border bg-muted/20">
        <Icon className="w-4 h-4 text-muted-foreground" strokeWidth={1.75} />
        <h3 className="font-bold text-xs uppercase tracking-wider text-foreground">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function Skeleton() {
  return <div className="h-5 rounded-md bg-muted animate-pulse w-3/4" />
}

// ─── Main Component ───────────────────────────────────────────────────────────
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
    } catch { }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const activeEvents = events.filter(e => e.status === 'ACTIVE')
  const s = stats

  const statusChipClass = (status: string) => {
    if (status === 'ACTIVE') return 'chip-active'
    if (status === 'UPCOMING') return 'chip-upcoming'
    return 'chip-ended'
  }
  const statusLabel = (status: string) => ({ ACTIVE: 'Aktif', UPCOMING: 'Akan Datang', COMPLETED: 'Selesai', CANCELLED: 'Dibatalkan' }[status] || status)

  // ── SUPER ADMIN ────────────────────────────────────────
  if (role === 'SUPER_ADMIN') return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="academic-badge">Super Admin</span>
            <span className="text-xs text-muted-foreground">• Pengendali Utama</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Pusat Kendali Administrator</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Kelola event sekolah, data pengguna, kompetisi, dan sesi voting.</p>
        </div>
        <button
          onClick={fetchData}
          className="self-start sm:self-auto flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Perbarui Data</span>
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} value={loading ? '...' : s?.users.total ?? 0} label="Total Akun Pengguna" sub={`${s?.users.siswa ?? 0} siswa terdaftar`} accent="primary" />
        <StatCard icon={Calendar} value={loading ? '...' : s?.events.total ?? 0} label="Agenda Kegiatan" sub={`${s?.events.active ?? 0} event aktif saat ini`} accent="emerald" />
        <StatCard icon={Trophy} value={loading ? '...' : s?.competitions.total ?? 0} label="Cabang Lomba" sub="Classmeeting & seni" accent="amber" />
        <StatCard icon={Vote} value={loading ? '...' : s?.voting.totalVoters ?? 0} label="Daftar Pemilih Tetap" sub="Pemilu Raya OSIS" accent="slate" />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickActionCard href="/dashboard/events" icon={Calendar} title="Kelola Agenda & Event" desc="Buka kegiatan baru atau ubah status pelaksanaan." accent="primary" />
        <QuickActionCard href="/dashboard/users" icon={Users} title="Manajemen Pengguna" desc="Kelola hak akses siswa, ketua kelas, dan panitia." accent="primary" />
        <QuickActionCard href="/dashboard/classmeeting/competitions" icon={Trophy} title="Modul Classmeeting" desc="Atur pendaftaran lomba, bagan, dan leaderboard." accent="amber" />
        <QuickActionCard href="/dashboard/pemilu/real-count" icon={BarChart3} title="Real Count Pemilu" desc="Pantau rekapitulasi surat suara yang telah masuk." badge={s?.voting.sessionActive ? 'SESI DIBUKA' : undefined} accent="emerald" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <SectionCard title="Daftar Kegiatan Aktif" icon={Calendar}>
          {loading ? (
            <div className="space-y-3">{[1, 2, 3].map(i => <Skeleton key={i} />)}</div>
          ) : activeEvents.length > 0 ? (
            <div className="space-y-2.5">
              {activeEvents.map(ev => (
                <div key={ev.id} className="flex items-center justify-between p-3 rounded-lg border border-border/70 bg-muted/30">
                  <div className="min-w-0 pr-2">
                    <p className="text-sm font-semibold text-foreground truncate">{ev.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(ev.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-md shrink-0 ${statusChipClass(ev.status)}`}>
                    {statusLabel(ev.status)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-lg border border-dashed border-border text-center text-xs text-muted-foreground">
              Belum ada kegiatan yang berstatus aktif saat ini. Buka menu Kelola Event untuk mengaktifkan.
            </div>
          )}
        </SectionCard>

        <SectionCard title="Partisipasi Pemilu OSIS" icon={Vote}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-muted/40 border border-border">
              <div>
                <p className="text-xs text-muted-foreground">Total Hak Suara</p>
                <p className="text-lg font-bold text-foreground mt-0.5">{loading ? '...' : s?.voting.totalVoters ?? 0}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Suara Masuk</p>
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{loading ? '...' : s?.voting.votedCount ?? 0}</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Tingkat Partisipasi</span>
                <span className="font-semibold text-foreground">{loading ? '...' : `${s?.voting.participationRate ?? 0}%`}</span>
              </div>
              <div className="w-full rounded-full h-2 bg-muted overflow-hidden">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${s?.voting.participationRate ?? 0}%` }}
                />
              </div>
            </div>

            <Link
              href="/dashboard/pemilu/real-count"
              className="block w-full py-2.5 text-center rounded-lg border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors"
            >
              Buka Layar Real Count Lengkap
            </Link>
          </div>
        </SectionCard>
      </div>
    </div>
  )

  // ── SISWA ────────────────────────────────────────
  if (role === 'SISWA') return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div className="pb-4 border-b border-border">
        <span className="academic-badge mb-2">Portal Siswa</span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Halo, {currentUser?.name?.split(' ')[0]}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Kelas {currentUser?.kelas || '-'} • Tetap pantau jadwal tanding dan gunakan hak suara OSIS.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <QuickActionCard
          href="/dashboard/pemilu/voting"
          icon={Vote}
          title="Bilik Pemilu OSIS"
          desc="Gunakan hak suaramu untuk menentukan ketua OSIS."
          badge={s?.voting.sessionActive ? 'SESI DIBUKA' : undefined}
          accent="primary"
        />
        <QuickActionCard
          href="/dashboard/classmeeting/schedule"
          icon={Clock}
          title="Jadwal Pertandingan"
          desc="Lihat jam dan lokasi lomba kelas hari ini."
          accent="amber"
        />
        <QuickActionCard
          href="/dashboard/pengumuman"
          icon={Megaphone}
          title="Papan Pengumuman"
          desc={`${s?.announcements.total ?? 0} surat pengumuman resmi terbit.`}
          accent="emerald"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <SectionCard title="Agenda Sekolah Hari Ini" icon={Calendar}>
          {loading ? (
            <div className="space-y-3">{[1, 2].map(i => <Skeleton key={i} />)}</div>
          ) : activeEvents.length > 0 ? (
            <div className="space-y-2">
              {activeEvents.map(ev => (
                <div key={ev.id} className="flex items-center justify-between p-3 rounded-lg border border-border/70 bg-muted/30">
                  <span className="text-sm font-medium text-foreground">{ev.name}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${statusChipClass(ev.status)}`}>
                    {statusLabel(ev.status)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Tidak ada agenda tanding aktif hari ini.</p>
          )}
        </SectionCard>

        <SectionCard title="Status Pemilu OSIS" icon={Vote}>
          <div className="space-y-4">
            <div className={`p-4 rounded-lg border ${s?.voting.sessionActive ? 'bg-primary/5 border-primary/20' : 'bg-muted/40 border-border'}`}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`w-2 h-2 rounded-full ${s?.voting.sessionActive ? 'bg-emerald-500' : 'bg-muted-foreground'}`} />
                <span className="text-xs font-bold text-foreground">
                  {s?.voting.sessionActive ? 'Pemungutan Suara Sedang Berlangsung' : 'Bilik Suara Belum Dibuka'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {s?.voting.sessionActive
                  ? 'Setiap siswa memiliki hak 1 kali voting. Pastikan memilih sebelum sesi ditutup.'
                  : 'Panitia belum membuka sesi pemilihan suara. Pantau pengumuman untuk jadwal voting.'}
              </p>
            </div>

            <Link
              href="/dashboard/pemilu/voting"
              className="block w-full py-2.5 text-center rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
            >
              Masuk ke Bilik Suara
            </Link>
          </div>
        </SectionCard>
      </div>
    </div>
  )

  // ── KETUA KELAS ────────────────────────────────────────
  if (role === 'KETUA_KELAS') return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div className="pb-4 border-b border-border">
        <span className="academic-badge mb-2">Ketua Kelas</span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Pusat Delegasi Kelas: {currentUser?.kelas}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Daftarkan anggota tim lomba kelas dan pastikan seluruh syarat delegasi terpenuhi.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard icon={Trophy} value={loading ? '...' : s?.competitions.total ?? 0} label="Cabang Lomba Dibuka" accent="amber" />
        <StatCard icon={Users} value={loading ? '...' : s?.teams.total ?? 0} label="Regu Didaftarkan" accent="primary" />
        <StatCard icon={CheckCircle} value={loading ? '...' : s?.teams.approved ?? 0} label="Lolos Verifikasi" accent="emerald" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <QuickActionCard href="/dashboard/classmeeting/competitions" icon={Trophy} title="Daftar Cabang Lomba" desc="Cek syarat peserta dan kuota pemain per cabang." accent="amber" />
        <QuickActionCard href="/dashboard/classmeeting/my-teams" icon={Users} title="Kelola Tim Kelas" desc="Tambah atau ubah nama anggota delegasi kelas." accent="primary" />
        <QuickActionCard href="/dashboard/classmeeting/schedule" icon={Clock} title="Jadwal Tanding" desc="Jadwal pertandingan kelas di babak penyisihan." accent="primary" />
        <QuickActionCard href="/dashboard/pengumuman" icon={Megaphone} title="Pengumuman Panitia" desc="Petunjuk teknis dan regulasi lomba terupdate." accent="emerald" />
      </div>
    </div>
  )

  // ── KANDIDAT ────────────────────────────────────────
  if (role === 'KANDIDAT') return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div className="pb-4 border-b border-border">
        <span className="academic-badge mb-2">Kandidat Paslon OSIS</span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Dashboard Kampanye & Suara
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Perbarui materi kampanye dan pantau tren perolehan suara pemilih.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard icon={BarChart3} value={loading ? '...' : s?.voting.votedCount ?? 0} label="Surat Suara Masuk" accent="primary" />
        <StatCard icon={Users} value={loading ? '...' : s?.voting.totalVoters ?? 0} label="Total Pemilih Tetap" accent="slate" />
        <StatCard icon={Vote} value={loading ? '...' : `${s?.voting.participationRate ?? 0}%`} label="Partisipasi Pemilih" accent="emerald" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <QuickActionCard href="/dashboard/pemilu/profile" icon={Star} title="Profil & Visi Misi" desc="Perbarui deskripsi paslon, program kerja, dan media kampanye." accent="primary" />
        <QuickActionCard href="/dashboard/pemilu/real-count" icon={BarChart3} title="Hasil Real Count" desc="Pantau grafik persentase perolehan suara secara transparan." badge={s?.voting.sessionActive ? 'LIVE' : undefined} accent="emerald" />
      </div>
    </div>
  )

  // ── PANITIA (default) ────────────────────────────────────────
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div className="pb-4 border-b border-border">
        <span className="academic-badge mb-2">Panitia Pelaksana</span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Dashboard Operasional Panitia
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Verifikasi tim peserta lomba, catat skor hasil pertandingan, dan siapkan publikasi juara.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard icon={Calendar} value={loading ? '...' : s?.events.active ?? 0} label="Kegiatan Berjalan" accent="primary" />
        <StatCard icon={Users} value={loading ? '...' : s?.teams.total ?? 0} label="Pendaftaran Regu" accent="slate" />
        <StatCard icon={CheckCircle} value={loading ? '...' : s?.teams.approved ?? 0} label="Sudah Diverifikasi" accent="emerald" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <QuickActionCard href="/dashboard/classmeeting/teams" icon={Users} title="Verifikasi Peserta" desc={`${s?.teams.pending ?? 0} tim menunggu persetujuan berkas.`} accent="primary" />
        <QuickActionCard href="/dashboard/classmeeting/results" icon={Trophy} title="Input Hasil Pertandingan" desc="Catat skor tanding dan loloskan tim ke babak berikutnya." accent="amber" />
        <QuickActionCard href="/dashboard/classmeeting/competitions" icon={Calendar} title="Kelola Cabang Lomba" desc="Atur jadwal, bagan, dan kuota pemain lomba." accent="primary" />
        <QuickActionCard href="/dashboard/pengumuman" icon={Megaphone} title="Rilis Pengumuman" desc="Kirimkan pemberitahuan resmi kepada seluruh siswa." accent="emerald" />
      </div>
    </div>
  )
}
