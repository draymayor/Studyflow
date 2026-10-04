import { CheckCircle2 } from 'lucide-react'

export default function Toast({ show, message }) {
  if (!show) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 top-6 z-50 flex justify-center px-4">
      <div className="flex items-center gap-2.5 rounded-xl bg-sf-text-primary px-4 py-3 text-white shadow-lg shadow-slate-900/20">
        <CheckCircle2 size={18} className="shrink-0 text-sf-success" />
        <p className="text-[14px] font-medium">{message}</p>
      </div>
    </div>
  )
}
