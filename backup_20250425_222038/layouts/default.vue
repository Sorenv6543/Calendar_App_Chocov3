<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <span class="text-xl font-bold">Calendar App</span>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NuxtLink
                v-for="item in navigation"
                :key="item.name"
                :to="item.path"
                class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                :class="[
                  route.path === item.path
                    ? 'border-primary-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                ]"
              >
                {{ item.name }}
              </NuxtLink>
            </div>
          </div>
          <div class="flex items-center">
            <UButton
              v-if="isAuthenticated"
              color="gray"
              variant="ghost"
              @click="handleLogout"
            >
              Sign out
            </UButton>
          </div>
        </div>
      </div>
    </nav>

    <!-- Page Content -->
    <main class="py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()

// TODO: Replace with actual auth state
const isAuthenticated = ref(false)

const navigation = [
  { name: 'Calendar', path: '/calendar' },
  { name: 'Settings', path: '/settings' }
]

const handleLogout = () => {
  // TODO: Implement actual logout logic
  isAuthenticated.value = false
  router.push('/login')
}

// Simple auth check - in a real app, this would be more sophisticated
watch(route, (newRoute) => {
  if (!isAuthenticated.value && newRoute.path !== '/login') {
    router.push('/login')
  }
}, { immediate: true })
</script> 