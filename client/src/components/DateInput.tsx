import { useEffect, useRef, useState } from 'react'
import { FORMAT, formatDate, parseDate } from '../utils/date'

interface Props {
  value: string                        // internal ISO format: YYYY-MM-DD
  onChange: (value: string) => void    // called with YYYY-MM-DD (or '' when incomplete)
  className?: string
}

// Displays dates in the format configured by VITE_DATE_FORMAT while storing
// YYYY-MM-DD internally. Handles mid-typing gracefully — the display is not
// reset while the user is entering an incomplete date.
export default function DateInput({ value, onChange, className }: Props) {
  const [display, setDisplay] = useState(() => value ? formatDate(value) : '')

  // Track the last ISO value we sent to the parent so we can distinguish an
  // external value change (e.g. form load) from a round-trip of our own onChange.
  const sentRef = useRef(parseDate(display))

  useEffect(() => {
    if (value !== sentRef.current) {
      sentRef.current = value
      setDisplay(value ? formatDate(value) : '')
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw    = e.target.value
    const parsed = parseDate(raw)
    setDisplay(raw)
    sentRef.current = parsed
    onChange(parsed)
  }

  return (
    <input
      type="text"
      value={display}
      onChange={handleChange}
      placeholder={FORMAT}
      className={className}
    />
  )
}
