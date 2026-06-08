import { create } from 'zustand'
import { api } from '../api'
import type { Membership } from '../types/membership'

export type { Membership }

interface MembershipsState {
  memberships: Membership[]
  loading: boolean
  error: string | null
  fetchMemberships: () => Promise<void>
  addMembership: (data: Omit<Membership, 'id' | 'date'>) => Promise<string>
  updateMembership: (id: string, data: Partial<Omit<Membership, 'id'>>) => Promise<void>
  deleteMembership: (id: string) => Promise<void>
  reset: () => void
}

export const useMembershipsStore = create<MembershipsState>()((set) => ({
  memberships: [],
  loading: false,
  error: null,

  fetchMemberships: async () => {
    set({ loading: true, error: null })
    try {
      const { data } = await api.get<{ data: Membership[]; total: number }>('/api/memberships')
      set({ memberships: data })
    } catch (err: any) {
      set({ error: err?.message ?? 'Failed to load memberships.' })
    } finally {
      set({ loading: false })
    }
  },

  addMembership: async (data) => {
    const created = await api.post<Membership>('/api/memberships', data)
    set(s => ({ memberships: [created, ...s.memberships] }))
    return created.id
  },

  updateMembership: async (id, data) => {
    const updated = await api.put<Membership>(`/api/memberships/${id}`, data)
    set(s => ({ memberships: s.memberships.map(m => (m.id === id ? updated : m)) }))
  },

  deleteMembership: async (id) => {
    await api.del(`/api/memberships/${id}`)
    set(s => ({ memberships: s.memberships.filter(m => m.id !== id) }))
  },

  reset: () => set({ memberships: [], loading: false, error: null }),
}))
