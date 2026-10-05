import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import DashboardShell from '../components/layout/DashboardShell.jsx'
import PageHeader from '../components/layout/PageHeader.jsx'
import Button from '../components/ui/Button.jsx'
import Badge from '../components/ui/Badge.jsx'
import Toast from '../components/ui/Toast.jsx'
import ErrorBanner from '../components/ui/ErrorBanner.jsx'
import TimetableGrid from '../components/domain/TimetableGrid.jsx'
import ReminderControl from '../components/domain/ReminderControl.jsx'
import { useTimetable } from '../hooks/useTimetable.js'
import { useCourses } from '../hooks/useCourses.js'
import { useAvailability } from '../hooks/useAvailability.js'
import { generateTimetable } from '../lib/algorithm/generateTimetable.js'
import { saveTimetable } from '../lib/algorithm/saveTimetable.js'
import { openMaterial } from '../lib/materials.js'
import { scheduleNotifications } from '../lib/algorithm/scheduleNotifications.js'

const LEGEND_DOT = {
  indigo: 'bg-sf-course-indigo',
  sky: 'bg-sf-course-sky',
  teal: 'bg-sf-course-teal',
  violet: 'bg-sf-course-violet',
  rose: 'bg-sf-course-rose',
  amber: 'bg-sf-course-amber',
  slate: 'bg-slate-500',
}

export default function Timetable() {
  const { entries, loading, error, markComplete, refetch } = useTimetable()
  const { courses, loading: coursesLoading } = useCourses()
  const { slots, loading: slotsLoading } = useAvailability()
  const [generating, setGenerating] = useState(false)
  const [message, setMessage] = useState('')
  const [warning, setWarning] = useState('')
  const [info, setInfo] = useState('')
  const [showToast, setShowToast] = useState(false)

  // One legend chip per course that appears in the timetable.
  const legend = [...new Map(entries.map((e) => [e.courseName, e])).values()]

  async function handleGenerate() {
    setMessage('')
    setWarning('')
    setInfo('')
    if (courses.length === 0 && slots.length === 0) {
      setMessage('Add your courses and weekly availability first, then generate your timetable.')
      return
    }
    if (courses.length === 0) {
      setMessage('Add at least one course first, then generate your timetable.')
      return
    }
    if (slots.length === 0) {
      setMessage('Add your weekly availability first, then generate your timetable.')
      return
    }

    setGenerating(true)
    try {
      const generated = generateTimetable({
        courses,
        availabilitySlots: slots,
        sessionDurationMinutes: 90,
      })
      if (generated.length === 0) {
        setMessage('Your availability slots are shorter than one 90-minute session. Add longer slots to generate a timetable.')
        return
      }
      const signature = (list) =>
        list
          .map((e) => `${e.courseId}|${e.dayOfWeek}|${e.startTime}|${e.endTime}`)
          .sort()
          .join(';')
      if (entries.length > 0 && signature(generated) === signature(entries)) {
        setInfo('Your timetable is already up to date with your courses and availability.')
        return
      }
      const saved = await saveTimetable(generated)
      try {
        await scheduleNotifications(saved)
      } catch (err) {
        // The timetable is already saved; only the reminders failed.
        console.error('Scheduling reminders failed', err)
        setWarning('Your timetable is saved, but we could not schedule its reminders. Try regenerating to retry.')
      }
      await refetch()
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2200)
    } catch (err) {
      console.error('Generating timetable failed', err)
      setMessage('We could not generate your timetable. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  function toggleComplete(session) {
    markComplete(session.id, !session.isCompleted)
  }

  async function handleOpenMaterial(path) {
    try {
      await openMaterial(path)
    } catch (err) {
      console.error('Opening material failed', err)
      setMessage('We could not open that file. Please try again.')
    }
  }

  return (
    <DashboardShell>
      <Toast show={showToast} message="Timetable generated" />

      <PageHeader
        title="My Timetable"
        subtitle="Generated from your courses and availability"
        action={
          <Button
            size="sm"
            variant="outline"
            onClick={handleGenerate}
            disabled={generating || coursesLoading || slotsLoading}
          >
            <RefreshCw size={15} />
            {generating ? 'Generating…' : entries.length > 0 ? 'Regenerate' : 'Generate'}
          </Button>
        }
      />

      {warning && (
        <p className="mb-4 rounded-lg bg-sf-warning-bg px-3.5 py-3 text-[14px] text-sf-warning">
          {warning}
        </p>
      )}

      {info && (
        <p className="mb-4 rounded-lg bg-sf-success-bg px-3.5 py-3 text-[14px] text-sf-success">{info}</p>
      )}

      <ReminderControl />

      {(message || error) && (
        <div className="mb-4">
          <ErrorBanner message={message || error} />
        </div>
      )}

      {loading ? (
        <p className="text-[14px] text-sf-text-muted">Loading…</p>
      ) : entries.length === 0 ? (
        <p className="rounded-xl border border-dashed border-sf-border p-8 text-center text-[14px] text-sf-text-secondary">
          No timetable yet. Press Generate to build one from your courses and availability.
        </p>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap gap-2">
            {legend.map((e) => (
              <Badge key={e.courseName} tone="neutral" className="gap-1.5">
                <span className={`h-2 w-2 rounded-full ${LEGEND_DOT[e.color]}`} />
                {e.courseCode ?? e.courseName}
              </Badge>
            ))}
          </div>

          <TimetableGrid
            entries={entries}
            onMarkComplete={toggleComplete}
            onOpenMaterial={handleOpenMaterial}
          />

          <p className="mt-4 text-center text-[12px] text-sf-text-muted">
            Tap a session to mark it complete. Tap it again to undo.
          </p>
        </>
      )}
    </DashboardShell>
  )
}
