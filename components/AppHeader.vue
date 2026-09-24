<script setup lang="ts">
const { user, role, logout } = useAuth()
const { isOnline } = useOffline()

const initials = computed(() => (user.value?.name ?? '').trim().slice(0, 2).toUpperCase())

const roleLabel = computed(() => {
  const r = role.value
  if (!r) return ''
  return r.toUpperCase()
})

const roleBadgeClass = computed(() => {
  const r = role.value
  if (r === 'coach') return 'badge-coach'
  if (r === 'igl') return 'badge-igl'
  return 'badge-player'
})
</script>

<template>
  <header class="sticky top-0 z-40 bg-bg/95 backdrop-blur border-b border-border">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <NuxtLink to="/dashboard" class="flex items-center gap-2.5 group">
          <div class="w-9 h-9 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center group-hover:bg-accent/25 transition-colors">
            <span class="text-accent font-bold text-lg">S</span>
          </div>
          <span class="text-lg font-bold text-gray-100 hidden sm:block">StratBaker</span>
        </NuxtLink>
        <div v-if="user?.team" class="hidden md:flex items-center gap-2 ml-2 pl-3 border-l border-border">
          <span class="text-sm text-muted-light">{{ user.team?.name }}</span>
        </div>
      </div>

      <div v-if="user" class="flex items-center gap-3">
        <div class="flex items-center gap-1.5" :title="isOnline ? 'Online' : 'Offline'">
          <span class="dot" :class="isOnline ? 'bg-accent' : 'bg-warning'" />
          <span class="text-xs text-muted hidden sm:block">{{ isOnline ? 'Online' : 'Offline' }}</span>
        </div>

        <span class="badge" :class="roleBadgeClass">{{ roleLabel }}</span>

        <div class="w-9 h-9 rounded-full bg-bg-lighter border border-border flex items-center justify-center text-sm font-semibold text-accent">
          {{ initials }}
        </div>

        <button class="btn btn-ghost !px-2.5" title="Logout" @click="logout">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>
