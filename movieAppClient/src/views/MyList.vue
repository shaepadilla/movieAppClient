<template>
  <div class="mylist-page">

    <!-- ── Page Header ───────────────────────────────────────── -->
    <div class="mylist-header">
      <div>
        <h1 class="page-heading">My List</h1>
        <p class="page-subheading">{{ myList.length }} title{{ myList.length !== 1 ? 's' : '' }} saved</p>
      </div>
      <div class="view-toggle">
        <button class="view-btn" :class="{ active: gridView === 'grid' }" @click="gridView = 'grid'" title="Grid view">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
        </button>
        <button class="view-btn" :class="{ active: gridView === 'list' }" @click="gridView = 'list'" title="List view">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
        </button>
      </div>
    </div>

    <!-- ── Filter Pills ───────────────────────────────────────── -->
    <div class="filter-pills-row">
      <button
        v-for="f in filterOptions" :key="f.value"
        class="filter-pill" :class="{ active: activeFilter === f.value }"
        @click="activeFilter = f.value"
      >{{ f.label }}</button>
    </div>

    <!-- ── Empty State ────────────────────────────────────────── -->
    <div v-if="filteredList.length === 0" class="empty-state">
      <svg class="empty-icon" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
      </svg>
      <h2 class="empty-title">{{ myList.length === 0 ? 'Nothing saved yet' : 'No matches found' }}</h2>
      <p class="empty-body">{{ myList.length === 0 ? 'Add movies and shows to your list to watch them later.' : 'Try a different filter.' }}</p>
      <router-link to="/movies" class="btn-browse">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
        Browse Content
      </router-link>
    </div>

    <!-- ── Grid View ──────────────────────────────────────────── -->
    <div v-else-if="gridView === 'grid'" class="mylist-grid">
      <div class="ml-card" v-for="item in filteredList" :key="item.id">
        <div class="ml-poster" :style="{ background: item.gradient }">

          <!-- Watched overlay -->
          <div v-if="item.watched" class="watched-overlay">
            <div class="watched-check">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Watched</span>
            </div>
          </div>

          <!-- In-progress bar -->
          <div v-if="item.progress > 0 && item.progress < 100" class="progress-bar-poster">
            <div class="progress-fill-poster" :style="{ width: item.progress + '%' }"></div>
          </div>

          <!-- New episode badge -->
          <span v-if="item.newEpisode" class="new-ep-badge">● NEW EP</span>

          <!-- Hover overlay -->
          <div class="ml-hover-overlay">
            <button class="play-circle">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
            </button>
            <button class="remove-from-list" @click.stop="removeItem(item.id)">✕ Remove</button>
          </div>

          <span class="poster-genre-tag">{{ item.genre }}</span>
        </div>

        <div class="ml-meta">
          <p class="ml-title">{{ item.title }}</p>
          <p class="ml-sub">
            <span class="type-badge" :class="item.type === 'series' ? 'badge-series' : 'badge-movie'">{{ item.type === 'series' ? 'Series' : 'Movie' }}</span>
            {{ item.year }} · ⭐ {{ item.rating }}
          </p>
        </div>
      </div>
    </div>

    <!-- ── List View ──────────────────────────────────────────── -->
    <div v-else class="mylist-rows">
      <div class="ml-row" v-for="item in filteredList" :key="item.id">
        <div class="ml-row-thumb" :style="{ background: item.gradient }">
          <div v-if="item.watched" class="watched-overlay-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <span v-if="item.newEpisode" class="new-ep-badge-sm">NEW EP</span>
        </div>

        <div class="ml-row-meta">
          <p class="ml-row-title">{{ item.title }}</p>
          <p class="ml-row-sub">
            <span class="type-badge" :class="item.type === 'series' ? 'badge-series' : 'badge-movie'">{{ item.type === 'series' ? 'Series' : 'Movie' }}</span>
            {{ item.genre }} · {{ item.year }} · ⭐ {{ item.rating }}
          </p>
          <div class="ml-progress-wrap" v-if="item.progress > 0 && item.progress < 100">
            <div class="ml-progress-bar">
              <div class="ml-progress-fill" :style="{ width: item.progress + '%' }"></div>
            </div>
            <span class="ml-progress-label">{{ item.progress }}%</span>
          </div>
        </div>

        <div class="ml-row-actions">
          <button class="btn btn-primary btn-sm">▶ Play</button>
          <button class="btn btn-ghost btn-sm" @click="removeItem(item.id)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
            Remove
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'

