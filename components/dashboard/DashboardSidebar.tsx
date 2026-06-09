'use client'

import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  LayoutDashboard, Trophy, Vote, Calendar, Megaphone,
  LogOut, Menu, X, ChevronDown, Users, Shield,
  Star, CheckCircle, Sun, Moon, Settings, Tag,
  School, ListChecks, UserCheck, BarChart2, ClipboardList,
  UserPlus, Tv2, PieChart, BookOpen, Layers, Medal,
  GraduationCap, FilePen, LucideIcon,
} from 'lucide-react'

const roleConfig: Record<string, { label: string; color: string; icon: LucideIcon }> = {
  'SUPER_ADMIN': { label: 'Super Admin',   color: 'from-blue-500 to-blue-400',    icon: Shield },
  'PANITIA':     { label: 'Panitia Event', color: 'from-violet-500 to-violet-400', icon: CheckCircle },
  'KANDIDAT':    { label: 'Kandidat OSIS', color: 'from-pink-500 to-pink-400',    icon: Trophy },
  'KETUA_KELAS': { label: 'Ketua Kelas',   color: 'from-cyan-500 to-cyan-400',    icon: Star },
  'SISWA':       { label: 'Siswa',         color: 'from-green-500 to-green-400',  icon: Users },
}

const navItemStyle = (active: boolean) => ({
  background: active ? 'rgba(59,130,246,0.12)' : 'transparent',
  color: active ? '#60a5fa' : 'var(--text-muted)',
  fontWeight: active ? 500 : 400,
})

