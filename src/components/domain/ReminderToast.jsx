import { Bell } from 'lucide-react'

export default function ReminderToast({ courseName, startTime }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-sf-warning/30 bg-sf-warning-bg px-4 py-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sf-warning/15 text-sf-warning">
        <Bell size={18} />
      </span>
      <p className="text-[14px] text-sf-text-primary">
        <span className="font-semibold">Next up:</span> {courseName} at{' '}
        <span className="font-semibold">{startTime}</span>
      </p>
    </div>
  )
}
