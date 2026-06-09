'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import {
  Trophy, ArrowLeft, Plus, Trash2, Users,
  CheckCircle, Calendar, Clock, MapPin, AlertCircle,
  Dumbbell, Mic2, Palette, LucideIcon,
} from 'lucide-react'
import Link from 'next/link'

interface Competition {
  id: string; name: string; category: string; date: string
  time: string; location: string; event: { name: string }
  _count: { teams: number }
}

const CAT_COLOR: Record<string, string> = {
  OLAHRAGA: 'from-blue-500 to-cyan-500',
  AKADEMIK:  'from-violet-500 to-purple-500',
  SENI:      'from-amber-500 to-yellow-500',
}
const CAT_ICON: Record<string, LucideIcon> = { OLAHRAGA: Dumbbell, AKADEMIK: Mic2, SENI: Palette }

const KELAS_LIST = [
  'X IPA 1','X IPA 2','X IPA 3','X IPS 1','X IPS 2',
  'XI IPA 1','XI IPA 2','XI IPA 3','XI IPS 1','XI IPS 2',
  'XII IPA 1','XII IPA 2','XII IPA 3','XII IPS 1','XII IPS 2',
]

export default function RegisterTeamPage() {
  const params  = useParams()
  const router  = useRouter()
  const { currentUser } = useAuth()
  const id = params?.id as string

  const [comp, setComp] = useState<Competition | null>(null)
  const [loadingComp, setLoadingComp] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [teamName, setTeamName] = useState('')
  const [kelas, setKelas] = useState(currentUser?.kelas ?? '')
  const [members, setMembers] = useState<string[]>([''])
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Fetch competition data from API
  useEffect(() => {
    const fetchComp = async () => {
      setLoadingComp(true)
      try {
        const res = await fetch(`/api/competitions/${id}`, { credentials: 'include' })
        if (res.status === 404) { setNotFound(true); setLoadingComp(false); return }
        const json = await res.json()
        if (json.success) {
          setComp(json.data)
          setTeamName(`Tim ${json.data.name} ${currentUser?.kelas ?? ''}`)
        } else { setNotFound(true) }
      } catch { setNotFound(true) }
      setLoadingComp(false)
    }
    if (id) fetchComp()
  }, [id, currentUser?.kelas])

  // Member helpers
  const addMember    = () => setMembers(m => [...m, ''])
  const removeMember = (i: number) => setMembers(m => m.filter((_, idx) => idx !== i))
  const updateMember = (i: number, v: string) => setMembers(m => m.map((x, idx) => idx === i ? v : x))

  const filledMembers = members.filter(m => m.trim())
  const canSubmit = teamName.trim() && kelas && filledMembers.length >= 1

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit || !comp) return
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: teamName,
          kelas,
          competitionId: comp.id,
          members: filledMembers.map(name => ({ name })),
        }),
      })
      const json = await res.json()
      if (json.success) { setSubmitted(true) }
      else setError(json.error || 'Gagal mendaftarkan tim')
    } catch { setError('Gagal terhubung ke server') }
    setLoading(false)
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loadingComp) return (
    <div className="p-6 max-w-2xl mx-auto space-y-4 mt-8">
      {[1,2,3].map(i => <div key={i} className="glass-card rounded-2xl h-20 animate-pulse" style={{ background: 'var(--subtle-bg)' }} />)}
    </div>
  )

  // ── 404 guard ────────────────────────────────────────────────────────────
  if (notFound || !comp) return (
    <div className="p-6 max-w-xl mx-auto text-center space-y-4 mt-16">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center mx-auto">
        <Trophy className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Kompetisi tidak ditemukan</h1>
      <Link href="/dashboard/classmeeting/competitions">
        <button className="mt-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:opacity-90 transition">
          Kembali ke Daftar Kompetisi
        </button>
      </Link>
    </div>
  )

  const color = CAT_COLOR[comp.category] || 'from-blue-500 to-violet-500'
  const CatIcon = CAT_ICON[comp.category] || Trophy

  // ── Success screen ───────────────────────────────────────────────────────
  if (submitted) return (
    <div className="p-6 max-w-xl mx-auto mt-10 animate-fade-in-up">
      <div className="glass-card rounded-3xl p-8 text-center space-y-4">
        <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-xl`}>
          <CatIcon className="w-10 h-10 text-white" />
        </div>
        <div className="w-14 h-14 mx-auto rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center -mt-8 relative z-10">
          <CheckCircle className="w-7 h-7 text-green-400" />
        </div>
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Pendaftaran Berhasil!</h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Tim <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>{teamName}</span> telah
          didaftarkan untuk <strong>{comp.name}</strong>. Panitia akan memverifikasi pendaftaran Anda.
        </p>
        <div className="p-4 rounded-2xl text-left space-y-2" style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)' }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>Anggota tim</p>
          {filledMembers.map((m, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0`}>{i+1}</span>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{m}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-3 pt-2">
          <Link href="/dashboard/classmeeting/my-teams" className="flex-1">
            <button className="w-full py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:opacity-90 transition">Lihat Tim Saya</button>
          </Link>
          <Link href="/dashboard/classmeeting/competitions" className="flex-1">
            <button className="w-full py-2.5 rounded-xl text-sm font-medium transition" style={{ background: 'var(--subtle-bg)', color: 'var(--text-muted)', border: '1px solid var(--subtle-border)' }}>Kompetisi Lain</button>
          </Link>
        </div>
      </div>
    </div>
  )

  // ── Main form ─────────────────────────────────────────────────────────────
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6 animate-fade-in-up">
      <Link href="/dashboard/classmeeting/competitions" className="inline-flex items-center gap-2 text-sm transition hover:opacity-80" style={{ color: 'var(--text-muted)' }}>
        <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Kompetisi
      </Link>

      {/* Header card */}
      <div className="glass-card rounded-3xl overflow-hidden">
        <div className={`h-2 bg-gradient-to-r ${color}`} />
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg flex-shrink-0`}>
              <CatIcon className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1"><Trophy className="w-3.5 h-3.5 text-amber-400" /><span className="text-xs text-amber-400 font-medium uppercase tracking-wider">Daftar Tim</span></div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{comp.name}</h1>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}><Calendar className="w-3 h-3" />{new Date(comp.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}><Clock className="w-3 h-3" />{comp.time} WIB</span>
                <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}><MapPin className="w-3 h-3" />{comp.location}</span>
                <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}><Users className="w-3 h-3" />{comp._count.teams} tim terdaftar</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nama tim + kelas */}
        <div className="glass-card rounded-2xl p-5 space-y-4">
          <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Informasi Tim</p>
          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Nama Tim *</label>
            <input type="text" value={teamName} onChange={e => setTeamName(e.target.value)} placeholder="cth. Tim Futsal XII IPA 1"
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition focus:ring-2 focus:ring-blue-500/40"
              style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)', color: 'var(--text-primary)' }} required />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Kelas *</label>
            <select value={kelas} onChange={e => setKelas(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition focus:ring-2 focus:ring-blue-500/40 appearance-none cursor-pointer"
              style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)', color: kelas ? 'var(--text-primary)' : 'var(--text-faint)' }} required>
              <option value="">Pilih kelas...</option>
              {KELAS_LIST.map(k => <option key={k} value={k} style={{ background: 'hsl(222,47%,9%)' }}>{k}</option>)}
            </select>
          </div>
        </div>

        {/* Anggota */}
        <div className="glass-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Anggota Tim</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-faint)' }}>Minimal 1 anggota</p>
            </div>
            <span className={`px-3 py-1 rounded-xl text-xs font-bold ${filledMembers.length >= 1 ? 'bg-green-500/15 text-green-400 border border-green-500/25' : 'bg-amber-500/15 text-amber-400 border border-amber-500/25'}`}>
              {filledMembers.length} anggota
            </span>
          </div>
          <div className="space-y-2.5">
            {members.map((member, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0 bg-gradient-to-br ${color}`}>{i+1}</span>
                <input type="text" value={member} onChange={e => updateMember(i, e.target.value)} placeholder={`Nama anggota ${i+1}`}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none transition focus:ring-2 focus:ring-blue-500/40"
                  style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)', color: 'var(--text-primary)' }} />
                {members.length > 1 && (
                  <button type="button" onClick={() => removeMember(i)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-500/15 border border-red-500/20 transition flex-shrink-0">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={addMember}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition border-dashed border hover:opacity-80"
            style={{ borderColor: 'var(--subtle-border)', color: 'var(--text-muted)' }}>
            <Plus className="w-4 h-4" /> Tambah Anggota
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 px-4 py-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-red-400">{error}</p>
          </div>
        )}

        {/* Validation hint */}
        {!canSubmit && (filledMembers.length > 0 || teamName.trim()) && !error && (
          <div className="flex items-start gap-2 px-4 py-3 rounded-xl" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-400">
              {!teamName.trim() ? 'Isi nama tim terlebih dahulu.' : !kelas ? 'Pilih kelas terlebih dahulu.' : 'Isi minimal 1 nama anggota.'}
            </p>
          </div>
        )}

        {/* Submit */}
        <button type="submit" disabled={!canSubmit || loading}
          className={`w-full py-3.5 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 shadow-lg ${canSubmit && !loading ? `bg-gradient-to-r ${color} text-white hover:opacity-90 hover:shadow-xl hover:-translate-y-0.5` : 'opacity-40 cursor-not-allowed'}`}
          style={canSubmit && !loading ? {} : { background: 'var(--subtle-bg)', color: 'var(--text-faint)', border: '1px solid var(--subtle-border)' }}>
          {loading ? (
            <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>Mendaftarkan...</>
          ) : (
            <><Trophy className="w-4 h-4" />Daftarkan Tim</>
          )}
        </button>
      </form>
    </div>
  )
}
