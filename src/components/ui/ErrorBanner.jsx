import { AlertCircle } from 'lucide-react'

export default function ErrorBanner({ message }) {
  if (!message) return null

  return (
    <div
      role="alert"
      className="flex items-start gap-2.5 rounded-lg bg-sf-danger-bg px-3.5 py-3 text-[14px] text-sf-danger"
    >
      <AlertCircle size={18} className="mt-px shrink-0" />
      <p>{message}</p>
    </div>
  )
}
