import { createContext, useContext, useState } from 'react'

const CasesContext = createContext(null)

const INITIAL_CASES = [
  { id: 'C-001', title: 'Server outage in production',    status: 'Open',        priority: 'High',   description: 'Production servers went down at 3am. Needs immediate attention.', date: '2026-06-01' },
  { id: 'C-002', title: 'Login timeout after 5 minutes',  status: 'In Progress', priority: 'Medium', description: 'Users are being logged out after 5 minutes of inactivity.', date: '2026-06-03' },
  { id: 'C-003', title: 'Export PDF feature not working', status: 'Closed',      priority: 'Low',    description: 'PDF export button throws a 500 error on large datasets.', date: '2026-05-28' },
  { id: 'C-004', title: 'Dashboard chart renders empty',  status: 'Open',        priority: 'Medium', description: 'The line chart on the main dashboard shows no data after refresh.', date: '2026-06-05' },
]

export function CasesProvider({ children }) {
  const [cases, setCases] = useState(() => {
    try {
      const stored = localStorage.getItem('cases')
      return stored ? JSON.parse(stored) : INITIAL_CASES
    } catch {
      return INITIAL_CASES
    }
  })

  const persist = (updated) => {
    setCases(updated)
    localStorage.setItem('cases', JSON.stringify(updated))
  }

  const addCase = (data) => {
    const maxNum = cases.reduce((max, c) => {
      const n = parseInt(c.id.replace('C-', ''), 10)
      return Math.max(max, isNaN(n) ? 0 : n)
    }, 0)
    const next = {
      id: `C-${String(maxNum + 1).padStart(3, '0')}`,
      date: new Date().toISOString().slice(0, 10),
      ...data,
    }
    persist([next, ...cases])
    return next.id
  }

  const updateCase = (id, data) => {
    persist(cases.map(c => c.id === id ? { ...c, ...data } : c))
  }

  const getCaseById = (id) => cases.find(c => c.id === id)

  return (
    <CasesContext.Provider value={{ cases, addCase, updateCase, getCaseById }}>
      {children}
    </CasesContext.Provider>
  )
}

export const useCases = () => useContext(CasesContext)
