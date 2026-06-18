<template>
  <div class="home-page">

    <!-- ── Hero ─────────────────────────────────────────────── -->
    <section class="hero" :style="{ background: film.backdropGradient }">
      <div class="hero-overlay" />

      <div class="hero-inner">
        <!-- Left -->
        <div class="hero-left">
          <div class="hero-badge">{{ film.badge }}</div>

          <h1 class="hero-title">{{ film.title }}</h1>

          <div class="hero-meta-row">
            <span class="hero-rating">⭐ {{ film.rating }}</span>
            <span class="meta-sep">·</span>
            <span>{{ film.year }}</span>
            <template v-if="film.duration">
              <span class="meta-sep">·</span>
              <span>{{ film.duration }}</span>
            </template>
            <span v-if="film.quality" class="quality-tag">{{ film.quality }}</span>
          </div>

          <div class="hero-genres">
            <span class="genre-pill-outline" v-for="g in film.genres" :key="g">{{ g }}</span>
          </div>

          <p class="hero-desc">{{ film.description }}</p>

          <div class="hero-btns">
            <button class="btn-watch">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="margin-right:6px"><polygon points="5,3 19,12 5,21"/></svg>
              Watch Now
            </button>
            <button class="btn-mylist" @click="router.push('/my-list')">+ My List</button>
          </div>
        </div>

        <!-- Right — poster card -->
        <div class="hero-right">
          <div class="poster-card" :style="{ background: film.posterGradient }">
            <img v-if="film.poster" class="hero-poster-img" :src="film.poster" :alt="film.title">
            <div class="poster-shine" />
            <p class="poster-title-text">{{ film.title }}</p>
            <p class="poster-year-text">{{ film.year }}</p>
          </div>
        </div>
      </div>

      <!-- Carousel dots -->
      <div class="carousel-dots">
        <button
          v-for="(_, i) in heroFilms"
          :key="i"
          class="dot-btn"
          :class="{ active: i === heroIdx }"
          @click="jumpTo(i)"
        />
      </div>
    </section>

    <!-- ── Genre Filter ───────────────────────────────────────── -->
    <section class="genre-filter-row">
      <div class="genre-scroll-track">
        <button
          v-for="g in genres"
          :key="g"
          class="genre-filter-pill"
          :class="{ active: g === activeGenre }"
          @click="activeGenre = g"
        >{{ g }}</button>
      </div>
    </section>

    <!-- ── Top Picks ─────────────────────────────────────────── -->
    <section class="content-section">
      <h2 class="section-title">Top Picks For You</h2>
      <div class="card-scroll-row">
        <div
          class="hcard"
          v-for="(m, i) in topPicks"
          :key="m.title"
        >
          <div class="hcard-thumb" :style="{ background: m.gradient }">
            <img v-if="m.poster" class="hcard-img-cover" :src="m.poster" :alt="m.title">
            <span class="rank-badge">{{ i + 1 }}</span>
            <div class="thumb-overlay">
              <div class="play-circle">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
              </div>
            </div>
          </div>
          <div class="hcard-info">
            <p class="hcard-title">{{ m.title }}</p>
            <p class="hcard-caption">{{ m.genre }} · {{ m.year }} · ⭐ {{ m.rating }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Continue Watching ─────────────────────────────────── -->
    <section class="content-section">
      <h2 class="section-title">Continue Watching</h2>
      <div class="card-scroll-row">
        <div
          class="hcard"
          v-for="m in continueWatching"
          :key="m.title"
        >
          <div class="hcard-thumb" :style="{ background: m.gradient }">
            <div class="thumb-overlay">
              <button class="resume-btn">Resume</button>
            </div>
            <div class="progress-track">
              <div class="progress-fill" :style="{ width: m.progress + '%' }" />
            </div>
          </div>
          <div class="hcard-info">
            <p class="hcard-title">{{ m.title }}</p>
            <p class="hcard-caption">{{ m.subtitle }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── New Releases ──────────────────────────────────────── -->
    <section class="content-section">
      <h2 class="section-title">New Releases This Week</h2>
      <div class="card-scroll-row">
        <div
          class="hcard"
          v-for="m in newReleases"
          :key="m.title"
        >
          <div class="hcard-thumb" :style="{ background: m.gradient }">
            <img v-if="m.poster" class="hcard-img-cover" :src="m.poster" :alt="m.title">
            <span class="new-badge">NEW</span>
            <div class="thumb-overlay">
              <div class="play-circle">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
              </div>
            </div>
          </div>
          <div class="hcard-info">
            <p class="hcard-title">{{ m.title }}</p>
            <p class="hcard-caption">{{ m.genre }} · {{ m.year }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Because You Watched ───────────────────────────────── -->
    <section class="content-section">
      <div class="section-header-group">
        <h2 class="section-title">Because You Watched Interstellar</h2>
        <p class="section-subtitle">Space &amp; Sci-Fi picks</p>
      </div>
      <div class="card-scroll-row">
        <div
          class="hcard"
          v-for="m in scifiPicks"
          :key="m.title"
        >
          <div class="hcard-thumb" :style="{ background: m.gradient }">
            <div class="thumb-overlay">
              <div class="play-circle">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
              </div>
            </div>
          </div>
          <div class="hcard-info">
            <p class="hcard-title">{{ m.title }}</p>
            <p class="hcard-caption">{{ m.genre }} · {{ m.year }} · ⭐ {{ m.rating }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Footer ────────────────────────────────────────────── -->
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-top">
          <span class="footer-logo">▶ Reelz</span>
          <nav class="footer-links">
            <a href="#">About</a>
            <a href="#">Help</a>
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
            <a href="#">Careers</a>
          </nav>
          <div class="footer-social">
            <a href="#" class="social-icon" aria-label="Twitter/X">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#" class="social-icon" aria-label="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="#" class="social-icon" aria-label="YouTube">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#0d0d0f"/></svg>
            </a>
          </div>
        </div>
        <div class="footer-bottom">
          <p class="footer-copy">© 2026 Reelz Inc.</p>
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { API } from '../config.js'

const router = useRouter()

/* ── API state ───────────────────────────────────────────────── */
const apiMovies = ref([])

/* ── Gradient palettes ───────────────────────────────────────── */
const heroPalette = [
  { bg: 'linear-gradient(135deg,#07051a,#160e38,#040210)', poster: 'linear-gradient(160deg,#2a1560,#4a20a0,#1a0d50)' },
  { bg: 'linear-gradient(135deg,#060c16,#0c1828,#030609)', poster: 'linear-gradient(160deg,#0d1a38,#1a2e58,#080f20)' },
  { bg: 'linear-gradient(135deg,#180806,#2e1208,#0e0504)', poster: 'linear-gradient(160deg,#3a1008,#6a2010,#280a06)' },
]

const cardPalette = [
  'linear-gradient(145deg,#0d1c32,#1a3050)',
  'linear-gradient(145deg,#0d2a1a,#1a3a28)',
  'linear-gradient(145deg,#2a0e0e,#3c1812)',
  'linear-gradient(145deg,#1a0d2a,#2c1a3c)',
  'linear-gradient(145deg,#0d1a3c,#182840)',
  'linear-gradient(145deg,#0d0d0e,#1a0d12)',
  'linear-gradient(145deg,#1c1608,#2c2212)',
  'linear-gradient(145deg,#0c0a28,#181040)',
  'linear-gradient(145deg,#08101e,#101830)',
  'linear-gradient(145deg,#1c1208,#2c1e10)',
]

/* ── Poster map (keep in sync with Movies.vue) ──────────────── */
const posterMap = {
  'colombiana':     '/posters/Colombiana.png',
  'parasite':       '/posters/Parasite.png',
  'obsession':      '/posters/Obsession.png',
  'arrietty':       '/posters/Arrietty.png',
  'disaster-movie': '/posters/Disastermovie.png',
}

function getPoster(title) {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
  return posterMap[slug] ?? null
}

/* ── Hero carousel (first 3 API movies) ─────────────────────── */
const heroFilms = computed(() =>
  apiMovies.value.slice(0, 3).map((m, i) => {
    const p = heroPalette[i % heroPalette.length]
    return {
      title: m.title,
      badge: `🔥 #${i + 1} Trending Now`,
      rating: m.rating ?? '—',
      year: String(m.year),
      genres: [m.genre].filter(Boolean),
      description: m.description,
      backdropGradient: p.bg,
      posterGradient: p.poster,
      poster: getPoster(m.title)
    }
  })
)

const heroIdx = ref(0)
const film = computed(() => heroFilms.value[heroIdx.value] ?? {})

let timer
function jumpTo(i) {
  heroIdx.value = i
  clearInterval(timer)
  timer = setInterval(advance, 6000)
}
function advance() {
  if (!heroFilms.value.length) return
  heroIdx.value = (heroIdx.value + 1) % heroFilms.value.length
}

/* ── Genre filter ────────────────────────────────────────────── */
const genres = ['All', 'Action', 'Sci-Fi', 'Drama', 'Thriller', 'Comedy', 'Horror', 'Romance', 'Animation']
const activeGenre = ref('All')

/* ── Top Picks — first 6 from API ───────────────────────────── */
const topPicks = computed(() =>
  apiMovies.value.slice(0, 6).map((m, i) => ({
    title: m.title,
    genre: m.genre,
    year: String(m.year),
    rating: m.rating ?? '—',
    gradient: cardPalette[i % cardPalette.length],
    poster: getPoster(m.title)
  }))
)

/* ── New Releases — 4 most recent by year ───────────────────── */
const newReleases = computed(() =>
  [...apiMovies.value]
    .sort((a, b) => b.year - a.year)
    .slice(0, 4)
    .map((m, i) => ({
      title: m.title,
      genre: m.genre,
      year: String(m.year),
      gradient: cardPalette[(i + 4) % cardPalette.length],
      poster: getPoster(m.title)
    }))
)

/* ── Static sections (personal/recommendation state) ────────── */
const continueWatching = [
  { title: 'Oppenheimer',   subtitle: '78% watched',     progress: 78, gradient: 'linear-gradient(145deg,#1c1608,#2c2212)' },
  { title: 'The Bear (S3)', subtitle: 'Episode 4 · 45%', progress: 45, gradient: 'linear-gradient(145deg,#0a1520,#14202e)' },
  { title: 'Interstellar',  subtitle: '22% watched',     progress: 22, gradient: 'linear-gradient(145deg,#080c1e,#101838)' }
]

const scifiPicks = [
  { title: 'Arrival II',       genre: 'Sci-Fi',      year: '2025', rating: '8.9', gradient: 'linear-gradient(145deg,#0d1c32,#1a3050)' },
  { title: 'Gravity Returns',  genre: 'Sci-Fi',      year: '2025', rating: '8.2', gradient: 'linear-gradient(145deg,#080e1e,#101a38)' },
  { title: 'The Martian II',   genre: 'Sci-Fi',      year: '2026', rating: '8.5', gradient: 'linear-gradient(145deg,#1e0c0c,#300e10)' },
  { title: 'Cosmos',           genre: 'Space drama', year: '2025', rating: '7.8', gradient: 'linear-gradient(145deg,#060610,#0e0e22)' },
  { title: 'Event Horizon II', genre: 'Sci-Fi',      year: '2026', rating: '7.6', gradient: 'linear-gradient(145deg,#0e080a,#200e12)' }
]

/* ── Fetch ───────────────────────────────────────────────────── */
async function fetchMovies() {
  try {
    const res = await axios.get(`${API}/movies/getMovies`)
    apiMovies.value = res.data.movies || res.data || []
  } catch {
    apiMovies.value = []
  }
}

onMounted(() => {
  fetchMovies()
  timer = setInterval(advance, 6000)
})
onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
/* ── Page ────────────────────────────────────────────────────── */
.home-page {
  background: var(--bg-primary);
  min-height: 100vh;
}

/* ── Hero ────────────────────────────────────────────────────── */
.hero {
  position: relative;
  height: 520px;
  overflow: hidden;
  transition: background 0.8s ease;
  /* pull up under the transparent navbar */
  margin-top: -60px;
  padding-top: 60px;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 60%, transparent 100%),
              linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%);
  pointer-events: none;
}

.hero-inner {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 48px;
  gap: 40px;
}

.hero-left {
  max-width: 500px;
  flex-shrink: 0;
}

.hero-badge {
  display: inline-block;
  background: var(--accent-red);
  color: #fff;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 4px 10px;
  border-radius: var(--radius-pill);
  margin-bottom: 14px;
}

.hero-title {
  font-size: 36px;
  font-weight: 600;
  letter-spacing: -0.5px;
  line-height: 1.15;
  color: #fff;
  margin-bottom: 12px;
}

.hero-meta-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.hero-rating {
  color: var(--accent-amber);
  font-weight: 500;
}

.meta-sep {
  color: var(--text-muted);
}

.quality-tag {
  background: var(--bg-elevated);
  border: 1px solid var(--border-medium);
  color: var(--text-muted);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.5px;
  padding: 2px 6px;
  border-radius: 4px;
}

.hero-genres {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}

.genre-pill-outline {
  border: 1px solid var(--border-medium);
  color: var(--text-secondary);
  font-size: 12px;
  padding: 3px 10px;
  border-radius: var(--radius-pill);
}

.hero-desc {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 22px;
}

.hero-btns {
  display: flex;
  gap: 12px;
  align-items: center;
}

.btn-watch {
  display: inline-flex;
  align-items: center;
  background: var(--accent-red);
  color: #fff;
  border: none;
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  padding: 10px 22px;
  border-radius: var(--radius-btn);
  cursor: pointer;
  transition: background 0.15s;
}

.btn-watch:hover { background: var(--accent-red-hover); }

.btn-mylist {
  background: rgba(255,255,255,0.1);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.25);
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  padding: 10px 22px;
  border-radius: var(--radius-btn);
  cursor: pointer;
  transition: background 0.15s;
}

.btn-mylist:hover { background: rgba(255,255,255,0.18); }

/* Poster */
.hero-right {
  flex-shrink: 0;
}

.poster-card {
  width: 180px;
  height: 270px;
  border-radius: 12px;
  transform: rotate(-3deg);
  box-shadow: 0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 16px;
  position: relative;
  overflow: hidden;
  transition: background 0.8s ease;
}

.hero-poster-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  z-index: 0;
}

