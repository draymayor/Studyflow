import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'

// Postgres TIME comes back as "HH:MM:SS"; the UI works in "HH:MM".
function fromRow(row) {
  return {
    id: row.id,
    dayOfWeek: row.day_of_week,
    startTime: row.start_time.slice(0, 5),
    endTime: row.end_time.slice(0, 5),
  }
}

export function useAvailability() {
  const { user } = useAuth()
  const userId = user?.id
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refetch = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('availability')
        .select('*')
        .order('day_of_week')
        .order('start_time')
      if (fetchError) throw fetchError
      setSlots(data.map(fromRow))
      setError(null)
    } catch (err) {
      console.error('Fetching availability failed', err)
      setError('We could not load your availability. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (userId) refetch()
  }, [userId, refetch])

  async function addSlot({ dayOfWeek, startTime, endTime }) {
    if (!startTime || !endTime || endTime <= startTime) {
      setError('End time must be after start time.')
      return false
    }
    try {
      const { error: insertError } = await supabase.from('availability').insert({
        user_id: userId,
        day_of_week: dayOfWeek,
        start_time: startTime,
        end_time: endTime,
      })
      if (insertError) throw insertError
      await refetch()
      return true
    } catch (err) {
      console.error('Adding slot failed', err)
      setError('We could not save that time slot. Please try again.')
      return false
    }
  }

  async function deleteSlot(slotId) {
    try {
      const { error: deleteError } = await supabase.from('availability').delete().eq('id', slotId)
      if (deleteError) throw deleteError
      await refetch()
      return true
    } catch (err) {
      console.error('Deleting slot failed', err)
      setError('We could not remove that time slot. Please try again.')
      return false
    }
  }

  return { slots, loading, error, addSlot, deleteSlot, refetch }
}
