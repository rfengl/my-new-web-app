// export type SubmissionGL = {
//   id: string
//   membershipId: string
//   submissionStatus: string
//   displayStatus: string
//   requestType: string
//   glType: string
//   mrn: string
//   createdDate?: string
// }

export type SubmissionGL = {
  id: string
  membershipId: string
  submissionStatus: string
  displayStatus: string
  requestType: string
  glType: number
  mrn: string
  billingDate: string
  dateOfAdmission: string
  dateOfDischarge: string
  doctorName: string
  doctorSpecialty: string
  provisionalDiagnosis: string
  icdCode: string
  estimatedCost: number
  
  createdDate?: string
}
