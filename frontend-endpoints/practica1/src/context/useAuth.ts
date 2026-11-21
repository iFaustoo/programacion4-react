import { createContext, useContext } from 'react'
import type { UserDetail } from '../api/types'

export interface AuthValue {
  user: UserDetail | null
  permissions: string[]
  isAuthenticated: boolean
  loadingSession: boolean
  sessionMessage: string | null
  showAllButtons: boolean
  setShowAllButtons: (show: boolean) => void
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  refreshSession: () => Promise<void>
  can: (permission: string) => boolean
  hasPermission: (permission: string) => boolean
}

export const AuthContext = createContext<AuthValue | null>(null)

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return value
}
