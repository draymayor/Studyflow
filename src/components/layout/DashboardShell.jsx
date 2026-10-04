import Sidebar from './Sidebar.jsx'
import MobileNav from './MobileNav.jsx'

export default function DashboardShell({ children }) {
  return (
    <div className="flex min-h-screen bg-sf-bg">
      <Sidebar />
      <main className="flex-1 overflow-y-auto px-4 pb-24 pt-6 sm:px-6 md:px-10 md:py-8 md:pb-8">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
      <div className="md:hidden">
        <MobileNav />
      </div>
    </div>
  )
}
