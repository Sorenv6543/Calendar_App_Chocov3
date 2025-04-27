<template>
  <UButton
    :icon="colorMode.value === 'dark' ? 'i-heroicons-moon' : 'i-heroicons-sun'"
    color="gray"
    variant="ghost"
    aria-label="Theme"
    @click="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'"
  />
</template>

<script setup lang="ts">
const colorMode = useColorMode()
</script> 