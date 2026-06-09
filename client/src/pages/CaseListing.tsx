import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMembershipsStore } from '../store/membershipsStore'
import { formatDate } from '../utils/date'

const STATUS_STYLES: Record<string, string> = {
  Inforce: 'bg-[#d1fae5] text-[#065f46]',
  Expired: 'bg-slate-100 text-slate-500',
}

export default function CaseListing() {
  const navigate = useNavigate()

  const memberships      = useMembershipsStore((s) => s.memberships)
  const loading          = useMembershipsStore((s) => s.loading)
  const error            = useMembershipsStore((s) => s.error)
  const fetchMemberships = useMembershipsStore((s) => s.fetchMemberships)
  const deleteMembership = useMembershipsStore((s) => s.deleteMembership)
  const reset            = useMembershipsStore((s) => s.reset)

  const [deleting, setDeleting] = useState(new Set<string>())

  useEffect(() => {
    fetchMemberships()
  }, [fetchMemberships])

  const handleDelete = async (id: string) => {
    if (!window.confirm(`Delete case ${id}? This cannot be undone.`)) return
    setDeleting((prev) => new Set([...prev, id]))
    try {
      await deleteMembership(id)
    } finally {
      setDeleting((prev) => {
        const s = new Set(prev)
        s.delete(id)
        return s
      })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    reset()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-navy shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-500 rounded-md flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <span className="font-semibold text-white tracking-wide leading-none">Case Portal</span>
              <p className="text-[11px] text-white/50 leading-none mt-0.5 tracking-wide uppercase">TPA Platform · Malaysia</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
<button onClick={() => navigate('/api-docs')}
              className="text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-md px-3 py-1.5 transition-colors flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              API Docs
            </button>
            <button onClick={() => navigate('/guide')}
              className="text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-md px-3 py-1.5 transition-colors flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Help
            </button>
            <div className="w-px h-5 bg-white/20 mx-2" />
            <button onClick={handleLogout}
              className="text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-md px-3 py-1.5 transition-colors">
              Log out
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Cases</h1>
            <p className="text-sm text-slate-500 mt-0.5">{memberships.length} total</p>
          </div>
          <button
            onClick={() => navigate('/cases/new')}
            className="flex items-center gap-2 bg-primary-700 text-white text-sm font-medium
                       px-4 py-2.5 rounded-lg hover:bg-primary-800 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Case
          </button>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-4 flex items-center justify-between bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
            <span>{error}</span>
            <button onClick={fetchMemberships} className="text-xs underline ml-4">Retry</button>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Policy No</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Name</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">ID No</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Eff. Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Created</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-slate-400">
                    Loading cases…
                  </td>
                </tr>
              )}
              {!loading && memberships.length === 0 && !error && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-slate-400">
                    No cases yet. Create your first one.
                  </td>
                </tr>
              )}
              {memberships.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-slate-600 text-xs">{m.policyNo || '—'}</td>
                  <td className="px-5 py-3.5 text-slate-800 font-medium">{m.name}</td>
                  <td className="px-5 py-3.5 text-slate-500 text-xs">
                    <span className="font-mono">{m.idNo || '—'}</span>
                    {m.idNo && <span className="ml-1.5 text-[10px] text-slate-400 uppercase">{m.idType}</span>}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 text-xs">{formatDate(m.policyEffDate)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${STATUS_STYLES[m.status] ?? 'bg-slate-100 text-slate-500'}`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 text-xs">{formatDate(m.createdDate)}</td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/cases/${m.id}/edit`)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-slate-600
                                   border border-slate-300 rounded-md px-2.5 py-1
                                   hover:bg-slate-100 transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(m.id)}
                        disabled={deleting.has(m.id)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-red-600
                                   border border-red-200 rounded-md px-2.5 py-1
                                   hover:bg-red-50 disabled:opacity-50 transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        {deleting.has(m.id) ? 'Deleting…' : 'Delete'}
                      </button>
                    </div>
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
