import { useEffect, useState } from 'react'
import { Bell, BellOff } from 'lucide-react'
import Button from '../ui/Button.jsx'
import ErrorBanner from '../ui/ErrorBanner.jsx'
import {
  disableReminders,
  enableReminders,
  getReminderStatus,
  unsupportedMessage,
} from '../../lib/push.js'

export default function ReminderControl() {
  const [status, setStatus] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getReminderStatus().then(setStatus)
  }, [])

  async function handleEnable() {
    setBusy(true)
    setError('')
    try {
      setStatus(await enableReminders())
    } catch (err) {
      console.error('Enabling reminders failed', err)
      setError('We could not turn on reminders. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  async function handleDisable() {
    setBusy(true)
    setError('')
    try {
      await disableReminders()
      setStatus(await getReminderStatus())
    } catch (err) {
      console.error('Disabling reminders failed', err)
      setError('We could not turn off reminders. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  if (status === null) return null

  return (
    <div className="mb-4 flex flex-col gap-3 rounded-xl border border-sf-border bg-sf-surface p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        {status === 'enabled' ? (
          <Bell size={18} className="mt-0.5 shrink-0 text-sf-success" />
        ) : (
          <BellOff size={18} className="mt-0.5 shrink-0 text-sf-text-muted" />
        )}
        <p className="text-[14px] text-sf-text-secondary">
          {status === 'enabled' && 'Reminders are on. We will notify you when a session starts.'}
          {status === 'default' && 'Turn on reminders to get a notification when each study session starts.'}
          {status === 'denied' &&
            'Notifications are blocked for this site. Allow them in your browser settings, then reload this page.'}
          {status === 'unsupported' && unsupportedMessage()}
        </p>
      </div>
      {status === 'default' && (
        <Button size="sm" onClick={handleEnable} disabled={busy}>
          {busy ? 'Enabling…' : 'Enable reminders'}
        </Button>
      )}
      {status === 'enabled' && (
        <Button size="sm" variant="outline" onClick={handleDisable} disabled={busy}>
          {busy ? 'Turning off…' : 'Turn off'}
        </Button>
      )}
      {error && (
        <div className="sm:basis-full">
          <ErrorBanner message={error} />
        </div>
      )}
    </div>
  )
}
