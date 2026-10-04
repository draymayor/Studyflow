import { useState } from 'react'
import { Plus } from 'lucide-react'
import DashboardShell from '../components/layout/DashboardShell.jsx'
import PageHeader from '../components/layout/PageHeader.jsx'
import Button from '../components/ui/Button.jsx'
import Input from '../components/ui/Input.jsx'
import Select from '../components/ui/Select.jsx'
import Modal from '../components/ui/Modal.jsx'
import Toast from '../components/ui/Toast.jsx'
import ErrorBanner from '../components/ui/ErrorBanner.jsx'
import CourseCard from '../components/domain/CourseCard.jsx'
import { useCourses } from '../hooks/useCourses.js'

export default function Courses() {
  const { courses, loading, error, addCourse, deleteCourse } = useCourses()
  const [isModalOpen, setModalOpen] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ courseName: '', courseCode: '', creditHours: '3' })

  async function handleAddCourse(e) {
    e.preventDefault()
    setSubmitting(true)
    const ok = await addCourse({
      courseName: form.courseName.trim(),
      courseCode: form.courseCode.trim(),
      creditHours: Number(form.creditHours),
    })
    setSubmitting(false)
    if (!ok) return
    setForm({ courseName: '', courseCode: '', creditHours: '3' })
    setModalOpen(false)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2200)
  }

  function handleDelete(course) {
    deleteCourse(course.id)
  }

  return (
    <DashboardShell>
      <Toast show={showToast} message="Course added" />

      <PageHeader
        title="My Courses"
        subtitle={loading ? 'Loading your courses…' : `${courses.length} course${courses.length === 1 ? '' : 's'} added`}
        action={
          <Button onClick={() => setModalOpen(true)}>
            <Plus size={16} /> Add Course
          </Button>
        }
      />

      <ErrorBanner message={error} />

      {loading ? (
        <p className="text-[14px] text-sf-text-muted">Loading…</p>
      ) : courses.length === 0 ? (
        <p className="rounded-xl border border-dashed border-sf-border p-8 text-center text-[14px] text-sf-text-secondary">
          Add your first course to get started.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <Modal open={isModalOpen} onClose={() => setModalOpen(false)} title="Add a course">
        <form onSubmit={handleAddCourse} className="flex flex-col gap-4">
          <Input
            id="courseName"
            label="Course name"
            placeholder="e.g. Database Management Systems"
            value={form.courseName}
            onChange={(e) => setForm((f) => ({ ...f, courseName: e.target.value }))}
            required
          />
          <Input
            id="courseCode"
            label="Course code"
            placeholder="e.g. CIT 405"
            value={form.courseCode}
            onChange={(e) => setForm((f) => ({ ...f, courseCode: e.target.value }))}
            required
          />
          <Select
            id="creditHours"
            label="Credit hours"
            value={form.creditHours}
            onChange={(e) => setForm((f) => ({ ...f, creditHours: e.target.value }))}
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n} credit{n === 1 ? '' : 's'}
              </option>
            ))}
          </Select>
          <Button type="submit" fullWidth className="mt-1" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save course'}
          </Button>
        </form>
      </Modal>
    </DashboardShell>
  )
}
