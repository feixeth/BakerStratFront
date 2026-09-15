<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: 'auth' })

onMounted(() => {
  const token = import.meta.client ? localStorage.getItem('stratbaker_token') : null
  navigateTo(token ? '/dashboard' : '/login')
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
  </div>
</template>
