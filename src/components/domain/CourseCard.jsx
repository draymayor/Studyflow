import { Pencil, Trash2 } from 'lucide-react'

const COLOR_HEX = {
  indigo: '#4F46E5',
  sky: '#0284C7',
  teal: '#0D9488',
  violet: '#7C3AED',
  rose: '#E11D48',
  amber: '#D97706',
}

export default function CourseCard({ course, onEdit, onDelete }) {
  const { courseName, courseCode, creditHours, color } = course
  const hex = COLOR_HEX[color] ?? COLOR_HEX.indigo

  return (
    <div
      className="flex items-center justify-between rounded-xl border border-sf-border bg-white p-4"
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: hex }} />
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold text-sf-text-primary">{courseName}</p>
          <p className="mt-0.5 text-[13px] text-sf-text-secondary">
            {courseCode} · {creditHours} credit{creditHours === 1 ? '' : 's'}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={() => onEdit?.(course)}
          aria-label={`Edit ${courseName}`}
          className="rounded-lg p-2 text-sf-text-muted hover:bg-sf-surface hover:text-sf-primary"
        >
          <Pencil size={16} />
        </button>
        <button
          type="button"
          onClick={() => onDelete?.(course)}
          aria-label={`Delete ${courseName}`}
          className="rounded-lg p-2 text-sf-text-muted hover:bg-sf-surface hover:text-sf-danger"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}
