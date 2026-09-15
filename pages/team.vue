<script setup lang="ts">
import { teamMembers, pendingInvitations, type TeamMember } from '~/utils/mockData'

definePageMeta({ layout: 'default', middleware: 'auth' })

const { user, role } = useAuth()

const members = ref<TeamMember[]>(JSON.parse(JSON.stringify(teamMembers)))
const invitations = ref(JSON.parse(JSON.stringify(pendingInvitations)))

const isCoach = computed(() => role.value === 'coach')

const inviteEmail = ref('')
const inviteRole = ref<'player' | 'igl'>('player')
const showInviteForm = ref(false)

const showTransferModal = ref(false)
const transferTarget = ref('')

const importError = ref('')
const importSuccess = ref('')

function roleBadgeClass(r: string) {
  if (r === 'coach') return 'badge-coach'
  if (r === 'igl') return 'badge-igl'
  return 'badge-player'
}

function avatarFrom(pseudo: string): string {
  return pseudo.slice(0, 2).toUpperCase()
}

function sendInvite() {
  if (!inviteEmail.value.trim()) return
  invitations.value.push({
    id: 'inv-' + Date.now(),
    email: inviteEmail.value.trim(),
    role: inviteRole.value,
    sentAt: new Date().toISOString().split('T')[0],
  })
  inviteEmail.value = ''
  inviteRole.value = 'player'
  showInviteForm.value = false
}

function changeRole(memberId: string, newRole: 'igl' | 'player') {
  const member = members.value.find((m) => m.id === memberId)
  if (member) {
    member.role = newRole
  }
}

function canChangeRole(member: TeamMember): boolean {
  return member.id !== user.value?.id && member.role !== 'coach'
}

function openTransferModal(memberId: string) {
  transferTarget.value = memberId
  showTransferModal.value = true
}

function confirmTransfer() {
  const target = members.value.find((m) => m.id === transferTarget.value)
  const me = members.value.find((m) => m.id === user.value?.id)
  if (target && me) {
    target.role = 'coach'
    me.role = 'player'
  }
  showTransferModal.value = false
  transferTarget.value = ''
}

function exportBundle() {
  const bundle = {
    app: 'StratBaker',
    version: 1,
    exportedAt: new Date().toISOString(),
    members: members.value,
    invitations: invitations.value,
  }
  const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'team.stratbaker'
  a.click()
  URL.revokeObjectURL(url)
}

function importBundle(event: Event) {
  importError.value = ''
  importSuccess.value = ''
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target?.result as string)
      if (data.app !== 'StratBaker') {
        importError.value = 'Invalid file format. Not a StratBaker bundle.'
        return
      }
      if (data.members && Array.isArray(data.members)) {
        members.value = data.members
      }
      if (data.invitations && Array.isArray(data.invitations)) {
        invitations.value = data.invitations
      }
      importSuccess.value = 'Bundle imported successfully.'
    } catch {
      importError.value = 'Could not read file. Make sure it is a valid .stratbaker file.'
    }
  }
  reader.readAsText(file)
  input.value = ''
}
</script>

