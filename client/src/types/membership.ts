export type Membership = {
  id: string
  date?: string
  name: string
  idType: 'NRIC' | 'Passport'
  idNo: string
  insurance: string
  company: string
  policyNo: string
  rbEntitlement: number
  coPayment: number        // in %
  coInsurance: string      // in % or alphanumeric
  deductible: number       // in currency
  policyEffDate: string
  policyExpDate: string
  policyLapseDate: string
  status: 'Inforce' | 'Expired'
  underwritingExclusion: string
  submissionId?: string
}
