import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { COUNTRIES, createUser, getUser, updateUser } from '../api/endpoints'
import type { UserDetail, UserPayload } from '../api/types'
import { ErrorMessage } from '../components/ErrorMessage'
import { useFetch } from '../hooks/useFetch'

const PASSWORD_FOR_UPDATE = 'sin-cambios'

export function UserFormPage() {
  const { id } = useParams()
  if (!id) return <UserForm />
  return <EditUser id={Number(id)} />
}

function EditUser({ id }: { id: number }) {
  const { data: user, error, loading } = useFetch(() => getUser(id), [id])
  if (loading) return <p role="status">Cargando usuario…</p>
  if (error || !user) return <ErrorMessage message={error ?? 'No se encontró el usuario.'} />
  return <UserForm user={user} />
}

function UserForm({ user }: { user?: UserDetail }) {
  const navigate = useNavigate()
  const [name, setName] = useState(user?.name ?? '')
  const [age, setAge] = useState(user ? String(user.age) : '')
  const [countryId, setCountryId] = useState(
    user?.country ? String(user.country.id) : '',
  )
  const [email, setEmail] = useState(user?.email ?? '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSaving(true)
    const payload: UserPayload = {
      name: name.trim(),
      age: Number(age),
      country_id: countryId ? Number(countryId) : null,
      email,
      password: user ? PASSWORD_FOR_UPDATE : password,
    }
    try {
      if (user) {
        await updateUser(user.id, payload)
        navigate(`/users/${user.id}`)
      } else {
        const created = await createUser(payload)
        navigate(`/users/${created.id}`)
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo guardar el usuario.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="panel form-panel">
      <p className="eyebrow">{user ? 'Editar registro' : 'Nuevo registro'}</p>
      <h1>{user ? `Editar a ${user.name}` : 'Crear usuario'}</h1>
      <form className="stack-form" onSubmit={submit}>
        <label>
          Nombre
          <input value={name} onChange={(event) => setName(event.target.value)} required />
        </label>
        <label>
          Edad
          <input
            type="number"
            min="0"
            value={age}
            onChange={(event) => setAge(event.target.value)}
            required
          />
        </label>
        <label>
          País
          <select value={countryId} onChange={(event) => setCountryId(event.target.value)}>
            <option value="">Sin país</option>
            {COUNTRIES.map((country) => (
              <option key={country.id} value={country.id}>{country.name}</option>
            ))}
          </select>
        </label>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={Boolean(user)}
            required
          />
        </label>
        {!user && (
          <label>
            Contraseña (mínimo 4 caracteres)
            <input
              type="password"
              minLength={4}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
        )}
        <ErrorMessage message={error} />
        <div className="button-group">
          <button type="submit" disabled={saving}>{saving ? 'Guardando…' : 'Guardar'}</button>
          <Link className="button-link secondary-link" to={user ? `/users/${user.id}` : '/users'}>Volver</Link>
        </div>
      </form>
    </section>
  )
}