.poster-shine {
  position: absolute;
  top: -40%;
  left: -40%;
  width: 80%;
  height: 80%;
  background: radial-gradient(ellipse, rgba(255,255,255,0.08) 0%, transparent 70%);
  pointer-events: none;
  z-index: 1;
}

.poster-title-text, .poster-year-text { z-index: 1; position: relative; }

.poster-title-text {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255,255,255,0.9);
  line-height: 1.3;
  margin-bottom: 4px;
}

.poster-year-text {
  font-size: 11px;
  color: rgba(255,255,255,0.45);
}

/* Dots */
.carousel-dots {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 2;
}

.dot-btn {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  border: none;
  background: rgba(255,255,255,0.3);
  cursor: pointer;
  padding: 0;
  transition: width 0.3s, background 0.3s;
}

.dot-btn.active {
  width: 24px;
  background: var(--accent-red);
}

/* ── Genre filter row ────────────────────────────────────────── */
.genre-filter-row {
  padding: 24px 48px 8px;
}

.genre-scroll-track {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  padding-bottom: 4px;
}

.genre-scroll-track::-webkit-scrollbar { display: none; }

.genre-filter-pill {
  flex-shrink: 0;
  background: none;
  border: 1px solid var(--border-medium);
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  padding: 6px 16px;
  border-radius: var(--radius-pill);
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}

