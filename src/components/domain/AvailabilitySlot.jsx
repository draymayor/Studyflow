import { X } from 'lucide-react'

export default function AvailabilitySlot({ startTime, endTime, onRemove }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-sf-primary-light px-3 py-1.5 text-[13px] font-medium text-sf-primary">
      {startTime} – {endTime}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove slot"
          className="rounded-full p-0.5 hover:bg-sf-primary/10"
        >
          <X size={13} />
        </button>
      )}
    </span>
  )
}
