import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useStore } from 'zustand'
import { useCasesStore } from '../store/casesStore'
import { createCaseFormStore } from '../store/caseFormStore'
import type { CaseFormFields } from '../store/caseFormStore'
import { api } from '../api'
import type { Case } from '../types/case'
import ZustandInput from '../components/ZustandInput'
import ZustandSelect from '../components/ZustandSelect'
import ZustandTextarea from '../components/ZustandTextarea'
import ZustandDateInput from '../components/ZustandDateInput'

type Tab = 'verification' | 'submission'

const inputClass =
  'w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm ' +
  'focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent ' +
  'placeholder:text-slate-400'

const selectClass =
  'w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm ' +
  'focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent'

export default function CaseForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const addCase    = useCasesStore((s) => s.addCase)
  const updateCase = useCasesStore((s) => s.updateCase)

  const [store]     = useState(() => createCaseFormStore())
  const [activeTab, setActiveTab] = useState<Tab>('verification')

  const saving      = useStore(store, (s) => s.saving)
  const saveError   = useStore(store, (s) => s.saveError)
  const loadingCase = useStore(store, (s) => s.loadingCase)
  const notFound    = useStore(store, (s) => s.notFound)

  useEffect(() => {
    if (!isEdit) {
      store.getState().reset()
      return
    }
    store.setState({ loadingCase: true, notFound: false })
    api
      .get<Case>(`/api/cases/${id}`)
      .then((c) => store.getState().populate(c))
      .catch(() => store.setState({ notFound: true }))
      .finally(() => store.setState({ loadingCase: false }))
  }, [id])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    store.setState({ saveError: '', saving: true })
    const { saving: _s, saveError: _se, loadingCase: _lc, notFound: _nf,
            setField: _sf, populate: _p, reset: _r, ...formData } = store.getState()
    try {
      if (isEdit) {
        await updateCase(id!, formData as CaseFormFields)
      } else {
        await addCase(formData as CaseFormFields)
      }
      navigate('/cases')
    } catch (err: any) {
      store.setState({ saveError: err?.message ?? 'Failed to save. Please try again.' })
    } finally {
      store.setState({ saving: false })
    }
  }

  if (loadingCase) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-400 text-sm">Loading…</p>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">
            Case <span className="font-mono">{id}</span> not found.
          </p>
          <button
            onClick={() => navigate('/cases')}
            className="text-sm text-slate-800 underline underline-offset-2"
          >
            Back to cases
          </button>
        </div>
      </div>
    )
  }

  const tabClass = (tab: Tab) =>
    `px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ` +
    (activeTab === tab
      ? 'border-slate-800 text-slate-800'
      : 'border-transparent text-slate-500 hover:text-slate-700')

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate('/cases')}
            className="text-slate-400 hover:text-slate-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="font-semibold text-slate-800">
            {isEdit ? `Edit Case ${id}` : 'New Case'}
          </h1>
        </div>

        {/* Tab nav — edit mode only */}
        {isEdit && (
          <div className="max-w-3xl mx-auto px-6 flex gap-1 -mb-px">
            <button className={tabClass('verification')} onClick={() => setActiveTab('verification')}>
              Membership Verification
            </button>
            <button className={tabClass('submission')} onClick={() => setActiveTab('submission')}>
              Submission / GL Request
            </button>
          </div>
        )}
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ── Membership Verification tab ── */}
          {activeTab === 'verification' && (
            <>
              {/* Personal Information */}
              <fieldset className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                <legend className="text-sm font-semibold text-slate-700 px-1 -mt-3 mb-2">
                  Personal Information
                </legend>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Name <span className="text-red-400">*</span>
                  </label>
                  <ZustandInput store={store} field="name" type="text" required
                    placeholder="Full name" className={inputClass} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">NRIC</label>
                    <ZustandInput store={store} field="nric" type="text"
                      placeholder="e.g. 901231-10-1234" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Passport No</label>
                    <ZustandInput store={store} field="passportNo" type="text"
                      placeholder="Passport number" className={inputClass} />
                  </div>
                </div>
              </fieldset>

              {/* Policy Information */}
              <fieldset className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                <legend className="text-sm font-semibold text-slate-700 px-1 -mt-3 mb-2">
                  Policy Information
                </legend>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Insurance</label>
                    <ZustandInput store={store} field="insurance" type="text"
                      placeholder="Insurer name" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Company</label>
                    <ZustandInput store={store} field="company" type="text"
                      placeholder="Employer / company" className={inputClass} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Policy No</label>
                    <ZustandInput store={store} field="policyNo" type="text"
                      placeholder="e.g. TM-2024-00123" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                    <ZustandSelect store={store} field="status" className={selectClass}>
                      <option>Inforce</option>
                      <option>Expired</option>
                    </ZustandSelect>
                  </div>
                </div>
              </fieldset>

              {/* Benefit Details */}
              <fieldset className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                <legend className="text-sm font-semibold text-slate-700 px-1 -mt-3 mb-2">
                  Benefit Details
                </legend>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      RB Entitlement
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">RM</span>
                      <ZustandInput store={store} field="rbEntitlement" type="number" min={0} step="0.01"
                        placeholder="0.00"
                        className="w-full border border-slate-300 rounded-lg pl-10 pr-3 py-2.5 text-sm
                                   focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent
                                   placeholder:text-slate-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Deductible
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">RM</span>
                      <ZustandInput store={store} field="deductible" type="number" min={0} step="0.01"
                        placeholder="0.00"
                        className="w-full border border-slate-300 rounded-lg pl-10 pr-3 py-2.5 text-sm
                                   focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent
                                   placeholder:text-slate-400" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Co-Payment
                    </label>
                    <div className="relative">
                      <ZustandInput store={store} field="coPayment" type="number" min={0} max={100} step="0.01"
                        placeholder="0"
                        className="w-full border border-slate-300 rounded-lg px-3 pr-8 py-2.5 text-sm
                                   focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent
                                   placeholder:text-slate-400" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Co-Takaful / Co-Insurance
                    </label>
                    <ZustandInput store={store} field="coInsurance" type="text"
                      placeholder="e.g. 10% or N/A" className={inputClass} />
                  </div>
                </div>
              </fieldset>

              {/* Policy Dates */}
              <fieldset className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                <legend className="text-sm font-semibold text-slate-700 px-1 -mt-3 mb-2">
                  Policy Dates
                </legend>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Effective Date
                    </label>
                    <ZustandDateInput store={store} field="policyEffDate" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Expiry Date
                    </label>
                    <ZustandDateInput store={store} field="policyExpDate" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Lapse Date
                    </label>
                    <ZustandDateInput store={store} field="policyLapseDate" className={inputClass} />
                  </div>
                </div>
              </fieldset>

              {/* Other */}
              <fieldset className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                <legend className="text-sm font-semibold text-slate-700 px-1 -mt-3 mb-2">
                  Other
                </legend>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Underwriting Exclusion
                  </label>
                  <ZustandTextarea store={store} field="underwritingExclusion" rows={4}
                    placeholder="List any exclusions…"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm
                               focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent
                               placeholder:text-slate-400 resize-y" />
                </div>
              </fieldset>

              {saveError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2.5">
                  {saveError}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button type="button" onClick={() => navigate('/cases')}
                  className="flex-1 border border-slate-300 text-slate-600 rounded-lg py-2.5 text-sm
                             hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 bg-slate-800 text-white rounded-lg py-2.5 text-sm font-medium
                             hover:bg-slate-700 disabled:opacity-60 transition-colors">
                  {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Case'}
                </button>
              </div>
            </>
          )}

          {/* ── Submission / GL Request tab ── */}
          {activeTab === 'submission' && (
            <>
              <div className="bg-white rounded-xl border border-slate-200 p-12 flex flex-col items-center justify-center gap-4 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-slate-700 font-medium">Submission / GL Request</p>
                  <p className="text-slate-400 text-sm mt-1">
                    This section is under construction.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => navigate('/cases')}
                  className="flex-1 border border-slate-300 text-slate-600 rounded-lg py-2.5 text-sm
                             hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
              </div>
            </>
          )}

        </form>
      </main>
    </div>
  )
}
