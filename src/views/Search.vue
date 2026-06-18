<template>
  <div class="search-page">

    <!-- ── Search Bar ─────────────────────────────────────────── -->
    <div class="search-bar-wrap">
      <div class="search-bar-inner">
        <svg class="sb-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          ref="searchInput"
          v-model="query"
          type="text"
          placeholder="Search movies, shows, actors…"
          class="sb-input"
          autocomplete="off"
          spellcheck="false"
        />
        <button v-if="query" class="sb-clear" @click="query = ''" aria-label="Clear">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </div>

    <!-- ── Initial / Genre State ─────────────────────────────── -->
    <div v-if="!query" class="initial-state">
      <h2 class="mood-heading">What are you in the mood for?</h2>
      <div class="genre-grid">
        <button
          v-for="g in genres"
          :key="g.name"
          class="genre-card"
          :style="{ background: g.gradient }"
          @click="query = g.name"
        >
          <span class="genre-icon-lg">{{ g.icon }}</span>
          <span class="genre-card-name">{{ g.name }}</span>
        </button>
      </div>
    </div>

    <!-- ── No Results ─────────────────────────────────────────── -->
    <div v-else-if="!hasResults" class="no-results-state">
      <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" class="nr-icon">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <h2 class="nr-heading">No results for <em>"{{ query }}"</em></h2>
      <p class="nr-body">Try searching for a genre, actor, or title</p>
      <div class="nr-suggestions">
        <button v-for="s in suggestions" :key="s" class="suggestion-pill" @click="query = s">{{ s }}</button>
      </div>
    </div>

    <!-- ── Results ────────────────────────────────────────────── -->
    <div v-else class="results-state">

      <!-- Top Results -->
      <section class="results-section" v-if="topResults.length">
        <h3 class="section-label">Top Results</h3>
        <div class="top-results-grid">
          <div class="top-card" v-for="item in topResults" :key="item.id">
            <div class="top-poster" :style="{ background: item.gradient }">
              <span class="top-type-badge" :class="item.type === 'series' ? 'badge-series' : 'badge-movie'">{{ item.type === 'series' ? 'Series' : 'Movie' }}</span>
              <div class="top-play-overlay">
                <div class="play-circle-sm">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
                </div>
              </div>
            </div>
            <div class="top-meta">
              <p class="top-title">{{ item.title }}</p>
              <p class="top-sub">{{ item.genre }} · ⭐ {{ item.rating }}</p>
              <div class="top-actions">
                <button class="btn btn-primary btn-sm">▶ Play</button>
                <button class="btn btn-ghost btn-sm">+ My List</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Movies -->
      <section class="results-section" v-if="movieResults.length">
        <h3 class="section-label">Movies</h3>
        <div class="scroll-row">
          <div class="scroll-card" v-for="m in movieResults" :key="m.id">
            <div class="scroll-poster" :style="{ background: m.gradient }">
              <span class="poster-genre-tag">{{ m.genre }}</span>
              <div class="scroll-overlay">
                <div class="play-circle-sm"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg></div>
              </div>
            </div>
            <p class="scroll-title">{{ m.title }}</p>
            <p class="scroll-sub">⭐ {{ m.rating }}</p>
          </div>
        </div>
      </section>

      <!-- Series -->
      <section class="results-section" v-if="seriesResults.length">
        <h3 class="section-label">Series</h3>
        <div class="scroll-row">
          <div class="scroll-card" v-for="s in seriesResults" :key="s.id">
            <div class="scroll-poster" :style="{ background: s.gradient }">
              <span class="poster-genre-tag">{{ s.genre }}</span>
              <div class="scroll-overlay">
                <div class="play-circle-sm"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg></div>
              </div>
            </div>
            <p class="scroll-title">{{ s.title }}</p>
            <p class="scroll-sub">S{{ s.seasons }} · ⭐ {{ s.rating }}</p>
          </div>
        </div>
      </section>

      <!-- Cast & Crew -->
      <section class="results-section" v-if="actorResults.length">
        <h3 class="section-label">Cast &amp; Crew</h3>
        <div class="cast-row">
          <div class="actor-card" v-for="a in actorResults" :key="a.name">
            <div class="actor-avatar" :style="{ background: a.color }">{{ a.initials }}</div>
            <p class="actor-name">{{ a.name }}</p>
            <p class="actor-known">Known for: {{ a.known }}</p>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const query = ref('')
const searchInput = ref(null)

onMounted(() => searchInput.value?.focus())