const gridView    = ref('grid')
const activeFilter = ref('all')

const filterOptions = [
  { label: 'All',       value: 'all' },
  { label: 'Movies',    value: 'movie' },
  { label: 'Series',    value: 'series' },
  { label: 'Watched',   value: 'watched' },
  { label: 'Unwatched', value: 'unwatched' },
]

const myList = reactive([
  { id:'ml1', title:"Dune: Part Three",          type:'movie',  genre:'Sci-Fi',    year:2026, rating:'9.1', progress:0,   watched:false, newEpisode:false, gradient:'linear-gradient(175deg,#14093a,#2e1560,#08041a)' },
  { id:'ml2', title:'Interstellar',               type:'movie',  genre:'Sci-Fi',    year:2014, rating:'8.6', progress:22,  watched:false, newEpisode:false, gradient:'linear-gradient(175deg,#080c1e,#101838,#040810)' },
  { id:'ml3', title:'Wildlands',                  type:'movie',  genre:'Drama',     year:2026, rating:'8.3', progress:0,   watched:false, newEpisode:false, gradient:'linear-gradient(175deg,#0c2814,#163820,#070f09)' },
  { id:'ml4', title:'The Syndicate (S1–S5)',       type:'series', genre:'Crime',     year:2021, rating:'9.0', progress:100, watched:true,  newEpisode:false, gradient:'linear-gradient(175deg,#0c0e12,#141618,#060708)' },
  { id:'ml5', title:'Arrival II',                 type:'movie',  genre:'Sci-Fi',    year:2025, rating:'8.9', progress:0,   watched:false, newEpisode:false, gradient:'linear-gradient(175deg,#0d1c32,#1a3050,#08100a)' },
  { id:'ml6', title:'Blackwood (S2)',             type:'series', genre:'Horror',    year:2025, rating:'8.7', progress:0,   watched:false, newEpisode:true,  gradient:'linear-gradient(175deg,#120606,#200808,#090404)' },
  { id:'ml7', title:"Gravity's Edge",             type:'movie',  genre:'Sci-Fi',    year:2024, rating:'8.5', progress:100, watched:true,  newEpisode:false, gradient:'linear-gradient(175deg,#0a0c22,#121530,#05060e)' },
  { id:'ml8', title:'The Council',                type:'series', genre:'Political', year:2023, rating:'8.9', progress:100, watched:true,  newEpisode:false, gradient:'linear-gradient(175deg,#0a1220,#0e1830,#050810)' },
])

const filteredList = computed(() => {
  if (activeFilter.value === 'all')       return myList
  if (activeFilter.value === 'movie')     return myList.filter(i => i.type === 'movie')
  if (activeFilter.value === 'series')    return myList.filter(i => i.type === 'series')
  if (activeFilter.value === 'watched')   return myList.filter(i => i.watched)
  if (activeFilter.value === 'unwatched') return myList.filter(i => !i.watched)
  return myList
})

function removeItem(id) {
  const idx = myList.findIndex(i => i.id === id)
  if (idx !== -1) myList.splice(idx, 1)
}
</script>

<style scoped>
.mylist-page { min-height: 100vh; background: var(--bg-primary); padding-bottom: 60px; }

/* ── Header ──────────────────────────────────────────────────── */
.mylist-header {
  display: flex; align-items: flex-end; justify-content: space-between;
  padding: 36px 48px 24px;
}
.page-heading    { font-size: 28px; font-weight: 600; letter-spacing: -0.5px; color: var(--text-primary); margin-bottom: 4px; }
.page-subheading { font-size: 13px; color: var(--text-muted); }

.view-toggle { display: flex; gap: 2px; }
.view-btn {
  background: none; border: 1px solid var(--border-medium); color: var(--text-muted);
  width: 34px; height: 34px; border-radius: var(--radius-btn); cursor: pointer;
  display: flex; align-items: center; justify-content: center; transition: color 0.15s, background 0.15s;
}
.view-btn:hover  { color: var(--text-primary); }
.view-btn.active { color: var(--text-primary); background: var(--bg-elevated); }

