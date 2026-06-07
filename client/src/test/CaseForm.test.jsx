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
  })

  it('renders a blank form with Create Case button', () => {
    renderForm('/cases/new')
    expect(screen.getByPlaceholderText(/brief summary/i)).toHaveValue('')
    expect(screen.getByPlaceholderText(/describe the issue/i)).toHaveValue('')
    expect(screen.getByRole('button', { name: /create case/i })).toBeInTheDocument()
  })

  it('shows "New Case" in the page heading', () => {
    renderForm('/cases/new')
    expect(screen.getByText('New Case')).toBeInTheDocument()
  })

  it('requires the title field before submitting', async () => {
    const user = userEvent.setup()
    renderForm('/cases/new')

    await user.click(screen.getByRole('button', { name: /create case/i }))
    // HTML5 validation prevents submit — navigate should not be called
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('creates a case and navigates to /cases on submit', async () => {
    const user = userEvent.setup()
    renderForm('/cases/new')

    await user.type(screen.getByPlaceholderText(/brief summary/i), 'New test issue')
    await user.click(screen.getByRole('button', { name: /create case/i }))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/cases')
    })
  })

  it('navigates back to /cases when Cancel is clicked', async () => {
    const user = userEvent.setup()
    renderForm('/cases/new')

    await user.click(screen.getByRole('button', { name: /cancel/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/cases')
  })
})

describe('CaseForm — edit mode (/cases/:id/edit)', () => {
  beforeEach(() => {
    localStorage.clear()
    mockNavigate.mockClear()
  })

  it('pre-populates fields with the existing case data', () => {
    renderForm('/cases/C-001/edit', '/cases/:id/edit')
    expect(screen.getByDisplayValue('Server outage in production')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Production servers went down at 3am. Needs immediate attention.')).toBeInTheDocument()
  })

  it('shows "Edit Case C-001" in the page heading', () => {
    renderForm('/cases/C-001/edit', '/cases/:id/edit')
    expect(screen.getByText('Edit Case C-001')).toBeInTheDocument()
  })

  it('shows Save Changes button instead of Create Case', () => {
    renderForm('/cases/C-001/edit', '/cases/:id/edit')
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /create case/i })).not.toBeInTheDocument()
  })

  it('saves changes and navigates to /cases on submit', async () => {
    const user = userEvent.setup()
    renderForm('/cases/C-001/edit', '/cases/:id/edit')

    const titleInput = screen.getByDisplayValue('Server outage in production')
    await user.clear(titleInput)
    await user.type(titleInput, 'Updated title')
    await user.click(screen.getByRole('button', { name: /save changes/i }))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/cases')
    })
  })

  it('shows a not-found message for an unknown case id', () => {
    renderForm('/cases/C-999/edit', '/cases/:id/edit')
    expect(screen.getByText(/not found/i)).toBeInTheDocument()
  })
})