const navHoverEnter = (e: React.MouseEvent, active: boolean) => {
  if (!active) {
    (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'
    ;(e.currentTarget as HTMLElement).style.background = 'var(--subtle-hover-bg)'
  }
}
const navHoverLeave = (e: React.MouseEvent, active: boolean) => {
  if (!active) {
    (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'
    ;(e.currentTarget as HTMLElement).style.background = 'transparent'
  }
}

interface SchoolSettings { schoolName: string; logo: string | null }
interface SubItem { label: string; href: string; icon?: LucideIcon }
interface MenuItem {
  label: string
  icon: LucideIcon
  href?: string
  submenu?: SubItem[]
}

export default function DashboardSidebar() {
  const { currentUser, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({})
  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings>({ schoolName: 'SMKS Digital', logo: null })

  // Fetch school settings untuk logo & nama
  useEffect(() => {
    fetch('/api/settings', { credentials: 'include' })
      .then(r => r.json())
      .then(j => { if (j.success) setSchoolSettings({ schoolName: j.data.schoolName, logo: j.data.logo }) })
      .catch(() => {})
  }, [])

  const handleLogout = async () => { await logout(); router.push('/') }
  const toggleMenu = (menu: string) =>
    setExpandedMenus(prev => ({ ...prev, [menu]: !prev[menu] }))
  const isActive       = (href: string) => pathname === href
  const isParentActive = (submenu: SubItem[]) =>
    submenu.some(s => pathname === s.href)

  const getMenuItems = (): MenuItem[] => {
    const base:     MenuItem[] = [{ label: 'Dashboard',   href: '/dashboard',            icon: LayoutDashboard }]
    const announce: MenuItem[] = [{ label: 'Pengumuman',  href: '/dashboard/pengumuman', icon: Megaphone }]

    const settings: MenuItem[] = [{
      label: 'Pengaturan', icon: Settings, submenu: [
        { label: 'Pengaturan Sekolah', href: '/dashboard/settings',            icon: School },
        { label: 'Kelola Kelas',       href: '/dashboard/settings/kelas',      icon: GraduationCap },
        { label: 'Kategori Lomba',     href: '/dashboard/settings/categories', icon: Tag },
      ]
    }]

    if (currentUser?.role === 'SUPER_ADMIN') return [
      ...base,
      { label: 'Event', icon: Calendar, submenu: [
        { label: 'Kelola Event', href: '/dashboard/events',  icon: ClipboardList },
        { label: 'Kelola User',  href: '/dashboard/users',   icon: Users },
      ]},
      { label: 'Classmeeting', icon: Trophy, submenu: [
        { label: 'Daftar Lomba',  href: '/dashboard/classmeeting/competitions', icon: Layers },
        { label: 'Tim',           href: '/dashboard/classmeeting/teams',        icon: UserCheck },
        { label: 'Input Hasil',   href: '/dashboard/classmeeting/results',      icon: FilePen },
        { label: 'Jadwal',        href: '/dashboard/classmeeting/schedule',     icon: Calendar },
        { label: 'Leaderboard',   href: '/dashboard/classmeeting/leaderboard',  icon: Medal },
      ]},
      { label: 'Pemilu OSIS', icon: Vote, submenu: [
        { label: 'Kelola Pemilu', href: '/dashboard/pemilu/admin',       icon: Settings },
        { label: 'Kandidat',      href: '/dashboard/pemilu/candidates',  icon: UserPlus },
        { label: 'Voting',        href: '/dashboard/pemilu/voting',      icon: Vote },
        { label: 'Real Count',    href: '/dashboard/pemilu/real-count',  icon: BarChart2 },
      ]},
      ...announce,
      ...settings,
    ]

    if (currentUser?.role === 'PANITIA') return [
      ...base,
      { label: 'Classmeeting', icon: Trophy, submenu: [
        { label: 'Daftar Lomba',   href: '/dashboard/classmeeting/competitions', icon: Layers },
        { label: 'Verifikasi Tim', href: '/dashboard/classmeeting/teams',        icon: UserCheck },
        { label: 'Input Hasil',    href: '/dashboard/classmeeting/results',      icon: FilePen },
      ]},
      { label: 'Pemilu OSIS', icon: Vote, submenu: [
        { label: 'Kelola Pemilu', href: '/dashboard/pemilu/admin',      icon: Settings },
        { label: 'Kandidat',      href: '/dashboard/pemilu/candidates', icon: UserPlus },
        { label: 'Real Count',    href: '/dashboard/pemilu/real-count', icon: BarChart2 },
      ]},
      ...announce,
      { label: 'Pengaturan', icon: Settings, submenu: [
        { label: 'Kategori Lomba', href: '/dashboard/settings/categories', icon: Tag },
      ]},
    ]

    if (currentUser?.role === 'KANDIDAT') return [
      ...base,
      { label: 'Pemilu OSIS', icon: Vote, submenu: [
        { label: 'Profil Kampanye', href: '/dashboard/pemilu/profile',    icon: BookOpen },
        { label: 'Lihat Kandidat',  href: '/dashboard/pemilu/candidates', icon: Users },
      ]},
      ...announce,
    ]

    if (currentUser?.role === 'KETUA_KELAS') return [
      ...base,
      { label: 'Classmeeting', icon: Trophy, submenu: [
        { label: 'Daftar Lomba', href: '/dashboard/classmeeting/competitions', icon: Layers },
        { label: 'Tim Kelas',    href: '/dashboard/classmeeting/my-teams',     icon: UserCheck },
        { label: 'Jadwal',       href: '/dashboard/classmeeting/schedule',     icon: Calendar },
        { label: 'Hasil',        href: '/dashboard/classmeeting/results',      icon: ListChecks },
      ]},
      ...announce,
    ]

    // SISWA (default)
    return [
      ...base,
      { label: 'Classmeeting', icon: Trophy, submenu: [
        { label: 'Jadwal Lomba', href: '/dashboard/classmeeting/schedule',    icon: Calendar },
        { label: 'Leaderboard',  href: '/dashboard/classmeeting/leaderboard', icon: Medal },
      ]},
      { label: 'Pemilu OSIS', icon: Vote, submenu: [
        { label: 'Voting',         href: '/dashboard/pemilu/voting',      icon: Vote },
        { label: 'Lihat Kandidat', href: '/dashboard/pemilu/candidates',  icon: Users },
        { label: 'Real Count',     href: '/dashboard/pemilu/real-count',  icon: PieChart },
      ]},
      ...announce,
    ]
  }

  const menuItems = getMenuItems()
  const role    = currentUser?.role || 'SISWA'
  const roleCfg = roleConfig[role] || roleConfig['SISWA']
  const RoleIcon = roleCfg.icon

  const SidebarContent = () => (
    <aside className="w-64 h-screen sidebar-bg flex flex-col">

      {/* Logo */}
      <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--nav-border)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0 overflow-hidden">
            {schoolSettings.logo
              ? <img src={schoolSettings.logo} alt="logo" className="w-full h-full object-cover" />
              : <span className="text-white font-bold text-sm">{schoolSettings.schoolName.slice(0, 2).toUpperCase()}</span>}
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{schoolSettings.schoolName}</p>
            <p className="text-[10px]" style={{ color: 'var(--text-faint)' }}>Manajemen Kegiatan</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="px-4 py-4" style={{ borderBottom: '1px solid var(--nav-border)' }}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden`}
            style={{ background: currentUser?.avatar ? 'transparent' : undefined }}>
            {currentUser?.avatar
              ? <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover rounded-xl" />
              : <div className={`w-full h-full rounded-xl bg-gradient-to-br ${roleCfg.color} flex items-center justify-center`}>
                  <RoleIcon className="w-5 h-5 text-white" />
                </div>}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
              {currentUser?.name}
            </p>
            <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
              {currentUser?.kelas || roleCfg.label}
            </p>
          </div>
        </div>
        <div className="mt-3">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gradient-to-r ${roleCfg.color} text-white`}>
            {roleCfg.label}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5 scrollbar-thin">
        {menuItems.map((item, idx) => (
          <div key={idx}>
            {'submenu' in item && item.submenu ? (
              <div>
                {/* Parent button */}
                <button
                  onClick={() => toggleMenu(item.label)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-sm"
                  style={navItemStyle(isParentActive(item.submenu))}
                  onMouseEnter={e => navHoverEnter(e, isParentActive(item.submenu!))}
                  onMouseLeave={e => navHoverLeave(e, isParentActive(item.submenu!))}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={16} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${expandedMenus[item.label] ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Submenu */}
                {expandedMenus[item.label] && (
                  <div
                    className="mt-0.5 ml-3 pl-3 space-y-0.5"
                    style={{ borderLeft: '1px solid var(--subtle-border)' }}
                  >
                    {item.submenu.map((sub, subIdx) => {
                      const SubIcon = sub.icon
                      return (
                        <Link
                          key={subIdx}
                          href={sub.href}
                          onClick={() => setIsMobileOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all"
                          style={navItemStyle(isActive(sub.href))}
                          onMouseEnter={e => navHoverEnter(e, isActive(sub.href))}
                          onMouseLeave={e => navHoverLeave(e, isActive(sub.href))}
                        >
                          {SubIcon && <SubIcon size={13} className="flex-shrink-0 opacity-70" />}
                          <span>{sub.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={(item as any).href}
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm"
                style={navItemStyle(isActive((item as any).href))}
                onMouseEnter={e => navHoverEnter(e, isActive((item as any).href))}
                onMouseLeave={e => navHoverLeave(e, isActive((item as any).href))}
              >
                <item.icon size={16} />
                <span className="font-medium">{item.label}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Theme Toggle + Logout */}
      <div className="p-3 space-y-1" style={{ borderTop: '1px solid var(--nav-border)' }}>
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'
            ;(e.currentTarget as HTMLElement).style.background = 'var(--subtle-hover-bg)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'
            ;(e.currentTarget as HTMLElement).style.background = 'transparent'
          }}
        >
          {theme === 'dark' ? (
            <>
              <Sun size={16} className="text-amber-400 flex-shrink-0" />
              <span className="font-medium">Mode Terang</span>
            </>
          ) : (
            <>
              <Moon size={16} className="text-blue-500 flex-shrink-0" />
              <span className="font-medium">Mode Gelap</span>
            </>
          )}
          {/* Toggle pill */}
          <div className={`ml-auto w-9 h-5 rounded-full transition-all flex items-center px-0.5 ${
            theme === 'light' ? 'bg-amber-400' : 'bg-blue-600'
          }`}>
            <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${
              theme === 'light' ? 'translate-x-4' : 'translate-x-0'
            }`} />
          </div>
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={16} />
          <span className="font-medium">Keluar</span>
        </button>
      </div>
    </aside>
  )

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2.5 bg-blue-600 text-white rounded-xl shadow-lg"
      >
        {isMobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden z-30"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="fixed left-0 top-0 z-40 md:hidden">
            <SidebarContent />
          </div>
        </>
      )}
    </>
  )
}
