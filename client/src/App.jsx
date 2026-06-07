import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import CaseListing from './pages/CaseListing'

function PrivateRoute({ children }) {
  return localStorage.getItem('auth_token')
    ? children
    : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/cases" element={<PrivateRoute><CaseListing /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/cases" replace />} />
    </Routes>
  )
}
