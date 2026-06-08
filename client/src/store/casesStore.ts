import { create } from 'zustand'
import { api } from '../api'
import type { Case } from '../types/case'

export type { Case }

interface CasesState {
  cases: Case[]
  loading: boolean
  error: string | null
  fetchCases: () => Promise<void>
  addCase: (data: Omit<Case, 'id' | 'date'>) => Promise<string>
  updateCase: (id: string, data: Partial<Omit<Case, 'id'>>) => Promise<void>
  deleteCase: (id: string) => Promise<void>
  reset: () => void
}

export const useCasesStore = create<CasesState>()((set) => ({
  cases: [],
  loading: false,
  error: null,

  fetchCases: async () => {
    set({ loading: true, error: null })
    try {
      const { data } = await api.get<{ data: Case[]; total: number }>('/api/cases')
      set({ cases: data })
    } catch (err: any) {
      set({ error: err?.message ?? 'Failed to load cases.' })
    } finally {
      set({ loading: false })
    }
  },

  addCase: async (data) => {
    const created = await api.post<Case>('/api/cases', data)
    set(s => ({ cases: [created, ...s.cases] }))
    return created.id
  },

  updateCase: async (id, data) => {
    const updated = await api.put<Case>(`/api/cases/${id}`, data)
    set(s => ({ cases: s.cases.map(c => (c.id === id ? updated : c)) }))
  },

  deleteCase: async (id) => {
    await api.del(`/api/cases/${id}`)
    set(s => ({ cases: s.cases.filter(c => c.id !== id) }))
  },

  reset: () => set({ cases: [], loading: false, error: null }),
}))
