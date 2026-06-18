<template>
  <div class="movies-page">

    <!-- ── Page Header ───────────────────────────────────────── -->
    <div class="movies-page-header">
      <div>
        <h1 class="movies-heading">Movies</h1>
        <p class="movies-subheading">10,000+ films, updated weekly</p>
      </div>
      <div v-if="auth.isAdmin" class="admin-header-actions">
        <button class="btn-dash-toggle" @click="dashMode = !dashMode">
          <svg v-if="!dashMode" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
          <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
          {{ dashMode ? 'Browse View' : 'Dashboard' }}
        </button>
        <router-link to="/addMovie" class="btn-add-movie">+ Add Movie</router-link>
      </div>
    </div>

    <!-- ── Admin Dashboard Table ─────────────────────────────── -->
    <template v-if="auth.isAdmin && dashMode">
      <div class="dash-section">
        <div v-if="loading" class="state-msg">Loading movies…</div>
        <div v-else-if="apiMovies.length === 0" class="state-msg">No movies found.</div>
        <div v-else class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Title</th><th>Director</th><th>Year</th><th>Genre</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="m in apiMovies" :key="m._id">
                <td>{{ m.title }}</td>
                <td>{{ m.director }}</td>
                <td>{{ m.year }}</td>
                <td>{{ m.genre }}</td>
                <td>
                  <div class="action-group">
                    <router-link :to="`/movies/${m._id}/edit`" class="btn btn-warning btn-sm">Update</router-link>
                    <button class="btn btn-danger btn-sm" @click="deleteMovie(m._id)">Delete</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="deleteError" class="err-banner">{{ deleteError }}</div>
      </div>
    </template>

    <!-- ── Browse View ────────────────────────────────────────── -->
    <template v-else>

      <!-- Filter bar (sticky) -->
      <div class="filter-bar">
        <div class="filter-bar-inner">
          <div class="filter-selects">

            <div class="filter-group" :class="{ 'filter-active': filters.genre }">
              <span class="filter-label">Genre</span>
              <div class="select-wrap">
                <select v-model="filters.genre">
                  <option value="">All</option>
                  <option v-for="g in genreOptions" :key="g" :value="g">{{ g }}</option>
                </select>
                <svg class="select-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>

            <div class="filter-group" :class="{ 'filter-active': filters.year }">
              <span class="filter-label">Year</span>
              <div class="select-wrap">
                <select v-model="filters.year">
                  <option value="">All</option>
                  <option v-for="y in yearOptions" :key="y.value" :value="y.value">{{ y.label }}</option>
                </select>
                <svg class="select-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>

            <div class="filter-group" :class="{ 'filter-active': filters.rating }">
              <span class="filter-label">Rating</span>
              <div class="select-wrap">
                <select v-model="filters.rating">
                  <option value="">All</option>
                  <option value="9">⭐ 9+</option>
                  <option value="8">⭐ 8+</option>
                  <option value="7">⭐ 7+</option>
                </select>
                <svg class="select-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>

            <div class="filter-group">
              <span class="filter-label">Sort by</span>
              <div class="select-wrap">
                <select v-model="filters.sort">
                  <option value="trending">Trending</option>
                  <option value="newest">Newest</option>
                  <option value="top">Top Rated</option>
                  <option value="az">A–Z</option>
                </select>
                <svg class="select-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>

          </div>

          <!-- View toggle -->
          <div class="view-toggle">
            <button class="view-btn" :class="{ active: gridView === 'grid' }" @click="gridView = 'grid'" title="Grid view">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            </button>
            <button class="view-btn" :class="{ active: gridView === 'list' }" @click="gridView = 'list'" title="List view">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            </button>
          </div>
        </div>

        <!-- Active filter pills -->
        <div class="active-pills-row" v-if="activePills.length">
          <button
            class="active-filter-pill"
            v-for="p in activePills"
            :key="p.key"
            @click="clearFilter(p.key)"
          >{{ p.label }}<span class="pill-x">×</span></button>
          <button class="clear-all" @click="clearAll">Clear all</button>
        </div>
      </div>

      <!-- Movie grid / list -->
      <div v-if="loading" class="state-msg loading-msg">
        <span class="dot-pulse"><span /><span /><span /></span>
      </div>
      <div v-else-if="visibleFilms.length === 0" class="state-msg">No movies match your filters.</div>

      <div v-else :class="gridView === 'grid' ? 'poster-grid' : 'poster-list'">
        <div
          class="poster-card"
          v-for="film in visibleFilms"
          :key="film.id"
          :class="{ 'poster-card-list': gridView === 'list' }"
        >
          <!-- Poster image -->
          <div class="poster-wrap" :class="{ 'poster-wrap-list': gridView === 'list' }">
            <div class="poster-img" :style="{ background: film.gradient }">
              <img v-if="film.poster" class="poster-img-cover" :src="film.poster" :alt="film.title">
              <!-- Hover overlay -->
              <div class="poster-overlay">
                <component
                  :is="film._id ? 'router-link' : 'button'"
                  v-bind="film._id ? { to: `/movies/${film._id}` } : {}"
                  class="play-lg"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
                </component>
                <button class="mylist-overlay" @click.prevent="addToList(film)">
                  {{ watchlist.has(film._id) ? '✓ In My List' : '+ My List' }}
                </button>
                <!-- Admin actions on overlay -->
                <div v-if="auth.isAdmin && film._id" class="admin-card-actions">
                  <router-link :to="`/movies/${film._id}/edit`" class="card-admin-btn update">Update</router-link>
                  <button class="card-admin-btn delete" @click.prevent="deleteMovie(film._id)">Delete</button>
                </div>
              </div>
              <!-- Genre label on poster -->
              <span class="poster-genre-tag">{{ film.genre }}</span>
            </div>
          </div>

          <!-- Meta (grid) -->
          <div class="poster-meta" v-if="gridView === 'grid'">
            <p class="poster-title-txt">{{ film.title }}</p>
            <p class="poster-caption-txt">⭐ {{ film.rating }} · {{ film.year }}</p>
          </div>

          <!-- Meta (list) -->
          <div class="list-meta" v-else>
            <p class="list-title">{{ film.title }}</p>
            <p class="list-director" v-if="film.director">Directed by {{ film.director }}</p>
            <div class="list-tags">
              <span class="badge badge-genre">{{ film.genre }}</span>
              <span class="badge badge-year">{{ film.year }}</span>
              <span class="badge-rating">⭐ {{ film.rating }}</span>
            </div>
            <p class="list-desc" v-if="film.description">{{ film.description }}</p>
            <div class="list-actions">
              <component
                :is="film._id ? 'router-link' : 'button'"
                v-bind="film._id ? { to: `/movies/${film._id}` } : {}"
                class="btn btn-primary btn-sm"
              >▶ Watch</component>
              <button class="btn btn-secondary btn-sm" @click="addToList(film)">
                {{ watchlist.has(film._id) ? '✓ In My List' : '+ My List' }}
              </button>
              <template v-if="auth.isAdmin && film._id">
                <router-link :to="`/movies/${film._id}/edit`" class="btn btn-warning btn-sm">Update</router-link>
                <button class="btn btn-danger btn-sm" @click="deleteMovie(film._id)">Delete</button>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- Load More -->
      <div class="load-more-row" v-if="canLoadMore && !loading">
        <button class="btn-load-more" @click="loadMore" :disabled="loadingMore">
          <span v-if="loadingMore" class="dot-pulse"><span /><span /><span /></span>
          <span v-else>Load More</span>
        </button>
      </div>

      <div v-if="deleteError" class="err-banner">{{ deleteError }}</div>
    </template>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import axios from 'axios'
