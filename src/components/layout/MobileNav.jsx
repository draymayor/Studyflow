import { NavLink } from 'react-router-dom'
import { LayoutDashboard, BookOpen, Clock, CalendarDays, FileText, Settings } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: LayoutDashboard, end: true },
  { to: '/courses', label: 'Courses', icon: BookOpen },
  { to: '/availability', label: 'Hours', icon: Clock },
  { to: '/timetable', label: 'Timetable', icon: CalendarDays },
  { to: '/materials', label: 'Materials', icon: FileText },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-sf-border bg-sf-bg">
      <ul className="grid grid-cols-6">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${
                  isActive ? 'text-sf-primary' : 'text-sf-text-muted'
                }`
              }
            >
              <Icon size={20} strokeWidth={2} />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
