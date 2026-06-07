import { Routes, Route, Navigate } from 'react-router-dom'
import { CasesProvider } from './context/CasesContext'
import Login from './pages/Login'
import CaseListing from './pages/CaseListing'
import CaseForm from './pages/CaseForm'
import UserGuide from './pages/UserGuide'
import ApiDocs from './pages/ApiDocs'

function PrivateRoute({ children }) {
  return localStorage.getItem('auth_token')
    ? children
    : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <CasesProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cases" element={<PrivateRoute><CaseListing /></PrivateRoute>} />
        <Route path="/cases/new" element={<PrivateRoute><CaseForm /></PrivateRoute>} />
        <Route path="/cases/:id/edit" element={<PrivateRoute><CaseForm /></PrivateRoute>} />
        <Route path="/guide" element={<PrivateRoute><UserGuide /></PrivateRoute>} />
        <Route path="/api-docs" element={<PrivateRoute><ApiDocs /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/cases" replace />} />
      </Routes>
    </CasesProvider>
  )
}
