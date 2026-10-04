import { useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useCourses } from './useCourses.js'
import {
  materialPath,
  openMaterial,
  removeMaterialFile,
  uploadMaterialFile,
} from '../lib/materials.js'

const MAX_BYTES = 10 * 1024 * 1024

async function setMaterialUrl(courseId, value) {
  const { error } = await supabase.from('courses').update({ material_url: value }).eq('id', courseId)
  if (error) throw error
}

export function useMaterials() {
  const { user } = useAuth()
  const userId = user?.id
  const { courses, loading, error: loadError, refetch } = useCourses()
  const [busyId, setBusyId] = useState(null)
  const [actionError, setActionError] = useState(null)

  async function run(courseId, failureMessage, task) {
    setBusyId(courseId)
    setActionError(null)
    try {
      await task()
      return true
    } catch (err) {
      console.error(failureMessage, err)
      setActionError(failureMessage)
      return false
    } finally {
      setBusyId(null)
    }
  }

  async function uploadMaterial(courseId, file) {
    if (!file) return false
    if (file.type !== 'application/pdf') {
      setActionError('Only PDF files can be uploaded. Please choose a .pdf file.')
      return false
    }
    if (file.size > MAX_BYTES) {
      setActionError('That file is larger than 10 MB. Please choose a smaller PDF.')
      return false
    }
    const path = materialPath(userId, courseId)
    return run(courseId, 'We could not upload that file. Please try again.', async () => {
      await uploadMaterialFile(path, file)
      await setMaterialUrl(courseId, path)
      await refetch()
    })
  }

  function viewMaterial(path) {
    return run(null, 'We could not open that file. Please try again.', () => openMaterial(path))
  }

  function removeMaterial(courseId, path) {
    return run(courseId, 'We could not remove that file. Please try again.', async () => {
      await removeMaterialFile(path)
      await setMaterialUrl(courseId, null)
      await refetch()
    })
  }

  return {
    courses,
    loading,
    error: actionError || loadError,
    busyId,
    uploadMaterial,
    viewMaterial,
    removeMaterial,
    clearError: () => setActionError(null),
  }
}
