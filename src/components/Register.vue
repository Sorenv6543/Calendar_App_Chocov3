<template>
  <div class="register-container">
    <div class="register-card">
      <div class="modal-glass-effect"></div>

      <!-- Header with gradient -->
      <div class="modal-header">
        <div class="d-flex align-center">
          <v-icon color="white" class="mr-2">mdi-account-plus</v-icon>
          <span>Create Account</span>
        </div>
      </div>

      <div class="modal-content">
        <form class="register-form" @submit.prevent="handleRegister">
          <!-- Email Input -->
          <div class="input-group">
            <div class="d-flex align-center mb-1">
              <v-icon color="primary" size="20">mdi-email</v-icon>
              <span class="ml-2 input-label">Email</span>
            </div>
            <input id="email" v-model="form.email" type="email" placeholder="Enter your email" :disabled="isLoading"
              aria-required="true" autocomplete="email" class="glass-input" />
          </div>

          <!-- Password Input -->
          <div class="input-group">
            <div class="d-flex align-center mb-1">
              <v-icon color="primary" size="20">mdi-lock</v-icon>
              <span class="ml-2 input-label">Password</span>
            </div>
            <input id="password" v-model="form.password" type="password" placeholder="Enter your password"
              :disabled="isLoading" aria-required="true" minlength="8" autocomplete="new-password"
              class="glass-input" />
          </div>

          <!-- Full Name Input -->
          <div class="input-group">
            <div class="d-flex align-center mb-1">
              <v-icon color="primary" size="20">mdi-account</v-icon>
              <span class="ml-2 input-label">Full Name</span>
            </div>
            <input id="fullName" v-model="form.fullName" type="text" placeholder="Enter your full name"
              :disabled="isLoading" aria-required="true" autocomplete="name" class="glass-input" />
          </div>

          <div class="modal-actions">
            <router-link to="/login" class="cancel-btn">
              Already have an account? Login
            </router-link>
            <button type="submit" :disabled="isLoading || !isFormValid" class="create-btn">
              <v-icon start v-if="!isLoading">mdi-check</v-icon>
              <span v-if="isLoading">Registering...</span>
              <span v-else>Register</span>
            </button>
          </div>

          <p v-if="error" class="error-message">{{ error }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { db } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { ref, computed } from 'vue';
import { registerUser } from '../auth';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoading = ref(false);
const error = ref('');

const form = ref({
  email: '',
  password: '',
  fullName: ''
});

const isFormValid = computed(() => {
  return form.value.email &&
    form.value.password &&
    form.value.password.length >= 8 &&
    form.value.fullName;
});

const resetForm = () => {
  form.value = {
    email: '',
    password: '',
    fullName: ''
  };
  error.value = '';
};

const handleRegister = async () => {
  if (!isFormValid.value) return;

  isLoading.value = true;
  error.value = '';

  try {
    const userCredential = await registerUser(form.value.email, form.value.password);
    const userId = userCredential.user.uid;

    await setDoc(doc(db, 'users', userId), {
      fullName: form.value.fullName,
      email: form.value.email,
      houses: [],
      id: userId
    });

    resetForm();
    router.push('/home');
  } catch (err) {
    error.value = err.message || 'Registration failed. Please try again.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e0e6ed 100%);
}

.register-card {
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
  box-shadow: 0 4px 15px rgba(98, 0, 234, 0.2);
}

.modal-content {
  padding: 20px;
  position: relative;
  z-index: 1;
}

.register-form {
  width: 100%;
}

.input-group {
  margin-bottom: 20px;
}

.input-label {
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.7);
}

.d-flex {
  display: flex;
}

.align-center {
  align-items: center;
}

.mb-1 {
  margin-bottom: 4px;
}

.ml-2 {
  margin-left: 8px;
}

.mr-2 {
  margin-right: 8px;
}

.glass-input {
  width: 100%;
  padding: 12px 16px;
  background-color: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(98, 0, 234, 0.15);
  border-radius: 10px;
  transition: all 0.2s ease;
  margin-top: 4px;
  outline: none;
  font-size: 14px;
}

.glass-input:hover {
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 10px rgba(98, 0, 234, 0.08);
  border: 1px solid rgba(98, 0, 234, 0.3);
}

.glass-input:focus {
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 6px 15px rgba(98, 0, 234, 0.1);
  border: 1px solid rgba(98, 0, 234, 0.5);
}

.modal-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 12px 0 20px;
  position: relative;
  z-index: 1;
}

.cancel-btn {
  color: rgba(0, 0, 0, 0.6);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s ease;
}

.cancel-btn:hover {
  color: #6200ea;
  text-decoration: underline;
}

.create-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  border-radius: 10px;
  font-weight: 500;
  letter-spacing: 0;
  padding: 0 20px;
  height: 44px;
  background: linear-gradient(135deg, #6200ea 0%, #9c27b0 100%);
  box-shadow: 0 4px 15px rgba(98, 0, 234, 0.3);
  transition: all 0.2s ease;
  color: white;
  border: none;
  cursor: pointer;
}

.create-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(98, 0, 234, 0.4);
}

.create-btn:disabled {
  background: linear-gradient(135deg, #9e9e9e 0%, #757575 100%);
  box-shadow: none;
  cursor: not-allowed;
}

.error-message {
  color: #ff4444;
  margin-top: 1rem;
  font-size: 0.9rem;
  text-align: center;
  background-color: rgba(255, 68, 68, 0.1);
  padding: 8px;
  border-radius: 8px;
  border-left: 3px solid #ff4444;
}
</style>