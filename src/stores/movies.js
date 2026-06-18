import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { API } from '../config.js'

export const useMoviesStore = defineStore('movies', () => {
  const movies  = ref([])
  const loading = ref(false)
  const error   = ref(null)

  async function fetchMovies() {
    loading.value = true
    error.value   = null
    try {
      const { data } = await axios.get(`${API}/movies/getMovies`)
      movies.value = data.movies || []
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function fetchMovie(id) {
    const { data } = await axios.get(`${API}/movies/getMovie/${id}`)
    return data.movie
  }

  async function addMovie(payload, token) {
    const { data } = await axios.post(`${API}/movies/addMovie`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return data
  }

  async function updateMovie(id, payload, token) {
    const { data } = await axios.patch(`${API}/movies/updateMovie/${id}`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return data
  }

  async function deleteMovie(id, token) {
    const { data } = await axios.delete(`${API}/movies/deleteMovie/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    await fetchMovies()
    return data
  }

  async function addComment(id, comment, token) {
    const { data } = await axios.post(`${API}/movies/addComment/${id}`, { comment }, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return data
  }

  const getById = computed(() => id => movies.value.find(m => m._id === id))

  return {
    movies, loading, error,
    fetchMovies, fetchMovie, addMovie, updateMovie, deleteMovie, addComment,
    getById,
  }
})
