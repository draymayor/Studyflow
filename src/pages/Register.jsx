import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Button from '../components/ui/Button.jsx'
import Input from '../components/ui/Input.jsx'
import PasswordInput from '../components/ui/PasswordInput.jsx'
import ErrorBanner from '../components/ui/ErrorBanner.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Register() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [matricNo, setMatricNo] = useState('')
  const [password, setPassword] = useState('')
  const { signUp } = useAuth()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await signUp({ email, password, fullName, matricNo: matricNo.trim() })
      navigate('/', { replace: true })
    } catch (err) {
      console.error('signUp failed', err)
      setError(err.message || 'Could not create your account. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-sf-surface px-4 py-10">
      <div className="w-full max-w-sm rounded-2xl border border-sf-border bg-sf-bg p-8 shadow-sm">
        <div className="mb-7 text-center">
          <h1 className="text-2xl font-bold">
            <span className="text-sf-text-primary">Study</span>
            <span className="text-sf-primary">Flow</span>
          </h1>
          <p className="mt-1.5 text-[15px] text-sf-text-secondary">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <ErrorBanner message={error} />
          <Input
            id="fullName"
            label="Full name"
            type="text"
            placeholder="Ada Obi"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
            required
          />
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <Input
            id="matricNo"
            label="Matric number (optional)"
            type="text"
            placeholder="NOU123456789"
            value={matricNo}
            onChange={(e) => setMatricNo(e.target.value)}
          />
          <PasswordInput
            id="password"
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            minLength={6}
            required
          />

          <Button type="submit" fullWidth className="mt-1" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create account'}
          </Button>
        </form>

        <p className="mt-6 text-center text-[14px] text-sf-text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-sf-primary hover:text-sf-primary-hover">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
