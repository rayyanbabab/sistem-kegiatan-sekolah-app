'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Vote, CheckCircle, Clock, AlertCircle, Trophy } from 'lucide-react'

interface Candidate {
  id: string; number: number; visiMisi: string; photo: string | null
  user: { name: string; kelas: string | null; avatar: string | null }
}
interface VotingSession {
  id: string; status: string; startTime: string; endTime: string
  totalVoters: number; votedCount: number
}

export default function VotingPage() {
  const { currentUser } = useAuth()
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [session, setSession] = useState<VotingSession | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [myVoteCandidateId, setMyVoteCandidateId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [candidatesRes, sessionRes, voteRes] = await Promise.all([
        fetch('/api/candidates', { credentials: 'include' }),
        fetch('/api/voting/session', { credentials: 'include' }),
        fetch('/api/voting/vote', { credentials: 'include' }),
      ])
      if (candidatesRes.ok) { const j = await candidatesRes.json(); if (j.success) setCandidates(j.data) }
      if (sessionRes.ok) { const j = await sessionRes.json(); if (j.success) setSession(j.data) }
      if (voteRes.ok) {
        const j = await voteRes.json()
        if (j.success) {
          setHasVoted(j.data.hasVoted)
          setMyVoteCandidateId(j.data.vote?.candidateId || null)
        }
      }
    } catch { /* ignore */ }
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const handleVote = async () => {
    if (!selectedId || !session) return
    setSubmitting(true); setError('')
    try {
      const res = await fetch('/api/voting/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ candidateId: selectedId, votingSessionId: session.id }),
      })
      const json = await res.json()
      if (json.success) { setHasVoted(true); setMyVoteCandidateId(selectedId); setSuccess(true) }
      else setError(json.error || 'Gagal menyimpan suara')
    } catch { setError('Gagal terhubung ke server') }
    setSubmitting(false)
  }

  const isSessionOpen = session?.status === 'OPEN'
  const GRADIENTS = ['from-blue-500 to-cyan-500', 'from-violet-500 to-purple-500', 'from-pink-500 to-rose-500', 'from-amber-500 to-orange-500']

  if (loading) return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <div className="h-8 w-48 rounded-xl animate-pulse" style={{ background: 'var(--subtle-bg)' }} />
      <div className="grid md:grid-cols-2 gap-4">{[1,2,3,4].map(i => <div key={i} className="glass-card rounded-2xl h-52 animate-pulse" style={{ background: 'var(--subtle-bg)' }} />)}</div>
    </div>
  )

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1"><Vote className="w-4 h-4 text-violet-400" /><span className="text-xs text-violet-400 font-medium uppercase tracking-wider">Pemilu OSIS</span></div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Voting</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>Pilih satu kandidat terbaik untuk memimpin OSIS</p>
      </div>

      {/* Session status */}
      {session && (
        <div className={`glass-card rounded-2xl p-4 flex items-center gap-3 border ${isSessionOpen ? 'border-green-500/20 bg-green-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isSessionOpen ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
          <div className="flex-1">
            <p className={`text-sm font-semibold ${isSessionOpen ? 'text-green-400' : 'text-red-400'}`}>
              {isSessionOpen ? 'Sesi Voting Sedang Berlangsung' : `Voting ${session.status === 'CLOSED' ? 'Telah Ditutup' : 'Belum Dibuka'}`}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-faint)' }}>
              {new Date(session.startTime).toLocaleString('id-ID')} — {new Date(session.endTime).toLocaleString('id-ID')}
            </p>
          </div>
          {isSessionOpen && (
            <div className="text-right">
              <p className="text-sm font-bold text-green-400">{session.votedCount} / {session.totalVoters}</p>
              <p className="text-xs" style={{ color: 'var(--text-faint)' }}>sudah memilih</p>
            </div>
          )}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="glass-card rounded-2xl p-6 text-center border border-green-500/20 bg-green-500/5">
          <div className="w-14 h-14 mx-auto rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mb-3">
            <CheckCircle className="w-7 h-7 text-green-400" />
          </div>
          <h2 className="text-xl font-bold text-green-400">Suara Berhasil Dicatat!</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Terima kasih telah menggunakan hak suara Anda.</p>
        </div>
      )}

      {/* Already voted */}
      {!success && hasVoted && (
        <div className="glass-card rounded-2xl p-5 border border-blue-500/20 bg-blue-500/5 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Anda sudah memberikan suara. Lihat hasilnya di Real Count.</p>
        </div>
      )}

      {/* Not open */}
      {!isSessionOpen && !hasVoted && (
        <div className="glass-card rounded-2xl p-5 border border-amber-500/20 bg-amber-500/5 flex items-center gap-3">
          <Clock className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <p className="text-sm text-amber-400">Sesi voting belum dibuka atau sudah ditutup.</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="glass-card rounded-2xl p-4 border border-red-500/20 bg-red-500/5 flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Candidates */}
      <div className="grid md:grid-cols-2 gap-5">
        {candidates.map((c, idx) => {
          const grad = GRADIENTS[idx % GRADIENTS.length]
          const isSelected = selectedId === c.id
          const isMyVote = myVoteCandidateId === c.id
          const canSelect = isSessionOpen && !hasVoted && !success
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => canSelect && setSelectedId(c.id)}
              disabled={!canSelect}
              className={`glass-card rounded-2xl overflow-hidden text-left transition-all w-full ${canSelect ? 'cursor-pointer hover:-translate-y-0.5 hover:border-white/25' : 'cursor-default'} ${isSelected ? 'ring-2 ring-blue-500/50' : ''} ${isMyVote ? 'ring-2 ring-green-500/50' : ''}`}
            >
              <div className={`h-1.5 bg-gradient-to-r ${grad}`} />
              <div className="p-5">
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative flex-shrink-0">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center text-xl font-bold text-white shadow-lg overflow-hidden`}>
                      {(c.user.avatar || c.photo) ? <img src={c.photo || c.user.avatar!} alt={c.user.name} className="w-full h-full object-cover" /> : c.user.name.charAt(0)}
                    </div>
                    <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br ${grad} border-2 flex items-center justify-center text-white text-xs font-bold`} style={{ borderColor: 'var(--glass-bg)' }}>
                      {c.number}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>{c.user.name}</h3>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{c.user.kelas}</p>
                  </div>
                  {(isSelected || isMyVote) && (
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${isMyVote ? 'bg-green-500' : 'bg-blue-500'}`}>
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <p className="text-xs leading-relaxed line-clamp-3" style={{ color: 'var(--text-muted)' }}>{c.visiMisi}</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Submit button */}
      {isSessionOpen && !hasVoted && !success && (
        <button
          onClick={handleVote}
          disabled={!selectedId || submitting}
          className={`w-full py-3.5 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 shadow-lg ${selectedId ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:opacity-90 hover:-translate-y-0.5' : 'opacity-40 cursor-not-allowed'}`}
          style={!selectedId ? { background: 'var(--subtle-bg)', color: 'var(--text-faint)', border: '1px solid var(--subtle-border)' } : {}}
        >
          {submitting ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Menyimpan...</> :
            <><Trophy className="w-4 h-4" /> {selectedId ? `Pilih Kandidat #${candidates.find(c=>c.id===selectedId)?.number}` : 'Pilih Satu Kandidat'}</>}
        </button>
      )}
    </div>
  )
}
