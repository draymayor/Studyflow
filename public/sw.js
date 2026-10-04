// StudyFlow service worker: shows study reminders delivered by Web Push.
// Payload is JSON: { title, body, url }.

self.addEventListener('push', (event) => {
  let data = {}
  try {
    data = event.data ? event.data.json() : {}
  } catch {
    data = { body: event.data ? event.data.text() : '' }
  }

  const title = data.title || 'StudyFlow'
  const options = {
    body: data.body || 'Time for your study session.',
    data: { url: data.url || '/timetable' },
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const target = new URL(event.notification.data?.url || '/timetable', self.location.origin).href

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
      for (const client of windows) {
        if (new URL(client.url).origin === self.location.origin && 'focus' in client) {
          return client.focus().then((focused) => ('navigate' in focused ? focused.navigate(target) : focused))
        }
      }
      return self.clients.openWindow(target)
    }),
  )
})