<template>
  <div>
    <AppHeader />

    <template v-if="isCoach">
    <main class="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <PageHeader title="Team Management" subtitle="Manage members, roles, and invitations" back-to="/dashboard" />

      <div class="mt-6 flex flex-wrap items-center gap-3">
        <button class="btn btn-primary" @click="showInviteForm = !showInviteForm">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Invite by Email
        </button>
        <button class="btn btn-secondary" @click="exportBundle">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Bundle
        </button>
        <label class="btn btn-secondary cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Import Bundle
          <input type="file" accept=".stratbaker" class="hidden" @change="importBundle" />
        </label>
      </div>

      <p v-if="importError" class="mt-3 text-sm text-danger">{{ importError }}</p>
      <p v-if="importSuccess" class="mt-3 text-sm text-accent">{{ importSuccess }}</p>

      <div v-if="showInviteForm" class="mt-4 card p-5">
        <h3 class="text-base font-semibold text-gray-100 mb-3">Invite a New Member</h3>
        <div class="flex flex-col sm:flex-row gap-3">
          <input
            v-model="inviteEmail"
            type="email"
            class="input flex-1"
            placeholder="player@team.gg"
          />
          <select v-model="inviteRole" class="input sm:w-40">
            <option value="player">Player</option>
            <option value="igl">IGL</option>
          </select>
          <button class="btn btn-primary shrink-0" @click="sendInvite">Send Invite</button>
        </div>
      </div>

      <div class="mt-8">
        <h2 class="text-lg font-bold text-gray-100 mb-4">Members ({{ members.length }})</h2>
        <div class="space-y-3">
          <div
            v-for="member in members"
            :key="member.id"
            class="card p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
          >
            <div class="flex items-center gap-3 flex-1 min-w-0">
              <div class="w-10 h-10 rounded-full bg-bg-lighter border border-border flex items-center justify-center text-sm font-semibold text-accent shrink-0">
                {{ avatarFrom(member.pseudo) }}
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <span class="font-semibold text-gray-100 truncate">{{ member.pseudo }}</span>
                  <span v-if="member.id === user?.id" class="text-xs text-muted">(You)</span>
                </div>
                <p class="text-sm text-muted truncate">{{ member.email }}</p>
                <p class="text-xs text-muted mt-0.5 sm:hidden">Joined {{ member.joinDate }}</p>
              </div>
            </div>

            <div class="hidden sm:block text-xs text-muted shrink-0">{{ member.joinDate }}</div>

            <div class="flex items-center gap-2 shrink-0">
              <span class="badge" :class="roleBadgeClass(member.role)">{{ member.role.toUpperCase() }}</span>

              <select
                v-if="canChangeRole(member)"
                :value="member.role"
                class="bg-bg-light border border-border rounded-md px-2 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-accent"
                @change="changeRole(member.id, ($event.target as HTMLSelectElement).value as 'igl' | 'player')"
              >
                <option value="player">Player</option>
                <option value="igl">IGL</option>
              </select>

              <button
                v-if="member.role !== 'coach'"
                class="btn btn-ghost !px-2.5 !py-1.5 text-xs"
                @click="openTransferModal(member.id)"
              >
                Make Coach
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8">
        <h2 class="text-lg font-bold text-gray-100 mb-4">Pending Invitations ({{ invitations.length }})</h2>
        <div v-if="invitations.length > 0" class="space-y-3">
          <div
            v-for="inv in invitations"
            :key="inv.id"
            class="card p-4 flex items-center justify-between gap-4"
          >
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-9 h-9 rounded-full bg-bg-lighter border border-border flex items-center justify-center text-xs text-muted">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="min-w-0">
                <p class="text-sm font-medium text-gray-100 truncate">{{ inv.email }}</p>
                <p class="text-xs text-muted">Sent {{ inv.sentAt }}</p>
              </div>
            </div>
            <span class="badge" :class="inv.role === 'igl' ? 'badge-igl' : 'badge-player'">{{ inv.role.toUpperCase() }}</span>
          </div>
        </div>
        <p v-else class="text-muted text-sm">No pending invitations.</p>
      </div>
    </main>

    <Teleport to="body">
      <div
        v-if="showTransferModal"
        class="fixed inset-0 z-50 flex items-center justify-center px-4"
        @click.self="showTransferModal = false"
      >
        <div class="absolute inset-0 bg-black/60" />
        <div class="relative card p-6 w-full max-w-sm bg-bg-card">
          <h3 class="text-lg font-bold text-gray-100 mb-2">Transfer Coach Role?</h3>
          <p class="text-sm text-muted-light mb-5">
            You will become a Player and lose access to team management. This action cannot be undone from the reader view.
          </p>
          <div class="flex items-center justify-end gap-2">
            <button class="btn btn-ghost" @click="showTransferModal = false">Cancel</button>
            <button class="btn btn-danger" @click="confirmTransfer">Transfer Role</button>
          </div>
        </div>
      </div>
    </Teleport>
    </template>

    <main v-else class="max-w-5xl mx-auto px-4 py-20 text-center">
      <p class="text-muted-light text-lg">Only coaches can access team management.</p>
      <NuxtLink to="/dashboard" class="btn btn-secondary mt-4">Back to Dashboard</NuxtLink>
    </main>
  </div>
</template>
