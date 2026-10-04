import { Link } from 'react-router-dom'
import { BookOpen, CalendarClock, CheckCircle2, Bell } from 'lucide-react'
import DashboardShell from '../components/layout/DashboardShell.jsx'
import WelcomeBanner from '../components/domain/WelcomeBanner.jsx'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import StatCard from '../components/ui/StatCard.jsx'
import ErrorBanner from '../components/ui/ErrorBanner.jsx'
import { useDashboard } from '../hooks/useDashboard.js'
import { formatTime } from '../lib/time.js'

const COLOR_DOT = {
  indigo: 'bg-sf-course-indigo',
  sky: 'bg-sf-course-sky',
  teal: 'bg-sf-course-teal',
  violet: 'bg-sf-course-violet',
  rose: 'bg-sf-course-rose',
  amber: 'bg-sf-course-amber',
  slate: 'bg-slate-500',
}

export default function Dashboard() {
  const {
    greetingName,
    courseCount,
    totalCredits,
    sessionCount,
    completedCount,
    nextReminder,
    todayName,
    todaySessions,
    loading,
    error,
    markComplete,
  } = useDashboard()

  let emptyToday = 'No sessions today'
  if (courseCount === 0) {
    emptyToday = (
      <>
        You have no courses yet.{' '}
        <Link to="/courses" className="font-medium text-sf-primary">Add your first course in My Courses</Link>.
      </>
    )
  } else if (sessionCount === 0) {
    emptyToday = (
      <>
        You have no timetable yet.{' '}
        <Link to="/timetable" className="font-medium text-sf-primary">Generate it in My Timetable</Link>.
      </>
    )
  }

  return (
    <DashboardShell>
      <WelcomeBanner
        name={greetingName}
        todayName={todayName}
        totalToday={todaySessions.length}
        completedToday={todaySessions.filter((x) => x.isCompleted).length}
        remainingToday={todaySessions.filter((x) => !x.isCompleted).length}
      />

      {error && (
        <div className="mb-4">
          <ErrorBanner message={error} />
        </div>
      )}

      {loading ? (
        <p className="text-[14px] text-sf-text-muted">Loading…</p>
      ) : (
        <>
          <div className="mb-8 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={BookOpen}
              tone="primary"
              value={courseCount}
              label="Courses enrolled"
              sublabel={`${totalCredits} credit hours in total`}
            />
            <StatCard
              icon={CalendarClock}
              tone="blue"
              value={sessionCount}
              label="Sessions this week"
              progress={sessionCount ? (completedCount / sessionCount) * 100 : 0}
              footer={`${completedCount} of ${sessionCount} completed`}
            />
            <StatCard
              icon={CheckCircle2}
              tone="success"
              value={completedCount}
              label="Completed sessions"
              sublabel={sessionCount ? `${Math.round((completedCount / sessionCount) * 100)}% of your week` : 'Nothing scheduled yet'}
            />
            <StatCard
              icon={Bell}
              tone="warning"
              value={nextReminder ? nextReminder.time : '—'}
              label="Next reminder"
              sublabel={
                nextReminder
                  ? `${nextReminder.courseName} · ${nextReminder.day}`
                  : 'No reminders scheduled'
              }
            />
          </div>

          <h2 className="mb-3 text-[18px] font-semibold text-sf-text-primary">
            Today's Sessions · {todayName}
          </h2>
          <div className="flex flex-col gap-3">
            {todaySessions.length === 0 && (
              <Card>
                <p className="text-[14px] text-sf-text-secondary">{emptyToday}</p>
              </Card>
            )}
            {todaySessions.map((session) => (
              <Card key={session.id} className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${COLOR_DOT[session.color]}`} />
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-medium text-sf-text-primary">{session.courseName}</p>
                    <p className="text-[13px] text-sf-text-secondary">
                      {formatTime(session.startTime)} – {formatTime(session.endTime)}
                    </p>
                  </div>
                </div>
                {session.isCompleted ? (
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 text-[13px] font-medium text-sf-success">
                      <CheckCircle2 size={16} /> Completed
                    </span>
                    <Button size="sm" variant="ghost" onClick={() => markComplete(session.id, false)}>
                      Undo
                    </Button>
                  </div>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => markComplete(session.id)}>
                    Mark Complete
                  </Button>
                )}
              </Card>
            ))}
          </div>
        </>
      )}
    </DashboardShell>
  )
}