import { auth } from '../store/auth.js'
import { API } from '../config.js'
import { useWatchlistStore } from '../stores/watchlist.js'
import { useToast } from '../composables/useToast.js'

const watchlist = useWatchlistStore()
const { success, info } = useToast()

/* ── State ───────────────────────────────────────────────────── */
const apiMovies = ref([])
const loading = ref(true)
const loadingMore = ref(false)
const deleteError = ref('')
const dashMode = ref(false)
const gridView = ref('grid')
const displayLimit = ref(10)

/* ── Filters ─────────────────────────────────────────────────── */
const filters = reactive({ genre: '', year: '', rating: '', sort: 'trending' })

const genreOptions = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller', 'Romance', 'Animation', 'Documentary']
const yearOptions = [
  { label: '2026', value: '2026' },
  { label: '2025', value: '2025' },
  { label: '2024', value: '2024' },
  { label: '2020–2023', value: '2020-2023' },
  { label: 'Before 2020', value: 'before2020' }
]

const activePills = computed(() => {
  const pills = []
  if (filters.genre) pills.push({ key: 'genre', label: filters.genre })
  if (filters.year) {
    const y = yearOptions.find(o => o.value === filters.year)
    pills.push({ key: 'year', label: y ? y.label : filters.year })
  }
  if (filters.rating) pills.push({ key: 'rating', label: `⭐ ${filters.rating}+` })
  return pills
})

