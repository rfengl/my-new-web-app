export const FORMAT = import.meta.env.VITE_DATE_FORMAT ?? 'YYYY-MM-DD'

export function formatDate(value: string | null | undefined): string {
  if (!value) return '—'
  const d = new Date(value)
  if (isNaN(d.getTime())) return value
  const yyyy = String(d.getUTCFullYear())
  const mm   = String(d.getUTCMonth() + 1).padStart(2, '0')
  const dd   = String(d.getUTCDate()).padStart(2, '0')
  return FORMAT.replace('YYYY', yyyy).replace('MM', mm).replace('DD', dd)
}

// Converts a user-typed display string (e.g. "15/01/2024") → "2024-01-15".
// Returns '' if the input is incomplete or doesn't match the configured format.
export function parseDate(display: string): string {
  if (!display) return ''
  const sep = FORMAT.replace(/[A-Z]/g, '')[0]
  if (!sep) return ''
  const fmtParts = FORMAT.split(sep)
  const parts    = display.split(sep)
  if (parts.length !== 3) return ''
  const get  = (token: string) => parts[fmtParts.indexOf(token)] ?? ''
  const yyyy = get('YYYY')
  const mm   = get('MM').padStart(2, '0')
  const dd   = get('DD').padStart(2, '0')
  if (yyyy.length !== 4 || !mm || !dd) return ''
  const iso = `${yyyy}-${mm}-${dd}`
  return isNaN(new Date(iso).getTime()) ? '' : iso
}
