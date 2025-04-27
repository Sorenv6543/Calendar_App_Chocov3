<script setup lang="ts">
const router = useRouter()

onMounted(() => {
  router.push('/calendar')
})
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin" />
      <p class="mt-2">Redirecting to calendar...</p>
    </div>
  </div>
</template> 