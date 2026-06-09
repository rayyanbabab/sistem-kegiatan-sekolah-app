'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Vote, Star, FileText, TrendingUp, Users, CheckCircle, RefreshCw, BookOpen, Theater, Heart, Monitor } from 'lucide-react'

interface CandidateProfile {
  id: string; number: number; visiMisi: string
  campaignVideo: string | null; photo: string | null; votes: number
  user: { name: string; kelas: string | null; avatar: string | null }
}
interface VotingSessionInfo {
  totalVoters: number; votedCount: number; participationRate: number
  status: string; startTime: string; endTime: string
}

const PROGRAMS = [
  { icon: BookOpen, title: 'Program Akademik', desc: 'Peningkatan fasilitas belajar dan mentoring antar siswa', color: 'from-blue-500 to-cyan-500' },
  { icon: Theater,  title: 'Program Seni & Budaya', desc: 'Revitalisasi kegiatan seni untuk mengembangkan bakat', color: 'from-violet-500 to-purple-500' },
  { icon: Heart,    title: 'Program Sosial', desc: 'Kegiatan sosial dan gotong royong untuk masyarakat', color: 'from-pink-500 to-rose-500' },
  { icon: Monitor,  title: 'Program Digital', desc: 'Modernisasi sistem informasi dan komunikasi OSIS', color: 'from-green-500 to-emerald-500' },
]

export default function CandidateProfilePage() {
  const { currentUser } = useAuth()
  const [profile, setProfile] = useState<CandidateProfile | null>(null)
  const [sessionInfo, setSessionInfo] = useState<VotingSessionInfo | null>(null)
  const [allCandidates, setAllCandidates] = useState<CandidateProfile[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [candRes, resultsRes] = await Promise.all([
        fetch('/api/candidates', { credentials: 'include' }),
        fetch('/api/voting/results', { credentials: 'include' }),
      ])
      if (candRes.ok) {
        const j = await candRes.json()
        if (j.success) {
          setAllCandidates(j.data)
          // Find current user's candidate profile
          const mine = j.data.find((c: CandidateProfile) => c.user.name === currentUser?.name)
          if (mine) setProfile(mine)
        }
      }
      if (resultsRes.ok) {
        const j = await resultsRes.json()
        if (j.success && j.data.votingSession) setSessionInfo(j.data.votingSession)
      }
    } catch { /* ignore */ }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [currentUser?.name])

  const totalVoters = sessionInfo?.totalVoters || 450
  const myVotes     = profile?.votes || 0
  const myPct       = totalVoters > 0 ? Math.round((myVotes / totalVoters) * 100) : 0
  const myRank      = profile
    ? [...allCandidates].sort((a, b) => b.votes - a.votes).findIndex(c => c.id === profile.id) + 1
    : 0

  const timelineItems = [
    { event: 'Pendaftaran Kandidat Dibuka', done: true, date: '10 Juni 2026' },
    { event: 'Batas Akhir Upload Profil', done: true, date: '15 Juni 2026' },
    { event: 'Voting Dibuka', done: sessionInfo?.status === 'OPEN' || sessionInfo?.status === 'CLOSED', date: sessionInfo ? new Date(sessionInfo.startTime).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '20 Juni 2026' },
    { event: 'Voting Ditutup', done: sessionInfo?.status === 'CLOSED', date: sessionInfo ? new Date(sessionInfo.endTime).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '22 Juni 2026' },
    { event: 'Pengumuman Pemenang', done: false, date: '23 Juni 2026' },
  ]

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Vote className="w-4 h-4 text-violet-400" />
            <span className="text-xs text-violet-400 font-medium uppercase tracking-wider">Pemilu OSIS 2026</span>
          </div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Profil Kampanye Saya</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Kelola profil kampanye dan program kerja Anda</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition" style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)', color: 'var(--text-muted)' }}>
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Profile Card */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-violet-500 to-pink-500" />
        <div className="p-6">
          <div className="flex gap-5 flex-col sm:flex-row">
            {/* Photo */}
            <div className="relative flex-shrink-0">
              <div className="w-28 h-28 rounded-2xl overflow-hidden" style={{ border: '2px solid var(--glass-border)' }}>
                {loading ? (
                  <div className="w-full h-full animate-pulse" style={{ background: 'var(--subtle-bg)' }} />
                ) : (
                  <img
                    src={profile?.photo || profile?.user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.name || 'candidate'}`}
                    alt="Foto Kandidat"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              {profile && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <span className="text-white text-xs font-bold">#{profile.number}</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{currentUser?.name}</h2>
              <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                {currentUser?.kelas} · Kandidat OSIS 2026
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Suara', value: loading ? '...' : myVotes, color: 'text-violet-400' },
                  { label: 'Persentase', value: loading ? '...' : `${myPct}%`, color: 'text-pink-400' },
                  { label: 'Ranking', value: loading ? '...' : myRank > 0 ? `#${myRank}` : '—', color: 'text-amber-400' },
                ].map(s => (
                  <div key={s.label} className="p-3 rounded-xl text-center" style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)' }}>
                    <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-faint)' }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visi Misi */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-4 h-4 text-amber-400" />
          <h2 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Visi & Misi</h2>
        </div>
        <div className="p-4 rounded-xl" style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)' }}>
          {loading ? (
            <div className="space-y-2">
              <div className="h-3 rounded w-full animate-pulse" style={{ background: 'var(--subtle-border)' }} />
              <div className="h-3 rounded w-4/5 animate-pulse" style={{ background: 'var(--subtle-border)' }} />
            </div>
          ) : (
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {profile?.visiMisi || 'Visi misi belum diisi.'}
            </p>
          )}
        </div>
      </div>

      {/* Program Kerja */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-4 h-4 text-blue-400" />
          <h2 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Program Kerja</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {PROGRAMS.map(p => (
            <div key={p.title} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)' }}>
              <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${p.color} flex items-center justify-center flex-shrink-0`}>
                <p.icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{p.title}</p>
                <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <h2 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Timeline Pemilu</h2>
        </div>
        <div className="space-y-3">
          {timelineItems.map((t, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${t.done ? 'bg-green-500/15 border border-green-500/30' : 'bg-white/5 border border-white/10'}`}>
                {t.done ? <CheckCircle className="w-4 h-4 text-green-400" /> : <div className="w-2 h-2 rounded-full bg-white/20" />}
              </div>
              <div className="flex-1 flex items-center justify-between gap-3">
                <p className="text-sm" style={{ color: t.done ? 'var(--text-secondary)' : 'var(--text-faint)' }}>{t.event}</p>
                <span className="text-xs flex-shrink-0" style={{ color: 'var(--text-faint)' }}>{t.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats pendukung */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-pink-400" />
          <h2 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Perolehan Suara</h2>
        </div>
        <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)' }}>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {loading ? '...' : myVotes} suara diperoleh
            </p>
            <p className="text-xs" style={{ color: 'var(--text-faint)' }}>dari {totalVoters} total pemilih</p>
          </div>
          <div className="ml-auto flex-1">
            <div className="w-full h-2 rounded-full" style={{ background: 'var(--subtle-border)' }}>
              <div className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 transition-all duration-1000" style={{ width: `${myPct}%` }} />
            </div>
            <p className="text-[10px] text-right mt-1 text-violet-400">{myPct}%</p>
          </div>
        </div>
      </div>
    </div>
  )
}
