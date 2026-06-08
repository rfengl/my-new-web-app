import { createStore } from 'zustand/vanilla'
import type { Membership } from '../types/membership'

export type MembershipFormFields = Omit<Membership, 'id' | 'date'>

export interface MembershipFormState extends MembershipFormFields {
  saving: boolean
  saveError: string
  loadingCase: boolean
  notFound: boolean
  setField: <K extends keyof MembershipFormFields>(key: K, value: MembershipFormFields[K]) => void
  populate: (c: Membership) => void
  reset: () => void
}

const EMPTY: MembershipFormFields = {
  name: '',
  nric: '',
  passportNo: '',
  insurance: '',
  company: '',
  policyNo: '',
  rbEntitlement: 0,
  coPayment: 0,
  coInsurance: '',
  deductible: 0,
  policyEffDate: '',
  policyExpDate: '',
  policyLapseDate: '',
  status: 'Inforce',
  underwritingExclusion: '',
}

export function createMembershipFormStore() {
  return createStore<MembershipFormState>()((set) => ({
    ...EMPTY,
    saving: false,
    saveError: '',
    loadingCase: false,
    notFound: false,

    setField: (key, value) => set({ [key]: value } as any),

    populate: (c) =>
      set({
        name:                  c.name,
        nric:                  c.nric,
        passportNo:            c.passportNo,
        insurance:             c.insurance,
        company:               c.company,
        policyNo:              c.policyNo,
        rbEntitlement:         c.rbEntitlement,
        coPayment:             c.coPayment,
        coInsurance:           c.coInsurance,
        deductible:            c.deductible,
        policyEffDate:         c.policyEffDate?.slice(0, 10) ?? '',
        policyExpDate:         c.policyExpDate?.slice(0, 10) ?? '',
        policyLapseDate:       c.policyLapseDate?.slice(0, 10) ?? '',
        status:                c.status,
        underwritingExclusion: c.underwritingExclusion,
      }),

    reset: () => set({ ...EMPTY, saving: false, saveError: '', loadingCase: false, notFound: false }),
  }))
}
