<script setup lang="ts">
const props = defineProps<{
  title: string
  subtitle?: string
  backTo?: string
}>()
</script>

<template>
  <div class="flex items-center gap-4">
    <NuxtLink v-if="backTo" :to="backTo" class="btn btn-ghost !px-2.5 !py-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
    </NuxtLink>
    <div>
      <h1 class="text-2xl font-bold text-gray-100">{{ title }}</h1>
      <p v-if="subtitle" class="text-sm text-muted-light mt-0.5">{{ subtitle }}</p>
    </div>
  </div>
</template>
