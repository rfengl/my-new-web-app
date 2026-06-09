import { createStore } from 'zustand/vanilla'
import { api } from '../api'
import type { SubmissionGL } from '../types/submissionGL'

// glType is stored as string in the form (ZustandSelect always gives strings); converted at API boundaries
export type SubmissionFormFields = Omit<SubmissionGL, 'id' | 'membershipId' | 'createdDate' | 'displayStatus'>

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
  submissionStatus:     '',
  requestType:          '',
  glType:               0,
  mrn:                  '',
  billingDate:          '',
  dateOfAdmission:      '',
  dateOfDischarge:      '',
  doctorName:           '',
  doctorSpecialty:      '',
  provisionalDiagnosis: '',
  icdCode:              '',
  estimatedCost:        0,
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
        submissionId:         s.id,
        submissionStatus:     s.submissionStatus,
        requestType:          s.requestType,
        glType:               s.glType,
        mrn:                  s.mrn,
        billingDate:          s.billingDate,
        dateOfAdmission:      s.dateOfAdmission,
        dateOfDischarge:      s.dateOfDischarge,
        doctorName:           s.doctorName,
        doctorSpecialty:      s.doctorSpecialty,
        provisionalDiagnosis: s.provisionalDiagnosis,
        icdCode:              s.icdCode,
        estimatedCost:        s.estimatedCost,
      }),

    save: async (membershipId) => {
      const {
        submissionId, submissionStatus, requestType, glType, mrn,
        billingDate, dateOfAdmission, dateOfDischarge,
        doctorName, doctorSpecialty, provisionalDiagnosis, icdCode, estimatedCost,
      } = get()
      const payload = {
        submissionStatus, requestType, glType, mrn,
        billingDate, dateOfAdmission, dateOfDischarge,
        doctorName, doctorSpecialty, provisionalDiagnosis, icdCode, estimatedCost,
      }
      if (submissionId) {
        return api.put<SubmissionGL>(`/api/submissions/${submissionId}`, payload)
      }
      const created = await api.post<SubmissionGL>(
        `/api/submissions`,
        { ...payload, membershipId },
      )
      set({ submissionId: created.id })
      return created
    },

    reset: () => set({ ...EMPTY, submissionId: '', saving: false, saveError: '' }),
  }))
}
