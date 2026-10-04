import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 sm:items-center">
      <div className="w-full max-w-md rounded-t-2xl bg-sf-bg p-5 sm:rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-sf-text-primary">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1 text-sf-text-muted hover:bg-sf-surface hover:text-sf-text-primary"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
