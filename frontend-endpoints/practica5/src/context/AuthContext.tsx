import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { ApiError, registerUnauthorizedHandler } from '../api/client'
import { getMyId, getRole, getUser, login as loginRequest } from '../api/endpoints'
import type { UserDetail } from '../api/types'
import { PRACTICA } from '../practica'
import { AuthContext } from './useAuth'
import type { AuthValue } from './useAuth'

async function fetchSession() {
  const { id } = await getMyId()
  const user = await getUser(id)
  const roles = await Promise.all(user.roles.map((role) => getRole(role.id)))
  const permissions = [...new Set(roles.flatMap((role) =>
    role.permissions.map((permission) => permission.name),
  ))]
  return { user, permissions }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user, setUser] = useState<UserDetail | null>(null)
  const [permissions, setPermissions] = useState<string[]>([])
  const [sessionMessage, setSessionMessage] = useState<string | null>(null)
  const [showAllButtons, setShowAllButtons] = useState(false)

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    setPermissions([])
    setShowAllButtons(false)
  }, [])

  const refreshSession = useCallback(async () => {
    const session = await fetchSession()
    setUser(session.user)
    setPermissions(session.permissions)
  }, [])

  useEffect(() => {
    registerUnauthorizedHandler(() => {
      logout()
      setSessionMessage('Tu sesión venció. Volvé a ingresar.')
    })
    return () => registerUnauthorizedHandler(() => {})
  }, [logout])

  useEffect(() => {
    if (!token) return
    let active = true
    fetchSession().then((session) => {
      if (!active) return
      setUser(session.user)
      setPermissions(session.permissions)
    }).catch((cause: Error) => {
      if (!active) return
      localStorage.removeItem('token')
      setToken(null)
      setUser(null)
      setPermissions([])
      setSessionMessage(
        cause instanceof ApiError ? cause.message : 'No se pudo recuperar la sesión.',
      )
    })
    return () => {
      active = false
    }
  }, [token])

  async function login(email: string, password: string) {
    setSessionMessage(null)
    const result = await loginRequest(email, password)
    localStorage.setItem('token', result.token)
    setToken(result.token)
  }

  const value = useMemo<AuthValue>(() => ({
    user,
    permissions,
    isAuthenticated: token !== null,
    loadingSession: token !== null && user === null,
    sessionMessage,
    showAllButtons,
    setShowAllButtons,
    login,
    logout,
    refreshSession,
    can: (permission) =>
      PRACTICA < 8 || showAllButtons || permissions.includes(permission),
    hasPermission: (permission) => permissions.includes(permission),
  }), [user, permissions, token, sessionMessage, showAllButtons, logout, refreshSession])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
