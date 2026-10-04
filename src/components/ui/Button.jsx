const VARIANTS = {
  primary: 'bg-sf-primary text-white hover:bg-sf-primary-hover',
  outline: 'border border-sf-border text-sf-text-primary hover:bg-sf-surface',
  ghost: 'text-sf-primary hover:bg-sf-primary-light',
  danger: 'bg-sf-danger text-white hover:bg-red-700',
}

const SIZES = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-sm px-4 py-2.5',
  lg: 'text-base px-5 py-3',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  type = 'button',
  ...rest
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
