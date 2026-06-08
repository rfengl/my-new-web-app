import { useStore } from 'zustand'
import type { StoreApi } from 'zustand'

interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  store: StoreApi<any>
  field: string
}

export default function ZustandInput({ store, field, ...rest }: Props) {
  const value    = useStore(store, (s: any) => s[field])
  const setField = useStore(store, (s: any) => s.setField)

  return (
    <input
      {...rest}
      value={value || ''}
      onChange={(e) => {
        const v = e.target.type === 'number' ? Number(e.target.value) : e.target.value
        setField(field, v)
      }}
    />
  )
}
