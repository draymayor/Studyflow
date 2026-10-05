import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'

// Course colour tags cycle in order (docs/BRAND.md). Derived from list position, not stored.
const COLOR_CYCLE = ['indigo', 'sky', 'teal', 'violet', 'rose', 'amber']

function fromRow(row, index) {
  return {
    id: row.id,
    courseName: row.course_name,
    courseCode: row.course_code,
    creditHours: row.credit_hours,
    materialUrl: row.material_url,
    color: COLOR_CYCLE[index % COLOR_CYCLE.length],
  }
}

function isValidCredit(value) {
  return Number.isInteger(value) && value >= 1 && value <= 6
}

export function useCourses() {
  const { user } = useAuth()
  const userId = user?.id
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refetch = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('courses')
        .select('*')
        .order('created_at')
      if (fetchError) throw fetchError
      setCourses(data.map(fromRow))
      setError(null)
    } catch (err) {
      console.error('Fetching courses failed', err)
      setError('We could not load your courses. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (userId) refetch()
  }, [userId, refetch])

  async function addCourse({ courseName, courseCode, creditHours }) {
    if (!isValidCredit(creditHours)) {
      setError('Credit hours must be a whole number from 1 to 6.')
      return false
    }
    try {
      const { error: insertError } = await supabase.from('courses').insert({
        user_id: userId,
        course_name: courseName,
        course_code: courseCode,
        credit_hours: creditHours,
      })
      if (insertError) throw insertError
      await refetch()
      return true
    } catch (err) {
      console.error('Adding course failed', err)
      setError('We could not save that course. Please try again.')
      return false
    }
  }

  async function updateCourse(courseId, updates) {
    const row = {}
    if (updates.courseName !== undefined) row.course_name = updates.courseName
    if (updates.courseCode !== undefined) row.course_code = updates.courseCode
    if (updates.creditHours !== undefined) {
      if (!isValidCredit(updates.creditHours)) {
        setError('Credit hours must be a whole number from 1 to 6.')
        return false
      }
      row.credit_hours = updates.creditHours
    }
    try {
      const { error: updateError } = await supabase.from('courses').update(row).eq('id', courseId)
      if (updateError) throw updateError
      await refetch()
      return true
    } catch (err) {
      console.error('Updating course failed', err)
      setError('We could not update that course. Please try again.')
      return false
    }
  }

  async function deleteCourse(courseId) {
    // Remove the course's PDF first, using the stored path (never rebuilt). If that fails the
    // course row is kept, so a file is never left behind without its course.
    try {
      const { data: course, error: readError } = await supabase
        .from('courses')
        .select('material_url')
        .eq('id', courseId)
        .maybeSingle()
      if (readError) throw readError
      if (course?.material_url) {
        const { error: removeError } = await supabase.storage.from('materials').remove([course.material_url])
        if (removeError) {
          console.error('Removing course PDF failed', removeError)
          setError('This course was not deleted because its PDF could not be removed from storage. Please try again.')
          return false
        }
      }
    } catch (err) {
      console.error('Checking course PDF failed', err)
      setError('This course was not deleted because we could not check its PDF. Please try again.')
      return false
    }

    try {
      const { error: deleteError } = await supabase.from('courses').delete().eq('id', courseId)
      if (deleteError) throw deleteError
      await refetch()
      return true
    } catch (err) {
      console.error('Deleting course failed', err)
      setError('We could not delete that course. Please try again.')
      return false
    }
  }

  return { courses, loading, error, addCourse, updateCourse, deleteCourse, refetch }
}