function clearFilter(key) { filters[key] = '' }
function clearAll() { filters.genre = ''; filters.year = ''; filters.rating = '' }

/* Gradient palette for API movies */
const palette = [
  'linear-gradient(175deg,#14093a,#2e1560,#08041a)',
  'linear-gradient(175deg,#3a0e0e,#5e1812,#1c0808)',
  'linear-gradient(175deg,#0c1428,#162242,#07090f)',
  'linear-gradient(175deg,#0c2814,#163820,#070f09)',
  'linear-gradient(175deg,#281408,#3c1e0c,#100a04)',
  'linear-gradient(175deg,#0a0828,#130e40,#05040e)',
  'linear-gradient(175deg,#0c1830,#142438,#07090f)',
  'linear-gradient(175deg,#0e0808,#1c0c0c,#070404)',
  'linear-gradient(175deg,#180e28,#261838,#0c0814)',
  'linear-gradient(175deg,#1e1808,#2a2210,#0e0c04)',
]

const posterMap = {
  'colombiana': '/posters/Colombiana.png',
  'parasite':   '/posters/Parasite.png',
  'arrietty': '/posters/Arrietty.png',
  'disaster-movie': '/posters/Disastermovie.png',
  'obsession': '/posters/Obsession.png',
}

function getPoster(title) {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
  return posterMap[slug] ?? null
}

/* ── Film list from API ───────────────────────────────────────── */
const allFilms = computed(() =>
  apiMovies.value.map((m, i) => ({
    id: m._id,
    _id: m._id,
    title: m.title,
    genre: m.genre,
    year: m.year,
    rating: m.rating ?? '—',
    director: m.director,
    description: m.description,
    gradient: palette[i % palette.length],
    poster: getPoster(m.title)
  }))
)

/* ── Filtered + sorted ───────────────────────────────────────── */
const filteredFilms = computed(() => {
  let list = [...allFilms.value]

  if (filters.genre) list = list.filter(f => f.genre === filters.genre)

  if (filters.year) {
    if (filters.year === 'before2020') {
      list = list.filter(f => Number(f.year) < 2020)
    } else if (filters.year.includes('-')) {
      const [lo, hi] = filters.year.split('-').map(Number)
      list = list.filter(f => Number(f.year) >= lo && Number(f.year) <= hi)
    } else {
      list = list.filter(f => String(f.year) === filters.year)
    }
  }

  if (filters.rating) {
    const min = Number(filters.rating)
    list = list.filter(f => Number(f.rating) >= min)
  }

  if (filters.sort === 'newest')  list.sort((a, b) => b.year - a.year)
  if (filters.sort === 'top')     list.sort((a, b) => b.rating - a.rating)
  if (filters.sort === 'az')      list.sort((a, b) => a.title.localeCompare(b.title))

  return list
})

const visibleFilms = computed(() => filteredFilms.value.slice(0, displayLimit.value))
const canLoadMore  = computed(() => filteredFilms.value.length > displayLimit.value)

function loadMore() {
  loadingMore.value = true
  setTimeout(() => {
    displayLimit.value += 10
    loadingMore.value = false
  }, 600)
}

/* ── API calls ───────────────────────────────────────────────── */
async function fetchMovies() {
  loading.value = true
  try {
    const res = await axios.get(`${API}/movies/getMovies`)
    apiMovies.value = res.data.movies || res.data || []
  } catch {
    apiMovies.value = []
  } finally {
    loading.value = false
  }
}

function addToList(film) {
  const added = watchlist.add({
    id:       film._id,
    title:    film.title,
    type:     'movie',
    genre:    film.genre,
    year:     film.year,
    rating:   film.rating,
    gradient: film.gradient,
  })
  added ? success(`"${film.title}" added to My List`) : info(`"${film.title}" is already in your list`)
}

async function deleteMovie(id) {
  if (!confirm('Delete this movie?')) return
  deleteError.value = ''
  try {
    await axios.delete(`${API}/movies/deleteMovie/${id}`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    apiMovies.value = apiMovies.value.filter(m => m._id !== id)
  } catch (err) {
    deleteError.value = err.response?.data?.message || 'Delete failed.'
  }
}

onMounted(fetchMovies)
</script>

<style scoped>
/* ── Page ────────────────────────────────────────────────────── */
.movies-page {
  min-height: 100vh;
  background: var(--bg-primary);
  padding-bottom: 60px;
}

/* ── Header ──────────────────────────────────────────────────── */
.movies-page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 36px 48px 28px;
}

