<script setup lang="ts">
import { getStratById, getMapNameBySlug, type StratSection } from '~/utils/mockData'

definePageMeta({ layout: 'default', middleware: 'auth' })

const route = useRoute()
const { role } = useAuth()

const stratId = computed(() => route.params.id as string)
const strat = ref(getStratById(stratId.value) || null)

const canEdit = computed(() => role.value === 'coach' || role.value === 'igl')

const saveStatus = ref<'idle' | 'saving' | 'saved'>('saved')
const lastSavedText = ref('Saved just now')

const sections = ref<StratSection[]>(
  strat.value ? JSON.parse(JSON.stringify(strat.value.sections)) : []
)

const dragIndex = ref<number | null>(null)

function onDragStart(index: number) {
  dragIndex.value = index
}

function onDrop(targetIndex: number) {
  if (dragIndex.value === null || dragIndex.value === targetIndex) return
  const item = sections.value.splice(dragIndex.value, 1)[0]
  sections.value.splice(targetIndex, 0, item)
  dragIndex.value = null
  triggerSave()
}

function addSection(type: 'setup' | 'text') {
  const newSection: StratSection = {
    id: 'sec-' + Date.now(),
    type,
    title: type === 'setup' ? 'New Setup' : 'New Text Block',
    content: type === 'text' ? '' : '',
    setup: type === 'setup' ? [{ player: '', role: '' }] : undefined,
  }
  sections.value.push(newSection)
  triggerSave()
}

function removeSection(index: number) {
  sections.value.splice(index, 1)
  triggerSave()
}

function addSetupRow(section: StratSection) {
  if (!section.setup) section.setup = []
  section.setup.push({ player: '', role: '' })
  triggerSave()
}

function removeSetupRow(section: StratSection, rowIndex: number) {
  if (section.setup) {
    section.setup.splice(rowIndex, 1)
    triggerSave()
  }
}

let saveTimer: ReturnType<typeof setTimeout> | null = null

function triggerSave() {
  saveStatus.value = 'saving'
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    saveStatus.value = 'saved'
    lastSavedText.value = 'Saved just now'
  }, 800)
}

