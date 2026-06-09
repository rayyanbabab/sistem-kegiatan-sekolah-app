'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Vote, Users, BarChart3, Star, ExternalLink, BookOpen, Theater, Heart, Monitor } from 'lucide-react'

interface CandidateDetail {
  id: string; number: number; visiMisi: string
  campaignVideo: string | null; photo: string | null
  votes: number
  user: { name: string; kelas: string | null; avatar: string | null }
}

const GRADIENTS = [
  'from-blue-500 to-cyan-500', 'from-violet-500 to-purple-500',
  'from-pink-500 to-rose-500', 'from-amber-500 to-orange-500',
]
const PROGRAMS = [
  { icon: BookOpen, title: 'Program Akademik', desc: 'Peningkatan fasilitas belajar dan program mentoring antar siswa', color: 'from-blue-500 to-cyan-500' },
  { icon: Theater,  title: 'Program Seni & Budaya', desc: 'Revitalisasi kegiatan seni untuk mengembangkan bakat siswa', color: 'from-violet-500 to-purple-500' },
  { icon: Heart,    title: 'Program Sosial', desc: 'Kegiatan sosial dan gotong royong untuk masyarakat sekitar', color: 'from-pink-500 to-rose-500' },
  { icon: Monitor,  title: 'Program Digital', desc: 'Modernisasi sistem informasi dan komunikasi OSIS', color: 'from-green-500 to-emerald-500' },
]

export default function CandidateDetailPage() {
  const params = useParams()
  const candidateId = params.id as string

  const [candidate, setCandidate] = useState<CandidateDetail | null>(null)
  const [totalVotes, setTotalVotes] = useState(0)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
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
            const found = j.data.find((c: CandidateDetail) => c.id === candidateId)
            if (found) setCandidate(found)
            else setNotFound(true)
          }
        }
        if (resultsRes.ok) {
          const j = await resultsRes.json()
          if (j.success) setTotalVotes(j.data.votingSession?.votedCount || 0)
        }
      } catch { setNotFound(true) }
      setLoading(false)
    }
    if (candidateId) fetchData()
  }, [candidateId])

  if (loading) return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      {[1,2,3].map(i => <div key={i} className="glass-card rounded-2xl h-32 animate-pulse" style={{ background: 'var(--subtle-bg)' }} />)}
    </div>
  )

  if (notFound || !candidate) return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="glass-card rounded-2xl p-16 text-center">
        <p className="font-medium" style={{ color: 'var(--text-muted)' }}>Kandidat Tidak Ditemukan</p>
        <Link href="/dashboard/pemilu/candidates">
          <button className="mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:opacity-90 transition">Kembali</button>
        </Link>
      </div>
    </div>
  )

  const colorIdx = (candidate.number - 1) % GRADIENTS.length
  const color = GRADIENTS[colorIdx]
  const pct = totalVotes > 0 ? Math.round((candidate.votes / totalVotes) * 100) : 0

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      {/* Back */}
      <Link href="/dashboard/pemilu/candidates">
        <button className="flex items-center gap-2 text-sm transition hover:opacity-80" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Kandidat
        </button>
      </Link>

      {/* Hero */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className={`h-1.5 bg-gradient-to-r ${color}`} />
        <div className="p-6">
          <div className="flex gap-6 flex-col sm:flex-row">
            <div className="relative flex-shrink-0">
              <div className="w-36 h-36 rounded-2xl overflow-hidden border-2" style={{ borderColor: 'var(--glass-border)' }}>
                {(candidate.photo || candidate.user.avatar) ? (
                  <img src={candidate.photo || candidate.user.avatar!} alt={candidate.user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${color} flex items-center justify-center text-5xl font-bold text-white`}>{candidate.user.name.charAt(0)}</div>
                )}
              </div>
              <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                <span className="text-white font-bold">#{candidate.number}</span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{candidate.user.name}</h1>
              <p className="flex items-center gap-1.5 text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                <Users className="w-3.5 h-3.5" /> {candidate.user.kelas}
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Suara', value: candidate.votes, color: 'text-blue-400' },
                  { label: 'Persentase', value: `${pct}%`, color: 'text-violet-400' },
                  { label: 'Nomor Urut', value: `#${candidate.number}`, color: 'text-amber-400' },
                ].map(s => (
                  <div key={s.label} className="p-3 rounded-xl" style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)' }}>
                    <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-faint)' }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-5 pt-5" style={{ borderTop: '1px solid var(--subtle-border)' }}>
            {candidate.campaignVideo && (
              <a href={candidate.campaignVideo} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium flex-1 transition" style={{ background: 'var(--subtle-bg)', color: 'var(--text-muted)', border: '1px solid var(--subtle-border)' }}>
                <ExternalLink className="w-4 h-4" /> Video Kampanye
              </a>
            )}
            <Link href="/dashboard/pemilu/voting" className="flex-1">
              <button className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r ${color} shadow-lg hover:opacity-90 transition`}>
                <Vote className="w-4 h-4" /> Pilih Kandidat Ini
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Visi Misi */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3"><Star className="w-4 h-4 text-amber-400" /><h2 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Visi dan Misi</h2></div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{candidate.visiMisi}</p>
      </div>

      {/* Program Kerja */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4"><BarChart3 className="w-4 h-4 text-blue-400" /><h2 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Program Kerja</h2></div>
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

      {/* Statistik Voting */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4"><BarChart3 className="w-4 h-4 text-violet-400" /><h2 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Statistik Voting</h2></div>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Perolehan Suara</span>
              <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{candidate.votes} / {totalVotes} suara</span>
            </div>
            <div className="w-full rounded-full h-2" style={{ background: 'var(--subtle-bg)' }}>
              <div className={`h-2 rounded-full bg-gradient-to-r ${color} transition-all`} style={{ width: `${pct}%` }} />
            </div>
          </div>
          <div className="text-center p-4 rounded-xl" style={{ background: 'var(--subtle-bg)' }}>
            <p className="text-3xl font-bold text-violet-400">{pct}%</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-faint)' }}>dari total suara masuk</p>
          </div>
        </div>
      </div>
    </div>
  )
}
