import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import CaseForm from '../pages/CaseForm'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock('../api', () => ({
  api: {
    get:  vi.fn(),
    post: vi.fn(),
    put:  vi.fn(),
    del:  vi.fn(),
  },
}))

import { api } from '../api'

const MOCK_CASE = {
  id: 'C-001',
  name: 'Ahmad bin Abdullah',
  nric: '801231-10-1234',
  passportNo: '',
  insurance: 'Takaful Malaysia',
  company: 'ABC Sdn Bhd',
  policyNo: 'TM-2024-00123',
  rbEntitlement: 200,
  coPayment: 10,
  coInsurance: 'N/A',
  deductible: 500,
  policyEffDate: '2024-01-01',
  policyExpDate: '2025-01-01',
  policyLapseDate: '',
  status: 'Inforce',
  underwritingExclusion: '',
  date: '2026-06-01',
}

function renderForm(path: string, routePath = path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path={routePath} element={<CaseForm />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('CaseForm — create mode (/cases/new)', () => {
  beforeEach(() => {
    localStorage.clear()
    mockNavigate.mockClear()
    vi.mocked(api.get).mockResolvedValue([])
    vi.mocked(api.post).mockResolvedValue({ ...MOCK_CASE, id: 'C-005', date: '2026-06-07' })
  })

  it('renders a blank form with Create Case button', async () => {
    renderForm('/cases/new')
    await waitFor(() => expect(screen.getByPlaceholderText(/full name/i)).toBeInTheDocument())
    expect(screen.getByPlaceholderText(/full name/i)).toHaveValue('')
    expect(screen.getByRole('button', { name: /create case/i })).toBeInTheDocument()
  })

  it('shows "New Case" in the page heading', async () => {
    renderForm('/cases/new')
    await waitFor(() => expect(screen.getByText('New Case')).toBeInTheDocument())
  })

  it('requires the name field before submitting', async () => {
    const user = userEvent.setup()
    renderForm('/cases/new')
    await waitFor(() => expect(screen.getByRole('button', { name: /create case/i })).toBeInTheDocument())

    await user.click(screen.getByRole('button', { name: /create case/i }))
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('creates a case and navigates to /cases on submit', async () => {
    const user = userEvent.setup()
    renderForm('/cases/new')
    await waitFor(() => expect(screen.getByPlaceholderText(/full name/i)).toBeInTheDocument())

    await user.type(screen.getByPlaceholderText(/full name/i), 'Ahmad bin Abdullah')
    await user.click(screen.getByRole('button', { name: /create case/i }))

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/cases'))
    expect(api.post).toHaveBeenCalledWith('/api/memberships', expect.objectContaining({ name: 'Ahmad bin Abdullah' }))
  })

  it('navigates back to /cases when Cancel is clicked', async () => {
    const user = userEvent.setup()
    renderForm('/cases/new')
    await waitFor(() => expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument())

    await user.click(screen.getByRole('button', { name: /cancel/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/cases')
  })
})

describe('CaseForm — edit mode (/cases/:id/edit)', () => {
  beforeEach(() => {
    localStorage.clear()
    mockNavigate.mockClear()
    vi.mocked(api.get).mockImplementation((path) => {
      if (path === '/api/memberships/C-001') return Promise.resolve(MOCK_CASE)
      if (path === '/api/memberships/C-001/submissions') return Promise.resolve([])
      if (path === '/api/memberships/C-999') return Promise.reject({ message: 'Not found' })
      if (path === '/api/memberships/C-999/submissions') return Promise.resolve([])
      return Promise.resolve([])
    })
    vi.mocked(api.put).mockResolvedValue({ ...MOCK_CASE, name: 'Updated Name' })
  })

  it('fetches the case by ID and pre-populates the form', async () => {
    renderForm('/cases/C-001/edit', '/cases/:id/edit')
    await waitFor(() => expect(screen.getByDisplayValue('Ahmad bin Abdullah')).toBeInTheDocument())
    expect(screen.getByDisplayValue('TM-2024-00123')).toBeInTheDocument()
    expect(api.get).toHaveBeenCalledWith('/api/memberships/C-001')
  })

  it('shows "Edit Case C-001" in the page heading', async () => {
    renderForm('/cases/C-001/edit', '/cases/:id/edit')
    await waitFor(() => expect(screen.getByText('Edit Case C-001')).toBeInTheDocument())
  })

  it('shows Save Changes button instead of Create Case', async () => {
    renderForm('/cases/C-001/edit', '/cases/:id/edit')
    await waitFor(() => expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument())
    expect(screen.queryByRole('button', { name: /create case/i })).not.toBeInTheDocument()
  })

  it('calls PUT /api/memberships/:id and navigates to /cases on submit', async () => {
    const user = userEvent.setup()
    renderForm('/cases/C-001/edit', '/cases/:id/edit')
    await waitFor(() => expect(screen.getByDisplayValue('Ahmad bin Abdullah')).toBeInTheDocument())

    const nameInput = screen.getByDisplayValue('Ahmad bin Abdullah')
    await user.clear(nameInput)
    await user.type(nameInput, 'Updated Name')
    await user.click(screen.getByRole('button', { name: /save changes/i }))

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/cases'))
    expect(api.put).toHaveBeenCalledWith('/api/memberships/C-001', expect.objectContaining({ name: 'Updated Name' }))
  })

  it('shows a not-found message when the API returns an error for the case ID', async () => {
    renderForm('/cases/C-999/edit', '/cases/:id/edit')
    await waitFor(() => expect(screen.getByText(/not found/i)).toBeInTheDocument())
    expect(api.get).toHaveBeenCalledWith('/api/memberships/C-999')
  })
})
