import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function WelcomeBanner({ name, todayName, remainingToday, completedToday, totalToday }) {
  let message = 'No sessions today. Enjoy the rest.'
  if (totalToday > 0 && remainingToday === 0) message = `All ${totalToday} of today's sessions are done. Well done.`
  else if (totalToday > 0)
    message = `You have ${remainingToday} session${remainingToday === 1 ? '' : 's'} left today${completedToday > 0 ? `, ${completedToday} done` : ''}.`

  return (
    <section className="relative mb-6 overflow-hidden rounded-2xl bg-sf-primary px-6 py-7 text-white sm:px-8 sm:py-9">
      <span className="pointer-events-none absolute -right-10 -top-14 h-52 w-52 rounded-full bg-white/10" />
      <span className="pointer-events-none absolute -bottom-20 right-24 h-44 w-44 rounded-full bg-white/10" />
      <div className="relative">
        <p className="text-[13px] font-medium uppercase tracking-wide text-white/70">{todayName}</p>
        <h1 className="mt-1 text-[26px] font-bold leading-tight sm:text-[30px]">
          {name ? `Welcome back, ${name}` : 'Welcome back'}
        </h1>
        <p className="mt-2 max-w-md text-[15px] text-white/80">{message}</p>
        <Link
          to="/timetable"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-sf-primary transition-colors hover:bg-sf-primary-light"
        >
          View my timetable <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  )
}