/* ── Filter pills ────────────────────────────────────────────── */
.filter-pills-row { display: flex; gap: 8px; padding: 0 48px 28px; flex-wrap: wrap; }
.filter-pill {
  background: var(--bg-elevated); border: 1px solid var(--border-medium);
  color: var(--text-secondary); font-size: 13px; font-weight: 500; font-family: inherit;
  padding: 7px 16px; border-radius: var(--radius-pill); cursor: pointer; transition: all 0.15s;
}
.filter-pill:hover  { color: var(--text-primary); border-color: var(--border-medium); }
.filter-pill.active {
  background: var(--accent-red); border-color: var(--accent-red); color: #fff;
}

/* ── Empty state ─────────────────────────────────────────────── */
.empty-state {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 80px 24px; text-align: center; gap: 12px;
}
.empty-icon  { color: var(--text-muted); opacity: 0.5; margin-bottom: 8px; }
.empty-title { font-size: 22px; font-weight: 600; color: var(--text-primary); }
.empty-body  { font-size: 14px; color: var(--text-muted); max-width: 320px; line-height: 1.6; }
.btn-browse {
  margin-top: 8px; display: inline-flex; align-items: center; gap: 7px;
  background: var(--accent-red); color: #fff; font-size: 13px; font-weight: 500;
  padding: 9px 20px; border-radius: var(--radius-btn); text-decoration: none; transition: background 0.15s;
}
.btn-browse:hover { background: var(--accent-red-hover); }

/* ── Grid ────────────────────────────────────────────────────── */
.mylist-grid {
  display: grid; grid-template-columns: repeat(5, 1fr);
  gap: 16px; padding: 0 48px 32px;
}

.ml-card { cursor: pointer; }

.ml-poster {
  width: 100%; aspect-ratio: 2 / 3; border-radius: var(--radius-card);
  position: relative; overflow: hidden; transition: transform 0.2s;
}
.ml-card:hover .ml-poster { transform: scale(1.02); }

/* Watched overlay (grid) */
.watched-overlay {
  position: absolute; inset: 0; background: rgba(0,0,0,0.55);
  display: flex; align-items: center; justify-content: center; z-index: 2;
}
.watched-check {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  color: rgba(255,255,255,0.8); font-size: 11px; font-weight: 500;
}
.watched-check svg { opacity: 0.9; }

/* Progress bar on poster */
.progress-bar-poster {
  position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
  background: rgba(255,255,255,0.1); z-index: 3;
}
.progress-fill-poster { height: 100%; background: var(--accent-red); border-radius: 3px; }

/* New episode badge */
.new-ep-badge {
  position: absolute; top: 8px; right: 8px;
  background: rgba(34,197,94,0.2); color: #4ade80; border: 1px solid rgba(34,197,94,0.4);
  font-size: 10px; font-weight: 600; padding: 3px 8px; border-radius: var(--radius-pill); z-index: 3;
}

.poster-genre-tag {
  position: absolute; bottom: 8px; left: 8px;
  background: rgba(0,0,0,0.7); color: rgba(255,255,255,0.7);
  font-size: 10px; font-weight: 500; padding: 2px 7px; border-radius: var(--radius-pill);
  backdrop-filter: blur(4px); z-index: 3;
}

/* Hover overlay */
.ml-hover-overlay {
  position: absolute; inset: 0; background: rgba(0,0,0,0.6);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 10px; opacity: 0; transition: opacity 0.2s; z-index: 4;
}
.ml-poster:hover .ml-hover-overlay { opacity: 1; }

.play-circle {
  width: 48px; height: 48px; border-radius: 999px;
  background: rgba(255,255,255,0.15); border: 1.5px solid rgba(255,255,255,0.7);
  display: flex; align-items: center; justify-content: center; color: #fff; padding-left: 2px;
  cursor: pointer; backdrop-filter: blur(4px); transition: transform 0.15s;
}
.play-circle:hover { transform: scale(1.1); }

