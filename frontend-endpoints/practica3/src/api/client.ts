const API_URL = import.meta.env.VITE_API_URL

export class ApiError extends Error {
  public readonly status: number

  constructor(
    status: number,
    message: string,
  ) {
    super(message)
    this.status = status
    this.name = 'ApiError'
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
}

let unauthorizedHandler = () => {}

export function registerUnauthorizedHandler(handler: () => void) {
  unauthorizedHandler = handler
}

function errorMessage(text: string, status: number): string {
  try {
    const body: unknown = JSON.parse(text)
    if (
      typeof body === 'object' &&
      body !== null &&
      'detail' in body
    ) {
      const { detail } = body
      if (typeof detail === 'string') return detail
      if (Array.isArray(detail)) {
        return detail
          .map((item) => {
            if (
              typeof item === 'object' &&
              item !== null &&
              'msg' in item &&
              typeof item.msg === 'string'
            ) {
              return item.msg
            }
            return 'Error de validación'
          })
          .join(' · ')
      }
    }
  } catch {
    return text || `Error HTTP ${status}`
  }
  return text || `Error HTTP ${status}`
}

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  if (!API_URL) {
    throw new ApiError(
      0,
      'Falta VITE_API_URL. Copiá .env.example a .env.development y configurá la URL de la API.',
    )
  }

  const token = localStorage.getItem('token')
  const headers: Record<string, string> = {}
  if (options.body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  let response: Response
  try {
    response = await fetch(`${API_URL.replace(/\/+$/, '')}${path}`, {
      method: options.method ?? 'GET',
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    })
  } catch {
    throw new ApiError(0, 'No se pudo conectar con la API. Revisá que esté activa.')
  }

  const text = await response.text()
  if (!response.ok) {
    if (response.status === 401 && token) unauthorizedHandler()
    throw new ApiError(response.status, errorMessage(text, response.status))
  }

  return JSON.parse(text) as T
}
