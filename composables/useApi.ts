function handleUnauthorized() {
  if (!import.meta.client) return
  localStorage.removeItem('stratbaker_token')
  localStorage.removeItem('stratbaker_user')
  const router = useRouter()
  router.push('/login')
}

export function useApi() {
  function getToken(): string | null {
    if (!import.meta.client) return null
    return localStorage.getItem('stratbaker_token')
  }

  function getHeaders(): Record<string, string> {
    const token = getToken()
    return {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }
  }

  async function request<T>(path: string, method: 'GET' | 'POST' | 'PATCH' | 'DELETE', body?: unknown): Promise<T> {
    const { public: { apiUrl } } = useRuntimeConfig()

    try {
      return await $fetch<T>(path, {
        baseURL: apiUrl,
        method,
        headers: getHeaders(),
        credentials: 'include',
        body: method === 'GET' || method === 'DELETE' ? undefined : (body ?? {}),
      })
    } catch (error: any) {
      if (error?.response?.status === 401) {
        handleUnauthorized()
      }
      throw error
    }
  }

  async function get<T>(path: string): Promise<T> {
    return request<T>(path, 'GET')
  }

  async function post<T>(path: string, body?: unknown): Promise<T> {
    return request<T>(path, 'POST', body)
  }

  async function patch<T>(path: string, body?: unknown): Promise<T> {
    return request<T>(path, 'PATCH', body)
  }

  async function del<T>(path: string): Promise<T> {
    return request<T>(path, 'DELETE')
  }

  return {
    get,
    post,
    patch,
    delete: del,
  }
}
