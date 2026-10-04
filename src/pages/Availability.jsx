import { useState } from 'react'
import { Plus } from 'lucide-react'
import DashboardShell from '../components/layout/DashboardShell.jsx'
import PageHeader from '../components/layout/PageHeader.jsx'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import Input from '../components/ui/Input.jsx'
import Toast from '../components/ui/Toast.jsx'
import AvailabilitySlot from '../components/domain/AvailabilitySlot.jsx'
import { formatTime } from '../lib/time.js'
import ErrorBanner from '../components/ui/ErrorBanner.jsx'
import { useAvailability } from '../hooks/useAvailability.js'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function Availability() {
  const { slots, loading, error, addSlot, deleteSlot } = useAvailability()
  const [draft, setDraft] = useState({ startTime: '', endTime: '' })
  const [activeDay, setActiveDay] = useState(null)
  const [showToast, setShowToast] = useState(false)

  async function handleAddSlot(day) {
    const ok = await addSlot({ dayOfWeek: day, ...draft })
    if (!ok) return
    setDraft({ startTime: '', endTime: '' })
    setActiveDay(null)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2200)
  }

  function handleRemove(id) {
    deleteSlot(id)
  }

  const totalHours = slots.reduce((sum, s) => {
    const [sh, sm] = s.startTime.split(':').map(Number)
    const [eh, em] = s.endTime.split(':').map(Number)
    return sum + (eh * 60 + em - (sh * 60 + sm)) / 60
  }, 0)

  return (
    <DashboardShell>
      <Toast show={showToast} message="Availability updated" />

      <PageHeader
        title="Availability"
        subtitle={loading ? 'Loading your availability…' : `${totalHours.toFixed(1)} hours available per week`}
      />

      <ErrorBanner message={error} />

      <div className="flex flex-col gap-3">
        {DAYS.map((day) => {
          const daySlots = slots.filter((s) => s.dayOfWeek === day)
          const isAdding = activeDay === day

          return (
            <Card key={day}>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[15px] font-semibold text-sf-accent-blue">{day}</p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveDay(isAdding ? null : day)
                    setDraft({ startTime: '', endTime: '' })
                  }}
                  className="flex items-center gap-1 text-[13px] font-medium text-sf-primary hover:text-sf-primary-hover"
                >
                  <Plus size={14} /> Add slot
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {daySlots.length === 0 && !isAdding && (
                  <p className="text-[13px] text-sf-text-muted">No availability set</p>
                )}
                {daySlots.map((slot) => (
                  <AvailabilitySlot
                    key={slot.id}
                    startTime={formatTime(slot.startTime)}
                    endTime={formatTime(slot.endTime)}
                    onRemove={() => handleRemove(slot.id)}
                  />
                ))}
              </div>

              {isAdding && (
                <div className="mt-3 flex flex-wrap items-end gap-3 border-t border-sf-border pt-3">
                  <Input
                    id={`start-${day}`}
                    label="Start"
                    type="time"
                    value={draft.startTime}
                    onChange={(e) => setDraft((d) => ({ ...d, startTime: e.target.value }))}
                    className="min-w-[140px] flex-1 sm:flex-none sm:w-40"
                  />
                  <Input
                    id={`end-${day}`}
                    label="End"
                    type="time"
                    value={draft.endTime}
                    onChange={(e) => setDraft((d) => ({ ...d, endTime: e.target.value }))}
                    className="min-w-[140px] flex-1 sm:flex-none sm:w-40"
                  />
                  <Button size="sm" onClick={() => handleAddSlot(day)}>
                    Save
                  </Button>
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </DashboardShell>
  )
}
