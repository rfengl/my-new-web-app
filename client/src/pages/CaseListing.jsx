import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const STATUS_STYLES = {
  Open:        'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  'In Progress': 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  Closed:      'bg-slate-100 text-slate-500 ring-1 ring-slate-200',
}

const INITIAL_CASES = [
  { id: 'C-001', title: 'Server outage in production',    status: 'Open',        date: '2026-06-01' },
  { id: 'C-002', title: 'Login timeout after 5 minutes',  status: 'In Progress', date: '2026-06-03' },
  { id: 'C-003', title: 'Export PDF feature not working', status: 'Closed',      date: '2026-05-28' },
  { id: 'C-004', title: 'Dashboard chart renders empty',  status: 'Open',        date: '2026-06-05' },
]

function NewCaseModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ title: '', status: 'Open' })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
         onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-800">New Case</h2>
          <button onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
            <input
              type="text"
              required
              autoFocus
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent
                         placeholder:text-slate-400"
              placeholder="Describe the issue…"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
            <select
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
            >
              <option>Open</option>
              <option>In Progress</option>
              <option>Closed</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-slate-300 text-slate-600 rounded-lg py-2.5 text-sm
                         hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 bg-slate-800 text-white rounded-lg py-2.5 text-sm font-medium
                         hover:bg-slate-700 transition-colors">
              Create Case
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function CaseListing() {
  const navigate = useNavigate()
  const [cases, setCases] = useState(INITIAL_CASES)
  const [showModal, setShowModal] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    navigate('/login')
  }

  const handleCreateCase = ({ title, status }) => {
    const next = {
      id: `C-${String(cases.length + 1).padStart(3, '0')}`,
      title,
      status,
      date: new Date().toISOString().slice(0, 10),
    }
    setCases([next, ...cases])
    setShowModal(false)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="font-semibold text-slate-800">Case Portal</span>
          </div>
          <button onClick={handleLogout}
            className="text-sm text-slate-500 hover:text-slate-800 transition-colors">
            Log out
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Cases</h1>
            <p className="text-sm text-slate-500 mt-0.5">{cases.length} total</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-slate-800 text-white text-sm font-medium
                       px-4 py-2.5 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Case
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Case #</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Title</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cases.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-slate-400">
                    No cases yet. Create your first one.
                  </td>
                </tr>
              )}
              {cases.map(c => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                  <td className="px-5 py-3.5 font-mono text-slate-400 text-xs">{c.id}</td>
                  <td className="px-5 py-3.5 text-slate-800 font-medium">{c.title}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[c.status]}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400">{c.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {showModal && (
        <NewCaseModal
          onClose={() => setShowModal(false)}
          onSubmit={handleCreateCase}
        />
      )}
    </div>
  )
}
