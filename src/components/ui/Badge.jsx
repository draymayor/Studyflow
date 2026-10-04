const TONES = {
  primary: 'bg-sf-primary-light text-sf-primary',
  success: 'bg-sf-success-bg text-sf-success',
  warning: 'bg-sf-warning-bg text-sf-warning',
  danger: 'bg-sf-danger-bg text-sf-danger',
  neutral: 'bg-sf-surface-alt text-sf-text-secondary',
}

export default function Badge({ children, tone = 'neutral', className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
