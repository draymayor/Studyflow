import { supabase } from './supabase.js'

const BUCKET = 'materials'
const SIGNED_URL_SECONDS = 3600

// courses.material_url holds this storage path, never a URL (the bucket is private).
export function materialPath(userId, courseId) {
  return `${userId}/${courseId}.pdf`
}

export async function getSignedMaterialUrl(path) {
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, SIGNED_URL_SECONDS)
  if (error) throw error
  return data.signedUrl
}

// Opens the PDF in a new tab. The tab is opened before the async call so popup blockers
// treat it as part of the click.
export async function openMaterial(path) {
  const tab = window.open('', '_blank')
  try {
    const url = await getSignedMaterialUrl(path)
    if (tab) tab.location.href = url
    else window.location.assign(url)
  } catch (err) {
    if (tab) tab.close()
    throw err
  }
}

export async function uploadMaterialFile(path, file) {
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true, contentType: 'application/pdf' })
  if (error) throw error
}

export async function removeMaterialFile(path) {
  const { error } = await supabase.storage.from(BUCKET).remove([path])
  if (error) throw error
}
