<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: 'auth' })

const { login } = useAuth()

const email = ref('')
const password = ref('')
const remember = ref(true)
const loading = ref(false)
const error = ref('')

async function handleSubmit() {
  if (!email.value || !password.value) {
    error.value = 'Please enter both email and password.'
    return
  }

  error.value = ''
  loading.value = true

  try {
    await login(email.value, password.value)
    navigateTo('/dashboard')
  } catch (err: any) {
    error.value = err?.data?.message || 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/15 border border-accent/30 mb-4">
          <span class="text-accent font-bold text-3xl">S</span>
        </div>
        <h1 class="text-3xl font-bold text-gray-100">StratBaker</h1>
        <p class="text-muted-light mt-2">CS2 Strategy Platform for Esport Teams</p>
      </div>

      <div class="card p-6 sm:p-8">
        <form @submit.prevent="handleSubmit" class="space-y-5">
          <div>
            <label for="email" class="block text-sm font-medium text-muted-light mb-1.5">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="input"
              placeholder="coach@team.gg"
              autocomplete="email"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-muted-light mb-1.5">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="input"
              placeholder="••••••••"
              autocomplete="current-password"
            />
          </div>

          <div class="flex items-center gap-2.5">
            <input
              id="remember"
              v-model="remember"
              type="checkbox"
              class="w-4 h-4 rounded border-border bg-bg-light text-accent focus:ring-accent focus:ring-offset-0"
            />
            <label for="remember" class="text-sm text-muted-light cursor-pointer select-none">Remember me</label>
          </div>

          <p v-if="error" class="text-sm text-danger">{{ error }}</p>

          <button
            type="submit"
            class="btn btn-primary w-full !py-3 text-base"
            :disabled="loading"
          >
            <span v-if="loading" class="inline-block w-4 h-4 border-2 border-bg/30 border-t-bg rounded-full animate-spin" />
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <div class="mt-6 pt-6 border-t border-border text-center">
          <p class="text-xs text-muted">Connected to the StratBaker API — sign in with your team account.</p>
        </div>
      </div>
    </div>
  </div>
</template>
