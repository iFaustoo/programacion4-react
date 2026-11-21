import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export function ProtectedRoute() {
  const { isAuthenticated, loadingSession } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (loadingSession) return <p role="status">Cargando sesión…</p>
  return <Outlet />
}
