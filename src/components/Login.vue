<template>
  <div id="reg">
    <h1>Login</h1>
    <form id="col" @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" required autocomplete="email" />
      <input v-model="password" type="password" placeholder="Password" required autocomplete="current-password" />
      <button type="submit">Login</button>
      <p v-if="error">{{ error }}</p>
    </form>

    <p>Or Register <router-link to="/register">Here </router-link></p>
  </div>


</template>

<script setup>
import { ref } from 'vue';
import { loginUser } from '../auth';  // Adjust the path as necessary
import { useRouter } from 'vue-router';
const router = useRouter();
const email = ref('');
const password = ref('');
const error = ref('');


const login = async () => {
  try {
    await loginUser(email.value, password.value);
    router.push('/home');  // Redirect to dashboard
  } catch (err) {
    error.value = err.message;
  }
};
</script>

<style>
#reg {
  display: flex;
  /* margin-bottom: 28rem; */
  /* display: block; */
  /* border-block: initial; */
  flex-direction: column;
  flex-wrap: nowrap;
  align-content: center;
  justify-content: flex-end;
  align-items: center;
  padding-top: 3rem;
}

#col>input {

  padding: .6rem;
  display: flex;


}
</style>
