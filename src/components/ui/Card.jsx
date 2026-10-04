export default function Card({ children, className = '', padded = true, ...rest }) {
  return (
    <div
      className={`bg-sf-bg border border-sf-border rounded-xl ${padded ? 'p-4' : ''} ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}
