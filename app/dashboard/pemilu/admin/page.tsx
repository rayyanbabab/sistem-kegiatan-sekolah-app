'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Vote, Play, Square, Trophy, Plus, RefreshCw, Edit3, Trash2, Search, ExternalLink, Users, Calendar, AlertCircle } from 'lucide-react'
import { Modal, ConfirmDialog, FormField, Input, Select, Textarea, SubmitButton } from '@/components/ui/crud'

interface Candidate {
  id: string
  number: number
  votes: number
  visiMisi: string
  campaignVideo: string | null
  user: { name: string; kelas: string | null }
}

interface VotingSession {
  id: string
  status: string
  startTime: string
  endTime: string
  totalVoters: number
  votedCount: number
  event: { name: string }
}

const EMPTY_CAND = { userId: '', number: 1, visiMisi: '', campaignVideo: '', eventId: '' }

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
  const [searchCand, setSearchCand] = useState('')

  const [showSessionModal, setShowSessionModal] = useState(false)
  const [showCandModal, setShowCandModal] = useState(false)
  const [editCand, setEditCand] = useState<Candidate | null>(null)
  const [deleteCand, setDeleteCand] = useState<Candidate | null>(null)
  const [confirmSession, setConfirmSession] = useState<'open' | 'close' | null>(null)
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
        <div className="surface-card rounded-xl p-12 text-center border border-border">
          <Vote className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
          <h2 className="text-base font-bold text-foreground">Akses Dibatasi</h2>
          <p className="text-xs text-muted-foreground mt-1">Halaman ini hanya dapat diakses oleh Panitia Pemilu dan Super Admin.</p>
        </div>
      </div>
    )
  }

  const handleSessionAction = async (action: 'open' | 'close') => {
    setActioning(true)
    try {
      const res = await fetch('/api/voting/session', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action }),
      })
      const json = await res.json()
      if (json.success) { setConfirmSession(null); fetchData() }
    } catch { }
    setActioning(false)
  }

  const handleCreateSession = async (ev: React.FormEvent) => {
    ev.preventDefault()
    setError('')
    if (!sessForm.startTime || !sessForm.endTime || !sessForm.eventId) {
      setError('Semua field wajib diisi')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/voting/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
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
    const defaultEventId = session?.event ? events.find(e => e.name === session.event.name)?.id || events[0]?.id || '' : events[0]?.id || ''
    setCandForm({ ...EMPTY_CAND, number: (candidates.length + 1), eventId: defaultEventId })
    setError('')
    setShowCandModal(true)
  }

  const openEditCand = (c: Candidate) => {
    setEditCand(c)
    setCandForm({ userId: '', number: c.number, visiMisi: c.visiMisi, campaignVideo: c.campaignVideo || '', eventId: '' })
    setError('')
    setShowCandModal(true)
  }

  const handleSaveCand = async (ev: React.FormEvent) => {
    ev.preventDefault()
    setError('')
    if (!editCand && !candForm.userId) { setError('Pilih siswa kandidat terlebih dahulu'); return }
    if (!candForm.visiMisi) { setError('Visi dan misi wajib diisi'); return }
    setSaving(true)
    try {
      const url = editCand ? `/api/candidates/${editCand.id}` : '/api/candidates'
      const method = editCand ? 'PUT' : 'POST'
      const body = editCand
        ? { visiMisi: candForm.visiMisi, campaignVideo: candForm.campaignVideo || null, number: Number(candForm.number) }
        : { userId: candForm.userId, visiMisi: candForm.visiMisi, campaignVideo: candForm.campaignVideo || null, number: Number(candForm.number), eventId: candForm.eventId }
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(body) })
      const json = await res.json()
      if (json.success) { setShowCandModal(false); fetchData() }
      else setError(json.error || 'Gagal menyimpan kandidat')
    } catch { setError('Gagal terhubung ke server') }
    setSaving(false)
  }

  const handleDeleteCand = async () => {
    if (!deleteCand) return
    setDeleting(true)
    try {
      await fetch(`/api/candidates/${deleteCand.id}`, { method: 'DELETE', credentials: 'include' })
      setDeleteCand(null)
      fetchData()
    } catch { }
    setDeleting(false)
  }

  const sf = (k: string) => (v: string) => setSessForm(p => ({ ...p, [k]: v }))
  const cf = (k: string) => (v: string) => setCandForm(p => ({ ...p, [k]: v }))
  const userOpts = users.map(u => ({ value: u.id, label: `${u.name}${u.kelas ? ` (${u.kelas})` : ''}` }))
  const eventOpts = events.map(e => ({ value: e.id, label: e.name }))
  const pct = session ? Math.round((session.votedCount / Math.max(session.totalVoters, 1)) * 100) : 0

  const filteredCandidates = candidates.filter(c =>
    c.user.name.toLowerCase().includes(searchCand.toLowerCase()) ||
    (c.user.kelas && c.user.kelas.toLowerCase().includes(searchCand.toLowerCase()))
  )

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-4">
        <div>
          <span className="academic-badge mb-2">Panel Administrator</span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Kelola Pemilu OSIS
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Konfigurasi sesi bilik suara, kelola data paslon kandidat, dan pantau pemungutan suara.
          </p>
        </div>
        <button
          onClick={fetchData}
          className="self-start sm:self-auto flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Perbarui Data</span>
        </button>
      </div>

      {/* Sesi Voting Card */}
      <div className="surface-card rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Vote className="w-4 h-4 text-primary" />
            <h2 className="font-bold text-sm text-foreground">Status Sesi Pemilihan</h2>
          </div>
          {!session && (
            <button
              onClick={() => {
                setSessForm({ totalVoters: '450', startTime: '', endTime: '', eventId: events[0]?.id || '' })
                setError('')
                setShowSessionModal(true)
              }}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buat Sesi Voting</span>
            </button>
          )}
        </div>

        <div className="p-5 sm:p-6">
          {loading ? (
            <div className="h-24 animate-pulse rounded-lg bg-muted" />
          ) : !session ? (
            <div className="text-center py-8 border border-dashed border-border rounded-lg">
              <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-semibold text-foreground">Belum Ada Sesi Pemilihan Aktif</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Buat sesi voting untuk menentukan jadwal dan batas kuota hak suara pemilih.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                    session.status === 'OPEN'
                      ? 'chip-active'
                      : session.status === 'CLOSED'
                      ? 'chip-ended'
                      : 'chip-upcoming'
                  }`}>
                    {session.status === 'OPEN' ? 'Bilik Suara Dibuka' : session.status === 'CLOSED' ? 'Pemilihan Ditutup' : 'Draft / Terjadwal'}
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {session.event?.name}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {session.status !== 'OPEN' ? (
                    <button
                      onClick={() => setConfirmSession('open')}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Buka Bilik Suara</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setConfirmSession('close')}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors shadow-xs"
                    >
                      <Square className="w-3.5 h-3.5" />
                      <span>Tutup Pemilihan</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Progress & Metadata */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-3.5 rounded-lg bg-muted/40 border border-border">
                  <p className="text-xs text-muted-foreground">Jadwal Mulai</p>
                  <p className="text-sm font-semibold text-foreground mt-1">
                    {new Date(session.startTime).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="p-3.5 rounded-lg bg-muted/40 border border-border">
                  <p className="text-xs text-muted-foreground">Batas Akhir</p>
                  <p className="text-sm font-semibold text-foreground mt-1">
                    {new Date(session.endTime).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="p-3.5 rounded-lg bg-muted/40 border border-border">
                  <p className="text-xs text-muted-foreground">Suara Masuk / Kuota</p>
                  <p className="text-sm font-semibold text-foreground mt-1">
                    {session.votedCount} / {session.totalVoters} Pemilih ({pct}%)
                  </p>
                </div>
              </div>

              {/* Participation Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Tingkat Partisipasi Pemilih</span>
                  <span className="font-semibold text-foreground">{pct}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-muted overflow-hidden border border-border">
                  <div
                    className="h-full bg-primary transition-all duration-500 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Candidates Management */}
      <div className="surface-card rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-4 h-4 text-amber-500" />
            <h2 className="font-bold text-sm text-foreground">
              Daftar Paslon Kandidat ({candidates.length})
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari kandidat..."
                value={searchCand}
                onChange={e => setSearchCand(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg text-xs bg-background border border-input text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary w-40 sm:w-52"
              />
            </div>
            <button
              onClick={openCreateCand}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Paslon</span>
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {loading ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {[1, 2].map(i => <div key={i} className="h-36 rounded-lg bg-muted animate-pulse" />)}
            </div>
          ) : filteredCandidates.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-lg">
              <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-semibold text-foreground">
                {searchCand ? 'Tidak ada kandidat sesuai pencarian' : 'Belum Ada Paslon Terdaftar'}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Tambahkan profil kandidat dan visi-misi untuk ditampilkan di bilik suara siswa.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {filteredCandidates.map(c => (
                <div
                  key={c.id}
                  className="surface-card p-4 sm:p-5 rounded-xl border border-border flex flex-col justify-between hover:border-primary/40 transition-colors"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-secondary text-foreground/80 border border-border flex items-center justify-center font-bold text-sm shrink-0">
                          #{c.number}
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-foreground leading-tight">
                            {c.user.name}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Kelas {c.user.kelas || '-'}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-bold text-foreground block leading-tight">
                          {c.votes}
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">
                          Suara
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-muted/40 border border-border/80 mb-3">
                      <p className="text-xs font-semibold text-foreground mb-1">Visi & Misi:</p>
                      <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                        {c.visiMisi}
                      </p>
                    </div>

                    {c.campaignVideo && (
                      <a
                        href={c.campaignVideo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline mb-3"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Tonton Video Kampanye</span>
                      </a>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                    <button
                      onClick={() => openEditCand(c)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:bg-muted text-foreground transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setDeleteCand(c)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-destructive/20 text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sesi Modal */}
      <Modal isOpen={showSessionModal} onClose={() => setShowSessionModal(false)} title="Buat Sesi Pemilihan Suara">
        <form onSubmit={handleCreateSession} className="space-y-4">
          <FormField label="Agenda / Event Pemilu" required>
            <Select
              value={sessForm.eventId}
              onChange={e => sf('eventId')(e.target.value)}
              options={eventOpts}
              placeholder="Pilih event pemilu..."
              required
            />
          </FormField>
          <div className="grid sm:grid-cols-2 gap-3">
            <FormField label="Waktu Mulai" required>
              <Input
                type="datetime-local"
                value={sessForm.startTime}
                onChange={e => sf('startTime')(e.target.value)}
                required
              />
            </FormField>
            <FormField label="Waktu Selesai" required>
              <Input
                type="datetime-local"
                value={sessForm.endTime}
                onChange={e => sf('endTime')(e.target.value)}
                required
              />
            </FormField>
          </div>
          <FormField label="Total Kuota Pemilih" hint="Estimasi jumlah siswa pemilik hak suara sah">
            <Input
              type="number"
              value={sessForm.totalVoters}
              onChange={e => sf('totalVoters')(e.target.value)}
              min="1"
            />
          </FormField>
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <SubmitButton loading={saving} label="Buat Sesi Voting" />
        </form>
      </Modal>

      {/* Candidate Modal */}
      <Modal isOpen={showCandModal} onClose={() => setShowCandModal(false)} title={editCand ? `Edit Data Paslon #${editCand.number}` : 'Tambah Paslon Baru'}>
        <form onSubmit={handleSaveCand} className="space-y-4">
          {!editCand && (
            <>
              <FormField label="Pilih Siswa Calon Ketua" required>
                <Select
                  value={candForm.userId}
                  onChange={e => cf('userId')(e.target.value)}
                  options={userOpts}
                  placeholder="Pilih akun siswa..."
                  required
                />
              </FormField>
              <FormField label="Agenda Event Pemilu" required>
                <Select
                  value={candForm.eventId}
                  onChange={e => cf('eventId')(e.target.value)}
                  options={eventOpts}
                  placeholder="Pilih event..."
                  required
                />
              </FormField>
            </>
          )}
          <FormField label="Nomor Urut Paslon" required>
            <Input
              type="number"
              min="1"
              value={String(candForm.number)}
              onChange={e => cf('number')(e.target.value)}
              required
            />
          </FormField>
          <FormField label="Visi & Misi" hint="Tuliskan program kerja dan komitmen utama kandidat" required>
            <Textarea
              rows={4}
              value={candForm.visiMisi}
              onChange={e => cf('visiMisi')(e.target.value)}
              placeholder="Contoh: Visi: Mewujudkan OSIS berintegritas dan aktif..."
              required
            />
          </FormField>
          <FormField label="Tautan Video Kampanye" hint="Tautan video YouTube resmi kampanye (opsional)">
            <Input
              type="url"
              value={candForm.campaignVideo}
              onChange={e => cf('campaignVideo')(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
            />
          </FormField>
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <SubmitButton loading={saving} label={editCand ? 'Simpan Perubahan' : 'Daftarkan Paslon'} />
        </form>
      </Modal>

      {/* Confirm Session Dialog */}
      <ConfirmDialog
        isOpen={!!confirmSession}
        onClose={() => setConfirmSession(null)}
        onConfirm={() => handleSessionAction(confirmSession!)}
        loading={actioning}
        danger={confirmSession === 'close'}
        title={confirmSession === 'open' ? 'Buka Bilik Suara Digital?' : 'Tutup Pemungutan Suara?'}
        message={confirmSession === 'open'
          ? 'Setelah dibuka, seluruh siswa terdaftar dapat memberikan satu suara sah melalui bilik suara mereka.'
          : 'Setelah ditutup, siswa tidak dapat lagi mengirimkan suara baru dan rekapitulasi akhir akan dikunci.'}
        confirmLabel={confirmSession === 'open' ? 'Ya, Buka Voting' : 'Ya, Tutup Sesi'}
      />

      {/* Delete Candidate Dialog */}
      <ConfirmDialog
        isOpen={!!deleteCand}
        onClose={() => setDeleteCand(null)}
        onConfirm={handleDeleteCand}
        loading={deleting}
        title="Hapus Kandidat Paslon"
        message={`Hapus data kandidat "${deleteCand?.user?.name}"? Rekap suara yang sudah masuk untuk paslon ini juga akan dibatalkan.`}
        confirmLabel="Hapus Paslon"
      />
    </div>
  )
}
