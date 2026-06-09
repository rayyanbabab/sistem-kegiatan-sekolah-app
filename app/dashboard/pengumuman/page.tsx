'use client'

import { useState } from 'react'
import { Calendar, MessageCircle, Trophy, Vote, School, Bell, CheckCircle } from 'lucide-react'

const MOCK_ANNOUNCEMENTS = [
  {
    id: '1',
    title: 'Classmeeting 2026 Segera Dimulai!',
    description: 'Classmeeting tahun ini akan diadakan pada tanggal 20-25 Juni 2026. Semua tim wajib melakukan daftar ulang paling lambat 18 Juni 2026.',
    type: 'LOMBA',
    createdAt: '2026-06-07T08:00:00Z',
    creator: { name: 'Panitia OSIS' }
  },
  {
    id: '2',
    title: 'Pemilu OSIS 2026 — Profil Kandidat Tersedia',
    description: 'Lihat profil lengkap seluruh kandidat Ketua OSIS 2026. Voting akan dibuka pada 20 Juni 2026 pukul 08.00 WIB.',
    type: 'PEMILU',
    createdAt: '2026-06-06T09:00:00Z',
    creator: { name: 'Admin Sekolah' }
  },
  {
    id: '3',
    title: 'Pengumuman Libur Sekolah',
    description: 'Sekolah akan libur pada tanggal 1-7 Juli 2026 dalam rangka penerimaan rapor semester genap.',
    type: 'SEKOLAH',
    createdAt: '2026-06-05T07:00:00Z',
    creator: { name: 'Kepala Sekolah' }
  },
  {
    id: '4',
    title: 'Selamat! Tim Futsal Raih Juara 1',
    description: 'Tim futsal kelas XII IPA 1 berhasil meraih juara 1 dalam turnamen antar sekolah. Selamat kepada seluruh pemain!',
    type: 'JUARA',
    createdAt: '2026-06-04T16:00:00Z',
    creator: { name: 'Panitia OSIS' }
  },
]

const typeConfig: Record<string, { label: string; icon: any; color: string; bg: string; border: string }> = {
  LOMBA: { label: 'Lomba', icon: Trophy, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  PEMILU: { label: 'Pemilu', icon: Vote, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
  SEKOLAH: { label: 'Sekolah', icon: School, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  JUARA: { label: 'Juara', icon: Trophy, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
  UMUM: { label: 'Umum', icon: MessageCircle, color: 'text-white/50', bg: 'bg-white/5', border: 'border-white/10' },
}

const FILTERS = ['Semua', 'Sekolah', 'Lomba', 'Pemilu', 'Juara']

export default function PengumumanPage() {
  const [activeFilter, setActiveFilter] = useState('Semua')

  const filtered = MOCK_ANNOUNCEMENTS.filter(a =>
    activeFilter === 'Semua' || a.type.toLowerCase() === activeFilter.toLowerCase()
  )

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Bell className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-amber-400 font-medium uppercase tracking-wider">Info Terbaru</span>
        </div>
        <h1 className="text-3xl font-bold text-white">Pengumuman</h1>
        <p className="text-white/40 mt-1">Informasi penting tentang kegiatan sekolah</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
              activeFilter === f
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'bg-white/[0.03] text-white/40 border border-white/[0.06] hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Announcements */}
      <div className="space-y-4">
        {filtered.map((ann, i) => {
          const cfg = typeConfig[ann.type] || typeConfig.UMUM
          const Icon = cfg.icon
          const date = new Date(ann.createdAt)
          const isNew = (Date.now() - date.getTime()) < 7 * 24 * 60 * 60 * 1000

          return (
            <div
              key={ann.id}
              className="glass-card rounded-2xl p-5 hover:border-white/20 transition-all hover:-translate-y-0.5 cursor-pointer group"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg} border ${cfg.border}`}>
                  <Icon className={`w-5 h-5 ${cfg.color}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors leading-snug">
                      {ann.title}
                    </h3>
                    {isNew && (
                      <span className="flex-shrink-0 px-2 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-bold border border-red-500/20 rounded-full">
                        BARU
                      </span>
                    )}
                  </div>

                  <p className="text-white/50 text-sm line-clamp-2 mb-3 leading-relaxed">
                    {ann.description}
                  </p>

                  <div className="flex items-center gap-4">
                    <span className={`px-2.5 py-0.5 rounded-lg text-xs font-medium ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
                      {cfg.label}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-white/30">
                      <Calendar className="w-3 h-3" />
                      {date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <span className="text-xs text-white/30">· {ann.creator.name}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="glass-card rounded-2xl p-16 text-center">
            <MessageCircle className="w-12 h-12 text-white/10 mx-auto mb-3" />
            <p className="text-white/40 font-medium">Tidak ada pengumuman</p>
            <p className="text-white/20 text-sm mt-1">Cek kembali nanti</p>
          </div>
        )}
      </div>

      {/* Info box */}
      <div className="glass-card rounded-2xl p-5 border-blue-500/20 bg-blue-500/5">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-semibold text-blue-400">Tips</span>
        </div>
        <ul className="space-y-1.5 text-sm text-white/50">
          <li>• Baca semua pengumuman dengan seksama sebelum bertanya</li>
          <li>• Aktifkan notifikasi untuk mendapat update terbaru</li>
          <li>• Jika ada pertanyaan, hubungi panitia yang bersangkutan</li>
        </ul>
      </div>
    </div>
  )
}
