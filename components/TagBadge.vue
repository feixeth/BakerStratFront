<script setup lang="ts">
defineProps<{
  label: string
  active?: boolean
}>()
</script>

<template>
  <span class="badge" :class="active ? 'badge-tag' : ''">
    {{ label }}
  </span>
</template>
