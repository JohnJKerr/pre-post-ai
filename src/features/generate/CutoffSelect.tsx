import { useState } from 'react'
import { date } from '../../lib/format'
import { PRESET_CUTOFFS } from './cutoffs'

const CUSTOM = 'custom'

/** A preset cut-off, or any date. Controlled by the YYYY-MM-DD value. */
export function CutoffSelect({ value, onChange }: { value: string; onChange: (date: string) => void }) {
  const [picking, setPicking] = useState(() => !PRESET_CUTOFFS.some((c) => c.date === value))
  const [today] = useState(() => new Date().toISOString().slice(0, 10))

  return (
    <div className="flex w-full flex-col gap-2 sm:w-80">
      <label htmlFor="cutoff" className="text-sm font-medium text-muted">Cut-off</label>
      <select
        id="cutoff"
        className="select w-full"
        value={picking ? CUSTOM : value}
        onChange={(e) => {
          const picked = e.target.value
          setPicking(picked === CUSTOM)
          if (picked !== CUSTOM) onChange(picked)
        }}
      >
        {PRESET_CUTOFFS.map((c) => (
          <option key={c.date} value={c.date}>{c.label} · {date(c.date)}</option>
        ))}
        <option value={CUSTOM}>Pick a date…</option>
      </select>
      {picking && (
        <>
          <label htmlFor="cutoff-date" className="sr-only">Cut-off date</label>
          <input id="cutoff-date" type="date" className="input w-full" max={today} value={value} onChange={(e) => onChange(e.target.value)} required />
        </>
      )}
    </div>
  )
}
