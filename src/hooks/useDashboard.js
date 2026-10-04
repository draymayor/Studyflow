import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useCourses } from './useCourses.js'
import { useTimetable } from './useTimetable.js'

function formatReminder(date) {
  return {
    day: date.toLocaleDateString('en-US', { weekday: 'long' }),
    time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
  }
}

export function useDashboard() {
  const { user } = useAuth()
  const userId = user?.id
  const { courses, loading: coursesLoading, error: coursesError } = useCourses()
  const { entries, loading: entriesLoading, error: entriesError, markComplete } = useTimetable()
  const [fullName, setFullName] = useState(null)
  const [nextReminder, setNextReminder] = useState(null)
  const [extrasLoading, setExtrasLoading] = useState(true)
  const [extrasError, setExtrasError] = useState(null)

  const refetchExtras = useCallback(async () => {
    try {
      const [profileRes, reminderRes] = await Promise.all([
        supabase.from('users').select('full_name').eq('id', userId).maybeSingle(),
        supabase
          .from('notifications')
          .select('scheduled_at, timetable_entries(courses(course_name))')
          .eq('user_id', userId)
          .eq('is_sent', false)
          .gt('scheduled_at', new Date().toISOString())
          .order('scheduled_at')
          .limit(1)
          .maybeSingle(),
      ])
      if (profileRes.error) throw profileRes.error
      if (reminderRes.error) throw reminderRes.error

      setFullName(profileRes.data?.full_name ?? null)
      const reminder = reminderRes.data
      setNextReminder(
        reminder
          ? {
              ...formatReminder(new Date(reminder.scheduled_at)),
              // course_id is null once its course has been deleted
              courseName: reminder.timetable_entries?.courses?.course_name ?? 'Course removed',
            }
          : null,
      )
      setExtrasError(null)
    } catch (err) {
      console.error('Fetching dashboard data failed', err)
      setExtrasError('We could not load your dashboard. Please try again.')
    } finally {
      setExtrasLoading(false)
    }
  }, [userId])

  useEffect(() => {
    if (userId) refetchExtras()
  }, [userId, refetchExtras])

  const greetingName = fullName?.trim() || user?.email?.split('@')[0] || ''
  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' })
  const todaySessions = entries
    .filter((e) => e.dayOfWeek === todayName)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))

  return {
    greetingName,
    courseCount: courses.length,
    totalCredits: courses.reduce((sum, c) => sum + c.creditHours, 0),
    sessionCount: entries.length,
    completedCount: entries.filter((e) => e.isCompleted).length,
    nextReminder,
    todayName,
    todaySessions,
    loading: coursesLoading || entriesLoading || extrasLoading,
    error: coursesError || entriesError || extrasError,
    markComplete,
  }
}
