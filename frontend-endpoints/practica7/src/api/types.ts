export interface LoginResponse {
  msg: string
  token: string
}

export interface UserSummary {
  id: number
  name: string
}

export interface Country {
  id: number
  name: string
}

export interface RoleSummary {
  id: number
  name: string
}

export interface Permission {
  id: number
  name: string
  description?: string | null
}

export interface UserDetail extends UserSummary {
  age: number
  email: string
  country: Country | null
  roles: RoleSummary[]
}

export interface UserPayload {
  name: string
  age: number
  country_id: number | null
  email: string
  password: string
}

export interface NamedPayload {
  name: string
  description: string | null
}

export interface RoleDetail extends RoleSummary {
  description: string | null
  permissions: Permission[]
}

export interface CreatedResponse {
  id: number
}

export interface MessageResponse {
  msg: string
}
