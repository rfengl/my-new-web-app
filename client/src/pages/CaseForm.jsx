import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCases } from '../context/CasesContext'

const EMPTY_FORM = { title: '', description: '', status: 'Open', priority: 'Medium' }

export default function CaseForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { getCaseById, addCase, updateCase, loading } = useCases()

  const [form, setForm]       = useState(EMPTY_FORM)
  const [notFound, setNotFound] = useState(false)
  const [saving, setSaving]   = useState(false)
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    if (!isEdit || loading) return
    const existing = getCaseById(id)
    if (existing) {
      setForm({
        title:       existing.title,
        description: existing.description ?? '',
        status:      existing.status,
        priority:    existing.priority ?? 'Medium',
      })
    } else {
      setNotFound(true)
    }
  }, [id, loading])

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaveError('')
    setSaving(true)
    try {
      if (isEdit) {
        await updateCase(id, form)
      } else {
        await addCase(form)
      }
      navigate('/cases')
    } catch (err) {
      setSaveError(err?.message ?? 'Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
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
          <p className="text-slate-500 mb-4">Case <span className="font-mono">{id}</span> not found.</p>
          <button onClick={() => navigate('/cases')}
            className="text-sm text-slate-800 underline underline-offset-2">
            Back to cases
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-3">
          <button onClick={() => navigate('/cases')}
            className="text-slate-400 hover:text-slate-700 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="font-semibold text-slate-800">
            {isEdit ? `Edit Case ${id}` : 'New Case'}
          </h1>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-3xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={form.title}
              onChange={set('title')}
              placeholder="Brief summary of the issue"
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent
                         placeholder:text-slate-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Description
            </label>
            <textarea
              rows={5}
              value={form.description}
              onChange={set('description')}
              placeholder="Describe the issue in detail…"
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent
                         placeholder:text-slate-400 resize-y"
            />
          </div>

          {/* Status + Priority row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
              <select
                value={form.status}
                onChange={set('status')}
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm
                           focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
              >
                <option>Open</option>
                <option>In Progress</option>
                <option>Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Priority</label>
              <select
                value={form.priority}
                onChange={set('priority')}
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm
                           focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>

          {saveError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2.5">
              {saveError}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/cases')}
              className="flex-1 border border-slate-300 text-slate-600 rounded-lg py-2.5 text-sm
                         hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-slate-800 text-white rounded-lg py-2.5 text-sm font-medium
                         hover:bg-slate-700 disabled:opacity-60 transition-colors"
            >
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Case'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
