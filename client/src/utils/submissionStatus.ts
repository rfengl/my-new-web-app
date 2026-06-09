export const GL_TYPES = [
  { value: 1, label: 'Client' },
  { value: 2, label: 'Hospital' },
] as const

export type GlTypeValue = (typeof GL_TYPES)[number]['value']

export function glTypeLabel(glType: number): string {
  return GL_TYPES.find((t) => t.value === glType)?.label ?? String(glType)
}

export const SUBMISSION_STATUSES = [
  'New GL',
  'New Top Up',
  'Processing',
  'Defer Out',
  'Defer Reply',
  'Add Doc',
  'Notif. Approved',
  'IGL Approved',
  'FGL Approved',
  'Declined',
  'Cancelled',
  'Medical review',
] as const

const HOSPITAL_MAP: Record<string, string> = {
  'New GL':          'Draft',
  'New Top Up':      'New Top Up',
  'Processing':      'Processing',
  'Defer Out':       'Defer Out',
  'Defer Reply':     'Submitted',
  'Add Doc':         'Processing',
  'Notif. Approved': 'Submitted',
  'IGL Approved':    'Approved',
  'FGL Approved':    'Approved',
  'Declined':        'Declined',
  'Cancelled':       'Cancelled',
  'Medical review':  'Medical review',
}

export function getDisplayStatus(status: string, glType: number): string {
  if (glType !== 2) return status  // 2 = Hospital
  return HOSPITAL_MAP[status] ?? status
}
