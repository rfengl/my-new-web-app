import { useEffect, useRef, useState } from 'react'
import { FORMAT, formatDate, parseDate } from '../utils/date'

interface Props {
  value: string                      // YYYY-MM-DD or ''
  onChange: (value: string) => void  // called with YYYY-MM-DD or ''
  className?: string
}

export default function DateInput({ value, onChange, className }: Props) {
  const [display, setDisplay] = useState(() => value ? formatDate(value) : '')
  const pickerRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setDisplay(value ? formatDate(value) : '')
  }, [value])

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    setDisplay(raw)
    onChange(parseDate(raw))
  }

  const handlePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const iso = e.target.value  // always YYYY-MM-DD from type="date"
    onChange(iso)
    setDisplay(iso ? formatDate(iso) : '')
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={display}
        onChange={handleTextChange}
        placeholder={FORMAT}
        className={className}
        style={{ paddingRight: '2.5rem' }}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => pickerRef.current?.showPicker()}
        className="absolute inset-y-0 right-0 flex items-center px-3
                   text-slate-400 hover:text-slate-600 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>
      {/* Hidden native date picker — opened programmatically on icon click */}
      <input
        ref={pickerRef}
        type="date"
        value={value}
        onChange={handlePick}
        className="absolute inset-0 opacity-0 pointer-events-none"
        tabIndex={-1}
      />
    </div>
  )
}
