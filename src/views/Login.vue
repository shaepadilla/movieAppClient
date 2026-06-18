<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <h1 class="auth-title">Welcome back</h1>
      <p class="auth-subtitle">Sign in to your Reelz account</p>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label class="form-label">Email</label>
          <input
            type="email"
            class="form-control"
            placeholder="you@example.com"
            v-model="email"
            required
          />
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <input
            type="password"
            class="form-control"
            placeholder="Enter password"
            v-model="password"
            required
          />
        </div>

        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <div v-if="slowWarning" class="alert alert-info">
          The server is waking up — this can take up to 60 s on the free tier. Please wait…
        </div>

        <button type="submit" class="btn btn-primary btn-full" :disabled="loading">
          {{ loading ? 'Signing in…' : 'Login' }}
        </button>
      </form>

      <p class="auth-footer">
        Don't have an account? <router-link to="/register">Register</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { auth } from '../store/auth.js'
import { API } from '../config.js'
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const slowWarning = ref(false)

async function handleLogin() {
  error.value = ''
  slowWarning.value = false
  loading.value = true

  const wakeTimer = setTimeout(() => { slowWarning.value = true }, 4000)

  try {
    const res = await axios.post(`${API}/users/login`, {
      email: email.value,
      password: password.value
    }, { timeout: 60000 })

    const token = res.data.access || res.data.token
    const payload = JSON.parse(atob(token.split('.')[1]))
    auth.setAuth(token, payload.isAdmin)

    router.push('/')
  } catch (err) {
    if (err.code === 'ECONNABORTED') {
      error.value = 'Request timed out. The server may be unavailable — try again.'
    } else {
      error.value = err.response?.data?.message || 'Invalid email or password.'
    }
  } finally {
    clearTimeout(wakeTimer)
    loading.value = false
    slowWarning.value = false
  }
}
</script>
