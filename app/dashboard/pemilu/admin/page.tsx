'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Vote, Play, Square, Trophy, Plus, RefreshCw, Edit3, Trash2 } from 'lucide-react'
import { Modal, ConfirmDialog, FormField, Input, Select, SubmitButton } from '@/components/ui/crud'

interface Candidate { id: string; number: number; votes: number; visiMisi: string; campaignVideo: string | null; user: { name: string; kelas: string | null } }
interface VotingSession { id: string; status: string; startTime: string; endTime: string; totalVoters: number; votedCount: number; event: { name: string } }

const SESS_STATUS: Record<string, { label: string; color: string; bg: string; border: string }> = {
  OPEN:   { label: 'Berlangsung', color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20' },
  CLOSED: { label: 'Ditutup',     color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20' },
  DRAFT:  { label: 'Draft',       color: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/20' },
}

const EMPTY_CAND = { userId: '', number: 1, visiMisi: '', campaignVideo: '' }

export default function VotingAdminPage() {
  const { currentUser } = useAuth()
  const isAdmin = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'PANITIA'

  const [session, setSession] = useState<VotingSession | null>(null)
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [users, setUsers] = useState<{ id: string; name: string; kelas: string | null }[]>([])
  const [loading, setLoading] = useState(true)
  const [actioning, setActioning] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const [showSessionModal, setShowSessionModal] = useState(false)
  const [showCandModal, setShowCandModal]       = useState(false)
  const [editCand, setEditCand]                 = useState<Candidate | null>(null)
  const [deleteCand, setDeleteCand]             = useState<Candidate | null>(null)
  const [confirmSession, setConfirmSession]     = useState<'open' | 'close' | null>(null)
  const [sessForm, setSessForm] = useState({ totalVoters: '450', startTime: '', endTime: '', eventId: '' })
  const [candForm, setCandForm] = useState(EMPTY_CAND)
  const [events, setEvents] = useState<{ id: string; name: string }[]>([])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [sr, cr, ur, er] = await Promise.all([
        fetch('/api/voting/session', { credentials: 'include' }),
        fetch('/api/candidates', { credentials: 'include' }),
        fetch('/api/users', { credentials: 'include' }),
        fetch('/api/events', { credentials: 'include' }),
      ])
      const sj = await sr.json(); if (sj.success) setSession(sj.data)
      const cj = await cr.json(); if (cj.success) setCandidates(cj.data)
      const uj = await ur.json(); if (uj.success) setUsers(uj.data)
      const ej = await er.json(); if (ej.success) setEvents(ej.data)
    } catch { }
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  if (!isAdmin) {
    return (
      <div className="p-6 max-w-xl mx-auto mt-10">
        <div className="glass-card rounded-2xl p-16 text-center">
          <Vote className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-faint)' }} />
          <p className="font-medium" style={{ color: 'var(--text-muted)' }}>Halaman ini hanya untuk Admin/Panitia</p>
        </div>
      </div>
    )
  }

  const handleSessionAction = async (action: 'open' | 'close') => {
    setActioning(true)
    try {
      const res = await fetch('/api/voting/session', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ action }),
      })
      const json = await res.json()
      if (json.success) { setConfirmSession(null); fetchData() }
    } catch { }
    setActioning(false)
  }

  const handleCreateSession = async (ev: React.FormEvent) => {
    ev.preventDefault(); setError('')
    if (!sessForm.startTime || !sessForm.endTime || !sessForm.eventId) { setError('Semua field wajib diisi'); return }
    setSaving(true)
    try {
      const res = await fetch('/api/voting/session', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ ...sessForm, totalVoters: parseInt(sessForm.totalVoters) || 450 }),
      })
      const json = await res.json()
      if (json.success) { setShowSessionModal(false); fetchData() }
      else setError(json.error || 'Gagal membuat sesi')
    } catch { setError('Gagal terhubung ke server') }
    setSaving(false)
  }

  const openCreateCand = () => {
    setEditCand(null)
    setCandForm({ ...EMPTY_CAND, number: (candidates.length + 1) })
    setError(''); setShowCandModal(true)
  }
  const openEditCand = (c: Candidate) => {
    setEditCand(c)
    setCandForm({ userId: '', number: c.number, visiMisi: c.visiMisi, campaignVideo: c.campaignVideo || '' })
    setError(''); setShowCandModal(true)
  }

  const handleSaveCand = async (ev: React.FormEvent) => {
    ev.preventDefault(); setError('')
    if (!editCand && !candForm.userId) { setError('Pilih user terlebih dahulu'); return }
    if (!candForm.visiMisi) { setError('Visi misi wajib diisi'); return }
    setSaving(true)
    try {
      const url    = editCand ? `/api/candidates/${editCand.id}` : '/api/candidates'
      const method = editCand ? 'PUT' : 'POST'
      const body   = editCand
        ? { visiMisi: candForm.visiMisi, campaignVideo: candForm.campaignVideo || null, number: candForm.number }
        : { userId: candForm.userId, visiMisi: candForm.visiMisi, campaignVideo: candForm.campaignVideo || null, number: candForm.number }
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(body) })
      const json = await res.json()
      if (json.success) { setShowCandModal(false); fetchData() }
      else setError(json.error || 'Gagal menyimpan kandidat')
    } catch { setError('Gagal terhubung ke server') }
    setSaving(false)
  }

  const handleDeleteCand = async () => {
    if (!deleteCand) return; setDeleting(true)
    try {
      await fetch(`/api/candidates/${deleteCand.id}`, { method: 'DELETE', credentials: 'include' })
      setDeleteCand(null); fetchData()
    } catch { }
    setDeleting(false)
  }

  const sf = (k: string) => (v: string) => setSessForm(p => ({ ...p, [k]: v }))
  const cf = (k: string) => (v: string) => setCandForm(p => ({ ...p, [k]: v }))
  const userOpts  = users.map(u => ({ value: u.id, label: `${u.name}${u.kelas ? ` (${u.kelas})` : ''}` }))
  const eventOpts = events.map(e => ({ value: e.id, label: e.name }))
  const pct = session ? Math.round((session.votedCount / Math.max(session.totalVoters, 1)) * 100) : 0

  const GRADIENTS = ['from-blue-500 to-cyan-500','from-violet-500 to-purple-500','from-pink-500 to-rose-500','from-amber-500 to-orange-500']

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1"><Vote className="w-4 h-4 text-violet-400" /><span className="text-xs text-violet-400 font-medium uppercase tracking-wider">Pemilu Admin</span></div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Kelola Pemilu</h1>
        </div>
        <button onClick={fetchData} className="px-3 py-2 rounded-xl text-xs transition" style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)', color: 'var(--text-muted)' }}>
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Voting Session Card */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-violet-500 to-pink-500" />
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Vote className="w-4 h-4 text-violet-400" />
              <h2 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Sesi Voting</h2>
            </div>
            {!session && (
              <button onClick={() => { setSessForm({ totalVoters: '450', startTime: '', endTime: '', eventId: events[0]?.id || '' }); setError(''); setShowSessionModal(true) }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-pink-600 hover:opacity-90 transition">
                <Plus className="w-3.5 h-3.5" /> Buat Sesi Voting
              </button>
            )}
          </div>

          {loading ? (
            <div className="h-20 animate-pulse rounded-xl" style={{ background: 'var(--subtle-bg)' }} />
          ) : !session ? (
            <div className="text-center py-8">
              <p className="text-sm" style={{ color: 'var(--text-faint)' }}>Belum ada sesi voting. Buat sesi terlebih dahulu.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                {(() => { const s = SESS_STATUS[session.status] || SESS_STATUS.DRAFT; return <span className={`px-3 py-1 rounded-xl text-xs font-bold ${s.bg} ${s.color} border ${s.border}`}>{s.label}</span> })()}
                <span className="text-xs" style={{ color: 'var(--text-faint)' }}>{session.event?.name}</span>
                <span className="text-xs" style={{ color: 'var(--text-faint)' }}>Mulai: {new Date(session.startTime).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                <span className="text-xs" style={{ color: 'var(--text-faint)' }}>Selesai: {new Date(session.endTime).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  <span>Partisipasi: {session.votedCount}/{session.totalVoters} pemilih</span>
                  <span className="font-bold text-violet-400">{pct}%</span>
                </div>
                <div className="h-2 rounded-full" style={{ background: 'var(--subtle-bg)' }}>
                  <div className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 transition-all duration-700" style={{ width: `${pct}%` }} />
                </div>
              </div>
              <div className="flex gap-2">
                {session.status !== 'OPEN' && (
                  <button onClick={() => setConfirmSession('open')}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90 transition">
                    <Play className="w-4 h-4" /> Buka Voting
                  </button>
                )}
                {session.status === 'OPEN' && (
                  <button onClick={() => setConfirmSession('close')}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:opacity-90 transition">
                    <Square className="w-4 h-4" /> Tutup Voting
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Candidates Management */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--subtle-border)' }}>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h2 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Kandidat ({candidates.length})</h2>
          </div>
          <button onClick={openCreateCand}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 transition">
            <Plus className="w-3.5 h-3.5" /> Tambah Kandidat
          </button>
        </div>
        <div>
          {loading ? (
            <div className="divide-y" style={{ borderColor: 'var(--subtle-border)' }}>
              {[1,2,3].map(i => <div key={i} className="px-5 py-4 flex items-center gap-4 animate-pulse"><div className="w-12 h-12 rounded-xl" style={{ background: 'var(--subtle-bg)' }} /><div className="flex-1 space-y-2"><div className="h-3 rounded w-32" style={{ background: 'var(--subtle-bg)' }} /><div className="h-2.5 rounded w-48" style={{ background: 'var(--subtle-bg)' }} /></div></div>)}
            </div>
          ) : candidates.length === 0 ? (
            <div className="px-5 py-12 text-center"><p className="text-sm" style={{ color: 'var(--text-faint)' }}>Belum ada kandidat</p></div>
          ) : (
            candidates.map((c, idx) => {
              const grad = GRADIENTS[idx % GRADIENTS.length]
              return (
                <div key={c.id} className="px-5 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition group" style={{ borderBottom: '1px solid var(--subtle-border)' }}>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow`}>#{c.number}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{c.user.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-faint)' }}>{c.user.kelas} · {c.votes} suara</p>
                    <p className="text-xs mt-0.5 line-clamp-1" style={{ color: 'var(--text-muted)' }}>{c.visiMisi}</p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition flex-shrink-0">
                    <button onClick={() => openEditCand(c)} className="p-2 rounded-xl hover:bg-white/5 transition" style={{ color: 'var(--text-muted)' }}><Edit3 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setDeleteCand(c)} className="p-2 rounded-xl hover:bg-red-500/10 transition text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Session Modal */}
      <Modal isOpen={showSessionModal} onClose={() => setShowSessionModal(false)} title="Buat Sesi Voting">
        <form onSubmit={handleCreateSession} className="space-y-4">
          <FormField label="Event" required>
            <Select value={sessForm.eventId} onChange={e => sf('eventId')(e.target.value)} options={eventOpts} placeholder="Pilih event..." />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Waktu Mulai" required>
              <Input type="datetime-local" value={sessForm.startTime} onChange={e => sf('startTime')(e.target.value)} required />
            </FormField>
            <FormField label="Waktu Selesai" required>
              <Input type="datetime-local" value={sessForm.endTime} onChange={e => sf('endTime')(e.target.value)} required />
            </FormField>
          </div>
          <FormField label="Total Pemilih" hint="Jumlah siswa yang berhak memilih">
            <Input type="number" value={sessForm.totalVoters} onChange={e => sf('totalVoters')(e.target.value)} min="1" />
          </FormField>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <SubmitButton loading={saving} label="Buat Sesi Voting" />
        </form>
      </Modal>

      {/* Candidate Modal */}
      <Modal isOpen={showCandModal} onClose={() => setShowCandModal(false)} title={editCand ? `Edit Kandidat #${editCand.number}` : 'Tambah Kandidat'}>
        <form onSubmit={handleSaveCand} className="space-y-4">
          {!editCand && (
            <FormField label="Pilih Siswa" required>
              <Select value={candForm.userId} onChange={e => cf('userId')(e.target.value)} options={userOpts} placeholder="Pilih user..." />
            </FormField>
          )}
          <FormField label="Nomor Urut" required>
            <Input type="number" min="1" value={String(candForm.number)} onChange={e => cf('number')(e.target.value)} />
          </FormField>
          <FormField label="Visi & Misi" required>
            <textarea rows={4} value={candForm.visiMisi} onChange={e => cf('visiMisi')(e.target.value)}
              placeholder="Tuliskan visi misi kandidat..."
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition focus:ring-2 focus:ring-blue-500/40 resize-none"
              style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)', color: 'var(--text-primary)' }} />
          </FormField>
          <FormField label="Video Kampanye" hint="URL video YouTube (opsional)">
            <Input value={candForm.campaignVideo} onChange={e => cf('campaignVideo')(e.target.value)} placeholder="https://youtube.com/..." />
          </FormField>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <SubmitButton loading={saving} label={editCand ? 'Simpan Perubahan' : 'Tambah Kandidat'} />
        </form>
      </Modal>

      {/* Confirm Session Toggle */}
      <ConfirmDialog
        isOpen={!!confirmSession}
        onClose={() => setConfirmSession(null)}
        onConfirm={() => handleSessionAction(confirmSession!)}
        loading={actioning}
        danger={confirmSession === 'close'}
        title={confirmSession === 'open' ? 'Buka Sesi Voting' : 'Tutup Sesi Voting'}
        message={confirmSession === 'open' ? 'Siswa akan dapat mulai memberikan suara mereka. Lanjutkan?' : 'Sesi voting akan ditutup dan tidak ada lagi suara yang bisa masuk. Lanjutkan?'}
        confirmLabel={confirmSession === 'open' ? 'Ya, Buka Voting' : 'Ya, Tutup Voting'}
      />

      <ConfirmDialog isOpen={!!deleteCand} onClose={() => setDeleteCand(null)} onConfirm={handleDeleteCand} loading={deleting}
        title="Hapus Kandidat" message={`Hapus kandidat ${deleteCand?.user?.name}? Semua suara untuk kandidat ini juga akan dihapus.`} />
    </div>
  )
}
