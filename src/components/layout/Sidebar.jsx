import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import {
  LayoutDashboard,
  BookOpen,
  Clock,
  CalendarDays,
  FileText,
  Settings,
  LogOut,
} from 'lucide-react'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/courses', label: 'My Courses', icon: BookOpen },
  { to: '/availability', label: 'Availability', icon: Clock },
  { to: '/timetable', label: 'My Timetable', icon: CalendarDays },
  { to: '/materials', label: 'Course Materials', icon: FileText },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const { signOut } = useAuth()

  async function handleSignOut() {
    try {
      await signOut()
    } catch (err) {
      console.error('signOut failed', err)
    }
    navigate('/login', { replace: true })
  }

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-sf-primary md:flex">
      <div className="px-6 py-6">
        <h1 className="text-xl font-bold">
          <span className="text-white">Study</span>
          <span className="text-sf-primary-light">Flow</span>
        </h1>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium transition-colors ${
                isActive
                  ? 'bg-white/15 text-white'
                  : 'text-white/75 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon size={18} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/15 px-3 py-4">
        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium text-white/75 transition-colors hover:bg-white/10 hover:text-white"
        >
          <LogOut size={18} strokeWidth={2} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
