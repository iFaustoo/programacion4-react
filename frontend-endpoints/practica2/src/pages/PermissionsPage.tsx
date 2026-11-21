import { useState } from 'react'
import type { SubmitEvent } from 'react'
import {
  createPermission,
  deletePermission,
  getPermission,
  getPermissions,
  updatePermission,
} from '../api/endpoints'
import { ConfirmButton } from '../components/ConfirmButton'
import { ErrorMessage } from '../components/ErrorMessage'
import { useFetch } from '../hooks/useFetch'

export function PermissionsPage() {
  const { data: permissions, error, loading, reload } = useFetch(getPermissions, [])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [actionError, setActionError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  function resetForm() {
    setEditingId(null)
    setName('')
    setDescription('')
  }

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setActionError(null)
    setSaving(true)
    const payload = { name: name.trim(), description: description.trim() || null }
    try {
      if (editingId !== null) await updatePermission(editingId, payload)
      else await createPermission(payload)
      resetForm()
      reload()
    } catch (cause) {
      setActionError(cause instanceof Error ? cause.message : 'No se pudo guardar el permiso.')
    } finally {
      setSaving(false)
    }
  }

  async function startEditing(id: number) {
    setActionError(null)
    try {
      const permission = await getPermission(id)
      setEditingId(id)
      setName(permission.name)
      setDescription(permission.description ?? '')
    } catch (cause) {
      setActionError(cause instanceof Error ? cause.message : 'No se pudo cargar el permiso.')
    }
  }

  async function handleDelete(id: number) {
    setActionError(null)
    try {
      await deletePermission(id)
      if (id === editingId) resetForm()
      reload()
    } catch (cause) {
      setActionError(cause instanceof Error ? cause.message : 'No se pudo borrar el permiso.')
    }
  }

  return (
    <section>
      <p className="eyebrow">Configuración</p>
      <h1>Permisos</h1>
      <form className="panel stack-form" onSubmit={submit}>
        <h2>{editingId === null ? 'Crear permiso' : 'Editar permiso'}</h2>
        <label>
          Nombre
          <input value={name} onChange={(event) => setName(event.target.value)} required />
        </label>
        <label>
          Descripción
          <input value={description} onChange={(event) => setDescription(event.target.value)} />
        </label>
        <ErrorMessage message={actionError} />
        <div className="button-group">
          <button type="submit" disabled={saving}>
            {saving ? 'Guardando…' : editingId === null ? 'Crear permiso' : 'Guardar cambios'}
          </button>
          {editingId !== null && (
            <button type="button" className="secondary" onClick={resetForm}>Cancelar</button>
          )}
        </div>
      </form>

      <ErrorMessage message={error} />
      {loading && <p role="status">Cargando permisos…</p>}
      <ul className="card-list">
        {permissions?.map((permission) => (
          <li className="panel" key={permission.id}>
            <div>
              <strong>{permission.name}</strong>
              <p>{permission.description || 'Sin descripción'}</p>
            </div>
            <div className="button-group">
              <button type="button" className="secondary" onClick={() => void startEditing(permission.id)}>
                Editar
              </button>
              <ConfirmButton label="Borrar" onConfirm={() => void handleDelete(permission.id)} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
