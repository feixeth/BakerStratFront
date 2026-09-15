export interface AuthTeam {
  id: number
  name: string
  slug: string
  owner_id: number
}

export interface AuthUser {
  id: number
  name: string
  email: string
  role: 'coach' | 'igl' | 'player'
  team_id: number | null
  team?: AuthTeam | null
}

interface AuthState {
  user: AuthUser | null
  token: string | null
}

const TOKEN_KEY = 'stratbaker_token'
const USER_KEY = 'stratbaker_user'

export function useAuth() {
  const state = useState<AuthState>('stratbaker-auth', () => ({ user: null, token: null }))
  const initialized = useState('stratbaker-auth-initialized', () => false)

  const { get, post } = useApi()

  function persist(token: string, user: AuthUser) {
    if (import.meta.client) {
      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    }
    state.value = { token, user }
  }

  function clear() {
    if (import.meta.client) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    }
    state.value = { token: null, user: null }
  }

  async function init() {
    if (!import.meta.client || initialized.value) return
    initialized.value = true

    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) return

    const storedUser = localStorage.getItem(USER_KEY)
    if (storedUser) {
      try {
        state.value = { token, user: JSON.parse(storedUser) as AuthUser }
      } catch {
        state.value = { token, user: null }
      }
    } else {
      state.value = { token, user: null }
    }

    try {
      const freshUser = await get<AuthUser>('/api/auth/me')
      persist(token, freshUser)
    } catch {
      clear()
    }
  }

  async function login(email: string, password: string): Promise<AuthUser> {
    const response = await post<{ token: string, user: AuthUser }>('/api/auth/login', { email, password })
    persist(response.token, response.user)
    return response.user
  }

  async function logout() {
    try {
      await post('/api/auth/logout')
    } catch {
      // Backend may already be unreachable or the token already revoked — clear local state regardless.
    }
    clear()
    navigateTo('/login')
  }

  const token = computed(() => state.value.token)
  const user = computed(() => state.value.user)
  const role = computed(() => state.value.user?.role ?? null)
  const isAuthenticated = computed(() => !!state.value.token)

  return {
    user,
    token,
    role,
    isAuthenticated,
    init,
    login,
    logout,
  }
}
