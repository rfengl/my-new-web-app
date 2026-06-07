import { useNavigate } from 'react-router-dom'
import { useCases } from '../context/CasesContext'

const STATUS_STYLES = {
  Open:          'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  'In Progress': 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  Closed:        'bg-slate-100 text-slate-500 ring-1 ring-slate-200',
}

const PRIORITY_STYLES = {
  High:   'text-red-500',
  Medium: 'text-amber-500',
  Low:    'text-slate-400',
}

export default function CaseListing() {
  const navigate = useNavigate()
  const { cases } = useCases()

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    navigate('/login')
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
            onClick={() => navigate('/cases/new')}
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
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Priority</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cases.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-slate-400">
                    No cases yet. Create your first one.
                  </td>
                </tr>
              )}
              {cases.map(c => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-slate-400 text-xs">{c.id}</td>
                  <td className="px-5 py-3.5 text-slate-800 font-medium">{c.title}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold ${PRIORITY_STYLES[c.priority] ?? 'text-slate-400'}`}>
                      {c.priority ?? '—'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[c.status]}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400">{c.date}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => navigate(`/cases/${c.id}/edit`)}
                      className="text-xs text-slate-400 hover:text-slate-700 transition-colors"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
