export interface User {
  id: string
  email: string
  pseudo: string
  role: 'coach' | 'igl' | 'player'
  teamName: string
  avatar: string
}

export function useAuth() {
  const state = useState<User | null>('stratbaker-auth', () => null)

  const TOKEN_KEY = 'stratbaker_token'
  const USER_KEY = 'stratbaker_user'

  function loadFromStorage() {
    if (import.meta.client) {
      const token = localStorage.getItem(TOKEN_KEY)
      const userJson = localStorage.getItem(USER_KEY)
      if (token && userJson) {
        try {
          state.value = JSON.parse(userJson) as User
        } catch {
          state.value = null
        }
      }
    }
  }

  loadFromStorage()

  const token = computed(() => {
    if (!import.meta.client) return null
    return localStorage.getItem(TOKEN_KEY)
  })

  const isAuthenticated = computed(() => state.value !== null)

  const role = computed(() => state.value?.role ?? null)

  const user = computed(() => state.value)

  async function login(email: string, _password: string): Promise<User> {
    // Mock: determine role from email for demo purposes
    const mockUser: User = {
      id: 'u-1',
      email,
      pseudo: email.split('@')[0] || 'Coach',
      role: 'coach',
      teamName: 'Astralis Academy',
      avatar: (email.split('@')[0] || 'CO').slice(0, 2).toUpperCase(),
    }

    const mockToken = 'mock-jwt-' + btoa(email) + '.' + Date.now()

    if (import.meta.client) {
      localStorage.setItem(TOKEN_KEY, mockToken)
      localStorage.setItem(USER_KEY, JSON.stringify(mockUser))
    }

    state.value = mockUser
    return mockUser
  }

  function logout() {
    if (import.meta.client) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    }
    state.value = null
    navigateTo('/login')
  }

  return {
    user,
    token,
    role,
    isAuthenticated,
    login,
    logout,
  }
}
