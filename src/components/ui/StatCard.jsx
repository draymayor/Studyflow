const TONES = {
  primary: { bg: 'bg-sf-primary-light', text: 'text-sf-primary', bar: 'bg-sf-primary', track: 'bg-sf-primary-light' },
  blue: { bg: 'bg-sf-accent-blue-bg', text: 'text-sf-accent-blue', bar: 'bg-sf-accent-blue', track: 'bg-sf-accent-blue-bg' },
  success: { bg: 'bg-sf-success-bg', text: 'text-sf-success', bar: 'bg-sf-success', track: 'bg-sf-success-bg' },
  warning: { bg: 'bg-sf-warning-bg', text: 'text-sf-warning', bar: 'bg-sf-warning', track: 'bg-sf-warning-bg' },
}

// `progress` (0-100) is optional and adds a progress bar with `footer` beneath it.
export default function StatCard({ icon: Icon, label, value, sublabel, tone = 'primary', progress, footer }) {
  const { bg, text, bar, track } = TONES[tone] ?? TONES.primary

  return (
    <div className="flex flex-col rounded-xl border border-sf-border bg-sf-bg p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-[13px] font-medium text-sf-text-secondary">{label}</p>
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${bg} ${text}`}>
          <Icon size={18} strokeWidth={2} />
        </div>
      </div>
      <p className="text-3xl font-bold text-sf-text-primary">{value}</p>
      {sublabel && <p className="mt-1 text-[13px] text-sf-text-secondary">{sublabel}</p>}
      {progress !== undefined && (
        <div className="mt-auto pt-4">
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
            className={`h-2 w-full overflow-hidden rounded-full ${track}`}
          >
            <div className={`h-full rounded-full transition-all duration-500 ${bar}`} style={{ width: `${progress}%` }} />
          </div>
          {footer && <p className="mt-2 text-[12px] text-sf-text-muted">{footer}</p>}
        </div>
      )}
    </div>
  )
}