.movies-heading {
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -0.5px;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.movies-subheading {
  font-size: 13px;
  color: var(--text-muted);
}

.admin-header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.btn-dash-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-medium);
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  padding: 7px 14px;
  border-radius: var(--radius-btn);
  cursor: pointer;
  transition: color 0.15s, background 0.15s;
}
.btn-dash-toggle:hover { color: var(--text-primary); background: #2a2a2f; }

.btn-add-movie {
  display: inline-flex;
  align-items: center;
  background: var(--accent-red);
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  padding: 7px 14px;
  border-radius: var(--radius-btn);
  transition: background 0.15s;
}
.btn-add-movie:hover { background: var(--accent-red-hover); }

/* ── Admin table ─────────────────────────────────────────────── */
.dash-section {
  padding: 0 48px 32px;
}

.state-msg {
  text-align: center;
  padding: 48px 24px;
  color: var(--text-muted);
  font-size: 14px;
}

.err-banner {
  background: rgba(226,75,74,0.1);
  border: 1px solid rgba(226,75,74,0.25);
  color: #ff7b7a;
  font-size: 13px;
  padding: 10px 16px;
  border-radius: var(--radius-btn);
  margin: 16px 48px;
}

/* ── Filter bar ──────────────────────────────────────────────── */
.filter-bar {
  position: sticky;
  top: 60px;
  z-index: 90;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-subtle);
  padding: 14px 48px 0;
}

.filter-bar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 14px;
}

.filter-selects {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* Individual filter group */
.filter-group {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-btn);
  padding: 6px 10px 6px 12px;
  transition: border-color 0.15s;
}

.filter-group.filter-active {
  border-color: var(--accent-red);
}

.filter-label {
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 500;
  white-space: nowrap;
}

.select-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.select-wrap select {
  appearance: none;
  -webkit-appearance: none;
  background: none;
  border: none;
  color: var(--text-primary);
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  padding-right: 18px;
  min-width: 70px;
}

.select-wrap select option {
  background: var(--bg-elevated);
  color: var(--text-primary);
}

.select-chevron {
  position: absolute;
  right: 0;
  color: var(--text-muted);
  pointer-events: none;
}

/* View toggle */
.view-toggle {
  display: flex;
  gap: 2px;
  flex-shrink: 0;
}

.view-btn {
  background: none;
  border: 1px solid var(--border-medium);
  color: var(--text-muted);
  width: 34px;
  height: 34px;
  border-radius: var(--radius-btn);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s, background 0.15s, border-color 0.15s;
}
.view-btn:hover { color: var(--text-primary); }
.view-btn.active { color: var(--text-primary); background: var(--bg-elevated); border-color: var(--border-medium); }

/* Active filter pills row */
.active-pills-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 12px;
  flex-wrap: wrap;
}

.active-filter-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(226,75,74,0.12);
  border: 1px solid rgba(226,75,74,0.3);
  color: var(--accent-red);
  font-size: 12px;
  font-weight: 500;
  font-family: inherit;
  padding: 4px 10px;
  border-radius: var(--radius-pill);
  cursor: pointer;
  transition: background 0.15s;
}
.active-filter-pill:hover { background: rgba(226,75,74,0.2); }

.pill-x {
  font-size: 14px;
  line-height: 1;
  opacity: 0.7;
}

.clear-all {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 12px;
  font-family: inherit;
  cursor: pointer;
  padding: 4px 8px;
  transition: color 0.15s;
}
.clear-all:hover { color: var(--text-primary); }

/* ── Poster grid ─────────────────────────────────────────────── */
.poster-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  padding: 28px 48px;
}

.poster-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 28px 48px;
}

/* ── Poster card ─────────────────────────────────────────────── */
.poster-card {
  cursor: pointer;
}

.poster-card-list {
  display: flex;
  gap: 16px;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-card);
  overflow: hidden;
  transition: border-color 0.15s;
}
.poster-card-list:hover { border-color: var(--border-medium); }

.poster-wrap {
  position: relative;
}

.poster-wrap-list {
  flex-shrink: 0;
  width: 100px;
}

.poster-img {
  width: 100%;
  aspect-ratio: 2 / 3;
  border-radius: var(--radius-card);
  position: relative;
  overflow: hidden;
  transition: transform 0.2s;
}

.poster-img-cover {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

.poster-overlay, .poster-genre-tag { z-index: 1; }

.poster-card:not(.poster-card-list):hover .poster-img {
  transform: scale(1.02);
}

.poster-wrap-list .poster-img {
  aspect-ratio: 2 / 3;
  border-radius: 0;
}

/* Genre tag on poster */
.poster-genre-tag {
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: rgba(0,0,0,0.7);
  color: rgba(255,255,255,0.7);
  font-size: 10px;
  font-weight: 500;
  padding: 2px 7px;
  border-radius: var(--radius-pill);
  backdrop-filter: blur(4px);
}

/* Hover overlay */
.poster-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.55);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s;
  border-radius: var(--radius-card);
}

