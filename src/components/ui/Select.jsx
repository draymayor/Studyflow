export default function Select({ label, id, children, className = '', ...rest }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-[13px] font-medium text-sf-text-secondary tracking-wide">
          {label}
        </label>
      )}
      <select
        id={id}
        className="rounded-lg border border-sf-border bg-sf-bg px-3.5 py-2.5 text-[15px] text-sf-text-primary outline-none transition-colors focus:border-sf-primary focus:ring-2 focus:ring-sf-primary-light"
        {...rest}
      >
        {children}
      </select>
    </div>
  )
}
