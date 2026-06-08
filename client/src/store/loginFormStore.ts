import { createStore } from 'zustand/vanilla'

type LoginFields = { email: string; password: string }

export interface LoginFormState extends LoginFields {
  error: string
  loading: boolean
  setField: <K extends keyof LoginFields>(key: K, value: string) => void
}

export function createLoginFormStore() {
  return createStore<LoginFormState>()((set) => ({
    email: '',
    password: '',
    error: '',
    loading: false,
    setField: (key, value) => set({ [key]: value } as any),
  }))
}
