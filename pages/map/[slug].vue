<script setup lang="ts">
import { getMapBySlug, allTags, type Strat } from '~/utils/mockData'

definePageMeta({ layout: 'default', middleware: 'auth' })

const route = useRoute()
const { role } = useAuth()

const slug = computed(() => route.params.slug as string)
const mapData = computed(() => getMapBySlug(slug.value))

const selectedTag = ref<string | null>(null)
const dateFilter = ref<'all' | 'recent'>('all')

const canEdit = computed(() => role.value === 'coach' || role.value === 'igl')

const availableTags = computed(() => {
  if (!mapData.value) return []
  const tags = new Set<string>()
  mapData.value.strats.forEach((s) => s.tags.forEach((t) => tags.add(t)))
  return Array.from(tags)
})

const filteredStrats = computed(() => {
  if (!mapData.value) return []
  let result = [...mapData.value.strats]

  if (selectedTag.value) {
    result = result.filter((s) => s.tags.includes(selectedTag.value!))
  }

  if (dateFilter.value === 'recent') {
    const cutoff = new Date('2025-03-08')
    result = result.filter((s) => new Date(s.lastEdit) >= cutoff)
  }

  return result.sort((a, b) => new Date(b.lastEdit).getTime() - new Date(a.lastEdit).getTime())
})
</script>

<template>
  <div>
    <AppHeader />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8" v-if="mapData">
      <PageHeader
        :title="mapData.name"
        :subtitle="`${mapData.stratCount} strategies · Last updated ${mapData.lastUpdated}`"
        back-to="/dashboard"
      />

      <div class="mt-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div class="flex flex-wrap items-center gap-2">
          <button
            class="badge"
            :class="selectedTag === null ? 'badge-coach' : 'badge-tag hover:border-accent/30 cursor-pointer'"
            @click="selectedTag = null"
          >
            All tags
          </button>
          <button
            v-for="tag in availableTags"
            :key="tag"
            class="badge cursor-pointer transition-all"
            :class="selectedTag === tag ? 'badge-coach' : 'badge-tag hover:border-accent/30'"
            @click="selectedTag = selectedTag === tag ? null : tag"
          >
            {{ tag }}
          </button>

          <div class="ml-2 flex items-center gap-2">
            <button
              class="badge cursor-pointer"
              :class="dateFilter === 'all' ? 'badge-coach' : 'badge-tag'"
              @click="dateFilter = 'all'"
            >
              All dates
            </button>
            <button
              class="badge cursor-pointer"
              :class="dateFilter === 'recent' ? 'badge-coach' : 'badge-tag'"
              @click="dateFilter = 'recent'"
            >
              Recent
            </button>
          </div>
        </div>

        <button v-if="canEdit" class="btn btn-primary shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Strat
        </button>
      </div>

      <div class="mt-6 space-y-3">
        <NuxtLink
          v-for="strat in filteredStrats"
          :key="strat.id"
          :to="`/strat/${strat.id}`"
          class="card p-4 sm:p-5 hover:border-accent/40 transition-all duration-150 block group"
        >
          <div class="flex items-center justify-between gap-4">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-3">
                <h3 class="text-base sm:text-lg font-semibold text-gray-100 group-hover:text-accent transition-colors truncate">
                  {{ strat.title }}
                </h3>
                <span class="badge badge-tag shrink-0">v{{ strat.version }}</span>
              </div>
              <div class="flex flex-wrap items-center gap-1.5 mt-2">
                <span v-for="tag in strat.tags" :key="tag" class="badge badge-tag">{{ tag }}</span>
              </div>
            </div>

            <div class="hidden sm:flex flex-col items-end gap-1 shrink-0">
              <span class="text-sm text-muted-light">{{ strat.author }}</span>
              <span class="text-xs text-muted">{{ strat.lastEdit }}</span>
            </div>
          </div>

          <div class="flex sm:hidden items-center gap-2 mt-2 pt-2 border-t border-border">
            <span class="text-xs text-muted-light">{{ strat.author }}</span>
            <span class="text-xs text-muted">·</span>
            <span class="text-xs text-muted">{{ strat.lastEdit }}</span>
          </div>
        </NuxtLink>

        <p v-if="filteredStrats.length === 0" class="text-center text-muted py-12">
          No strategies match your filters.
        </p>
      </div>
    </main>

    <main v-else class="max-w-7xl mx-auto px-4 py-20 text-center">
      <p class="text-muted-light text-lg">Map not found.</p>
      <NuxtLink to="/dashboard" class="btn btn-secondary mt-4">Back to Dashboard</NuxtLink>
    </main>
  </div>
</template>