.poster-img:hover .poster-overlay { opacity: 1; }

.play-lg {
  width: 48px;
  height: 48px;
  border-radius: 999px;
  background: rgba(255,255,255,0.15);
  border: 1.5px solid rgba(255,255,255,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  padding-left: 2px;
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition: transform 0.15s, background 0.15s;
  text-decoration: none;
}
.play-lg:hover { transform: scale(1.1); background: rgba(255,255,255,0.25); }

.mylist-overlay {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.35);
  color: #fff;
  font-size: 11px;
  font-weight: 500;
  font-family: inherit;
  padding: 5px 12px;
  border-radius: var(--radius-pill);
  cursor: pointer;
  backdrop-filter: blur(4px);
}

.admin-card-actions {
  display: flex;
  gap: 6px;
  margin-top: 4px;
}

.card-admin-btn {
  font-size: 11px;
  font-weight: 500;
  font-family: inherit;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  border: none;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}
.card-admin-btn.update { background: rgba(239,159,39,0.2); color: var(--accent-amber); border: 1px solid rgba(239,159,39,0.35); }
.card-admin-btn.delete { background: rgba(226,75,74,0.2); color: #ff7b7a; border: 1px solid rgba(226,75,74,0.35); }

/* Poster meta */
.poster-meta {
  padding: 8px 2px 0;
}

.poster-title-txt {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 3px;
}

.poster-caption-txt {
  font-size: 12px;
  color: var(--text-muted);
}

/* ── List meta ───────────────────────────────────────────────── */
.list-meta {
  flex: 1;
  padding: 16px 16px 16px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.list-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

.list-director {
  font-size: 12px;
  color: var(--text-muted);
}

.list-tags {
  display: flex;
  gap: 6px;
  align-items: center;
  flex-wrap: wrap;
}

.badge {
  font-size: 11px;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: var(--radius-pill);
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.badge-genre {
  background: rgba(226,75,74,0.12);
  border: 1px solid rgba(226,75,74,0.25);
  color: var(--accent-red);
}

.badge-year {
  background: var(--bg-elevated);
  border: 1px solid var(--border-medium);
  color: var(--text-secondary);
}

.badge-rating {
  font-size: 12px;
  color: var(--accent-amber);
}

.list-desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.list-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 4px;
}

/* ── Load more ───────────────────────────────────────────────── */
.load-more-row {
  display: flex;
  justify-content: center;
  padding: 8px 0 40px;
}

.btn-load-more {
  background: none;
  border: 1px solid var(--border-medium);
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  padding: 10px 32px;
  border-radius: var(--radius-btn);
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s, background 0.15s;
  min-width: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-load-more:hover { color: var(--text-primary); border-color: var(--border-medium); background: var(--bg-elevated); }
.btn-load-more:disabled { opacity: 0.5; cursor: default; }

/* 3-dot loading pulse */
.loading-msg { display: flex; justify-content: center; }

.dot-pulse {
  display: inline-flex;
  gap: 4px;
  align-items: center;
}
.dot-pulse span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-red);
  animation: pulse 1.2s infinite ease-in-out;
}
.dot-pulse span:nth-child(2) { animation-delay: 0.2s; }
.dot-pulse span:nth-child(3) { animation-delay: 0.4s; }

@keyframes pulse {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40%           { transform: scale(1);   opacity: 1; }
}

/* ── Responsive ──────────────────────────────────────────────── */
@media (max-width: 1024px) {
  .movies-page-header { padding: 28px 24px 20px; }
  .filter-bar { padding: 12px 24px 0; }
  .poster-grid { grid-template-columns: repeat(3, 1fr); padding: 24px; }
  .poster-list { padding: 16px 24px; }
  .dash-section { padding: 0 24px 32px; }
  .err-banner { margin: 16px 24px; }
}

@media (max-width: 640px) {
  .movies-page-header { padding: 20px 16px 16px; flex-direction: column; align-items: flex-start; gap: 12px; }
  .filter-bar { padding: 10px 16px 0; top: 60px; }
  .filter-selects { gap: 6px; }
  .filter-group { padding: 5px 8px 5px 10px; }
  .filter-label { display: none; }
  .poster-grid { grid-template-columns: repeat(2, 1fr); padding: 16px; gap: 12px; }
  .poster-list { padding: 12px 16px; }
  .dash-section { padding: 0 16px 24px; }
}
</style>
