<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <h1 class="auth-title">Create account</h1>
      <p class="auth-subtitle">Join Reelz and start exploring movies</p>

      <form @submit.prevent="handleRegister">
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
        <div class="form-group">
          <label class="form-label">Confirm Password</label>
          <input
            type="password"
            class="form-control"
            placeholder="Confirm your password"
            v-model="confirmPassword"
            required
          />
        </div>

        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <div v-if="success" class="alert alert-success">{{ success }}</div>
        <div v-if="slowWarning" class="alert alert-info">
          The server is waking up — this can take up to 60 s on the free tier. Please wait…
        </div>

        <button type="submit" class="btn btn-primary btn-full" :disabled="loading">
          {{ loading ? 'Creating account…' : 'Register' }}
        </button>
      </form>

      <p class="auth-footer">
        Already have an account? <router-link to="/login">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { API } from '../config.js'
const router = useRouter()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)
const slowWarning = ref(false)

async function handleRegister() {
  error.value = ''
  success.value = ''
  slowWarning.value = false

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match.'
    return
  }

  loading.value = true

  // Show "waking up" hint if the server takes more than 4 s (Render free-tier cold start)
  const wakeTimer = setTimeout(() => { slowWarning.value = true }, 4000)

  try {
    await axios.post(`${API}/users/register`, {
      email: email.value,
      password: password.value
    }, { timeout: 60000 })
    success.value = 'Account created! Redirecting to login...'
    setTimeout(() => router.push('/login'), 1500)
  } catch (err) {
    if (err.code === 'ECONNABORTED') {
      error.value = 'Request timed out. The server may be unavailable — try again.'
    } else {
      error.value = err.response?.data?.message || 'Registration failed. Please try again.'
    }
  } finally {
    clearTimeout(wakeTimer)
    loading.value = false
    slowWarning.value = false
  }
}
</script>