.remove-from-list {
  background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.25);
  color: rgba(255,255,255,0.8); font-size: 11px; font-weight: 500; font-family: inherit;
  padding: 5px 12px; border-radius: var(--radius-pill); cursor: pointer; backdrop-filter: blur(4px);
  transition: background 0.15s;
}
.remove-from-list:hover { background: rgba(226,75,74,0.25); border-color: rgba(226,75,74,0.5); color: #fff; }

/* Card meta */
.ml-meta { padding: 8px 2px 0; }
.ml-title {
  font-size: 13px; font-weight: 500; color: var(--text-primary);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 4px;
}
.ml-sub { font-size: 12px; color: var(--text-muted); display: flex; align-items: center; gap: 5px; }

/* Type badge */
.type-badge {
  font-size: 10px; font-weight: 600; padding: 1px 6px; border-radius: var(--radius-pill);
  text-transform: uppercase; letter-spacing: 0.4px; flex-shrink: 0;
}
.badge-movie  { background: rgba(239,159,39,0.15); color: var(--accent-amber); }
.badge-series { background: rgba(99,102,241,0.15); color: #818cf8; }

/* ── List view rows ──────────────────────────────────────────── */
.mylist-rows { display: flex; flex-direction: column; gap: 10px; padding: 0 48px 32px; }

.ml-row {
  display: flex; align-items: center; gap: 16px;
  background: var(--bg-card); border: 1px solid var(--border-subtle);
  border-radius: var(--radius-card); overflow: hidden; transition: border-color 0.15s;
}
.ml-row:hover { border-color: var(--border-medium); }

.ml-row-thumb {
  flex-shrink: 0; width: 90px; height: 56px; position: relative;
}

.watched-overlay-sm {
  position: absolute; inset: 0; background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.8);
}
.new-ep-badge-sm {
  position: absolute; bottom: 4px; left: 4px;
  background: rgba(34,197,94,0.8); color: #fff;
  font-size: 8px; font-weight: 700; padding: 1px 5px; border-radius: 3px;
}

.ml-row-meta { flex: 1; padding: 12px 0; min-width: 0; }
.ml-row-title { font-size: 14px; font-weight: 500; color: var(--text-primary); margin-bottom: 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ml-row-sub   { font-size: 12px; color: var(--text-muted); display: flex; align-items: center; gap: 5px; margin-bottom: 6px; flex-wrap: wrap; }

.ml-progress-wrap { display: flex; align-items: center; gap: 8px; }
.ml-progress-bar  { flex: 1; max-width: 160px; height: 3px; background: var(--border-subtle); border-radius: 3px; }
.ml-progress-fill { height: 100%; background: var(--accent-red); border-radius: 3px; }
.ml-progress-label { font-size: 11px; color: var(--text-muted); }

.ml-row-actions { display: flex; gap: 8px; padding: 0 16px; flex-shrink: 0; }

/* ── Buttons ─────────────────────────────────────────────────── */
.btn { display: inline-flex; align-items: center; gap: 5px; font-family: inherit; font-size: 13px; font-weight: 500; padding: 8px 16px; border-radius: var(--radius-btn); border: none; cursor: pointer; text-decoration: none; transition: background 0.15s, opacity 0.15s; }
.btn-primary   { background: var(--accent-red); color: #fff; }
.btn-primary:hover { background: var(--accent-red-hover); }
.btn-ghost  { background: none; color: var(--text-secondary); border: 1px solid var(--border-medium); }
.btn-ghost:hover { color: var(--text-primary); background: var(--bg-elevated); }
.btn-sm { padding: 6px 12px; font-size: 12px; }

/* ── Responsive ──────────────────────────────────────────────── */
@media (max-width: 1024px) {
  .mylist-header     { padding: 28px 24px 20px; }
  .filter-pills-row  { padding: 0 24px 24px; }
  .mylist-grid       { grid-template-columns: repeat(3, 1fr); padding: 0 24px 24px; }
  .mylist-rows       { padding: 0 24px 24px; }
}
@media (max-width: 640px) {
  .mylist-header     { padding: 20px 16px 16px; }
  .filter-pills-row  { padding: 0 16px 20px; }
  .mylist-grid       { grid-template-columns: repeat(2, 1fr); padding: 0 16px 20px; gap: 12px; }
  .mylist-rows       { padding: 0 16px 20px; }
  .ml-row-actions    { padding: 0 12px; }
}
</style>
