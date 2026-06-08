import { useStore } from 'zustand'
import type { StoreApi } from 'zustand'

interface Props extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange'> {
  store: StoreApi<any>
  field: string
}

export default function ZustandTextarea({ store, field, ...rest }: Props) {
  const value    = useStore(store, (s: any) => s[field] ?? '')
  const setField = useStore(store, (s: any) => s.setField)

  return (
    <textarea {...rest} value={value} onChange={(e) => setField(field, e.target.value)} />
  )
}
