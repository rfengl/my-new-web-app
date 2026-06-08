import { useStore } from 'zustand'
import type { StoreApi } from 'zustand'

interface Props extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange'> {
  store: StoreApi<any>
  field: string
  children: React.ReactNode
}

export default function ZustandSelect({ store, field, children, ...rest }: Props) {
  const value    = useStore(store, (s: any) => s[field] ?? '')
  const setField = useStore(store, (s: any) => s.setField)

  return (
    <select {...rest} value={value} onChange={(e) => setField(field, e.target.value)}>
      {children}
    </select>
  )
}
