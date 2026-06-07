import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CasesProvider } from '../context/CasesContext'
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
  id: 'C-001', title: 'Server outage in production',
  description: 'Production servers went down at 3am.',
  status: 'Open', priority: 'High', date: '2026-06-01',
}

function renderForm(path, routePath = path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <CasesProvider>
        <Routes>
          <Route path={routePath} element={<CaseForm />} />
        </Routes>
      </CasesProvider>
    </MemoryRouter>
  )
}

describe('CaseForm — create mode (/cases/new)', () => {
  beforeEach(() => {
    localStorage.clear()
    mockNavigate.mockClear()
    // Provider list fetch
    vi.mocked(api.get).mockResolvedValue({ data: [], total: 0 })
    vi.mocked(api.post).mockResolvedValue({ id: 'C-005', title: 'New test issue', status: 'Open', priority: 'Medium', date: '2026-06-07' })
  })

  it('renders a blank form with Create Case button', async () => {
    renderForm('/cases/new')
    await waitFor(() => expect(screen.getByPlaceholderText(/brief summary/i)).toBeInTheDocument())
    expect(screen.getByPlaceholderText(/brief summary/i)).toHaveValue('')
    expect(screen.getByRole('button', { name: /create case/i })).toBeInTheDocument()
  })

  it('shows "New Case" in the page heading', async () => {
    renderForm('/cases/new')
    await waitFor(() => expect(screen.getByText('New Case')).toBeInTheDocument())
  })

  it('requires the title field before submitting', async () => {
    const user = userEvent.setup()
    renderForm('/cases/new')
    await waitFor(() => expect(screen.getByRole('button', { name: /create case/i })).toBeInTheDocument())

    await user.click(screen.getByRole('button', { name: /create case/i }))
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('creates a case and navigates to /cases on submit', async () => {
    const user = userEvent.setup()
    renderForm('/cases/new')
    await waitFor(() => expect(screen.getByPlaceholderText(/brief summary/i)).toBeInTheDocument())

    await user.type(screen.getByPlaceholderText(/brief summary/i), 'New test issue')
    await user.click(screen.getByRole('button', { name: /create case/i }))

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/cases'))
    expect(api.post).toHaveBeenCalledWith('/api/cases', expect.objectContaining({ title: 'New test issue' }))
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
    // Provider list fetch + individual case fetch
    vi.mocked(api.get).mockImplementation((path) => {
      if (path === '/api/cases/C-001') return Promise.resolve(MOCK_CASE)
      if (path === '/api/cases/C-999') return Promise.reject({ message: 'Not found' })
      return Promise.resolve({ data: [], total: 0 })
    })
    vi.mocked(api.put).mockResolvedValue({ ...MOCK_CASE, title: 'Updated title' })
  })

  it('fetches the case by ID and pre-populates the form', async () => {
    renderForm('/cases/C-001/edit', '/cases/:id/edit')
    await waitFor(() => expect(screen.getByDisplayValue('Server outage in production')).toBeInTheDocument())
    expect(screen.getByDisplayValue('Production servers went down at 3am.')).toBeInTheDocument()
    expect(api.get).toHaveBeenCalledWith('/api/cases/C-001')
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

  it('calls PUT /api/cases/:id and navigates to /cases on submit', async () => {
    const user = userEvent.setup()
    renderForm('/cases/C-001/edit', '/cases/:id/edit')
    await waitFor(() => expect(screen.getByDisplayValue('Server outage in production')).toBeInTheDocument())

    const titleInput = screen.getByDisplayValue('Server outage in production')
    await user.clear(titleInput)
    await user.type(titleInput, 'Updated title')
    await user.click(screen.getByRole('button', { name: /save changes/i }))

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/cases'))
    expect(api.put).toHaveBeenCalledWith('/api/cases/C-001', expect.objectContaining({ title: 'Updated title' }))
  })

  it('shows a not-found message when the API returns an error for the case ID', async () => {
    renderForm('/cases/C-999/edit', '/cases/:id/edit')
    await waitFor(() => expect(screen.getByText(/not found/i)).toBeInTheDocument())
    expect(api.get).toHaveBeenCalledWith('/api/cases/C-999')
  })
})
