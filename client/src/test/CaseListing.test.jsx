import { render, screen } from '@testing-library/react'
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
  })

  it('renders the initial cases in the table', () => {
    renderListing()
    expect(screen.getByText('C-001')).toBeInTheDocument()
    expect(screen.getByText('Server outage in production')).toBeInTheDocument()
    expect(screen.getByText('C-004')).toBeInTheDocument()
  })

  it('displays the correct total case count', () => {
    renderListing()
    expect(screen.getByText('4 total')).toBeInTheDocument()
  })

  it('shows status badges for cases', () => {
    renderListing()
    expect(screen.getAllByText('Open').length).toBeGreaterThan(0)
    expect(screen.getByText('In Progress')).toBeInTheDocument()
    expect(screen.getByText('Closed')).toBeInTheDocument()
  })

  it('navigates to /cases/new when New Case is clicked', async () => {
    const user = userEvent.setup()
    renderListing()

    await user.click(screen.getByRole('button', { name: /new case/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/cases/new')
  })

  it('navigates to the edit page when Edit is clicked on a row', async () => {
    const user = userEvent.setup()
    renderListing()

    const editButtons = screen.getAllByRole('button', { name: /edit/i })
    await user.click(editButtons[0])
    expect(mockNavigate).toHaveBeenCalledWith('/cases/C-001/edit')
  })

  it('shows an empty state message when there are no cases', () => {
    // Pre-set empty cases in localStorage so the provider starts empty
    localStorage.setItem('cases', JSON.stringify([]))
    renderListing()
    expect(screen.getByText(/no cases yet/i)).toBeInTheDocument()
  })

  it('clears the auth token and navigates to /login on logout', async () => {
    const user = userEvent.setup()
    localStorage.setItem('auth_token', 'test-token')
    renderListing()

    await user.click(screen.getByRole('button', { name: /log out/i }))
    expect(localStorage.getItem('auth_token')).toBeNull()
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })
})
