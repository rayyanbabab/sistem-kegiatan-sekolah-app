'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Trophy,
  Vote,
  Calendar,
  Megaphone,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Users,
  Settings
} from 'lucide-react'

export default function DashboardSidebar() {
  const { currentUser, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({})

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const toggleMenu = (menu: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }))
  }

  const isActive = (href: string) => pathname === href

  // Define menu items based on role
  const getMenuItems = () => {
    const baseItems = [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }
    ]

    const moduleItems = [
      { label: 'Pengumuman', href: '/dashboard/pengumuman', icon: Megaphone }
    ]

    if (currentUser?.role === 'super-admin') {
      return [
        ...baseItems,
        {
          label: 'Manajemen Event',
          icon: Calendar,
          submenu: [
            { label: 'Kelola Event', href: '/dashboard/events' },
            { label: 'Kelola User', href: '/dashboard/users' },
            { label: 'Backup Data', href: '/dashboard/backup' }
          ]
        },
        {
          label: 'Classmeeting',
          icon: Trophy,
          submenu: [
            { label: 'Daftar Lomba', href: '/dashboard/classmeeting/competitions' },
            { label: 'Tim', href: '/dashboard/classmeeting/teams' },
            { label: 'Jadwal', href: '/dashboard/classmeeting/schedule' },
            { label: 'Leaderboard', href: '/dashboard/classmeeting/leaderboard' }
          ]
        },
        {
          label: 'Pemilu OSIS',
          icon: Vote,
          submenu: [
            { label: 'Kandidat', href: '/dashboard/pemilu/candidates' },
            { label: 'Voting', href: '/dashboard/pemilu/voting' },
            { label: 'Real Count', href: '/dashboard/pemilu/real-count' },
            { label: 'Verifikasi', href: '/dashboard/pemilu/verification' }
          ]
        },
        ...moduleItems
      ]
    } else if (currentUser?.role === 'panitia') {
      return [
        ...baseItems,
        {
          label: 'Classmeeting',
          icon: Trophy,
          submenu: [
            { label: 'Daftar Lomba', href: '/dashboard/classmeeting/competitions' },
            { label: 'Verifikasi Tim', href: '/dashboard/classmeeting/teams' },
            { label: 'Input Hasil', href: '/dashboard/classmeeting/results' }
          ]
        },
        ...moduleItems
      ]
    } else if (currentUser?.role === 'kandidat') {
      return [
        ...baseItems,
        {
          label: 'Pemilu OSIS',
          icon: Vote,
          submenu: [
            { label: 'Profil Kampanye', href: '/dashboard/pemilu/profile' },
            { label: 'Lihat Kandidat', href: '/dashboard/pemilu/candidates' }
          ]
        },
        ...moduleItems
      ]
    } else if (currentUser?.role === 'ketua-kelas') {
      return [
        ...baseItems,
        {
          label: 'Classmeeting',
          icon: Trophy,
          submenu: [
            { label: 'Daftar Lomba', href: '/dashboard/classmeeting/competitions' },
            { label: 'Tim Kelas', href: '/dashboard/classmeeting/my-teams' },
            { label: 'Jadwal', href: '/dashboard/classmeeting/schedule' }
          ]
        },
        ...moduleItems
      ]
    } else {
      // Siswa
      return [
        ...baseItems,
        {
          label: 'Classmeeting',
          icon: Trophy,
          submenu: [
            { label: 'Jadwal Lomba', href: '/dashboard/classmeeting/schedule' },
            { label: 'Leaderboard', href: '/dashboard/classmeeting/leaderboard' }
          ]
        },
        {
          label: 'Pemilu OSIS',
          icon: Vote,
          submenu: [
            { label: 'Voting', href: '/dashboard/pemilu/voting' },
            { label: 'Lihat Kandidat', href: '/dashboard/pemilu/candidates' },
            { label: 'Real Count', href: '/dashboard/pemilu/real-count' }
          ]
        },
        ...moduleItems
      ]
    }
  }

  const menuItems = getMenuItems()

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-indigo-600 text-white rounded-lg"
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } fixed md:relative w-64 h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-r border-gray-700 flex flex-col transition-transform duration-300 z-40 md:z-0 shadow-2xl`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-700/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-xs">SM</span>
            </div>
            <h2 className="text-lg font-black text-white">SMKS Digital</h2>
          </div>
          <p className="text-xs text-gray-400 ml-11">Manajemen Kegiatan</p>
        </div>

        {/* User Info */}
        <div className="p-4 bg-gray-800/50 border-b border-gray-700/50 backdrop-blur-sm">
          <p className="text-sm font-bold text-white">{currentUser?.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">{currentUser?.kelas}</p>
          <span className="inline-block mt-3 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold rounded-lg shadow-lg">
            {currentUser?.role === 'super-admin' ? 'Super Admin' :
             currentUser?.role === 'panitia' ? 'Panitia Event' :
             currentUser?.role === 'kandidat' ? 'Kandidat OSIS' :
             currentUser?.role === 'ketua-kelas' ? 'Ketua Kelas' :
             'Siswa'}
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {menuItems.map((item, idx) => (
            <div key={idx}>
              {item.submenu ? (
                <div>
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                      expandedMenus[item.label]
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                        : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={18} />
                      <span>{item.label}</span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        expandedMenus[item.label] ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expandedMenus[item.label] && (
                    <div className="ml-2 mt-1 space-y-1 pl-2 border-l border-gray-700/50">
                      {item.submenu.map((sub, subIdx) => (
                        <Link
                          key={subIdx}
                          href={sub.href}
                          onClick={() => setIsMobileOpen(false)}
                          className={`block px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                            isActive(sub.href)
                              ? 'bg-blue-600/30 text-blue-300 border border-blue-600/40'
                              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/30'
                          }`}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                    isActive(item.href)
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-gray-700/50 bg-gray-800/30 space-y-2">
          <Button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-600/30 rounded-lg smooth-transition font-medium"
          >
            <LogOut size={18} />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  )
}