.genre-filter-pill:hover {
  color: var(--text-primary);
  border-color: var(--border-medium);
  background: var(--bg-elevated);
}

.genre-filter-pill.active {
  background: var(--accent-red);
  border-color: var(--accent-red);
  color: #fff;
}

/* ── Content sections ────────────────────────────────────────── */
.content-section {
  padding: 32px 48px 0;
}

.section-header-group {
  margin-bottom: 4px;
}

.section-title {
  font-size: 18px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 16px;
  letter-spacing: -0.2px;
}

.section-subtitle {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 16px;
  margin-top: -10px;
}

/* ── Horizontal card row ─────────────────────────────────────── */
.card-scroll-row {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scrollbar-width: none;
  padding-bottom: 24px;
}

.card-scroll-row::-webkit-scrollbar { display: none; }

/* ── Movie card (horizontal list) ────────────────────────────── */
.hcard {
  flex-shrink: 0;
  width: 220px;
  cursor: pointer;
}

.hcard-img-cover {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--radius-card);
  z-index: 0;
}

.hcard-thumb {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: var(--radius-card);
  overflow: hidden;
}

.rank-badge {
  position: absolute;
  z-index: 1;
  top: 8px;
  left: 8px;
  background: rgba(0,0,0,0.75);
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 4px;
  z-index: 1;
  font-family: inherit;
}

