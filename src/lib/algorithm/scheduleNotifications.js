import { supabase } from '../supabase.js'

const DAY_INDEX = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 }

// Next occurrence of `dayOfWeek` at `startTime` ("HH:MM" or "HH:MM:SS") in the browser's local
// time zone, strictly after `now`. If it has already passed today, it moves to next week.
export function nextOccurrence(dayOfWeek, startTime, now = new Date()) {
  const [hours, minutes] = startTime.split(':').map(Number)
  const target = new Date(now)
  target.setHours(hours, minutes, 0, 0)
  target.setDate(target.getDate() + ((DAY_INDEX[dayOfWeek] - now.getDay() + 7) % 7))
  if (target <= now) target.setDate(target.getDate() + 7)
  return target
}

// ISO 8601 timestamp carrying the local UTC offset, e.g. 2026-10-05T18:00:00+01:00
export function toLocalIso(date) {
  const pad = (n) => String(n).padStart(2, '0')
  const offset = -date.getTimezoneOffset()
  const sign = offset >= 0 ? '+' : '-'
  const abs = Math.abs(offset)
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}` +
    `${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`
  )
}

// `entries` are the saved timetable_entries rows (with ids) returned by saveTimetable().
// Old notifications disappear with their entries (ON DELETE CASCADE on timetable_entry_id).
export async function scheduleNotifications(entries) {
  if (entries.length === 0) return
  const now = new Date()

  const { error } = await supabase.from('notifications').insert(
    entries.map((entry) => ({
      user_id: entry.user_id,
      timetable_entry_id: entry.id,
      scheduled_at: toLocalIso(nextOccurrence(entry.day_of_week, entry.start_time, now)),
    })),
  )
  if (error) throw error
}
