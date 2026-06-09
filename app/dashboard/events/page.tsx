'use client'

import { useAuth } from '@/context/AuthContext'
import { Calendar, Plus, Edit2, Trash2, Eye, Shield } from 'lucide-react'

const EVENTS = [
  { id: '1', name: 'Classmeeting 2026', description: 'Kompetisi olahraga, akademik, dan seni antar kelas untuk mempererat persatuan siswa.', date: '2026-06-20', status: 'active', banner: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&q=80', category: 'Kompetisi' },
  { id: '2', name: 'Pemilu OSIS 2026', description: 'Pemilihan Ketua dan Wakil Ketua OSIS periode 2026-2027 secara demokratis dan transparan.', date: '2026-06-20', status: 'active', banner: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&q=80', category: 'Pemilu' },
  { id: '3', name: 'MPLS 2026', description: 'Masa Pengenalan Lingkungan Sekolah untuk siswa baru tahun ajaran 2026/2027.', date: '2026-07-15', status: 'upcoming', banner: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=200&q=80', category: 'Akademik' },
  { id: '4', name: 'Pekan Seni Sekolah', description: 'Pertunjukan dan pameran karya seni siswa dalam rangka HUT sekolah ke-25.', date: '2026-08-01', status: 'upcoming', banner: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&q=80', category: 'Seni' },
]

const STATUS_CFG = {
  active: { label: 'Aktif', class: 'bg-green-500/20 text-green-400 border border-green-500/30' },
  upcoming: { label: 'Segera', class: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
  ended: { label: 'Selesai', class: 'bg-white/10 text-white/40 border border-white/10' },
}

export default function EventsPage() {
  const { currentUser } = useAuth()

  if (currentUser?.role !== 'super-admin') {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="glass-card rounded-2xl p-16 text-center">
          <Shield className="w-12 h-12 text-white/10 mx-auto mb-3" />
          <p className="text-white/50 font-medium">Akses Ditolak</p>
          <p className="text-white/30 text-sm mt-1">Hanya Super Admin yang dapat mengakses halaman ini</p>
        </div>
      </div>
    )
  }

  const active = EVENTS.filter(e => e.status === 'active')
  const upcoming = EVENTS.filter(e => e.status === 'upcoming')

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-blue-400 font-medium uppercase tracking-wider">Super Admin</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Manajemen Event</h1>
          <p className="text-white/40 mt-1">Kelola semua event sekolah</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-blue-500/25">
          <Plus className="w-4 h-4" />
          Event Baru
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Event', value: EVENTS.length, color: 'from-blue-500 to-blue-400' },
          { label: 'Event Aktif', value: active.length, color: 'from-green-500 to-emerald-400' },
          { label: 'Event Mendatang', value: upcoming.length, color: 'from-amber-500 to-orange-400' },
        ].map(s => (
          <div key={s.label} className="glass-card rounded-2xl p-5 text-center">
            <p className={`text-3xl font-bold bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>{s.value}</p>
            <p className="text-sm text-white/50 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Grouped events */}
      {[
        { label: 'Event Aktif', dot: 'bg-green-400', items: active },
        { label: 'Event Mendatang', dot: 'bg-blue-400', items: upcoming },
      ].map(group => group.items.length > 0 && (
        <div key={group.label} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full ${group.dot} flex-shrink-0`} />
            <h2 className="text-base font-semibold text-white/70">{group.label}</h2>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {group.items.map(event => {
              const cfg = STATUS_CFG[event.status as keyof typeof STATUS_CFG]
              return (
                <div key={event.id} className="glass-card rounded-2xl overflow-hidden hover:border-white/20 transition-all hover:-translate-y-0.5 group">
                  <div className="flex gap-0">
                    {/* Banner */}
                    <div className="w-28 h-36 flex-shrink-0 overflow-hidden">
                      <img src={event.banner} alt={event.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    {/* Content */}
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-white text-sm leading-snug flex-1">{event.name}</h3>
                        <span className={`ml-2 flex-shrink-0 px-2 py-0.5 rounded-lg text-xs font-medium ${cfg.class}`}>
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-xs text-white/40 line-clamp-2 mb-3 leading-relaxed">{event.description}</p>
                      <div className="flex items-center gap-1 text-xs text-white/30 mb-3">
                        <Calendar className="w-3 h-3" />
                        {new Date(event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                      {/* Actions */}
                      <div className="flex gap-1.5 pt-2 border-t border-white/[0.06]">
                        <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/50 hover:text-white text-xs transition">
                          <Eye className="w-3 h-3" /> Lihat
                        </button>
                        <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/50 hover:text-white text-xs transition">
                          <Edit2 className="w-3 h-3" /> Edit
                        </button>
                        <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400/60 hover:text-red-400 text-xs transition">
                          <Trash2 className="w-3 h-3" /> Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {/* Guide */}
      <div className="glass-card rounded-2xl p-5 border-blue-500/20 bg-blue-500/5">
        <p className="text-sm font-semibold text-blue-400 mb-3">📋 Panduan Manajemen Event</p>
        <ul className="space-y-1.5 text-sm text-white/50">
          <li>• Klik "Event Baru" untuk membuat event baru</li>
          <li>• Edit event untuk mengubah detail dan konfigurasi</li>
          <li>• Status event berubah otomatis berdasarkan tanggal</li>
          <li>• Data event yang dihapus tidak dapat dikembalikan</li>
        </ul>
      </div>
    </div>
  )
}
