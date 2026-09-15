export function useApi() {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiUrl

  function getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (import.meta.client) {
      const token = localStorage.getItem('stratbaker_token')
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }
    return headers
  }

  async function get<T>(path: string): Promise<T> {
    return await $fetch<T>(path, {
      baseURL,
      headers: getHeaders(),
      method: 'GET',
    })
  }

  async function post<T>(path: string, body?: unknown): Promise<T> {
    return await $fetch<T>(path, {
      baseURL,
      headers: getHeaders(),
      method: 'POST',
      body: body ?? {},
    })
  }

  async function patch<T>(path: string, body?: unknown): Promise<T> {
    return await $fetch<T>(path, {
      baseURL,
      headers: getHeaders(),
      method: 'PATCH',
      body: body ?? {},
    })
  }

  async function del<T>(path: string): Promise<T> {
    return await $fetch<T>(path, {
      baseURL,
      headers: getHeaders(),
      method: 'DELETE',
    })
  }

  return {
    get,
    post,
    patch,
    delete: del,
  }
}
