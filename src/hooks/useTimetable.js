import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'

// Same position-based colour cycle as useCourses (docs/BRAND.md).
const COLOR_CYCLE = ['indigo', 'sky', 'teal', 'violet', 'rose', 'amber']

export function useTimetable() {
  const { user } = useAuth()
  const userId = user?.id
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refetch = useCallback(async () => {
    try {
      const [entriesRes, coursesRes] = await Promise.all([
        supabase
          .from('timetable_entries')
          .select('*, courses(course_name, course_code, material_url)')
          .order('start_time'),
        supabase.from('courses').select('id').order('created_at'),
      ])
      if (entriesRes.error) throw entriesRes.error
      if (coursesRes.error) throw coursesRes.error

      const colorByCourse = new Map(
        coursesRes.data.map((c, i) => [c.id, COLOR_CYCLE[i % COLOR_CYCLE.length]]),
      )

      setEntries(
        entriesRes.data.map((row) => ({
          id: row.id,
          courseId: row.course_id,
          // course_id is null once its course has been deleted (ON DELETE SET NULL)
          courseName: row.courses?.course_name ?? 'Course removed',
          courseCode: row.courses?.course_code ?? null,
          materialPath: row.courses?.material_url ?? null,
          color: colorByCourse.get(row.course_id) ?? 'slate',
          dayOfWeek: row.day_of_week,
          startTime: row.start_time.slice(0, 5),
          endTime: row.end_time.slice(0, 5),
          isCompleted: row.is_completed,
        })),
      )
      setError(null)
    } catch (err) {
      console.error('Fetching timetable failed', err)
      setError('We could not load your timetable. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (userId) refetch()
  }, [userId, refetch])

  // `completed` defaults to true per docs/DATA_FLOW.md; pass false to undo a tap.
  async function markComplete(entryId, completed = true) {
    try {
      const { error: updateError } = await supabase
        .from('timetable_entries')
        .update({ is_completed: completed })
        .eq('id', entryId)
      if (updateError) throw updateError
      await refetch()
      return true
    } catch (err) {
      console.error('Updating session failed', err)
      setError('We could not update that session. Please try again.')
      return false
    }
  }

  return { entries, loading, error, markComplete, refetch }
}
