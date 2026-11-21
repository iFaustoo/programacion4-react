import { useEffect, useState } from 'react'
import type { SubmitEvent } from 'react'
import {
  getMyId,
  getUser,
  getUsers,
  login as loginRequest,
} from './api/endpoints'
import { ErrorMessage } from './components/ErrorMessage'
import type { UserDetail, UserSummary } from './api/types'
import { PRACTICA } from './practica'

export function LegacyApp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState(() =>
    PRACTICA >= 3 ? localStorage.getItem('token') : null,
  )
  const [user, setUser] = useState<UserDetail | null>(null)
  const [users, setUsers] = useState<UserSummary[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loadedToken, setLoadedToken] = useState<string | null>(null)
  const loading = Boolean(token && PRACTICA >= 2 && loadedToken !== token)

  useEffect(() => {
    if (!token || PRACTICA < 2) return
    let active = true
    const headers = { Authorization: `Bearer ${token}` }
    const load = PRACTICA >= 4
      ? Promise.all([getUsers(0, 100), getMyId().then(({ id }) => getUser(id))])
      : Promise.resolve().then(() => {
          const apiUrl = getApiUrl()
          return Promise.all([
            fetch(`${apiUrl}/user`, { headers }).then(async (response) => {
              const body: unknown = await response.json()
              if (!response.ok) throw new Error(readDetail(body))
              return body as UserSummary[]
            }),
            fetch(`${apiUrl}/user/me/id`, { headers })
              .then((response) => readJSON<{ id: number }>(response))
              .then(({ id }) => fetch(`${apiUrl}/user/${id}`, { headers }))
              .then((response) => readJSON<UserDetail>(response)),
          ])
        })

    load.then(([resultUsers, currentUser]) => {
      if (!active) return
      setUsers(resultUsers)
      setUser(currentUser)
      setLoadedToken(token)
      setError(null)
    }).catch((cause: Error) => {
      if (active) {
        setLoadedToken(token)
        setError(cause.message)
      }
    })
    return () => {
      active = false
    }
  }, [token])

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    try {
      let newToken: string
      if (PRACTICA >= 4) {
        newToken = (await loginRequest(email, password)).token
      } else {
        const response = await fetch(`${getApiUrl()}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })
        const body: unknown = await response.json()
        if (!response.ok) throw new Error(readDetail(body))
        if (
          typeof body !== 'object' ||
          body === null ||
          !('token' in body) ||
          typeof body.token !== 'string'
        ) {
          throw new Error('La API devolvió una respuesta de login inválida.')
        }
        newToken = body.token
      }
      if (PRACTICA >= 3) localStorage.setItem('token', newToken)
      setToken(newToken)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo iniciar sesión.')
    }
  }

  function logout() {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    setUsers([])
    setLoadedToken(null)
  }

  if (!token) {
    return (
      <main className="login-shell">
        <form className="panel login-form" onSubmit={submit}>
          <p className="eyebrow">Práctica {PRACTICA}</p>
          <h1>Ingresar</h1>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <ErrorMessage message={error} />
          <button type="submit">Ingresar</button>
        </form>
      </main>
    )
  }

  if (PRACTICA === 1) {
    return (
      <main className="page-content panel">
        <h1>Bienvenido</h1>
        <p>Login correcto. El token recibido es visible para el navegador.</p>
        <code className="token-display">{token}</code>
      </main>
    )
  }

  return (
    <main className="page-content">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Práctica {PRACTICA}</p>
          <h1>Hola, {user?.name ?? 'usuario'}</h1>
        </div>
        {PRACTICA >= 3 && <button type="button" className="secondary" onClick={logout}>Salir</button>}
      </div>
      <ErrorMessage message={error} />
      {loading && <p role="status">Cargando datos…</p>}
      {user && (
        <div className="panel">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Roles:</strong> {user.roles.map((role) => role.name).join(', ') || 'ninguno'}</p>
        </div>
      )}
      <h2>Usuarios</h2>
      <ul className="card-list">
        {users.map((item) => <li className="panel" key={item.id}>{item.name}</li>)}
      </ul>
    </main>
  )
}

async function readJSON<T>(response: Response): Promise<T> {
  const body: unknown = await response.json()
  if (!response.ok) throw new Error(readDetail(body))
  return body as T
}

function readDetail(body: unknown): string {
  if (typeof body === 'object' && body !== null && 'detail' in body) {
    const { detail } = body
    if (typeof detail === 'string') return detail
  }
  return 'La API devolvió un error inesperado.'
}

function getApiUrl() {
  const apiUrl = import.meta.env.VITE_API_URL
  if (!apiUrl) {
    throw new Error('Configurá VITE_API_URL en .env.development antes de iniciar la app.')
  }
  return apiUrl
}
