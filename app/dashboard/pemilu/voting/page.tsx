'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Vote, CheckCircle, Clock, AlertCircle, Trophy, Check } from 'lucide-react'

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
    } catch { }
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

  if (loading) return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-4">
      <div className="h-6 w-48 rounded-md bg-muted animate-pulse" />
      <div className="grid md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="surface-card rounded-xl h-52 animate-pulse bg-muted" />
        ))}
      </div>
    </div>
  )

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-border">
        <span className="academic-badge mb-2">Bilik Suara Digital</span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Pemungutan Suara OSIS</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Gunakan hak suaramu secara bijak. Setiap akun siswa hanya dapat memilih 1 kali.
        </p>
      </div>

      {/* Session status banner */}
      {session && (
        <div className={`surface-card p-4 rounded-xl flex items-center justify-between gap-4 border ${
          isSessionOpen ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-border bg-muted/30'
        }`}>
          <div className="flex items-center gap-3">
            <span className={`w-2.5 h-2.5 rounded-full ${isSessionOpen ? 'bg-emerald-500' : 'bg-muted-foreground'}`} />
            <div>
              <p className="text-xs sm:text-sm font-bold text-foreground">
                {isSessionOpen ? 'Sesi Pemungutan Suara Sedang Berlangsung' : `Sesi Pemilihan ${session.status === 'CLOSED' ? 'Telah Berakhir' : 'Belum Dibuka'}`}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Periode: {new Date(session.startTime).toLocaleString('id-ID')} sampai {new Date(session.endTime).toLocaleString('id-ID')}
              </p>
            </div>
          </div>
          {isSessionOpen && (
            <div className="text-right shrink-0">
              <span className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {session.votedCount} / {session.totalVoters}
              </span>
              <p className="text-[10px] text-muted-foreground">Suara terhimpun</p>
            </div>
          )}
        </div>
      )}

      {/* Success Notification */}
      {success && (
        <div className="surface-card rounded-xl p-6 text-center border border-emerald-500/30 bg-emerald-500/5 space-y-2">
          <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-xs">
            <Check className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-foreground">Hak Suara Anda Berhasil Disimpan</h2>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Terima kasih telah berpartisipasi dalam demokrasi sekolah. Rekapitulasi suara dapat dipantau di halaman Real Count.
          </p>
        </div>
      )}

      {/* Already Voted Info */}
      {hasVoted && !success && (
        <div className="surface-card rounded-xl p-4 border border-border bg-muted/40 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div>
            <p className="text-xs sm:text-sm font-bold text-foreground">Anda Sudah Menggunakan Hak Suara</p>
            <p className="text-[11px] text-muted-foreground">Setiap siswa dibatasi satu kali voting untuk menjaga integritas pemilihan.</p>
          </div>
        </div>
      )}

      {/* Session closed warning */}
      {!isSessionOpen && (
        <div className="surface-card rounded-xl p-4 border border-border bg-muted/40 flex items-center gap-3">
          <Clock className="w-5 h-5 text-muted-foreground shrink-0" />
          <p className="text-xs text-muted-foreground">Bilik suara saat ini belum aktif atau telah ditutup oleh panitia pemilu.</p>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="surface-card rounded-xl p-4 border border-destructive/30 bg-destructive/5 flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
          <p className="text-xs text-destructive">{error}</p>
        </div>
      )}

      {/* Candidates List */}
      <div className="grid md:grid-cols-2 gap-4">
        {candidates.map((c) => {
          const isSelected = selectedId === c.id
          const isMyVote = myVoteCandidateId === c.id
          const canSelect = isSessionOpen && !hasVoted && !success

          return (
            <button
              key={c.id}
              type="button"
              onClick={() => canSelect && setSelectedId(c.id)}
              disabled={!canSelect}
              className={`surface-card rounded-xl p-5 text-left transition-all w-full relative ${
                canSelect ? 'cursor-pointer hover:border-primary/50' : 'cursor-default'
              } ${
                isSelected
                  ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
                  : isMyVote
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-500/5'
                  : 'border-border'
              }`}
            >
              <div className="flex items-start gap-4 mb-3">
                {/* Number Badge and Photo */}
                <div className="relative shrink-0">
                  <div className="w-14 h-14 rounded-xl bg-secondary text-secondary-foreground border border-border flex items-center justify-center font-bold text-base overflow-hidden">
                    {(c.user.avatar || c.photo) ? (
                      <img src={c.photo || c.user.avatar!} alt={c.user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{c.user.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-md bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shadow-xs">
                    {c.number}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-foreground truncate">{c.user.name}</h3>
                  <p className="text-xs text-muted-foreground">Kelas: {c.user.kelas || '-'}</p>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-primary mt-1 inline-block">
                    Paslon Nomor Urut {c.number}
                  </span>
                </div>

                {(isSelected || isMyVote) && (
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    isMyVote ? 'bg-emerald-500 text-white' : 'bg-primary text-primary-foreground'
                  }`}>
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-border">
                <p className="text-[11px] font-semibold text-foreground uppercase tracking-wider mb-1">Visi & Misi:</p>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {c.visiMisi || 'Belum mencantumkan visi misi.'}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Submit Button */}
      {isSessionOpen && !hasVoted && !success && (
        <button
          onClick={handleVote}
          disabled={!selectedId || submitting}
          className={`w-full py-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs ${
            selectedId
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-muted text-muted-foreground border border-border cursor-not-allowed opacity-60'
          }`}
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              <span>Menyimpan pilihan suara...</span>
            </>
          ) : (
            <>
              <Vote className="w-4 h-4" />
              <span>
                {selectedId
                  ? `Konfirmasi Pilihan untuk Paslon #${candidates.find(c => c.id === selectedId)?.number}`
                  : 'Pilih salah satu kandidat di atas'}
              </span>
            </>
          )}
        </button>
      )}
    </div>
  )
}
