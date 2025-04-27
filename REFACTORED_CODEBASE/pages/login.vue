<script setup lang="ts">
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const router = useRouter()

const handleLogin = async () => {
  try {
    loading.value = true
    error.value = ''
    
    // TODO: Implement actual authentication logic
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // For now, just redirect to calendar
    router.push('/calendar')
  } catch (err) {
    error.value = 'Invalid credentials'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label for="email" class="sr-only">Email address</label>
            <UInput
              id="email"
              v-model="email"
              type="email"
              placeholder="Email address"
              required
            />
          </div>
          
          <div>
            <label for="password" class="sr-only">Password</label>
            <UInput
              id="password"
              v-model="password"
              type="password"
              placeholder="Password"
              required
            />
          </div>
        </div>

        <div v-if="error" class="text-red-500 text-sm text-center">
          {{ error }}
        </div>

        <div>
          <UButton
            type="submit"
            :loading="loading"
            class="w-full"
          >
            Sign in
          </UButton>
        </div>
      </form>
    </div>
  </div>
</template> 