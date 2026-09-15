<script setup lang="ts">
import { getStratById, getMapNameBySlug, type StratSection } from '~/utils/mockData'

definePageMeta({ layout: 'default', middleware: 'auth' })

const route = useRoute()
const { role } = useAuth()
const { isOnline } = useOffline()

const stratId = computed(() => route.params.id as string)
const strat = ref(getStratById(stratId.value) || null)

const canEdit = computed(() => role.value === 'coach' || role.value === 'igl')

interface Annotation {
  sectionId: string
  text: string
  createdAt: string
}

const annotations = ref<Record<string, Annotation>>({})
const annotationOpen = ref<string | null>(null)
const annotationDraft = ref('')

function loadAnnotations() {
  if (!import.meta.client) return
  const stored = localStorage.getItem('stratbaker_annotations_' + stratId.value)
  if (stored) {
    try {
      annotations.value = JSON.parse(stored)
    } catch {
      annotations.value = {}
    }
  }
}

loadAnnotations()

function saveAnnotations() {
  if (!import.meta.client) return
  localStorage.setItem('stratbaker_annotations_' + stratId.value, JSON.stringify(annotations.value))
}

function openAnnotation(sectionId: string) {
  annotationOpen.value = sectionId
  annotationDraft.value = annotations.value[sectionId]?.text || ''
}

function saveAnnotation() {
  if (!annotationOpen.value) return
  if (annotationDraft.value.trim()) {
    annotations.value[annotationOpen.value] = {
      sectionId: annotationOpen.value,
      text: annotationDraft.value.trim(),
      createdAt: new Date().toISOString(),
    }
  } else {
    delete annotations.value[annotationOpen.value]
  }
  saveAnnotations()
  annotationOpen.value = null
  annotationDraft.value = ''
}

function removeAnnotation(sectionId: string) {
  delete annotations.value[sectionId]
  saveAnnotations()
  annotationOpen.value = null
}

function formatContent(content: string): string {
  let html = content
    .replace(/^## (.+)$/gm, '<h3 class="text-lg font-bold text-gray-100 mt-4 mb-2">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-100">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic text-muted-light">$1</em>')
    .replace(/^- (.+)$/gm, '<li class="ml-5 list-disc">$1</li>')
    .replace(/\n/g, '<br />')
  html = html.replace(/(<li[^>]*>.*?<\/li>(?:<br \/>)?)+/g, (m) => `<ul class="space-y-1 my-2">${m.replace(/<br \/>/g, '')}</ul>`)
  return html
}
</script>

<template>
  <div>
    <AppHeader />

    <template v-if="strat">
    <main class="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div class="flex items-center justify-between gap-4 mb-6">
        <PageHeader
          :title="strat.title"
          :subtitle="`${getMapNameBySlug(strat.mapSlug)} · v${strat.version}`"
          back-to="/map"
        />

        <div class="flex items-center gap-3 shrink-0">
          <div class="flex items-center gap-1.5" :title="strat.cached ? 'Offline ready' : 'Not cached'">
            <span class="dot" :class="strat.cached ? 'bg-accent' : 'bg-warning'" />
            <span class="text-xs hidden sm:block" :class="strat.cached ? 'text-accent' : 'text-warning'">
              {{ strat.cached ? 'Cached' : 'Not cached' }}
            </span>
          </div>
          <NuxtLink v-if="canEdit" :to="`/strat/${strat.id}/edit`" class="btn btn-secondary !py-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </NuxtLink>
        </div>
      </div>

      <div class="space-y-6">
        <div
          v-for="section in strat.sections"
          :key="section.id"
          class="card p-6 relative group"
        >
          <div class="flex items-start justify-between gap-4 mb-4">
            <h2 class="text-xl font-bold text-gray-100">{{ section.title }}</h2>

            <button
              v-if="role === 'player'"
              class="btn btn-ghost !p-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
              :class="{ '!opacity-100 text-warning': annotations[section.id] }"
              :title="annotations[section.id] ? 'Edit annotation' : 'Add annotation'"
              @click="openAnnotation(section.id)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </div>

          <div v-if="section.type === 'setup' && section.setup" class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-border">
                  <th class="text-left py-2.5 px-3 text-muted-light font-medium">Player</th>
                  <th class="text-left py-2.5 px-3 text-muted-light font-medium">Role / Position</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, ri) in section.setup" :key="ri" class="border-b border-border/50">
                  <td class="py-2.5 px-3 text-gray-100 font-medium">{{ row.player }}</td>
                  <td class="py-2.5 px-3 text-muted-light">{{ row.role }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="text-base leading-relaxed text-muted-light" v-html="formatContent(section.content)" />

          <div
            v-if="annotations[section.id]"
            class="mt-4 p-3 rounded-lg bg-warning/10 border border-warning/30 text-sm text-warning-dark"
          >
            <div class="flex items-start justify-between gap-2">
              <p>{{ annotations[section.id].text }}</p>
              <button class="btn btn-ghost !p-1 shrink-0 text-warning" @click="removeAnnotation(section.id)">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 pt-6 border-t border-border flex items-center justify-between text-sm text-muted">
        <span>Author: {{ strat.author }}</span>
        <span>Last edited: {{ strat.lastEdit }}</span>
      </div>
    </main>

    <Teleport to="body">

      <div
        v-if="annotationOpen"
        class="fixed inset-0 z-50 flex items-center justify-center px-4"
        @click.self="annotationOpen = null"
      >
        <div class="absolute inset-0 bg-black/60" @click="annotationOpen = null" />
        <div class="relative card p-5 w-full max-w-md bg-bg-card">
          <h3 class="text-base font-bold text-gray-100 mb-3">Personal Annotation</h3>
          <p class="text-xs text-muted mb-3">Visible only to you. Stored on this device.</p>
          <textarea
            v-model="annotationDraft"
            class="input min-h-[100px] resize-y text-sm"
            placeholder="Write your note for this section..."
            autofocus
          />
          <div class="flex items-center justify-end gap-2 mt-4">
            <button class="btn btn-ghost" @click="annotationOpen = null">Cancel</button>
            <button v-if="annotations[annotationOpen]" class="btn btn-danger !py-2" @click="removeAnnotation(annotationOpen)">Delete</button>
            <button class="btn btn-primary" @click="saveAnnotation">Save Note</button>
          </div>
        </div>
      </div>
    </Teleport>
    </template>

    <main v-else class="max-w-7xl mx-auto px-4 py-20 text-center">
      <p class="text-muted-light text-lg">Strategy not found.</p>
      <NuxtLink to="/dashboard" class="btn btn-secondary mt-4">Back to Dashboard</NuxtLink>
    </main>
  </div>
</template>
