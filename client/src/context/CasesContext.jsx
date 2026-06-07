import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { api } from '../api'

const CasesContext = createContext(null)

export function CasesProvider({ children }) {
  const [cases, setCases]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  const fetchCases = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.get('/api/cases')
      setCases(data)
    } catch (err) {
      setError(err?.message ?? 'Failed to load cases.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchCases() }, [fetchCases])

  const addCase = async (data) => {
    const created = await api.post('/api/cases', data)
    setCases(prev => [created, ...prev])
    return created.id
  }

  const updateCase = async (id, data) => {
    const updated = await api.put(`/api/cases/${id}`, data)
    setCases(prev => prev.map(c => c.id === id ? updated : c))
  }

  const deleteCase = async (id) => {
    await api.del(`/api/cases/${id}`)
    setCases(prev => prev.filter(c => c.id !== id))
  }

  return (
    <CasesContext.Provider value={{ cases, loading, error, addCase, updateCase, deleteCase, refresh: fetchCases }}>
      {children}
    </CasesContext.Provider>
  )
}

export const useCases = () => useContext(CasesContext)
