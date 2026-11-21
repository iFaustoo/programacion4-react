import { apiFetch } from './client'
import type {
  CreatedResponse,
  LoginResponse,
  MessageResponse,
  NamedPayload,
  Permission,
  RoleDetail,
  RoleSummary,
  UserDetail,
  UserPayload,
  UserSummary,
} from './types'

export const COUNTRIES = [
  { id: 1, name: 'Argentina' },
  { id: 2, name: 'Brasil' },
]

export const login = (email: string, password: string) =>
  apiFetch<LoginResponse>('/login', {
    method: 'POST',
    body: { email, password },
  })

export const getUsers = (offset: number, limit: number) =>
  apiFetch<UserSummary[]>(`/user?offset=${offset}&limit=${limit}`)
export const getUser = (id: number) => apiFetch<UserDetail>(`/user/${id}`)
export const getMyId = () => apiFetch<{ id: number }>('/user/me/id')
export const searchUsers = (name: string) =>
  apiFetch<UserSummary[]>(`/user/search/${encodeURIComponent(name)}`)
export const getAdults = () => apiFetch<UserSummary[]>('/user_mayores')
export const createUser = (user: UserPayload) =>
  apiFetch<CreatedResponse>('/user', { method: 'POST', body: user })
export const updateUser = (id: number, user: UserPayload) =>
  apiFetch<CreatedResponse>(`/user/${id}`, { method: 'PATCH', body: user })
export const deleteUser = (id: number) =>
  apiFetch<MessageResponse>(`/user/${id}`, { method: 'DELETE' })
export const addRoleToUser = (userId: number, roleId: number) =>
  apiFetch<UserDetail>(`/user/${userId}/role/${roleId}`, { method: 'POST' })
export const removeRoleFromUser = (userId: number, roleId: number) =>
  apiFetch<UserDetail>(`/user/${userId}/role/${roleId}`, { method: 'DELETE' })

export const getRoles = () => apiFetch<RoleSummary[]>('/role')
export const getRole = (id: number) => apiFetch<RoleDetail>(`/role/${id}`)
export const getRoleUsers = (id: number) =>
  apiFetch<UserSummary[]>(`/role/${id}/user`)
export const createRole = (role: NamedPayload) =>
  apiFetch<CreatedResponse>('/role', { method: 'POST', body: role })
export const updateRole = (id: number, role: NamedPayload) =>
  apiFetch<CreatedResponse>(`/role/${id}`, { method: 'PATCH', body: role })
export const deleteRole = (id: number) =>
  apiFetch<MessageResponse>(`/role/${id}`, { method: 'DELETE' })
export const addPermissionToRole = (roleId: number, permissionId: number) =>
  apiFetch<RoleDetail>(`/role/${roleId}/permission/${permissionId}`, {
    method: 'POST',
  })
export const removePermissionFromRole = (roleId: number, permissionId: number) =>
  apiFetch<RoleDetail>(`/role/${roleId}/permission/${permissionId}`, {
    method: 'DELETE',
  })

export const getPermissions = () => apiFetch<Permission[]>('/permission')
export const getPermission = (id: number) =>
  apiFetch<Permission>(`/permission/${id}`)
export const createPermission = (permission: NamedPayload) =>
  apiFetch<CreatedResponse>('/permission', {
    method: 'POST',
    body: permission,
  })
export const updatePermission = (id: number, permission: NamedPayload) =>
  apiFetch<CreatedResponse>(`/permission/${id}`, {
    method: 'PATCH',
    body: permission,
  })
export const deletePermission = (id: number) =>
  apiFetch<MessageResponse>(`/permission/${id}`, { method: 'DELETE' })