/* ── Genre quick-picks ───────────────────────────────────────── */
const genres = [
  { name: 'Action',    icon: '⚡', gradient: 'linear-gradient(135deg,#7f1d1d,#b91c1c)' },
  { name: 'Sci-Fi',   icon: '🚀', gradient: 'linear-gradient(135deg,#1e1b4b,#3730a3)' },
  { name: 'Horror',   icon: '👁️',  gradient: 'linear-gradient(135deg,#0d4444,#0f766e)' },
  { name: 'Drama',    icon: '🎭', gradient: 'linear-gradient(135deg,#78350f,#d97706)' },
  { name: 'Comedy',   icon: '😄', gradient: 'linear-gradient(135deg,#14532d,#16a34a)' },
  { name: 'Thriller', icon: '🔪', gradient: 'linear-gradient(135deg,#1c1c1c,#374151)' },
  { name: 'Romance',  icon: '❤️',  gradient: 'linear-gradient(135deg,#831843,#be185d)' },
  { name: 'Animation',icon: '✨', gradient: 'linear-gradient(135deg,#7c2d12,#ea580c)' },
]

/* ── Static data ─────────────────────────────────────────────── */
const allMovies = [
  { id:'m1',  title:"Dune: Part Three",    type:'movie', genre:'Sci-Fi',   rating:'9.1', gradient:'linear-gradient(175deg,#14093a,#2e1560,#08041a)' },
  { id:'m2',  title:'The Hollow Earth',    type:'movie', genre:'Thriller', rating:'8.7', gradient:'linear-gradient(175deg,#0a0f18,#0f1c30,#060810)' },
  { id:'m3',  title:'Eternal Run',         type:'movie', genre:'Action',   rating:'8.4', gradient:'linear-gradient(175deg,#1a0806,#320e08,#0c0402)' },
  { id:'m4',  title:'Wildlands',           type:'movie', genre:'Drama',    rating:'8.3', gradient:'linear-gradient(175deg,#0c2814,#163820,#070f09)' },
  { id:'m5',  title:'Arrival II',          type:'movie', genre:'Sci-Fi',   rating:'8.9', gradient:'linear-gradient(175deg,#0d1c32,#1a3050,#08100a)' },
  { id:'m6',  title:"Gravity's Edge",      type:'movie', genre:'Sci-Fi',   rating:'8.5', gradient:'linear-gradient(175deg,#0a0c22,#121530,#05060e)' },
  { id:'m7',  title:'Interstellar',        type:'movie', genre:'Sci-Fi',   rating:'8.6', gradient:'linear-gradient(175deg,#080c1e,#101838,#040810)' },
  { id:'m8',  title:'Fractured Silence',   type:'movie', genre:'Thriller', rating:'8.2', gradient:'linear-gradient(175deg,#12100e,#201c18,#090806)' },
]

const allSeries = [
  { id:'ss1',  title:'The Expanse: Origins', type:'series', genre:'Sci-Fi',    seasons:1, rating:'9.2', gradient:'linear-gradient(175deg,#09051c,#160b36,#050210)' },
  { id:'ss2',  title:'Blackwood',             type:'series', genre:'Horror',    seasons:2, rating:'8.7', gradient:'linear-gradient(175deg,#120606,#200a0a,#090404)' },
  { id:'ss3',  title:'The Council',           type:'series', genre:'Political', seasons:3, rating:'8.9', gradient:'linear-gradient(175deg,#0a1220,#0e1832,#050810)' },
  { id:'ss4',  title:'Fractured City',        type:'series', genre:'Crime',     seasons:2, rating:'8.4', gradient:'linear-gradient(175deg,#0e0e14,#161620,#09090c)' },
  { id:'ss5',  title:'The Syndicate',         type:'series', genre:'Crime',     seasons:5, rating:'9.0', gradient:'linear-gradient(175deg,#0c0e14,#14161c,#060708)' },
  { id:'ss6',  title:'Parallel',              type:'series', genre:'Sci-Fi',    seasons:2, rating:'8.2', gradient:'linear-gradient(175deg,#0c0a24,#161034,#060510)' },
]

const allActors = [
  { name:'Jake Mercer',  initials:'JM', color:'#6366f1', known:"The Expanse: Origins, Arrival II" },
  { name:'Lyra Chen',    initials:'LC', color:'#f59e0b', known:"Interstellar, Gravity's Edge" },
  { name:'Dom Santos',   initials:'DS', color:'#10b981', known:'Fractured City, Hollow Point' },
  { name:'Kai Rivera',   initials:'KR', color:'#8b5cf6', known:'Parallel, Solar Winds' },
  { name:'Nina Thatch',  initials:'NT', color:'#ef4444', known:'Wildlands, The Council' },
  { name:'Ren Okafor',   initials:'RO', color:'#3b82f6', known:'Blackwood, Eternal Run' },
]

