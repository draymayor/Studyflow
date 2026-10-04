// Reminder sender (Supabase Edge Function).
// Sends Web Push notifications for study sessions whose notifications row is due.
// Needs these secrets: VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY and VAPID_SUBJECT
// (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided by Supabase).
// A Supabase cron job calls it every minute.
// Already deployed in Supabase; this copy is for the repository.

import { createClient } from 'npm:@supabase/supabase-js@2'
import webpush from 'npm:web-push@3.6.7'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

webpush.setVapidDetails(
  Deno.env.get('VAPID_SUBJECT')!,
  Deno.env.get('VAPID_PUBLIC_KEY')!,
  Deno.env.get('VAPID_PRIVATE_KEY')!,
)

const STALE_AFTER_MS = 10 * 60 * 1000
const WEEK_MS = 7 * 24 * 60 * 60 * 1000

function to12h(t: string): string {
  const [h, m] = t.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${String(m).padStart(2, '0')} ${suffix}`
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

Deno.serve(async () => {
  const now = Date.now()
  const summary = {
    due: 0,
    sent: 0,
    skippedStale: 0,
    noSubscription: 0,
    failedPushes: 0,
    removedSubscriptions: 0,
    nextScheduled: 0,
  }

  const { data: dueRows, error: dueError } = await supabase
    .from('notifications')
    .select('id')
    .eq('is_sent', false)
    .lte('scheduled_at', new Date(now).toISOString())
    .limit(200)

  if (dueError) return json({ error: dueError.message }, 500)
  if (!dueRows || dueRows.length === 0) return json(summary)

  // Claim atomically: only rows still unsent are flipped, so overlapping runs never double-send.
  const { data: claimed, error: claimError } = await supabase
    .from('notifications')
    .update({ is_sent: true })
    .in('id', dueRows.map((r) => r.id))
    .eq('is_sent', false)
    .select(
      'id, user_id, scheduled_at, timetable_entry_id, timetable_entries(day_of_week, start_time, end_time, courses(course_name))',
    )

  if (claimError) return json({ error: claimError.message }, 500)

  for (const n of claimed ?? []) {
    summary.due++
    const scheduled = new Date(n.scheduled_at).getTime()

    // Schedule the same session for the next week that is still in the future.
    let next = scheduled + WEEK_MS
    while (next <= now) next += WEEK_MS
    const { error: nextError } = await supabase.from('notifications').insert({
      user_id: n.user_id,
      timetable_entry_id: n.timetable_entry_id,
      scheduled_at: new Date(next).toISOString(),
    })
    if (nextError) console.error('next-week insert failed', nextError.message)
    else summary.nextScheduled++

    if (now - scheduled > STALE_AFTER_MS) {
      summary.skippedStale++
      continue
    }

    const entry = Array.isArray(n.timetable_entries) ? n.timetable_entries[0] : n.timetable_entries
    const course = Array.isArray(entry?.courses) ? entry?.courses[0] : entry?.courses
    const courseName = course?.course_name ?? 'Study session'
    const timeRange = entry ? `${to12h(entry.start_time)} to ${to12h(entry.end_time)}` : ''

    const payload = JSON.stringify({
      title: `${courseName} session starting now`,
      body: `${timeRange}. Open StudyFlow to see your timetable.`.trim(),
      url: '/timetable',
    })

    const { data: subs, error: subsError } = await supabase
      .from('push_subscriptions')
      .select('id, endpoint, p256dh, auth')
      .eq('user_id', n.user_id)

    if (subsError) {
      console.error('subscription lookup failed', subsError.message)
      continue
    }
    if (!subs || subs.length === 0) {
      summary.noSubscription++
      continue
    }

    let delivered = false
    for (const sub of subs) {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload,
          { TTL: 600, urgency: 'high' },
        )
        delivered = true
      } catch (err) {
        const status = (err as { statusCode?: number }).statusCode
        if (status === 404 || status === 410) {
          await supabase.from('push_subscriptions').delete().eq('id', sub.id)
          summary.removedSubscriptions++
        } else {
          summary.failedPushes++
          console.error('push failed', status, (err as Error).message)
        }
      }
    }
    if (delivered) summary.sent++
  }

  return json(summary)
})
