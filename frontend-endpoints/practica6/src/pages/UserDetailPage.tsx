import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getRoles, getUser, addRoleToUser, removeRoleFromUser } from '../api/endpoints'
import { ErrorMessage } from '../components/ErrorMessage'
import { useAuth } from '../context/useAuth'
import { useFetch } from '../hooks/useFetch'
import { PRACTICA } from '../practica'

export function UserDetailPage() {
  const userId = Number(useParams().id)
  const { can, user: currentUser, refreshSession } = useAuth()
  const [selectedRole, setSelectedRole] = useState('')
  const [actionError, setActionError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const {
    data: user,
    error,
    loading,
    reload,
  } = useFetch(() => getUser(userId), [userId])
  const { data: roles } = useFetch(getRoles, [])

  async function changeRoles(action: () => Promise<unknown>) {
    setActionError(null)
    setSaving(true)
    try {
      await action()
      reload()
      if (userId === currentUser?.id) await refreshSession()
    } catch (cause) {
      setActionError(cause instanceof Error ? cause.message : 'No se pudieron actualizar los roles.')
    } finally {
      setSaving(false)
    }
  }

  if (!Number.isInteger(userId) || userId < 1) {
    return <ErrorMessage message="El identificador del usuario no es válido." />
  }
  if (loading && !user) return <p role="status">Cargando usuario…</p>
  if (error || !user) return <ErrorMessage message={error ?? 'No se encontró el usuario.'} />

  const hasRole = (id: number) => user.roles.some((role) => role.id === id)
  const availableRoles = roles?.filter((role) => !hasRole(role.id)) ?? []

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Detalle de usuario</p>
          <h1>{user.name}</h1>
        </div>
        <Link className="button-link secondary-link" to="/users">Volver a usuarios</Link>
      </div>
      <div className="panel detail-grid">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Edad:</strong> {user.age}</p>
        <p><strong>País:</strong> {user.country?.name ?? 'Sin país'}</p>
        {PRACTICA >= 7 && can('update_users') && (
          <Link className="button-link" to={`/users/${user.id}/edit`}>Editar usuario</Link>
        )}
      </div>

      {PRACTICA >= 8 && (
        <section className="subsection">
          <h2>Roles</h2>
          <ErrorMessage message={actionError} />
          {user.roles.length === 0 ? (
            <p>Sin roles asignados.</p>
          ) : (
            <ul className="item-list">
              {user.roles.map((role) => (
                <li key={role.id}>
                  <Link to={`/roles/${role.id}`}>{role.name}</Link>
                  {can('update_users') && (
                    <button
                      type="button"
                      className="secondary"
                      disabled={saving}
                      onClick={() => void changeRoles(() => removeRoleFromUser(user.id, role.id))}
                    >
                      Quitar
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
          {can('write_users') && availableRoles.length > 0 && (
            <div className="inline-form">
              <label htmlFor="role-select">Asignar rol</label>
              <select
                id="role-select"
                value={selectedRole}
                onChange={(event) => setSelectedRole(event.target.value)}
              >
                <option value="">Elegí un rol</option>
                {availableRoles.map((role) => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
              <button
                type="button"
                disabled={!selectedRole || saving}
                onClick={() => {
                  void changeRoles(() => addRoleToUser(user.id, Number(selectedRole)))
                  setSelectedRole('')
                }}
              >
                Asignar rol
              </button>
            </div>
          )}
        </section>
      )}
    </section>
  )
}