.new-badge {
  position: absolute;
  z-index: 1;
  top: 8px;
  right: 8px;
  background: var(--accent-red);
  color: #fff;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  padding: 2px 7px;
  border-radius: 4px;
  z-index: 1;
  font-family: inherit;
}

.thumb-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  border-radius: var(--radius-card);
}

.hcard:hover .thumb-overlay {
  opacity: 1;
}

.play-circle {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  background: rgba(255,255,255,0.15);
  border: 1.5px solid rgba(255,255,255,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  padding-left: 2px;
  backdrop-filter: blur(4px);
  transition: transform 0.15s;
}

.hcard:hover .play-circle {
  transform: scale(1.08);
}

.resume-btn {
  background: rgba(255,255,255,0.15);
  border: 1.5px solid rgba(255,255,255,0.6);
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  font-family: inherit;
  padding: 6px 14px;
  border-radius: var(--radius-btn);
  cursor: pointer;
  backdrop-filter: blur(4px);
}

/* Progress bar */
.progress-track {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(255,255,255,0.15);
}

.progress-fill {
  height: 100%;
  background: var(--accent-red);
  border-radius: 0 2px 2px 0;
}

.hcard-info {
  padding: 8px 2px 0;
}

.hcard-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 3px;
}

.hcard-caption {
  font-size: 12px;
  color: var(--text-muted);
}

