'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Vote, CheckCircle2, Lock, AlertCircle, ArrowRight, Users } from 'lucide-react'
import Link from 'next/link'

const CANDIDATES = [
  { id: '1', number: 1, name: 'Siti Nurhaliza', kelas: 'XII IPA 1', photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siti', visiMisi: 'Menciptakan OSIS yang lebih inklusif dan responsif terhadap kebutuhan siswa. Fokus pada peningkatan program akademik dan non-akademik.', color: 'from-blue-500 to-cyan-500' },
  { id: '2', number: 2, name: 'Budi Santoso', kelas: 'XII IPS 2', photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi', visiMisi: 'Membangun OSIS yang kuat dalam mengorganisir kegiatan sekolah. Meningkatkan partisipasi siswa dalam setiap program.', color: 'from-violet-500 to-purple-500' },
  { id: '3', number: 3, name: 'Rina Puspita', kelas: 'XII IPA 2', photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rina', visiMisi: 'OSIS yang transparan dan akuntabel. Mewujudkan program-program yang bermanfaat bagi seluruh siswa.', color: 'from-pink-500 to-rose-500' },
  { id: '4', number: 4, name: 'Hendra Wijaya', kelas: 'XII IPA 3', photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hendra', visiMisi: 'Memajukan semangat gotong royong dan kebersamaan di sekolah. OSIS yang dekat dengan siswa.', color: 'from-amber-500 to-orange-500' },
]

export default function VotingPage() {
  const { hasVoted, setHasVoted } = useAuth()
  const [selected, setSelected] = useState<string | null>(null)
  const [step, setStep] = useState<'select' | 'confirm' | 'done'>(hasVoted ? 'done' : 'select')

  const selectedCand = CANDIDATES.find(c => c.id === selected)

  // Already voted
  if (step === 'done') {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="glass-card rounded-3xl p-12 text-center border-green-500/20 bg-green-500/5">
          <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500/30 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Suara Berhasil Dicatat!</h2>
          <p className="text-white/50 mb-8">Terima kasih telah berpartisipasi dalam Pemilu OSIS 2026. Pilihan Anda telah tersimpan dengan aman.</p>
          <Link href="/dashboard/pemilu/real-count">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-semibold rounded-2xl transition shadow-lg shadow-blue-500/25">
              Lihat Hasil Real Count <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    )
  }

  // Confirm step
  if (step === 'confirm' && selectedCand) {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Konfirmasi Pilihan</h1>
          <p className="text-white/40 mt-1">Pastikan pilihan Anda sudah benar sebelum dikonfirmasi</p>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden">
          <div className={`h-1.5 bg-gradient-to-r ${selectedCand.color}`} />
          <div className="p-6">
            <div className="flex gap-5">
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/10">
                  <img src={selectedCand.photo} alt={selectedCand.name} className="w-full h-full object-cover" />
                </div>
                <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-gradient-to-br ${selectedCand.color} flex items-center justify-center shadow-lg`}>
                  <span className="text-white font-bold text-sm">{selectedCand.number}</span>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedCand.name}</h2>
                <p className="text-white/40 text-sm mt-1 flex items-center gap-1">
                  <Users className="w-3 h-3" /> {selectedCand.kelas}
                </p>
                <div className="mt-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <p className="text-xs text-white/30 mb-1 uppercase tracking-wider">Visi & Misi</p>
                  <p className="text-sm text-white/60 leading-relaxed">{selectedCand.visiMisi}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border-amber-500/20 bg-amber-500/5">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-400/80">
              Setelah dikonfirmasi, pilihan <strong>tidak dapat diubah</strong>. Pastikan Anda sudah yakin dengan pilihan ini.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setStep('select')}
            className="flex-1 py-3 rounded-2xl border border-white/10 text-white/60 hover:text-white hover:bg-white/[0.05] text-sm font-medium transition"
          >
            ← Kembali
          </button>
          <button
            onClick={() => { setHasVoted(true); setStep('done') }}
            className={`flex-1 py-3 rounded-2xl bg-gradient-to-r ${selectedCand.color} text-white font-semibold shadow-lg hover:opacity-90 transition`}
          >
            ✓ Konfirmasi Pilihan
          </button>
        </div>
      </div>
    )
  }

  // Select step
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Vote className="w-4 h-4 text-violet-400" />
          <span className="text-xs text-violet-400 font-medium uppercase tracking-wider">Pemilu OSIS 2026</span>
        </div>
        <h1 className="text-3xl font-bold text-white">Voting Pemilu OSIS</h1>
        <p className="text-white/40 mt-1">Pilih satu kandidat yang Anda percaya untuk memimpin OSIS</p>
      </div>

      {/* Status bar */}
      <div className="glass-card rounded-2xl p-5 border-violet-500/20 bg-violet-500/5">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-green-400 font-medium">Voting Aktif</span>
            </div>
            <p className="text-sm text-white/50">Sesi voting: 20 Jun 2026 · 08.00 – 16.00 WIB</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-violet-400">0%</p>
            <p className="text-xs text-white/30">Partisipasi</p>
          </div>
        </div>
        <div className="w-full bg-white/[0.06] rounded-full h-1.5">
          <div className="bg-gradient-to-r from-violet-500 to-purple-500 h-1.5 rounded-full" style={{ width: '0%' }} />
        </div>
      </div>

      {/* Candidates */}
      <div className="grid md:grid-cols-2 gap-4">
        {CANDIDATES.map((c) => {
          const isSelected = selected === c.id
          return (
            <button
              key={c.id}
              onClick={() => setSelected(c.id)}
              className={`text-left glass-card rounded-2xl overflow-hidden transition-all hover:-translate-y-0.5 ${isSelected ? 'border-violet-500/50 shadow-lg shadow-violet-500/10' : 'hover:border-white/20'}`}
            >
              <div className={`h-1 bg-gradient-to-r ${c.color} ${isSelected ? 'opacity-100' : 'opacity-30'}`} />
              <div className="p-5 flex gap-4">
                <div className="relative flex-shrink-0">
                  <div className={`w-16 h-16 rounded-xl overflow-hidden border-2 ${isSelected ? 'border-violet-400' : 'border-white/10'} transition-colors`}>
                    <img src={c.photo} alt={c.name} className="w-full h-full object-cover" />
                  </div>
                  <div className={`absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-lg bg-gradient-to-br ${c.color} flex items-center justify-center`}>
                    <span className="text-white font-bold text-xs">{c.number}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-white text-base">{c.name}</h3>
                      <p className="text-xs text-white/40">{c.kelas}</p>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-white/50 mt-2 line-clamp-2 leading-relaxed">{c.visiMisi}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Submit */}
      <button
        onClick={() => selected && setStep('confirm')}
        disabled={!selected}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold text-base shadow-xl shadow-violet-500/20 transition disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {selected ? `Lanjutkan → Pilih Kandidat #${CANDIDATES.find(c => c.id === selected)?.number}` : 'Pilih salah satu kandidat'}
      </button>

      <div className="glass-card rounded-2xl p-4 border-blue-500/20 bg-blue-500/5">
        <p className="text-xs text-white/40 text-center">🔒 Voting bersifat anonim · Satu akun satu suara · Pilihan tidak bisa diubah</p>
      </div>
    </div>
  )
}
