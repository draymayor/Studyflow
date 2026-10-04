import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import DashboardShell from '../components/layout/DashboardShell.jsx'
import PageHeader from '../components/layout/PageHeader.jsx'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import Input from '../components/ui/Input.jsx'
import PasswordInput from '../components/ui/PasswordInput.jsx'
import Toast from '../components/ui/Toast.jsx'
import ErrorBanner from '../components/ui/ErrorBanner.jsx'
import ReminderControl from '../components/domain/ReminderControl.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useProfile } from '../hooks/useProfile.js'

export default function Settings() {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const { email, profile, loading, error, updateProfile, changePassword } = useProfile()

  const [fullName, setFullName] = useState('')
  const [matricNo, setMatricNo] = useState('')
  const [profileError, setProfileError] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)

  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName)
      setMatricNo(profile.matricNo)
    }
  }, [profile])

  function flashToast(message) {
    setToastMessage(message)
    setTimeout(() => setToastMessage(''), 2200)
  }

  async function handleSaveProfile(e) {
    e.preventDefault()
    setProfileError('')
    setSavingProfile(true)
    const message = await updateProfile({ fullName, matricNo })
    setSavingProfile(false)
    if (message) setProfileError(message)
    else flashToast('Profile saved')
  }

  async function handleChangePassword(e) {
    e.preventDefault()
    setPasswordError('')
    setSavingPassword(true)
    const message = await changePassword(password, confirm)
    setSavingPassword(false)
    if (message) {
      setPasswordError(message)
      return
    }
    setPassword('')
    setConfirm('')
    flashToast('Password updated')
  }

  async function handleSignOut() {
    try {
      await signOut()
    } catch (err) {
      console.error('signOut failed', err)
    }
    navigate('/login', { replace: true })
  }

  return (
    <DashboardShell>
      <Toast show={Boolean(toastMessage)} message={toastMessage} />

      <PageHeader title="Settings" subtitle="Manage your profile and notifications" />

      <div className="flex max-w-xl flex-col gap-3">
        <ErrorBanner message={error} />

        <Card>
          <h2 className="mb-3 text-[18px] font-semibold text-sf-text-primary">Profile</h2>
          {loading ? (
            <p className="text-[14px] text-sf-text-muted">Loading…</p>
          ) : (
            <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
              <Input id="email" label="Email" value={email} readOnly disabled />
              <Input
                id="fullName"
                label="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <Input
                id="matricNo"
                label="Matric number (optional)"
                value={matricNo}
                onChange={(e) => setMatricNo(e.target.value)}
              />
              <ErrorBanner message={profileError} />
              <Button type="submit" disabled={savingProfile}>
                {savingProfile ? 'Saving…' : 'Save profile'}
              </Button>
            </form>
          )}
        </Card>

        <Card>
          <h2 className="mb-3 text-[18px] font-semibold text-sf-text-primary">Password</h2>
          <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
            <PasswordInput
              id="newPassword"
              label="New password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <PasswordInput
              id="confirmPassword"
              label="Confirm new password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
            <ErrorBanner message={passwordError} />
            <Button type="submit" disabled={savingPassword}>
              {savingPassword ? 'Updating…' : 'Update password'}
            </Button>
          </form>
        </Card>

        <div>
          <h2 className="mb-3 text-[18px] font-semibold text-sf-text-primary">Reminders</h2>
          <ReminderControl />
        </div>

        <Button variant="outline" fullWidth className="mt-2 !text-sf-danger" onClick={handleSignOut}>
          <LogOut size={16} /> Sign out
        </Button>
      </div>
    </DashboardShell>
  )
}