const suggestions = ['Sci-Fi', 'Drama', 'Action', 'Horror', 'Thriller', 'Crime']

/* ── Computed results ────────────────────────────────────────── */
const q = computed(() => query.value.toLowerCase().trim())

const movieResults = computed(() =>
  !q.value ? [] : allMovies.filter(m =>
    m.title.toLowerCase().includes(q.value) || m.genre.toLowerCase().includes(q.value)
  )
)
const seriesResults = computed(() =>
  !q.value ? [] : allSeries.filter(s =>
    s.title.toLowerCase().includes(q.value) || s.genre.toLowerCase().includes(q.value)
  )
)
const actorResults = computed(() =>
  !q.value ? [] : allActors.filter(a => a.name.toLowerCase().includes(q.value) || a.known.toLowerCase().includes(q.value))
)
const topResults = computed(() =>
  [...movieResults.value, ...seriesResults.value].slice(0, 4)
)
const hasResults = computed(() =>
  topResults.value.length > 0 || actorResults.value.length > 0
)
</script>

<style scoped>
.search-page { min-height: 100vh; background: var(--bg-primary); padding-bottom: 60px; }

/* ── Search bar ──────────────────────────────────────────────── */
.search-bar-wrap {
  padding: 32px 48px 24px;
  position: sticky; top: 60px; z-index: 90;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-subtle);
}
.search-bar-inner {
  display: flex; align-items: center; gap: 14px;
  background: var(--bg-elevated); border: 1.5px solid var(--border-medium);
  border-radius: 12px; padding: 0 18px; height: 52px;
  transition: border-color 0.15s;
}
.search-bar-inner:focus-within { border-color: rgba(255,255,255,0.3); }

.sb-icon { color: var(--text-muted); flex-shrink: 0; }
.sb-input {
  flex: 1; background: none; border: none; outline: none;
  color: var(--text-primary); font-size: 17px; font-family: inherit;
}
.sb-input::placeholder { color: var(--text-muted); }
.sb-clear {
  background: none; border: none; cursor: pointer; color: var(--text-muted);
  padding: 4px; display: flex; align-items: center; border-radius: 4px; transition: color 0.15s;
}
.sb-clear:hover { color: var(--text-primary); }

/* ── Initial state ───────────────────────────────────────────── */
.initial-state { padding: 44px 48px; }
.mood-heading  { font-size: 22px; font-weight: 600; color: var(--text-primary); margin-bottom: 28px; letter-spacing: -0.3px; }

.genre-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;
}
.genre-card {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 10px; height: 100px; border-radius: var(--radius-card); border: none; cursor: pointer;
  transition: transform 0.15s, filter 0.15s; position: relative; overflow: hidden;
}
.genre-card::after {
  content: ''; position: absolute; inset: 0;
  background: rgba(0,0,0,0.2); transition: background 0.15s;
}
.genre-card:hover { transform: scale(1.03); filter: brightness(1.1); }
.genre-card:hover::after { background: rgba(0,0,0,0.05); }

