import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export function RequirePermission({ permission }: { permission: string }) {
  const { hasPermission } = useAuth()
  if (!hasPermission(permission)) return <Navigate to="/users" replace />
  return <Outlet />
}
