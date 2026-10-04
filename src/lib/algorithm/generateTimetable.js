// Credit-hour-weighted study timetable generator (docs/DATA_FLOW.md §4, report §3.6.6).
// Pure function: no React, no Supabase. Rule-based only.

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

function toMinutes(time) {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

function toTime(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

// Sorts slots by day then start, and merges slots that overlap on the same day,
// so two overlapping availability entries can never produce clashing sessions.
function normaliseSlots(availabilitySlots) {
  const sorted = availabilitySlots
    .map((s) => ({ dayOfWeek: s.dayOfWeek, start: toMinutes(s.startTime), end: toMinutes(s.endTime) }))
    .filter((s) => DAY_ORDER.includes(s.dayOfWeek) && s.end > s.start)
    .sort((a, b) => DAY_ORDER.indexOf(a.dayOfWeek) - DAY_ORDER.indexOf(b.dayOfWeek) || a.start - b.start)

  const merged = []
  for (const slot of sorted) {
    const last = merged[merged.length - 1]
    if (last && last.dayOfWeek === slot.dayOfWeek && slot.start < last.end) {
      last.end = Math.max(last.end, slot.end)
    } else {
      merged.push({ ...slot })
    }
  }
  return merged
}

export function generateTimetable({ courses, availabilitySlots, sessionDurationMinutes = 90 }) {
  if (!courses?.length || !availabilitySlots?.length || sessionDurationMinutes <= 0) return []

  const slots = normaliseSlots(availabilitySlots)

  // 1. total credit hours
  const totalCredits = courses.reduce((sum, c) => sum + c.creditHours, 0)
  // 2. total available minutes
  const totalAvailableMinutes = slots.reduce((sum, s) => sum + (s.end - s.start), 0)
  if (totalCredits <= 0 || totalAvailableMinutes <= 0) return []

  // 3. weight -> study minutes -> session count per course
  const planned = courses.map((course) => {
    const weight = course.creditHours / totalCredits
    const studyMinutes = weight * totalAvailableMinutes
    return { courseId: course.id, sessionCount: Math.round(studyMinutes / sessionDurationMinutes) }
  })

  // 4. sort by session count, descending (stable, so ties keep input order)
  planned.sort((a, b) => b.sessionCount - a.sessionCount)

  // 5. walk the slots, assigning sessions round-robin. A session is only placed if it
  //    fits fully in what is left of the slot, so there are no partial sessions.
  const entries = []
  let pointer = 0
  const hasRemaining = () => planned.some((p) => p.sessionCount > 0)

  for (const slot of slots) {
    let cursor = slot.start
    while (cursor + sessionDurationMinutes <= slot.end && hasRemaining()) {
      while (planned[pointer % planned.length].sessionCount === 0) pointer++
      const course = planned[pointer % planned.length]
      pointer++

      entries.push({
        courseId: course.courseId,
        dayOfWeek: slot.dayOfWeek,
        startTime: toTime(cursor),
        endTime: toTime(cursor + sessionDurationMinutes),
      })
      course.sessionCount--
      cursor += sessionDurationMinutes
    }
  }

  // 6. flat list of entries
  return entries
}
