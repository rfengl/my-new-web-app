import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Login from './pages/Login'
import CaseListing from './pages/CaseListing'
import CaseForm from './pages/CaseForm'
import UserGuide from './pages/UserGuide'
import ApiDocs from './pages/ApiDocs'

function ProtectedLayout() {
  if (!localStorage.getItem('auth_token')) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/cases"          element={<CaseListing />} />
        <Route path="/cases/new"      element={<CaseForm />} />
        <Route path="/cases/:id/edit" element={<CaseForm />} />
        <Route path="/guide"          element={<UserGuide />} />
        <Route path="/api-docs"       element={<ApiDocs />} />
      </Route>
      <Route path="*" element={<Navigate to="/cases" replace />} />
    </Routes>
  )
}