/* ── Footer ──────────────────────────────────────────────────── */
.site-footer {
  background: #0a0a0c;
  border-top: 1px solid var(--border-subtle);
  margin-top: 48px;
  padding: 40px 48px;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 24px;
}

.footer-logo {
  font-size: 16px;
  font-weight: 600;
  color: var(--accent-red);
}

.footer-links {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.footer-links a {
  color: var(--text-secondary);
  font-size: 13px;
  transition: color 0.15s;
}

.footer-links a:hover {
  color: var(--text-primary);
}

.footer-social {
  display: flex;
  gap: 12px;
}

.social-icon {
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 999px;
  border: 1px solid var(--border-subtle);
  transition: color 0.15s, border-color 0.15s;
}

.social-icon:hover {
  color: var(--text-primary);
  border-color: var(--border-medium);
}

.footer-bottom {
  border-top: 1px solid var(--border-subtle);
  padding-top: 20px;
}

.footer-copy {
  font-size: 12px;
  color: var(--text-muted);
}

/* ── Responsive ──────────────────────────────────────────────── */
@media (max-width: 1024px) {
  .hero-inner { padding: 0 24px; }
  .genre-filter-row { padding: 20px 24px 8px; }
  .content-section { padding: 28px 24px 0; }
  .site-footer { padding: 32px 24px; }
}

@media (max-width: 640px) {
  .hero {
    height: 380px;
  }
  .hero-inner {
    padding: 0 20px;
    align-items: flex-end;
    padding-bottom: 48px;
  }
  .hero-right { display: none; }
  .hero-left { max-width: 100%; }
  .hero-title { font-size: 24px; }
  .hero-desc { display: none; }
  .genre-filter-row { padding: 16px 20px 4px; }
  .content-section { padding: 24px 20px 0; }
  .hcard { width: 160px; }
  .footer-top { flex-direction: column; gap: 16px; }
  .footer-links { gap: 16px; }
  .site-footer { padding: 28px 20px; }
}
</style>
