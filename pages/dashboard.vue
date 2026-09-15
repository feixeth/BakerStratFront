<script setup lang="ts">
import { maps, type MapInfo } from '~/utils/mockData'

definePageMeta({ layout: 'default', middleware: 'auth' })

const { user } = useAuth()
</script>

<template>
  <div>
    <AppHeader />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div class="mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-100">Strategy Maps</h1>
        <p class="text-muted-light mt-1">Select a map to view and manage strategies</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        <NuxtLink
          v-for="map in maps"
          :key="map.slug"
          :to="`/map/${map.slug}`"
          class="card p-5 hover:border-accent/40 transition-all duration-150 group cursor-pointer"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-lg bg-bg-lighter border border-border flex items-center justify-center group-hover:border-accent/30 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-muted-light group-hover:text-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 6l6-2v14l-6 2-6-2V4l6 2zm0 0v14m6-16l6 2v14l-6-2" />
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-bold text-gray-100 group-hover:text-accent transition-colors">{{ map.name }}</h2>
                <p class="text-xs text-muted">{{ map.stratCount }} {{ map.stratCount === 1 ? 'strat' : 'strats' }}</p>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between pt-3 border-t border-border">
            <div class="flex items-center gap-2">
              <span class="dot" :class="map.cached ? 'bg-accent' : 'bg-warning'" />
              <span class="text-xs" :class="map.cached ? 'text-accent' : 'text-warning'">
                {{ map.cached ? 'Offline ready' : 'Not cached' }}
              </span>
            </div>
            <span class="text-xs text-muted">Updated {{ map.lastUpdated }}</span>
          </div>
        </NuxtLink>
      </div>
    </main>
  </div>
</template>
