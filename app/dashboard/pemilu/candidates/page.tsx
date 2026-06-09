'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Trophy, Users, Star, RefreshCw, ExternalLink } from 'lucide-react'

interface Candidate {
  id: string; number: number; visiMisi: string; campaignVideo: string | null; photo: string | null
  votes: number
  user: { id: string; name: string; kelas: string | null; avatar: string | null }
}

export default function CandidatesPage() {
  const { currentUser } = useAuth()
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/candidates', { credentials: 'include' })
      const json = await res.json()
      if (json.success) setCandidates(json.data)
    } catch { /* ignore */ }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const GRADIENTS = [
    'from-blue-500 to-cyan-500', 'from-violet-500 to-purple-500',
    'from-pink-500 to-rose-500', 'from-amber-500 to-orange-500',
  ]

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-4 h-4 text-violet-400" />
            <span className="text-xs text-violet-400 font-medium uppercase tracking-wider">Pemilu OSIS 2026</span>
          </div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Kandidat</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>{candidates.length} kandidat terdaftar</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition" style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)', color: 'var(--text-muted)' }}>
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="glass-card rounded-2xl h-64 animate-pulse" style={{ background: 'var(--subtle-bg)' }} />)}
        </div>
      ) : candidates.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center">
          <Users className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-faint)' }} />
          <p className="font-medium" style={{ color: 'var(--text-muted)' }}>Belum ada kandidat</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {candidates.map((c, idx) => {
            const grad = GRADIENTS[idx % GRADIENTS.length]
            const isExpanded = expandedId === c.id
            return (
              <div key={c.id} className="glass-card rounded-2xl overflow-hidden hover:border-white/20 transition-all">
                {/* Gradient bar */}
                <div className={`h-1.5 bg-gradient-to-r ${grad}`} />

                <div className="p-5">
                  {/* Candidate info */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative flex-shrink-0">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center text-2xl font-bold text-white shadow-lg overflow-hidden`}>
                        {c.user.avatar ? (
                          <img src={c.user.avatar} alt={c.user.name} className="w-full h-full object-cover" />
                        ) : c.user.name.charAt(0)}
                      </div>
                      <div className={`absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full bg-gradient-to-br ${grad} border-2 flex items-center justify-center text-white text-xs font-bold`} style={{ borderColor: 'var(--glass-bg)' }}>
                        {c.number}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Star className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-xs text-amber-400 font-medium">Kandidat #{c.number}</span>
                      </div>
                      <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>{c.user.name}</h3>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{c.user.kelas}</p>
                    </div>
                    {(currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'PANITIA') && (
                      <div className="flex-shrink-0 text-right">
                        <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{c.votes}</p>
                        <p className="text-xs" style={{ color: 'var(--text-faint)' }}>suara</p>
                      </div>
                    )}
                  </div>

                  {/* Visi Misi */}
                  <div className="p-3 rounded-xl mb-3" style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)' }}>
                    <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Visi & Misi</p>
                    <p className={`text-xs leading-relaxed ${isExpanded ? '' : 'line-clamp-3'}`} style={{ color: 'var(--text-secondary)' }}>
                      {c.visiMisi}
                    </p>
                    {c.visiMisi.length > 120 && (
                      <button onClick={() => setExpandedId(isExpanded ? null : c.id)} className="text-xs mt-1 font-medium text-blue-400 hover:text-blue-300">
                        {isExpanded ? 'Lihat lebih sedikit' : 'Baca selengkapnya'}
                      </button>
                    )}
                  </div>

                  {/* Campaign Video */}
                  {c.campaignVideo && (
                    <a href={c.campaignVideo} target="_blank" rel="noopener noreferrer"
                      className={`flex items-center gap-2 w-full py-2 rounded-xl text-xs font-medium transition justify-center bg-gradient-to-r ${grad} text-white opacity-80 hover:opacity-100`}>
                      <ExternalLink className="w-3.5 h-3.5" /> Lihat Video Kampanye
                    </a>
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
