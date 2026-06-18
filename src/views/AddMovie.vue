<template>
  <div class="auth-wrapper" style="align-items:flex-start;padding-top:48px;">
    <div class="auth-card" style="max-width:520px;">
      <h1 class="auth-title">Add Movie</h1>
      <p class="auth-subtitle">Add a new movie to the catalog</p>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label class="form-label">Title</label>
          <input type="text" class="form-control" placeholder="Movie title" v-model="form.title" required />
        </div>
        <div class="form-group">
          <label class="form-label">Director</label>
          <input type="text" class="form-control" placeholder="Director name" v-model="form.director" required />
        </div>
        <div class="form-group">
          <label class="form-label">Year</label>
          <input type="number" class="form-control" placeholder="Release year" v-model="form.year" required />
        </div>
        <div class="form-group">
          <label class="form-label">Genre</label>
          <input type="text" class="form-control" placeholder="e.g. Action, Drama" v-model="form.genre" required />
        </div>
        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea
            class="form-control"
            placeholder="Movie description"
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
            {{ loading ? 'Adding...' : 'Add Movie' }}
          </button>
          <router-link to="/movies" class="btn btn-secondary">Cancel</router-link>
        </div>
      </form>
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

const form = ref({ title: '', director: '', year: '', genre: '', description: '' })
const error = ref('')
const success = ref('')
const loading = ref(false)

async function handleSubmit() {
  error.value = ''
  success.value = ''
  loading.value = true

  try {
    await axios.post(`${API}/movies/addMovie`, {
      ...form.value,
      year: Number(form.value.year)
    }, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    success.value = 'Movie added successfully! Redirecting...'
    setTimeout(() => router.push('/movies'), 1200)
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to add movie.'
  } finally {
    loading.value = false
  }
}
</script>
