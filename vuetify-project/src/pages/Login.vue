<!-- src/pages/Login.vue -->
<template>
  <div>
    <form @submit.prevent="handleLogin">
      <input v-model="email" placeholder="Email" required type="email">
      <input v-model="password" placeholder="Password" required type="password">
      <button type="submit">Login</button>
    </form>
  </div>
</template>

  <script setup lang="ts">
  import { ref } from 'vue'
  import { useAuthStore } from '../stores/auth'

  const email = ref('cristian@gmail.com')
  const password = ref('123456')
  const authStore = useAuthStore()

  const handleLogin = async () => {
    await authStore.login(email.value, password.value)
  }
  </script>
