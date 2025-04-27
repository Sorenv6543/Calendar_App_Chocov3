<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold">Event Statistics Dashboard</h1>
      <UButton
        icon="i-heroicons-arrow-path"
        @click="refreshStats"
        :loading="loading"
      >
        Refresh
      </UButton>
    </div>

    <EventStatsDashboard v-if="stats" :stats="stats" />
    <div v-else-if="loading" class="flex justify-center items-center h-64">
      <ULoadingIcon />
    </div>
    <div v-else-if="error" class="text-red-500 text-center">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EventStats } from '@/types/event';

const { events, getEventStats, fetchEvents } = useEventManagement();
const loading = ref(false);
const error = ref<string | null>(null);
const stats = ref<EventStats | null>(null);

const refreshStats = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    await fetchEvents();
    stats.value = getEventStats();
  } catch (err) {
    error.value = 'Failed to fetch statistics';
    console.error('Error fetching stats:', err);
  } finally {
    loading.value = false;
  }
};

// Initial load
onMounted(refreshStats);
</script> 