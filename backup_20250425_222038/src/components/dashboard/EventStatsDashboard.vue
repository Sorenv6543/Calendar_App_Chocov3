<template>
  <div class="space-y-6">
    <!-- Overview Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Total Events</h3>
            <UIcon name="i-heroicons-calendar" class="text-primary-500" />
          </div>
        </template>
        <div class="text-3xl font-bold">{{ stats.totalEvents }}</div>
        <template #footer>
          <div class="flex justify-between text-sm text-gray-500">
            <span>Upcoming: {{ stats.upcomingEvents }}</span>
            <span>Past: {{ stats.pastEvents }}</span>
          </div>
        </template>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Turn Events</h3>
            <UIcon name="i-heroicons-arrow-path" class="text-primary-500" />
          </div>
        </template>
        <div class="text-3xl font-bold">{{ stats.turnStats.totalTurns }}</div>
        <template #footer>
          <div class="flex justify-between text-sm text-gray-500">
            <span>Upcoming: {{ stats.turnStats.upcomingTurns }}</span>
            <span>Past: {{ stats.turnStats.pastTurns }}</span>
          </div>
        </template>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">This Month</h3>
            <UIcon name="i-heroicons-calendar-days" class="text-primary-500" />
          </div>
        </template>
        <div class="text-3xl font-bold">{{ stats.eventsThisMonth }}</div>
        <template #footer>
          <div class="flex justify-between text-sm text-gray-500">
            <span>Next Month: {{ stats.eventsNextMonth }}</span>
          </div>
        </template>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Average Events</h3>
            <UIcon name="i-heroicons-chart-bar" class="text-primary-500" />
          </div>
        </template>
        <div class="text-3xl font-bold">{{ Math.round(stats.houseStats.averageEventsPerHouse) }}</div>
        <template #footer>
          <div class="text-sm text-gray-500">
            per house
          </div>
        </template>
      </UCard>
    </div>

    <!-- Time Distribution -->
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Time Distribution</h3>
      </template>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div v-for="(count, period) in {
          morning: stats.timeDistribution.morningEvents,
          afternoon: stats.timeDistribution.afternoonEvents,
          evening: stats.timeDistribution.eveningEvents,
          night: stats.timeDistribution.nightEvents
        }" :key="period" class="text-center">
          <div class="text-2xl font-bold">{{ count }}</div>
          <div class="text-sm text-gray-500 capitalize">{{ period }} Events</div>
        </div>
      </div>
    </UCard>

    <!-- Event Characteristics -->
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Event Characteristics</h3>
      </template>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div v-for="(count, characteristic) in {
          'With Notes': stats.characteristics.withNotes,
          'With Contact': stats.characteristics.withContact,
          'All Day': stats.characteristics.allDayEvents,
          'Multi Day': stats.characteristics.multiDayEvents,
          'Average Duration': Math.round(stats.characteristics.averageEventDuration / 3600000) + 'h'
        }" :key="characteristic" class="text-center">
          <div class="text-2xl font-bold">{{ count }}</div>
          <div class="text-sm text-gray-500">{{ characteristic }}</div>
        </div>
      </div>
    </UCard>

    <!-- House Statistics -->
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">House Statistics</h3>
      </template>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 class="font-medium mb-2">Most Booked House</h4>
          <div class="flex items-center space-x-2">
            <UIcon name="i-heroicons-home" class="text-primary-500" />
            <span>{{ stats.houseStats.mostBookedHouse }}</span>
          </div>
        </div>
        <div>
          <h4 class="font-medium mb-2">Least Booked House</h4>
          <div class="flex items-center space-x-2">
            <UIcon name="i-heroicons-home" class="text-primary-500" />
            <span>{{ stats.houseStats.leastBookedHouse }}</span>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Events by Month -->
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Events by Month</h3>
      </template>
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr>
              <th class="px-4 py-2 text-left">Month</th>
              <th class="px-4 py-2 text-right">Events</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(count, month) in stats.eventsByMonth" :key="month">
              <td class="px-4 py-2">{{ formatMonth(month) }}</td>
              <td class="px-4 py-2 text-right">{{ count }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { EventStats } from '@/types/event';

interface Props {
  stats: EventStats;
}

defineProps<Props>();

const formatMonth = (monthKey: string): string => {
  const [year, month] = monthKey.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
};
</script>

<style scoped>
.overflow-x-auto {
  -webkit-overflow-scrolling: touch;
}
</style> 