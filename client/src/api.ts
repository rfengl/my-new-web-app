const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5003'

function headers(): Record<string, string> {
  const token = localStorage.getItem('auth_token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function request<T = unknown>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: headers(),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (res.status === 204) return null as T

  const isJson = res.headers.get('content-type')?.includes('application/json')
  const data = isJson ? await res.json() : null

  if (!res.ok) {
    throw data ?? { code: 'ERROR', message: `Request failed with status ${res.status}` }
  }
  return data as T
}

export const api = {
  get:  <T = unknown>(path: string) => request<T>('GET', path),
  post: <T = unknown>(path: string, body: unknown) => request<T>('POST', path, body),
  put:  <T = unknown>(path: string, body: unknown) => request<T>('PUT', path, body),
  del:  (path: string) => request('DELETE', path),
}
