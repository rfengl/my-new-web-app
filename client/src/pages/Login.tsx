import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from 'zustand'
import { createLoginFormStore } from '../store/loginFormStore'
import { api } from '../api'
import ZustandInput from '../components/ZustandInput'

export default function Login() {
  const navigate = useNavigate()
  const [store]  = useState(() => createLoginFormStore())

  const error   = useStore(store, (s) => s.error)
  const loading = useStore(store, (s) => s.loading)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    store.setState({ loading: true, error: '' })
    const { email, password } = store.getState()
    try {
      const { token } = await api.post<{ token: string; expiresIn: number }>('/api/auth/login', {
        email,
        password,
      })
      localStorage.setItem('auth_token', token)
      navigate('/cases')
    } catch (err: any) {
      store.setState({ error: err?.message ?? 'Invalid email or password.' })
    } finally {
      store.setState({ loading: false })
    }
  }

  const inputClass =
    'w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm ' +
    'focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent ' +
    'placeholder:text-slate-400'

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-800 rounded-xl mb-3">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Case Portal</h1>
          <p className="text-sm text-slate-500 mt-1">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email address
              </label>
              <ZustandInput
                store={store}
                field="email"
                type="email"
                required
                autoComplete="email"
                className={inputClass}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <ZustandInput
                store={store}
                field="password"
                type="password"
                required
                autoComplete="current-password"
                className={inputClass}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2.5">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-800 text-white rounded-lg py-2.5 text-sm font-medium
                         hover:bg-slate-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          Demo credentials: admin@example.com / password123
        </p>
      </div>
    </div>
  )
}
