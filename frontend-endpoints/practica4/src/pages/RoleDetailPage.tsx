import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  addPermissionToRole,
  getPermissions,
  getRole,
  getRoleUsers,
  removePermissionFromRole,
} from '../api/endpoints'
import { ErrorMessage } from '../components/ErrorMessage'
import { useAuth } from '../context/useAuth'
import { useFetch } from '../hooks/useFetch'

export function RoleDetailPage() {
  const roleId = Number(useParams().id)
  const { refreshSession } = useAuth()
  const [selectedPermission, setSelectedPermission] = useState('')
  const [actionError, setActionError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const {
    data: role,
    error,
    loading,
    reload,
  } = useFetch(() => getRole(roleId), [roleId])
  const { data: users } = useFetch(() => getRoleUsers(roleId), [roleId])
  const { data: permissions } = useFetch(getPermissions, [])

  async function changePermissions(action: () => Promise<unknown>) {
    setActionError(null)
    setSaving(true)
    try {
      await action()
      reload()
      await refreshSession()
    } catch (cause) {
      setActionError(cause instanceof Error ? cause.message : 'No se pudieron actualizar los permisos.')
    } finally {
      setSaving(false)
    }
  }

  if (!Number.isInteger(roleId) || roleId < 1) {
    return <ErrorMessage message="El identificador del rol no es válido." />
  }
  if (loading && !role) return <p role="status">Cargando rol…</p>
  if (error || !role) return <ErrorMessage message={error ?? 'No se encontró el rol.'} />

  const hasPermission = (id: number) =>
    role.permissions.some((permission) => permission.id === id)
  const available = permissions?.filter((permission) => !hasPermission(permission.id)) ?? []

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Gestión de acceso</p>
          <h1>Rol {role.name}</h1>
        </div>
        <Link className="button-link secondary-link" to="/roles">Volver a roles</Link>
      </div>
      <ErrorMessage message={actionError} />
      <section className="subsection">
        <h2>Permisos</h2>
        {role.permissions.length === 0 ? (
          <p>Sin permisos asignados.</p>
        ) : (
          <ul className="item-list">
            {role.permissions.map((permission) => (
              <li key={permission.id}>
                <span>{permission.name}</span>
                <button
                  type="button"
                  className="secondary"
                  disabled={saving}
                  onClick={() => void changePermissions(() =>
                    removePermissionFromRole(role.id, permission.id),
                  )}
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>
        )}
        {available.length > 0 && (
          <div className="inline-form">
            <label htmlFor="permission-select">Asignar permiso</label>
            <select
              id="permission-select"
              value={selectedPermission}
              onChange={(event) => setSelectedPermission(event.target.value)}
            >
              <option value="">Elegí un permiso</option>
              {available.map((permission) => (
                <option key={permission.id} value={permission.id}>{permission.name}</option>
              ))}
            </select>
            <button
              type="button"
              disabled={!selectedPermission || saving}
              onClick={() => {
                void changePermissions(() =>
                  addPermissionToRole(role.id, Number(selectedPermission)),
                )
                setSelectedPermission('')
              }}
            >
              Asignar permiso
            </button>
          </div>
        )}
      </section>
      <section className="subsection">
        <h2>Usuarios con este rol</h2>
        {users?.length === 0 && <p>Ningún usuario tiene este rol.</p>}
        <ul className="item-list">
          {users?.map((user) => (
            <li key={user.id}><Link to={`/users/${user.id}`}>{user.name}</Link></li>
          ))}
        </ul>
      </section>
    </section>
  )
}