.genre-icon-lg  { font-size: 28px; z-index: 1; }
.genre-card-name { font-size: 14px; font-weight: 600; color: #fff; z-index: 1; text-shadow: 0 1px 4px rgba(0,0,0,0.5); }

/* ── No results ──────────────────────────────────────────────── */
.no-results-state {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 80px 24px; text-align: center; gap: 12px;
}
.nr-icon    { color: var(--text-muted); opacity: 0.35; margin-bottom: 8px; }
.nr-heading { font-size: 22px; font-weight: 600; color: var(--text-primary); }
.nr-heading em { font-style: italic; color: var(--text-secondary); }
.nr-body    { font-size: 14px; color: var(--text-muted); }

.nr-suggestions { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-top: 12px; }
.suggestion-pill {
  background: var(--bg-elevated); border: 1px solid var(--border-medium);
  color: var(--text-secondary); font-size: 13px; font-family: inherit;
  padding: 7px 16px; border-radius: var(--radius-pill); cursor: pointer; transition: all 0.15s;
}
.suggestion-pill:hover { color: var(--text-primary); border-color: var(--border-medium); background: #2a2a2f; }

/* ── Results ─────────────────────────────────────────────────── */
.results-state { padding: 28px 48px; display: flex; flex-direction: column; gap: 40px; }
.results-section {}
.section-label { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); margin-bottom: 16px; }

/* Top results 2-col grid */
.top-results-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
.top-card { display: flex; gap: 14px; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-card); overflow: hidden; cursor: pointer; transition: border-color 0.15s; }
.top-card:hover { border-color: var(--border-medium); }
.top-poster {
  flex-shrink: 0; width: 90px; aspect-ratio: 2/3; position: relative; overflow: hidden;
}
.top-type-badge {
  position: absolute; top: 6px; left: 6px; font-size: 9px; font-weight: 700;
  padding: 2px 6px; border-radius: var(--radius-pill); text-transform: uppercase; letter-spacing: 0.5px; z-index: 2;
}
.badge-movie  { background: rgba(239,159,39,0.2); color: var(--accent-amber); border: 1px solid rgba(239,159,39,0.3); }
.badge-series { background: rgba(99,102,241,0.2); color: #818cf8; border: 1px solid rgba(99,102,241,0.3); }

.top-play-overlay {
  position: absolute; inset: 0; background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: opacity 0.2s;
}
.top-poster:hover .top-play-overlay { opacity: 1; }

.play-circle-sm {
  width: 36px; height: 36px; border-radius: 999px;
  background: rgba(255,255,255,0.15); border: 1.5px solid rgba(255,255,255,0.7);
  display: flex; align-items: center; justify-content: center; color: #fff; padding-left: 2px;
}

.top-meta { flex: 1; padding: 14px 14px 14px 0; display: flex; flex-direction: column; gap: 6px; }
.top-title { font-size: 15px; font-weight: 500; color: var(--text-primary); line-height: 1.3; }
.top-sub   { font-size: 12px; color: var(--text-muted); }
.top-actions { display: flex; gap: 8px; margin-top: 4px; }

/* Horizontal scroll rows */
.scroll-row {
  display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px;
}
.scroll-row::-webkit-scrollbar { height: 3px; }
.scroll-row::-webkit-scrollbar-track { background: transparent; }
.scroll-row::-webkit-scrollbar-thumb { background: var(--border-medium); border-radius: 3px; }

.scroll-card { flex-shrink: 0; width: 140px; cursor: pointer; }
.scroll-poster {
  width: 140px; aspect-ratio: 2/3; border-radius: var(--radius-card); position: relative;
  overflow: hidden; margin-bottom: 8px; transition: transform 0.2s;
}
.scroll-card:hover .scroll-poster { transform: scale(1.02); }

.poster-genre-tag {
  position: absolute; bottom: 6px; left: 6px;
  background: rgba(0,0,0,0.7); color: rgba(255,255,255,0.7);
  font-size: 9px; font-weight: 500; padding: 2px 6px; border-radius: var(--radius-pill);
  backdrop-filter: blur(4px);
}
.scroll-overlay {
  position: absolute; inset: 0; background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: opacity 0.2s;
}
.scroll-poster:hover .scroll-overlay { opacity: 1; }

.scroll-title { font-size: 12px; font-weight: 500; color: var(--text-primary); margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.scroll-sub   { font-size: 11px; color: var(--text-muted); }

/* Cast row */
.cast-row { display: flex; gap: 16px; flex-wrap: wrap; }
.actor-card {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  width: 100px; cursor: pointer;
}
.actor-avatar {
  width: 64px; height: 64px; border-radius: 999px;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; font-weight: 600; color: #fff; letter-spacing: -0.5px;
  transition: transform 0.15s;
}
.actor-card:hover .actor-avatar { transform: scale(1.05); }
.actor-name  { font-size: 12px; font-weight: 500; color: var(--text-primary); text-align: center; }
.actor-known { font-size: 10px; color: var(--text-muted); text-align: center; line-height: 1.4; }

/* ── Shared buttons ──────────────────────────────────────────── */
.btn { display: inline-flex; align-items: center; gap: 5px; font-family: inherit; font-size: 13px; font-weight: 500; padding: 8px 16px; border-radius: var(--radius-btn); border: none; cursor: pointer; transition: background 0.15s; text-decoration: none; }
.btn-primary { background: var(--accent-red); color: #fff; }
.btn-primary:hover { background: var(--accent-red-hover); }
.btn-ghost { background: none; color: var(--text-secondary); border: 1px solid var(--border-medium); }
.btn-ghost:hover { color: var(--text-primary); background: var(--bg-elevated); }
.btn-sm { padding: 5px 12px; font-size: 12px; }

/* ── Responsive ──────────────────────────────────────────────── */
@media (max-width: 1024px) {
  .search-bar-wrap { padding: 24px 24px 18px; }
  .initial-state   { padding: 32px 24px; }
  .results-state   { padding: 24px; }
  .genre-grid      { grid-template-columns: repeat(4, 1fr); }
  .top-results-grid { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .search-bar-wrap { padding: 16px 16px 14px; }
  .initial-state   { padding: 24px 16px; }
  .results-state   { padding: 16px; }
  .genre-grid      { grid-template-columns: repeat(2, 1fr); }
}
</style>
