import { supabase } from '../supabase.js'

// Replaces the signed-in user's timetable with `entries` (regeneration replaces, never appends).
// The new rows are inserted before the old ones are removed, so a failed insert
// leaves the previous timetable untouched. Returns the inserted rows (with ids).
export async function saveTimetable(entries) {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
  if (sessionError) throw sessionError
  const userId = sessionData.session?.user.id
  if (!userId) throw new Error('Not signed in')

  const { data: existing, error: existingError } = await supabase
    .from('timetable_entries')
    .select('id')
  if (existingError) throw existingError

  let inserted = []
  if (entries.length > 0) {
    const { data: insertedRows, error: insertError } = await supabase.from('timetable_entries').insert(
      entries.map((e) => ({
        user_id: userId,
        course_id: e.courseId,
        day_of_week: e.dayOfWeek,
        start_time: e.startTime,
        end_time: e.endTime,
      })),
    ).select()
    if (insertError) throw insertError
    inserted = insertedRows
  }

  const oldIds = existing.map((row) => row.id)
  if (oldIds.length > 0) {
    const { error: deleteError } = await supabase
      .from('timetable_entries')
      .delete()
      .in('id', oldIds)
    if (deleteError) throw deleteError
  }

  return inserted
}
