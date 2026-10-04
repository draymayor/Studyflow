import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'

export function useProfile() {
  const { user } = useAuth()
  const userId = user?.id
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refetch = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('users')
        .select('full_name, matric_no')
        .eq('id', userId)
        .maybeSingle()
      if (fetchError) throw fetchError
      setProfile({ fullName: data?.full_name ?? '', matricNo: data?.matric_no ?? '' })
      setError(null)
    } catch (err) {
      console.error('Fetching profile failed', err)
      setError('We could not load your profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    if (userId) refetch()
  }, [userId, refetch])

  // Returns null on success, or a friendly error message.
  async function updateProfile({ fullName, matricNo }) {
    const name = fullName.trim()
    if (!name) return 'Please enter your full name.'
    try {
      const { error: updateError } = await supabase
        .from('users')
        .update({ full_name: name, matric_no: matricNo.trim() || null })
        .eq('id', userId)
      if (updateError) throw updateError
      await refetch()
      return null
    } catch (err) {
      console.error('Updating profile failed', err)
      if (err?.code === '23505') return 'That matric number is already used by another account.'
      return 'We could not save your profile. Please try again.'
    }
  }

  // Returns null on success, or an error message.
  async function changePassword(password, confirm) {
    if (password.length < 6) return 'Your new password must be at least 6 characters.'
    if (password !== confirm) return 'The two passwords do not match.'
    try {
      const { error: authError } = await supabase.auth.updateUser({ password })
      if (authError) throw authError
      return null
    } catch (err) {
      console.error('Changing password failed', err)
      return err?.message || 'We could not change your password. Please try again.'
    }
  }

  return { email: user?.email ?? '', profile, loading, error, updateProfile, changePassword, refetch }
}
