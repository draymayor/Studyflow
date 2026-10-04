import { formatTime } from '../../lib/time.js'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const COLOR_HEX = {
  indigo: '#4F46E5',
  sky: '#0284C7',
  teal: '#0D9488',
  violet: '#7C3AED',
  rose: '#E11D48',
  amber: '#D97706',
  slate: '#64748B',
}

export default function TimetableGrid({ entries, onMarkComplete, onOpenMaterial }) {
  return (
    <div className="flex flex-col gap-4">
      {DAYS.map((day) => {
        const sessions = entries
          .filter((e) => e.dayOfWeek === day)
          .sort((a, b) => a.startTime.localeCompare(b.startTime))

        return (
          <section key={day}>
            <h2 className="rounded-lg bg-sf-accent-blue px-3.5 py-2 text-[14px] font-semibold text-white">
              {day}
            </h2>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {sessions.length === 0 && (
                <p className="px-1 text-[13px] text-sf-text-muted">No sessions</p>
              )}
              {sessions.map((session) => {
                const hex = COLOR_HEX[session.color] ?? COLOR_HEX.indigo
                const card = (
                  <button
                    type="button"
                    onClick={() => onMarkComplete?.(session)}
                    className={`w-full rounded-lg border border-sf-border bg-white px-3.5 py-3 text-left text-[14px] leading-snug text-sf-text-primary transition-opacity ${session.isCompleted ? 'opacity-40' : ''}`}
                  >
                    <span className="mb-1 flex items-center gap-2">
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: hex }}
                      />
                      <span className="truncate font-semibold">{session.courseName}</span>
                    </span>
                    <p className="text-[13px] text-sf-text-secondary">
                      {formatTime(session.startTime)} – {formatTime(session.endTime)}
                    </p>
                  </button>
                )
                if (!session.materialPath) return <div key={session.id}>{card}</div>
                return (
                  <div key={session.id} className="flex flex-col">
                    {card}
                    <button
                      type="button"
                      onClick={() => onOpenMaterial?.(session.materialPath)}
                      className="mt-1 self-start px-1 text-[13px] font-medium text-sf-primary hover:underline"
                    >
                      Open material
                    </button>
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
