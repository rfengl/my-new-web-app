import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCasesStore } from '../store/casesStore'
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
  { id: 'C-001', name: 'Ahmad bin Abdullah',    nric: '801231-10-1234', policyNo: 'TM-2024-00123',  policyEffDate: '2024-01-01', status: 'Inforce', date: '2026-06-01' },
  { id: 'C-002', name: 'Siti Rahayu bt Yusof', nric: '900515-14-5678', policyNo: 'PRU-2023-00456', policyEffDate: '2023-06-01', status: 'Expired', date: '2026-06-03' },
  { id: 'C-003', name: 'Lim Wei Jie',          nric: '',               policyNo: 'AIA-2024-00789', policyEffDate: '2024-03-15', status: 'Inforce', date: '2026-05-28' },
  { id: 'C-004', name: 'Kavitha a/p Rajan',    nric: '851120-07-2345', policyNo: 'GE-2022-01011',  policyEffDate: '2022-11-20', status: 'Expired', date: '2026-06-05' },
]

function renderListing() {
  return render(
    <MemoryRouter>
      <CaseListing />
    </MemoryRouter>
  )
}

describe('Case Listing page', () => {
  beforeEach(() => {
    localStorage.clear()
    mockNavigate.mockClear()
    useCasesStore.setState({ cases: [], loading: false, error: null })
    vi.mocked(api.get).mockResolvedValue({ data: MOCK_CASES, total: MOCK_CASES.length })
    vi.mocked(api.del).mockReset()
  })

  it('renders cases from the API', async () => {
    renderListing()
    await waitFor(() => {
      expect(screen.getByText('Ahmad bin Abdullah')).toBeInTheDocument()
    })
    expect(screen.getByText('TM-2024-00123')).toBeInTheDocument()
    expect(screen.getByText('Kavitha a/p Rajan')).toBeInTheDocument()
  })

  it('displays the correct total case count', async () => {
    renderListing()
    await waitFor(() => expect(screen.getByText('4 total')).toBeInTheDocument())
  })

  it('shows status badges for cases', async () => {
    renderListing()
    await waitFor(() => expect(screen.getAllByText('Inforce').length).toBeGreaterThan(0))
    expect(screen.getAllByText('Expired').length).toBeGreaterThan(0)
  })

  it('navigates to /cases/new when New Case is clicked', async () => {
    const user = userEvent.setup()
    renderListing()
    await waitFor(() => expect(screen.getByText('Ahmad bin Abdullah')).toBeInTheDocument())

    await user.click(screen.getByRole('button', { name: /new case/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/cases/new')
  })

  it('navigates to the edit page when Edit is clicked on a row', async () => {
    const user = userEvent.setup()
    renderListing()
    await waitFor(() => expect(screen.getByText('Ahmad bin Abdullah')).toBeInTheDocument())

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
    await waitFor(() => expect(screen.getByText('Ahmad bin Abdullah')).toBeInTheDocument())

    await user.click(screen.getByRole('button', { name: /log out/i }))
    expect(localStorage.getItem('auth_token')).toBeNull()
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  it('removes a case from the list after confirming delete', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    vi.mocked(api.del).mockResolvedValue(null)
    const user = userEvent.setup()
    renderListing()
    await waitFor(() => expect(screen.getByText('Ahmad bin Abdullah')).toBeInTheDocument())

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    await user.click(deleteButtons[0])

    await waitFor(() => expect(screen.queryByText('Ahmad bin Abdullah')).not.toBeInTheDocument())
    expect(api.del).toHaveBeenCalledWith('/api/cases/C-001')
  })

  it('does not delete when the confirmation is cancelled', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    const user = userEvent.setup()
    renderListing()
    await waitFor(() => expect(screen.getByText('Ahmad bin Abdullah')).toBeInTheDocument())

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    await user.click(deleteButtons[0])

    expect(api.del).not.toHaveBeenCalled()
    expect(screen.getByText('Ahmad bin Abdullah')).toBeInTheDocument()
  })
})
