import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import Input from './Input.jsx'

export default function PasswordInput(props) {
  const [visible, setVisible] = useState(false)
  const Icon = visible ? EyeOff : Eye

  return (
    <Input
      {...props}
      type={visible ? 'text' : 'password'}
      endAdornment={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="rounded-lg p-1.5 text-sf-text-muted hover:text-sf-primary"
        >
          <Icon size={18} />
        </button>
      }
    />
  )
}
