import { createStore } from 'zustand/vanilla'
import { api } from '../api'
import type { SubmissionGL } from '../types/submissionGL'

export type SubmissionFormFields = Omit<SubmissionGL, 'id' | 'membershipId' | 'createdDate'>

export interface SubmissionFormState extends SubmissionFormFields {
  submissionId: string   // empty = creating new; set = updating existing
  saving: boolean
  saveError: string
  setField: <K extends keyof SubmissionFormFields>(key: K, value: SubmissionFormFields[K]) => void
  populate: (s: SubmissionGL) => void
  save: (membershipId: string) => Promise<SubmissionGL>
  reset: () => void
}

const EMPTY: SubmissionFormFields = {
  submissionStatus: '',
  requestType: '',
  glType: 0,
  mrn: '',
}

export function createSubmissionFormStore() {
  return createStore<SubmissionFormState>()((set, get) => ({
    ...EMPTY,
    submissionId: '',
    saving: false,
    saveError: '',

    setField: (key, value) => set({ [key]: value } as any),

    populate: (s) =>
      set({
        submissionId:     s.id,
        submissionStatus: s.submissionStatus,
        requestType:      s.requestType,
        glType:           s.glType,
        mrn:              s.mrn,
      }),

    save: async (membershipId) => {
      const { submissionId, submissionStatus, requestType, glType, mrn } = get()
      const payload = { submissionStatus, requestType, glType, mrn }
      if (submissionId) {
        return api.put<SubmissionGL>(
          `/api/memberships/${membershipId}/submissions/${submissionId}`,
          payload,
        )
      }
      const created = await api.post<SubmissionGL>(
        `/api/memberships/${membershipId}/submissions`,
        payload,
      )
      set({ submissionId: created.id })
      return created
    },

    reset: () => set({ ...EMPTY, submissionId: '', saving: false, saveError: '' }),
  }))
}
