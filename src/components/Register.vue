<template>
  <div class="register-container">
    <h1>Register</h1>
    <form class="register-form" @submit.prevent="handleRegister">
      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" v-model="form.email" type="email" placeholder="Enter your email" :disabled="isLoading"
          aria-required="true" autocomplete="email" />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input id="password" v-model="form.password" type="password" placeholder="Enter your password"
          :disabled="isLoading" aria-required="true" minlength="8" autocomplete="new-password" />
      </div>

      <div class="form-group">
        <label for="fullName">Full Name</label>
        <input id="fullName" v-model="form.fullName" type="text" placeholder="Enter your full name"
          :disabled="isLoading" aria-required="true" autocomplete="name" />
      </div>

      <button type="submit" :disabled="isLoading || !isFormValid">
        {{ isLoading ? 'Registering...' : 'Register' }}
      </button>

      <p>Or Login <router-link to="/login">Here</router-link></p>
      <p v-if="error" class="error-message">{{ error }}</p>
    </form>
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
  flex-direction: column;
  align-items: center;
  padding-top: 3rem;
}

.register-form {
  width: 100%;
  max-width: 400px;
  padding: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 0.8rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: #ff4444;
  margin-top: 1rem;
  font-size: 0.9rem;
}
</style>