import { Link } from 'react-router-dom'
import { getRoles } from '../api/endpoints'
import { ErrorMessage } from '../components/ErrorMessage'
import { useFetch } from '../hooks/useFetch'

export function RolesPage() {
  const { data: roles, error, loading } = useFetch(getRoles, [])

  return (
    <section>
      <p className="eyebrow">Acceso y organización</p>
      <h1>Roles</h1>
      <ErrorMessage message={error} />
      {loading && <p role="status">Cargando roles…</p>}
      {roles && roles.length === 0 && <p>No hay roles disponibles.</p>}
      <ul className="card-list">
        {roles?.map((role) => (
          <li className="panel" key={role.id}>
            <Link to={`/roles/${role.id}`}>{role.name}</Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
