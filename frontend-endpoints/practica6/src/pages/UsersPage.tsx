import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { Link } from 'react-router-dom'
import { deleteUser, getAdults, getUsers, searchUsers } from '../api/endpoints'
import type { UserSummary } from '../api/types'
import { ConfirmButton } from '../components/ConfirmButton'
import { ErrorMessage } from '../components/ErrorMessage'
import { useAuth } from '../context/useAuth'
import { useFetch } from '../hooks/useFetch'
import { PRACTICA } from '../practica'

const PAGE_SIZE = 5

export function UsersPage() {
  const { can } = useAuth()
  const [offset, setOffset] = useState(0)
  const [searchText, setSearchText] = useState('')
  const [search, setSearch] = useState('')
  const [onlyAdults, setOnlyAdults] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<number | null>(null)

  const fetchPage = () => {
    if (PRACTICA < 6) return getUsers(0, 100)
    if (search) return searchUsers(search)
    if (onlyAdults) return getAdults()
    return getUsers(offset, PAGE_SIZE + 1)
  }
  const { data: users, error, loading, reload } = useFetch(
    fetchPage,
    [offset, search, onlyAdults],
  )

  function submitSearch(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setOffset(0)
    setSearch(searchText.trim())
  }

  async function handleDelete(id: number) {
    setActionError(null)
    setDeleting(id)
    try {
      await deleteUser(id)
      reload()
    } catch (cause) {
      setActionError(cause instanceof Error ? cause.message : 'No se pudo borrar el usuario.')
    } finally {
      setDeleting(null)
    }
  }

  const visibleUsers: UserSummary[] =
    PRACTICA >= 6 && !search && !onlyAdults
      ? (users ?? []).slice(0, PAGE_SIZE)
      : users ?? []

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Directorio</p>
          <h1>Usuarios</h1>
        </div>
        {PRACTICA >= 7 && can('write_users') && (
          <Link className="button-link" to="/users/new">Nuevo usuario</Link>
        )}
      </div>

      {PRACTICA >= 6 && (
        <form className="filter-form" onSubmit={submitSearch}>
          <label htmlFor="search-name">Buscar por nombre</label>
          <div className="inline-form">
            <input
              id="search-name"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />
            <button type="submit">Buscar</button>
          </div>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={onlyAdults}
              onChange={(event) => {
                setOffset(0)
                setOnlyAdults(event.target.checked)
              }}
            />
            Solo mayores de edad
          </label>
        </form>
      )}

      <ErrorMessage message={error ?? actionError} />
      {loading && <p role="status">Cargando usuarios…</p>}
      {!loading && !error && visibleUsers.length === 0 && <p>No se encontraron usuarios.</p>}

      {visibleUsers.length > 0 && (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                {PRACTICA >= 7 && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {visibleUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{PRACTICA >= 7 ? <Link to={`/users/${user.id}`}>{user.name}</Link> : user.name}</td>
                  {PRACTICA >= 7 && (
                    <td className="actions">
                      {can('update_users') && <Link to={`/users/${user.id}/edit`}>Editar</Link>}
                      {can('delete_users') && (
                        <ConfirmButton
                          label="Borrar"
                          disabled={deleting === user.id}
                          onConfirm={() => handleDelete(user.id)}
                        />
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {PRACTICA >= 6 && !search && !onlyAdults && users && (
        <div className="pagination">
          <button
            type="button"
            className="secondary"
            disabled={offset === 0}
            onClick={() => setOffset((current) => Math.max(0, current - PAGE_SIZE))}
          >
            Anterior
          </button>
          <span>Página {offset / PAGE_SIZE + 1}</span>
          <button
            type="button"
            className="secondary"
            disabled={users.length <= PAGE_SIZE}
            onClick={() => setOffset((current) => current + PAGE_SIZE)}
          >
            Siguiente
          </button>
        </div>
      )}
    </section>
  )
}
