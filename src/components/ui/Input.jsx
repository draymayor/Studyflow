export default function Input({ label, id, error, endAdornment, className = '', ...rest }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-[13px] font-medium text-sf-text-secondary tracking-wide">
          {label}
        </label>
      )}
      <div className="relative flex">
        <input
          id={id}
          className={`w-full rounded-lg border px-3.5 py-2.5 text-[15px] text-sf-text-primary placeholder:text-sf-text-muted outline-none transition-colors focus:border-sf-primary focus:ring-2 focus:ring-sf-primary-light ${endAdornment ? 'pr-11' : ''} ${error ? 'border-sf-danger' : 'border-sf-border'}`}
          {...rest}
        />
        {endAdornment && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">{endAdornment}</div>
        )}
      </div>
      {error && <p className="text-[13px] text-sf-danger">{error}</p>}
    </div>
  )
}