function publish() {
  saveStatus.value = 'saving'
  setTimeout(() => {
    saveStatus.value = 'saved'
    lastSavedText.value = 'Published just now'
  }, 600)
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

    <main class="max-w-7xl mx-auto px-4 sm:px-6 py-6" v-if="strat && canEdit">
      <PageHeader
        :title="strat.title"
        :subtitle="`${getMapNameBySlug(strat.mapSlug)} · v${strat.version}`"
        back-to="/map"
      />

      <div class="mt-6 card p-2 sm:p-3 flex flex-wrap items-center gap-1 sm:gap-2 sticky top-[60px] z-30 bg-bg-card/95 backdrop-blur">
        <button class="btn btn-ghost !px-3 !py-2 text-sm font-bold" title="Bold" @click="addSection('text')">
          <span class="font-bold">B</span>
        </button>
        <button class="btn btn-ghost !px-3 !py-2 text-sm italic" title="Italic">
          <span class="italic">I</span>
        </button>
        <div class="w-px h-6 bg-border" />
        <button class="btn btn-ghost !px-3 !py-2 text-sm" title="Bullet list">• List</button>
        <button class="btn btn-ghost !px-3 !py-2 text-sm font-semibold" title="Heading 2">H2</button>
        <button class="btn btn-ghost !px-3 !py-2 text-sm font-medium" title="Heading 3">H3</button>
        <div class="w-px h-6 bg-border" />
        <button class="btn btn-ghost !px-3 !py-2 text-sm" title="Insert table" @click="addSection('setup')">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16M4 6v12M12 6v12M20 6v12" />
          </svg>
          Table
        </button>
        <div class="w-px h-6 bg-border" />
        <button class="btn btn-ghost !px-3 !py-2 text-sm" title="Divider">—</button>
        <button class="btn btn-ghost !px-3 !py-2 text-sm" @click="addSection('text')">+ Section</button>

        <div class="ml-auto flex items-center gap-3">
          <span class="text-xs" :class="saveStatus === 'saving' ? 'text-warning' : 'text-accent'">
            {{ saveStatus === 'saving' ? 'Saving...' : lastSavedText }}
          </span>
          <button class="btn btn-primary !py-2" @click="publish">Publish</button>
        </div>
      </div>

      <div class="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div class="text-xs font-medium text-muted uppercase tracking-wide pb-2 border-b border-border">Editor</div>

          <div
            v-for="(section, index) in sections"
            :key="section.id"
            class="card p-4 draggable cursor-move"
            draggable="true"
            @dragstart="onDragStart(index)"
            @dragover.prevent
            @drop="onDrop(index)"
          >
            <div class="flex items-center justify-between mb-3">
              <input
                v-model="section.title"
                class="bg-transparent text-base font-semibold text-gray-100 focus:outline-none focus:text-accent border-b border-transparent focus:border-border flex-1"
              />
              <button class="btn btn-ghost !p-1.5" @click="removeSection(index)">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div v-if="section.type === 'setup'" class="space-y-2">
              <div class="grid grid-cols-2 gap-2 text-xs font-medium text-muted">
                <div>Player</div>
                <div>Role / Position</div>
              </div>
              <div v-for="(row, ri) in section.setup" :key="ri" class="grid grid-cols-2 gap-2 items-center">
                <input v-model="row.player" class="input !py-2 text-sm" placeholder="Player name" @input="triggerSave" />
                <div class="flex gap-1.5">
                  <input v-model="row.role" class="input !py-2 text-sm" placeholder="Role / position" @input="triggerSave" />
                  <button class="btn btn-ghost !p-1.5 shrink-0" @click="removeSetupRow(section, ri)">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <button class="btn btn-ghost !py-1.5 text-xs mt-1" @click="addSetupRow(section)">+ Add player</button>
            </div>

            <textarea
              v-else
              v-model="section.content"
              class="input !py-2 text-sm min-h-[120px] resize-y font-mono"
              placeholder="Write strat content... Use ## for headings, **bold**, *italic*, - bullets"
              @input="triggerSave"
            />
          </div>

          <button class="btn btn-secondary w-full" @click="addSection('text')">+ Add Section</button>
        </div>

        <div class="space-y-4">
          <div class="text-xs font-medium text-muted uppercase tracking-wide pb-2 border-b border-border">Live Preview</div>

          <div class="card p-6">
            <div v-for="section in sections" :key="section.id" class="mb-6 last:mb-0">
              <h3 class="text-lg font-bold text-gray-100 mb-3">{{ section.title }}</h3>

              <div v-if="section.type === 'setup' && section.setup" class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="border-b border-border">
                      <th class="text-left py-2 px-3 text-muted-light font-medium">Player</th>
                      <th class="text-left py-2 px-3 text-muted-light font-medium">Role / Position</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, ri) in section.setup" :key="ri" class="border-b border-border/50">
                      <td class="py-2 px-3 text-gray-100 font-medium">{{ row.player || '—' }}</td>
                      <td class="py-2 px-3 text-muted-light">{{ row.role || '—' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div v-else class="text-sm leading-relaxed text-muted-light" v-html="formatContent(section.content || 'Empty content')" />
            </div>

            <p v-if="sections.length === 0" class="text-center text-muted py-8">No sections yet. Add one from the toolbar above.</p>
          </div>
        </div>
      </div>

      <div class="mt-6 sticky bottom-0 bg-bg/95 backdrop-blur border-t border-border -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="badge badge-tag">v{{ strat.version }}</span>
          <span class="text-xs" :class="saveStatus === 'saving' ? 'text-warning' : 'text-accent'">
            {{ saveStatus === 'saving' ? 'Saving...' : lastSavedText }}
          </span>
        </div>
        <button class="btn btn-primary" @click="publish">Publish</button>
      </div>
    </main>

    <main v-else-if="strat && !canEdit" class="max-w-7xl mx-auto px-4 py-20 text-center">
      <p class="text-muted-light text-lg">You don't have permission to edit strategies.</p>
      <NuxtLink :to="`/strat/${strat.id}`" class="btn btn-secondary mt-4">View Strategy</NuxtLink>
    </main>

    <main v-else class="max-w-7xl mx-auto px-4 py-20 text-center">
      <p class="text-muted-light text-lg">Strategy not found.</p>
      <NuxtLink to="/dashboard" class="btn btn-secondary mt-4">Back to Dashboard</NuxtLink>
    </main>
  </div>
</template>
