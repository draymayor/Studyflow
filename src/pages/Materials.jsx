import { useState } from 'react'
import { CheckCircle2, ExternalLink, FileText, Trash2, Upload } from 'lucide-react'
import DashboardShell from '../components/layout/DashboardShell.jsx'
import PageHeader from '../components/layout/PageHeader.jsx'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import Toast from '../components/ui/Toast.jsx'
import ErrorBanner from '../components/ui/ErrorBanner.jsx'
import { useMaterials } from '../hooks/useMaterials.js'

const COLOR_HEX = {
  indigo: '#4F46E5',
  sky: '#0284C7',
  teal: '#0D9488',
  violet: '#7C3AED',
  rose: '#E11D48',
  amber: '#D97706',
}

export default function Materials() {
  const { courses, loading, error, busyId, uploadMaterial, viewMaterial, removeMaterial, clearError } =
    useMaterials()
  const [toastMessage, setToastMessage] = useState('')

  function flashToast(message) {
    setToastMessage(message)
    setTimeout(() => setToastMessage(''), 2200)
  }

  async function handleFile(course, e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (await uploadMaterial(course.id, file)) flashToast('Material uploaded')
  }

  async function handleRemove(course) {
    if (await removeMaterial(course.id, course.materialUrl)) flashToast('Material removed')
  }

  return (
    <DashboardShell>
      <Toast show={Boolean(toastMessage)} message={toastMessage} />

      <PageHeader title="Course Materials" subtitle="Upload PDFs for each of your courses" />

      <div className="mb-4">
        <ErrorBanner message={error} />
      </div>

      {loading ? (
        <p className="text-[14px] text-sf-text-muted">Loading…</p>
      ) : courses.length === 0 ? (
        <p className="rounded-xl border border-dashed border-sf-border p-8 text-center text-[14px] text-sf-text-secondary">
          Add a course first, then upload its PDF here.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const hex = COLOR_HEX[course.color] ?? COLOR_HEX.indigo
            const hasMaterial = Boolean(course.materialUrl)
            const busy = busyId === course.id

            return (
              <Card key={course.id} style={{ backgroundColor: `${hex}0A` }}>
                <div className="mb-3 flex items-center gap-2.5">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: hex }} />
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-semibold text-sf-text-primary">
                      {course.courseName}
                    </p>
                    <p className="text-[13px] text-sf-text-secondary">{course.courseCode}</p>
                  </div>
                </div>

                {hasMaterial ? (
                  <div className="flex items-center gap-2 rounded-lg bg-sf-bg px-3 py-2.5">
                    <CheckCircle2 size={16} className="shrink-0 text-sf-success" />
                    <p className="truncate text-[13px] font-medium text-sf-text-primary">PDF attached</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 rounded-lg bg-sf-bg px-3 py-2.5 text-sf-text-muted">
                    <FileText size={16} className="shrink-0" />
                    <p className="text-[13px]">No file attached</p>
                  </div>
                )}

                <div className="mt-3 flex flex-col gap-2">
                  <label
                    className={`inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      hasMaterial
                        ? 'border border-sf-border text-sf-text-primary hover:bg-sf-surface'
                        : 'bg-sf-primary text-white hover:bg-sf-primary-hover'
                    } ${busy ? 'pointer-events-none opacity-50' : ''}`}
                  >
                    <Upload size={15} />
                    {busy ? 'Working…' : hasMaterial ? 'Replace PDF' : 'Upload PDF'}
                    <input
                      type="file"
                      accept="application/pdf"
                      className="sr-only"
                      disabled={busy}
                      onClick={clearError}
                      onChange={(e) => handleFile(course, e)}
                    />
                  </label>

                  {hasMaterial && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        disabled={busy}
                        onClick={() => viewMaterial(course.materialUrl)}
                      >
                        <ExternalLink size={15} /> View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 !text-sf-danger"
                        disabled={busy}
                        onClick={() => handleRemove(course)}
                      >
                        <Trash2 size={15} /> Remove
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </DashboardShell>
  )
}
