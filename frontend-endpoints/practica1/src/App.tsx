import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { RequirePermission } from './components/RequirePermission'
import { AuthProvider } from './context/AuthContext'
import { LegacyApp } from './LegacyApp'
import { LoginPage } from './pages/LoginPage'
import { PermissionsPage } from './pages/PermissionsPage'
import { RoleDetailPage } from './pages/RoleDetailPage'
import { RolesPage } from './pages/RolesPage'
import { UserDetailPage } from './pages/UserDetailPage'
import { UserFormPage } from './pages/UserFormPage'
import { UsersPage } from './pages/UsersPage'
import { PRACTICA } from './practica'

function RoutedApp() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/users" element={<UsersPage />} />
              {PRACTICA >= 7 && (
                <>
                  <Route path="/users/:id" element={<UserDetailPage />} />
                  {PRACTICA >= 8 ? (
                    <>
                      <Route element={<RequirePermission permission="write_users" />}>
                        <Route path="/users/new" element={<UserFormPage />} />
                      </Route>
                      <Route element={<RequirePermission permission="update_users" />}>
                        <Route path="/users/:id/edit" element={<UserFormPage />} />
                      </Route>
                    </>
                  ) : (
                    <>
                      <Route path="/users/new" element={<UserFormPage />} />
                      <Route path="/users/:id/edit" element={<UserFormPage />} />
                    </>
                  )}
                </>
              )}
              {PRACTICA >= 8 && (
                <>
                  <Route path="/roles" element={<RolesPage />} />
                  <Route path="/roles/:id" element={<RoleDetailPage />} />
                  <Route path="/permissions" element={<PermissionsPage />} />
                </>
              )}
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/users" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

function App() {
  return PRACTICA <= 4 ? <LegacyApp /> : <RoutedApp />
}

export default App
