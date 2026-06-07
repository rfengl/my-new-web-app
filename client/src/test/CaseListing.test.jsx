import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CasesProvider } from '../context/CasesContext'
import CaseListing from '../pages/CaseListing'

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

const MOCK_CASES = [
  { id: 'C-001', title: 'Server outage in production',    status: 'Open',        priority: 'High',   date: '2026-06-01' },
  { id: 'C-002', title: 'Login timeout after 5 minutes',  status: 'In Progress', priority: 'Medium', date: '2026-06-03' },
  { id: 'C-003', title: 'Export PDF feature not working', status: 'Closed',      priority: 'Low',    date: '2026-05-28' },
  { id: 'C-004', title: 'Dashboard chart renders empty',  status: 'Open',        priority: 'Medium', date: '2026-06-05' },
]

function renderListing() {
  return render(
    <MemoryRouter>
      <CasesProvider>
        <CaseListing />
      </CasesProvider>
    </MemoryRouter>
  )
}

describe('Case Listing page', () => {
  beforeEach(() => {
    localStorage.clear()
    mockNavigate.mockClear()
    vi.mocked(api.get).mockResolvedValue({ data: MOCK_CASES, total: MOCK_CASES.length })
    vi.mocked(api.del).mockReset()
  })

  it('renders cases from the API', async () => {
    renderListing()
    await waitFor(() => {
      expect(screen.getByText('C-001')).toBeInTheDocument()
    })
    expect(screen.getByText('Server outage in production')).toBeInTheDocument()
    expect(screen.getByText('C-004')).toBeInTheDocument()
  })

  it('displays the correct total case count', async () => {
    renderListing()
    await waitFor(() => expect(screen.getByText('4 total')).toBeInTheDocument())
  })

  it('shows status badges for cases', async () => {
    renderListing()
    await waitFor(() => expect(screen.getByText('In Progress')).toBeInTheDocument())
    expect(screen.getAllByText('Open').length).toBeGreaterThan(0)
    expect(screen.getByText('Closed')).toBeInTheDocument()
  })

  it('navigates to /cases/new when New Case is clicked', async () => {
    const user = userEvent.setup()
    renderListing()
    await waitFor(() => expect(screen.getByText('C-001')).toBeInTheDocument())

    await user.click(screen.getByRole('button', { name: /new case/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/cases/new')
  })

  it('navigates to the edit page when Edit is clicked on a row', async () => {
    const user = userEvent.setup()
    renderListing()
    await waitFor(() => expect(screen.getByText('C-001')).toBeInTheDocument())

    const editButtons = screen.getAllByRole('button', { name: /edit/i })
    await user.click(editButtons[0])
    expect(mockNavigate).toHaveBeenCalledWith('/cases/C-001/edit')
  })

  it('shows an empty state message when the API returns no cases', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: [], total: 0 })
    renderListing()
    await waitFor(() => expect(screen.getByText(/no cases yet/i)).toBeInTheDocument())
  })

  it('shows an error banner when the API fails', async () => {
    vi.mocked(api.get).mockRejectedValue({ message: 'Failed to load cases.' })
    renderListing()
    await waitFor(() => expect(screen.getByText('Failed to load cases.')).toBeInTheDocument())
  })

  it('clears the auth token and navigates to /login on logout', async () => {
    const user = userEvent.setup()
    localStorage.setItem('auth_token', 'test-token')
    renderListing()
    await waitFor(() => expect(screen.getByText('C-001')).toBeInTheDocument())

    await user.click(screen.getByRole('button', { name: /log out/i }))
    expect(localStorage.getItem('auth_token')).toBeNull()
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  it('removes a case from the list after confirming delete', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    vi.mocked(api.del).mockResolvedValue(null)
    const user = userEvent.setup()
    renderListing()
    await waitFor(() => expect(screen.getByText('C-001')).toBeInTheDocument())

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    await user.click(deleteButtons[0])

    await waitFor(() => expect(screen.queryByText('C-001')).not.toBeInTheDocument())
    expect(api.del).toHaveBeenCalledWith('/api/cases/C-001')
  })

  it('does not delete when the confirmation is cancelled', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    const user = userEvent.setup()
    renderListing()
    await waitFor(() => expect(screen.getByText('C-001')).toBeInTheDocument())

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    await user.click(deleteButtons[0])

    expect(api.del).not.toHaveBeenCalled()
    expect(screen.getByText('C-001')).toBeInTheDocument()
  })
})
