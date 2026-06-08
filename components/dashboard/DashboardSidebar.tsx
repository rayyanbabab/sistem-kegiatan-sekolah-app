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
        } fixed md:relative w-64 h-screen bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 z-40 md:z-0`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-indigo-600">SMKS Digital</h2>
          <p className="text-xs text-gray-500 mt-1">Manajemen Kegiatan</p>
        </div>

        {/* User Info */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <p className="text-sm font-medium text-gray-900">{currentUser?.name}</p>
          <p className="text-xs text-gray-600">{currentUser?.kelas}</p>
          <span className="inline-block mt-2 px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded">
            {currentUser?.role === 'super-admin' ? 'Super Admin' :
             currentUser?.role === 'panitia' ? 'Panitia Event' :
             currentUser?.role === 'kandidat' ? 'Kandidat OSIS' :
             currentUser?.role === 'ketua-kelas' ? 'Ketua Kelas' :
             'Siswa'}
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item, idx) => (
            <div key={idx}>
              {item.submenu ? (
                <div>
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition ${
                      expandedMenus[item.label]
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={18} />
                      <span className="font-medium text-sm">{item.label}</span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        expandedMenus[item.label] ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expandedMenus[item.label] && (
                    <div className="ml-2 mt-1 space-y-1">
                      {item.submenu.map((sub, subIdx) => (
                        <Link
                          key={subIdx}
                          href={sub.href}
                          onClick={() => setIsMobileOpen(false)}
                          className={`block px-4 py-2 rounded-lg text-sm transition ${
                            isActive(sub.href)
                              ? 'bg-indigo-100 text-indigo-600 font-medium'
                              : 'text-gray-600 hover:bg-gray-50'
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
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                    isActive(item.href)
                      ? 'bg-indigo-100 text-indigo-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon size={18} />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full flex items-center justify-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
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
