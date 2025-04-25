<template>
  <div class="login-container">
    <v-card class="login-card">
      <div class="modal-glass-effect"></div>

      <!-- Header with gradient -->
      <v-card-title class="modal-header">
        <div class="d-flex align-center">
          <v-icon color="white" class="mr-2">mdi-login</v-icon>
          <span>Login</span>
        </div>
      </v-card-title>

      <v-card-text class="modal-content">
        <form @submit.prevent="login">
          <!-- Email Input -->
          <div class="input-group">
            <div class="d-flex align-center mb-1">
              <v-icon color="primary" size="20">mdi-email</v-icon>
              <span class="ml-2 input-label">Email</span>
            </div>
            <v-text-field v-model="email" type="email" outlined dense hide-details class="glass-input mb-4"
              placeholder="Enter your email" required autocomplete="email"></v-text-field>
          </div>

          <!-- Password Input -->
          <div class="input-group">
            <div class="d-flex align-center mb-1">
              <v-icon color="primary" size="20">mdi-lock</v-icon>
              <span class="ml-2 input-label">Password</span>
            </div>
            <v-text-field v-model="password" type="password" outlined dense hide-details class="glass-input"
              placeholder="Enter your password" required autocomplete="current-password"></v-text-field>
          </div>

          <!-- Error Message -->
          <v-alert v-if="error" type="error" dense class="mt-4" border="left">
            {{ error }}
          </v-alert>

          <!-- Actions -->
          <div class="d-flex flex-column align-center mt-6">
            <v-btn type="submit" color="primary" class="login-btn mb-4" :loading="isLoading">
              <v-icon left>mdi-login</v-icon>
              Login
            </v-btn>

            <p class="text-center">
              Don't have an account?
              <router-link to="/register" class="register-link">Register here</router-link>
            </p>
          </div>
        </form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { loginUser } from '../auth';
import { useRouter } from 'vue-router';
import type { FirebaseError } from 'firebase/app';

const router = useRouter();
const email = ref<string>('');
const password = ref<string>('');
const error = ref<string>('');
const isLoading = ref<boolean>(false);

const login = async (): Promise<void> => {
  try {
    isLoading.value = true;
    await loginUser(email.value, password.value);
    router.push('/home');
  } catch (err) {
    const firebaseError = err as FirebaseError;
    error.value = firebaseError.message;
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 16px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
}

.login-card {
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.modal-glass-effect {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.05) 100%);
  pointer-events: none;
  z-index: 0;
}

.modal-header {
  background: linear-gradient(135deg, #6200ea 0%, #9c27b0 100%);
  color: white;
  padding: 16px 20px;
  text-align: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  box-shadow: 0 4px 15px rgba(98, 0, 234, 0.2);
}

.modal-content {
  padding: 24px;
  position: relative;
  z-index: 1;
}

.input-group {
  margin-bottom: 20px;
}

.input-label {
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.7);
}

.glass-input {
  background-color: rgba(255, 255, 255, 0.6) !important;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(98, 0, 234, 0.15) !important;
  border-radius: 10px !important;
  transition: all 0.2s ease;
  margin-top: 4px;
}

.glass-input:hover {
  background-color: rgba(255, 255, 255, 0.8) !important;
  box-shadow: 0 4px 10px rgba(98, 0, 234, 0.08);
  border: 1px solid rgba(98, 0, 234, 0.3) !important;
}

.glass-input:focus,
.glass-input.v-input--is-focused {
  background-color: rgba(255, 255, 255, 0.9) !important;
  box-shadow: 0 6px 15px rgba(98, 0, 234, 0.1);
  border: 1px solid rgba(98, 0, 234, 0.5) !important;
}

.login-btn {
  border-radius: 10px;
  font-weight: 500;
  text-transform: none;
  letter-spacing: 0;
  padding: 0 24px;
  height: 44px;
  min-width: 160px;
  background: linear-gradient(135deg, #6200ea 0%, #9c27b0 100%) !important;
  box-shadow: 0 4px 15px rgba(98, 0, 234, 0.3) !important;
  transition: all 0.2s ease;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(98, 0, 234, 0.4) !important;
}

.register-link {
  color: #6200ea;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
}

.register-link:hover {
  text-decoration: underline;
  opacity: 0.9;
}
</style>
