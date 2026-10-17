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
  UserPlus, PieChart, BookOpen, Layers, Medal,
  GraduationCap, FilePen, LucideIcon,
} from 'lucide-react'

const roleConfig: Record<string, { label: string; badgeClass: string; icon: LucideIcon }> = {
  'SUPER_ADMIN': { label: 'Super Admin',   badgeClass: 'bg-primary/15 text-primary border-primary/30',                               icon: Shield },
  'PANITIA':     { label: 'Panitia Event', badgeClass: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30', icon: CheckCircle },
  'KANDIDAT':    { label: 'Kandidat OSIS', badgeClass: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30', icon: Trophy },
  'KETUA_KELAS': { label: 'Ketua Kelas',   badgeClass: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',    icon: Star },
  'SISWA':       { label: 'Siswa',         badgeClass: 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30',    icon: Users },
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
    <aside className="w-64 h-screen sidebar-bg flex flex-col border-r border-border bg-card">

      {/* School Brand Header */}
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden shadow-sm">
            {schoolSettings.logo
              ? <img src={schoolSettings.logo} alt="logo" className="w-full h-full object-cover" />
              : <span>{schoolSettings.schoolName.slice(0, 2).toUpperCase()}</span>}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-sm text-foreground truncate">{schoolSettings.schoolName}</p>
            <p className="text-[11px] text-muted-foreground truncate">Manajemen Kesiswaan</p>
          </div>
        </div>
      </div>

      {/* User Information Card */}
      <div className="px-4 py-3.5 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center shrink-0 border border-border">
            {currentUser?.avatar
              ? <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover rounded-lg" />
              : <RoleIcon className="w-4 h-4 text-primary" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-foreground truncate">
              {currentUser?.name || 'Pengguna'}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">
              {currentUser?.kelas || roleCfg.label}
            </p>
          </div>
        </div>
        <div className="mt-2.5">
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${roleCfg.badgeClass}`}>
            {roleCfg.label}
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5 scrollbar-thin">
        {menuItems.map((item, idx) => {
          const isItemParentActive = item.submenu ? isParentActive(item.submenu) : false
          const isItemActive = item.href ? isActive(item.href) : false

          return (
            <div key={idx}>
              {item.submenu ? (
                <div>
                  {/* Parent Accordion Button */}
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isItemParentActive
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${expandedMenus[item.label] ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Submenu Links */}
                  {expandedMenus[item.label] && (
                    <div className="mt-0.5 ml-3 pl-2.5 space-y-0.5 border-l border-border/80">
                      {item.submenu.map((sub, subIdx) => {
                        const isSubActive = isActive(sub.href)
                        const SubIcon = sub.icon
                        return (
                          <Link
                            key={subIdx}
                            href={sub.href}
                            onClick={() => setIsMobileOpen(false)}
                            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                              isSubActive
                                ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                          >
                            {SubIcon && <SubIcon className="w-3.5 h-3.5 shrink-0" />}
                            <span>{sub.label}</span>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href || '#'}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isItemActive
                      ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              )}
            </div>
          )
        })}
      </nav>

      {/* Theme Toggle & Logout Controls - with pb-12 for dev overlay clearance */}
      <div className="p-3 pb-12 border-t border-border space-y-1.5 bg-muted/20">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors border border-transparent hover:border-border"
        >
          <div className="flex items-center gap-2.5">
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-500 shrink-0" />
            ) : (
              <Moon className="w-4 h-4 text-primary shrink-0" />
            )}
            <span>{theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}</span>
          </div>
          <span className="text-[10px] font-semibold text-muted-foreground px-2 py-0.5 rounded bg-muted border border-border">
            {theme === 'dark' ? 'Gelap' : 'Terang'}
          </span>
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Keluar Akun</span>
        </button>
      </div>
    </aside>
  )

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-3 left-3 z-50 p-2 bg-primary text-primary-foreground rounded-lg shadow-md focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="Buka menu navigasi"
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden md:block shrink-0">
        <SidebarContent />
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative z-50">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  )
}
