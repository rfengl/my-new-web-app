import { useStore } from 'zustand'
import type { StoreApi } from 'zustand'
import DateInput from './DateInput'

interface Props {
  store: StoreApi<any>
  field: string
  className?: string
}

export default function ZustandDateInput({ store, field, className }: Props) {
  const value    = useStore(store, (s: any) => s[field] ?? '')
  const setField = useStore(store, (s: any) => s.setField)

  return (
    <DateInput
      value={value}
      onChange={(parsed) => setField(field, parsed)}
      className={className}
    />
  )
}
