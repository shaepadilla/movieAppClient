<template>
  <div class="auth-wrapper" style="align-items:flex-start;padding-top:48px;">
    <div class="auth-card" style="max-width:520px;">
      <h1 class="auth-title">Update Movie</h1>
      <p class="auth-subtitle">Edit movie details</p>

      <div v-if="fetching" class="loading">Loading...</div>

      <form v-else @submit.prevent="handleSubmit">
        <div class="form-group">
          <label class="form-label">Title</label>
          <input type="text" class="form-control" v-model="form.title" required />
        </div>
        <div class="form-group">
          <label class="form-label">Director</label>
          <input type="text" class="form-control" v-model="form.director" required />
        </div>
        <div class="form-group">
          <label class="form-label">Year</label>
          <input type="number" class="form-control" v-model="form.year" required />
        </div>
        <div class="form-group">
          <label class="form-label">Genre</label>
          <input type="text" class="form-control" v-model="form.genre" required />
        </div>
        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea
            class="form-control"
            v-model="form.description"
            rows="4"
            required
            style="resize:vertical;"
          ></textarea>
        </div>

        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <div v-if="success" class="alert alert-success">{{ success }}</div>

        <div style="display:flex;gap:10px;">
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Updating...' : 'Update' }}
          </button>
          <router-link to="/movies" class="btn btn-secondary">Cancel</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { auth } from '../store/auth.js'
import { API } from '../config.js'
const route = useRoute()
const router = useRouter()

const form = ref({ title: '', director: '', year: '', genre: '', description: '' })
const fetching = ref(true)
const loading = ref(false)
const error = ref('')
const success = ref('')

onMounted(async () => {
  try {
    const res = await axios.get(`${API}/movies/getMovie/${route.params.id}`)
    const m = res.data.movie || res.data
    form.value = {
      title: m.title,
      director: m.director,
      year: m.year,
      genre: m.genre,
      description: m.description
    }
  } catch {
    error.value = 'Failed to load movie.'
  } finally {
    fetching.value = false
  }
})

async function handleSubmit() {
  error.value = ''
  success.value = ''
  loading.value = true

  try {
    await axios.patch(`${API}/movies/updateMovie/${route.params.id}`, {
      ...form.value,
      year: Number(form.value.year)
    }, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    success.value = 'Movie updated! Redirecting...'
    setTimeout(() => router.push('/movies'), 1200)
  } catch (err) {
    error.value = err.response?.data?.message || 'Update failed.'
  } finally {
    loading.value = false
  }
}
</script>
