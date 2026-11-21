import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { PRACTICA } from '../practica'

export function Layout() {
  const {
    user,
    permissions,
    logout,
    showAllButtons,
    setShowAllButtons,
  } = useAuth()

  return (
    <>
      <header className="topbar">
        <nav aria-label="Navegación principal">
          <NavLink to="/users">Usuarios</NavLink>
          {PRACTICA >= 8 && <NavLink to="/roles">Roles</NavLink>}
          {PRACTICA >= 8 && <NavLink to="/permissions">Permisos</NavLink>}
        </nav>
        <span>{user?.name} · {user?.roles.map((role) => role.name).join(', ') || 'Sin rol'}</span>
        <button type="button" className="secondary" onClick={logout}>Salir</button>
      </header>
      {PRACTICA >= 8 && (
        <div className="permission-bar">
          <span>Permisos: {permissions.join(', ') || 'ninguno'}</span>
          <label>
            <input
              type="checkbox"
              checked={showAllButtons}
              onChange={(event) => setShowAllButtons(event.target.checked)}
            />
            Mostrar todos los botones (prueba)
          </label>
        </div>
      )}
      <main className="page-content"><Outlet /></main>
    </>
  )
}
