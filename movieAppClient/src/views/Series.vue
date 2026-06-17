<template>
  <div class="series-page">

    <!-- ── Page Header ───────────────────────────────────────── -->
    <div class="series-page-header">
      <div>
        <h1 class="page-heading">Series</h1>
        <p class="page-subheading">Binge-worthy shows, new episodes weekly</p>
      </div>
    </div>

    <!-- ── Filter Bar ─────────────────────────────────────────── -->
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

          <div class="filter-group" :class="{ 'filter-active': filters.seasons }">
            <span class="filter-label">Seasons</span>
            <div class="select-wrap">
              <select v-model="filters.seasons">
                <option value="">Any</option>
                <option value="1">1 Season</option>
                <option value="2-3">2–3 Seasons</option>
                <option value="4+">4+ Seasons</option>
              </select>
              <svg class="select-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>

          <div class="filter-group" :class="{ 'filter-active': filters.status }">
            <span class="filter-label">Status</span>
            <div class="select-wrap">
              <select v-model="filters.status">
                <option value="">All</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="New">New Season</option>
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

      <!-- Active pills -->
      <div class="active-pills-row" v-if="activePills.length">
        <button class="active-filter-pill" v-for="p in activePills" :key="p.key" @click="clearFilter(p.key)">
          {{ p.label }}<span class="pill-x">×</span>
        </button>
        <button class="clear-all" @click="clearAll">Clear all</button>
      </div>
    </div>

    <!-- ── Series Grid ────────────────────────────────────────── -->
    <div v-if="visibleSeries.length === 0" class="state-msg">No series match your filters.</div>

    <div v-else :class="gridView === 'grid' ? 'poster-grid' : 'poster-list'">
      <div
        class="poster-card"
        v-for="s in visibleSeries"
        :key="s.id"
        :class="{ 'poster-card-list': gridView === 'list' }"
      >
        <!-- Poster -->
        <div class="poster-wrap" :class="{ 'poster-wrap-list': gridView === 'list' }">
          <div class="poster-img" :style="{ background: s.gradient }">
            <!-- Status badge -->
            <span
              v-if="s.status === 'Ongoing' || s.status === 'New'"
              class="status-badge"
              :class="s.status === 'New' ? 'badge-new-ep' : 'badge-live'"
            >{{ s.status === 'New' ? '● NEW EP' : '● LIVE' }}</span>

            <!-- Hover overlay -->
            <div class="poster-overlay">
              <div class="play-lg">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
              </div>
              <button class="mylist-overlay">+ My List</button>
            </div>
            <span class="poster-genre-tag">{{ s.genre }}</span>
          </div>
        </div>

        <!-- Grid meta -->
        <div class="poster-meta" v-if="gridView === 'grid'">
          <p class="poster-title-txt">{{ s.title }}</p>
          <p class="poster-caption-txt">S{{ s.seasons }} · {{ s.eps }} eps · ⭐ {{ s.rating }}</p>
        </div>

        <!-- List meta -->
        <div class="list-meta" v-else>
          <p class="list-title">{{ s.title }}</p>
          <p class="list-sub">S{{ s.seasons }} · {{ s.eps }} eps · {{ s.status }}</p>
          <div class="list-tags">
            <span class="badge badge-genre">{{ s.genre }}</span>
            <span class="badge-rating">⭐ {{ s.rating }}</span>
            <span
              v-if="s.status === 'Ongoing' || s.status === 'New'"
              class="status-badge-inline"
              :class="s.status === 'New' ? 'badge-new-ep' : 'badge-live'"
            >{{ s.status === 'New' ? '● NEW EP' : '● LIVE' }}</span>
          </div>
          <div class="list-actions">
            <button class="btn btn-primary btn-sm">▶ Watch</button>
            <button class="btn btn-secondary btn-sm">+ My List</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Load More ──────────────────────────────────────────── -->
    <div class="load-more-row" v-if="canLoadMore">
      <button class="btn-load-more" @click="loadMore" :disabled="loadingMore">
        <span v-if="loadingMore" class="dot-pulse"><span /><span /><span /></span>
        <span v-else>Load More</span>
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

/* ── Filter state ────────────────────────────────────────────── */
const filters  = reactive({ genre: '', rating: '', seasons: '', status: '', sort: 'trending' })
const gridView = ref('grid')
const displayLimit = ref(12)
const loadingMore  = ref(false)

const genreOptions = ['Sci-Fi', 'Horror', 'Political', 'Crime', 'Thriller', 'Drama', 'Mystery', 'Romance', 'Action']

const activePills = computed(() => {
  const pills = []
  if (filters.genre)   pills.push({ key: 'genre',   label: filters.genre })
  if (filters.rating)  pills.push({ key: 'rating',  label: `⭐ ${filters.rating}+` })
  if (filters.seasons) {
    const lbl = { '1': '1 Season', '2-3': '2–3 Seasons', '4+': '4+ Seasons' }
    pills.push({ key: 'seasons', label: lbl[filters.seasons] || filters.seasons })
  }
  if (filters.status)  pills.push({ key: 'status',  label: filters.status })
  return pills
})

function clearFilter(key) { filters[key] = '' }
function clearAll() { filters.genre = ''; filters.rating = ''; filters.seasons = ''; filters.status = '' }

/* ── Series data ─────────────────────────────────────────────── */
const allSeries = [
  { id:'ss1',  title:'The Expanse: Origins', genre:'Sci-Fi',    seasons:1, eps:10, status:'Ongoing',   rating:9.2, gradient:'linear-gradient(175deg,#09051c,#160b36,#050210)' },
  { id:'ss2',  title:'Blackwood',            genre:'Horror',    seasons:2, eps:16, status:'Ongoing',   rating:8.7, gradient:'linear-gradient(175deg,#120606,#200a0a,#090404)' },
  { id:'ss3',  title:'The Council',          genre:'Political', seasons:3, eps:30, status:'Completed', rating:8.9, gradient:'linear-gradient(175deg,#0a1220,#0e1832,#050810)' },
  { id:'ss4',  title:'Fractured City',       genre:'Crime',     seasons:2, eps:18, status:'Ongoing',   rating:8.4, gradient:'linear-gradient(175deg,#0e0e14,#161620,#09090c)' },
  { id:'ss5',  title:'Solar Winds',          genre:'Sci-Fi',    seasons:1, eps:8,  status:'New',       rating:8.1, gradient:'linear-gradient(175deg,#0a0e28,#10163c,#060812)' },
  { id:'ss6',  title:'Hollow Point',         genre:'Thriller',  seasons:4, eps:40, status:'Completed', rating:8.6, gradient:'linear-gradient(175deg,#0e1018,#141822,#09090e)' },
  { id:'ss7',  title:'The Botanist',         genre:'Drama',     seasons:2, eps:20, status:'Ongoing',   rating:7.9, gradient:'linear-gradient(175deg,#08140a,#0c1e0e,#040a06)' },
  { id:'ss8',  title:'Night Market',         genre:'Mystery',   seasons:1, eps:8,  status:'Ongoing',   rating:8.3, gradient:'linear-gradient(175deg,#0a1214,#101c1e,#050a0c)' },
  { id:'ss9',  title:'Ember & Ash',          genre:'Romance',   seasons:3, eps:24, status:'Completed', rating:7.7, gradient:'linear-gradient(175deg,#160810,#221018,#0c0608)' },
  { id:'ss10', title:'Coldfront',            genre:'Action',    seasons:2, eps:16, status:'Ongoing',   rating:8.0, gradient:'linear-gradient(175deg,#1a0c08,#28140a,#0e0806)' },
  { id:'ss11', title:'The Syndicate',        genre:'Crime',     seasons:5, eps:50, status:'Completed', rating:9.0, gradient:'linear-gradient(175deg,#0c0e14,#14161c,#060708)' },
  { id:'ss12', title:'Parallel',             genre:'Sci-Fi',    seasons:2, eps:16, status:'Ongoing',   rating:8.2, gradient:'linear-gradient(175deg,#0c0a24,#161034,#060510)' },
]

/* ── Filter + sort ───────────────────────────────────────────── */
const filteredSeries = computed(() => {
  let list = [...allSeries]
  if (filters.genre)  list = list.filter(s => s.genre === filters.genre)
  if (filters.rating) list = list.filter(s => s.rating >= Number(filters.rating))
  if (filters.status) list = list.filter(s => s.status === filters.status)
  if (filters.seasons) {
    if (filters.seasons === '1')   list = list.filter(s => s.seasons === 1)
    if (filters.seasons === '2-3') list = list.filter(s => s.seasons >= 2 && s.seasons <= 3)
    if (filters.seasons === '4+')  list = list.filter(s => s.seasons >= 4)
  }
  if (filters.sort === 'top')     list.sort((a, b) => b.rating - a.rating)
  if (filters.sort === 'az')      list.sort((a, b) => a.title.localeCompare(b.title))
  if (filters.sort === 'newest')  list.sort((a, b) => b.eps - a.eps)
  return list
})

const visibleSeries = computed(() => filteredSeries.value.slice(0, displayLimit.value))
const canLoadMore   = computed(() => filteredSeries.value.length > displayLimit.value)

function loadMore() {
  loadingMore.value = true
  setTimeout(() => { displayLimit.value += 12; loadingMore.value = false }, 500)
}
</script>

<style scoped>
.series-page { min-height: 100vh; background: var(--bg-primary); padding-bottom: 60px; }

.series-page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 36px 48px 28px;
}

.page-heading    { font-size: 28px; font-weight: 600; letter-spacing: -0.5px; color: var(--text-primary); margin-bottom: 4px; }
.page-subheading { font-size: 13px; color: var(--text-muted); }

/* ── Filter bar (reuse same pattern as Movies) ───────────────── */
.filter-bar {
  position: sticky; top: 60px; z-index: 90;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-subtle);
  padding: 14px 48px 0;
}
.filter-bar-inner { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-bottom: 14px; }
.filter-selects   { display: flex; gap: 8px; flex-wrap: wrap; }

.filter-group {
  display: inline-flex; align-items: center; gap: 6px;
  background: var(--bg-elevated); border: 1px solid var(--border-medium);
  border-radius: var(--radius-btn); padding: 6px 10px 6px 12px; transition: border-color 0.15s;
}
.filter-group.filter-active { border-color: var(--accent-red); }
.filter-label { font-size: 12px; color: var(--text-muted); font-weight: 500; white-space: nowrap; }
.select-wrap  { position: relative; display: flex; align-items: center; }
.select-wrap select {
  appearance: none; -webkit-appearance: none; background: none; border: none;
  color: var(--text-primary); font-family: inherit; font-size: 13px; font-weight: 500;
  cursor: pointer; outline: none; padding-right: 18px; min-width: 70px;
}
.select-wrap select option { background: var(--bg-elevated); color: var(--text-primary); }
.select-chevron { position: absolute; right: 0; color: var(--text-muted); pointer-events: none; }

.view-toggle { display: flex; gap: 2px; flex-shrink: 0; }
.view-btn {
  background: none; border: 1px solid var(--border-medium); color: var(--text-muted);
  width: 34px; height: 34px; border-radius: var(--radius-btn); cursor: pointer;
  display: flex; align-items: center; justify-content: center; transition: color 0.15s, background 0.15s;
}
.view-btn:hover  { color: var(--text-primary); }
.view-btn.active { color: var(--text-primary); background: var(--bg-elevated); }

.active-pills-row { display: flex; align-items: center; gap: 8px; padding-bottom: 12px; flex-wrap: wrap; }
.active-filter-pill {
  display: inline-flex; align-items: center; gap: 5px;
  background: rgba(226,75,74,0.12); border: 1px solid rgba(226,75,74,0.3);
  color: var(--accent-red); font-size: 12px; font-weight: 500; font-family: inherit;
  padding: 4px 10px; border-radius: var(--radius-pill); cursor: pointer; transition: background 0.15s;
}
.active-filter-pill:hover { background: rgba(226,75,74,0.2); }
.pill-x { font-size: 14px; opacity: 0.7; }
.clear-all {
  background: none; border: none; color: var(--text-muted); font-size: 12px;
  font-family: inherit; cursor: pointer; padding: 4px 8px; transition: color 0.15s;
}
.clear-all:hover { color: var(--text-primary); }

/* ── Grid / List ─────────────────────────────────────────────── */
.poster-grid {
  display: grid; grid-template-columns: repeat(5, 1fr);
  gap: 16px; padding: 28px 48px;
}
.poster-list { display: flex; flex-direction: column; gap: 12px; padding: 28px 48px; }

.state-msg { text-align: center; padding: 60px 24px; color: var(--text-muted); font-size: 14px; }

/* ── Poster card ─────────────────────────────────────────────── */
.poster-card { cursor: pointer; }
.poster-card-list {
  display: flex; gap: 16px; background: var(--bg-card);
  border: 1px solid var(--border-subtle); border-radius: var(--radius-card);
  overflow: hidden; transition: border-color 0.15s;
}
.poster-card-list:hover { border-color: var(--border-medium); }

.poster-wrap      { position: relative; }
.poster-wrap-list { flex-shrink: 0; width: 100px; }

.poster-img {
  width: 100%; aspect-ratio: 2 / 3; border-radius: var(--radius-card);
  position: relative; overflow: hidden; transition: transform 0.2s;
}
.poster-card:not(.poster-card-list):hover .poster-img { transform: scale(1.02); }
.poster-wrap-list .poster-img { aspect-ratio: 2 / 3; border-radius: 0; }

/* Status badges */
.status-badge {
  position: absolute; top: 8px; right: 8px;
  font-size: 10px; font-weight: 600; padding: 3px 8px;
  border-radius: var(--radius-pill); z-index: 2; letter-spacing: 0.3px;
}
.badge-live   { background: rgba(34,197,94,0.2); color: #4ade80; border: 1px solid rgba(34,197,94,0.4); }
.badge-new-ep { background: rgba(34,197,94,0.2); color: #4ade80; border: 1px solid rgba(34,197,94,0.4); }

.status-badge-inline {
  display: inline-block; font-size: 10px; font-weight: 600;
  padding: 2px 7px; border-radius: var(--radius-pill); letter-spacing: 0.3px;
}

.poster-genre-tag {
  position: absolute; bottom: 8px; left: 8px;
  background: rgba(0,0,0,0.7); color: rgba(255,255,255,0.7);
  font-size: 10px; font-weight: 500; padding: 2px 7px; border-radius: var(--radius-pill);
  backdrop-filter: blur(4px);
}

/* Hover overlay */
.poster-overlay {
  position: absolute; inset: 0; background: rgba(0,0,0,0.55);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 8px; opacity: 0; transition: opacity 0.2s; border-radius: var(--radius-card);
}
.poster-img:hover .poster-overlay { opacity: 1; }

.play-lg {
  width: 48px; height: 48px; border-radius: 999px;
  background: rgba(255,255,255,0.15); border: 1.5px solid rgba(255,255,255,0.7);
  display: flex; align-items: center; justify-content: center;
  color: #fff; padding-left: 2px; cursor: pointer; backdrop-filter: blur(4px); transition: transform 0.15s;
}
.play-lg:hover { transform: scale(1.1); }

.mylist-overlay {
  background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.35);
  color: #fff; font-size: 11px; font-weight: 500; font-family: inherit;
  padding: 5px 12px; border-radius: var(--radius-pill); cursor: pointer; backdrop-filter: blur(4px);
}

/* Card meta */
.poster-meta { padding: 8px 2px 0; }
.poster-title-txt {
  font-size: 13px; font-weight: 500; color: var(--text-primary);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 3px;
}
.poster-caption-txt { font-size: 12px; color: var(--text-muted); }

/* List meta */
.list-meta  { flex: 1; padding: 16px 16px 16px 0; display: flex; flex-direction: column; gap: 7px; }
.list-title { font-size: 15px; font-weight: 500; color: var(--text-primary); }
.list-sub   { font-size: 12px; color: var(--text-muted); }

.list-tags { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }

.badge { font-size: 11px; font-weight: 500; padding: 3px 8px; border-radius: var(--radius-pill); text-transform: uppercase; letter-spacing: 0.4px; }
.badge-genre { background: rgba(226,75,74,0.12); border: 1px solid rgba(226,75,74,0.25); color: var(--accent-red); }
.badge-rating { font-size: 12px; color: var(--accent-amber); }

.list-actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 4px; }

.btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 8px 18px; font-size: 14px; font-weight: 500; font-family: inherit; border-radius: var(--radius-btn); border: none; cursor: pointer; transition: background 0.15s; text-decoration: none; }
.btn-primary   { background: var(--accent-red); color: #fff; }
.btn-primary:hover { background: var(--accent-red-hover); }
.btn-secondary { background: var(--bg-elevated); color: var(--text-primary); border: 1px solid var(--border-medium); }
.btn-secondary:hover { background: #2a2a2f; }
.btn-sm { padding: 5px 12px; font-size: 12px; }

/* ── Load more ───────────────────────────────────────────────── */
.load-more-row { display: flex; justify-content: center; padding: 8px 0 40px; }
.btn-load-more {
  background: none; border: 1px solid var(--border-medium); color: var(--text-secondary);
  font-size: 13px; font-weight: 500; font-family: inherit; padding: 10px 32px;
  border-radius: var(--radius-btn); cursor: pointer; min-width: 140px;
  display: flex; align-items: center; justify-content: center; transition: color 0.15s, background 0.15s;
}
.btn-load-more:hover { color: var(--text-primary); background: var(--bg-elevated); }
.btn-load-more:disabled { opacity: 0.5; cursor: default; }

.dot-pulse { display: inline-flex; gap: 4px; align-items: center; }
.dot-pulse span { width: 6px; height: 6px; border-radius: 50%; background: var(--accent-red); animation: dp 1.2s infinite ease-in-out; }
.dot-pulse span:nth-child(2) { animation-delay: 0.2s; }
.dot-pulse span:nth-child(3) { animation-delay: 0.4s; }
@keyframes dp { 0%,80%,100%{transform:scale(0.6);opacity:0.4} 40%{transform:scale(1);opacity:1} }

/* ── Responsive ──────────────────────────────────────────────── */
@media (max-width: 1024px) {
  .series-page-header { padding: 28px 24px 20px; }
  .filter-bar { padding: 12px 24px 0; }
  .poster-grid { grid-template-columns: repeat(3, 1fr); padding: 24px; }
  .poster-list { padding: 16px 24px; }
}
@media (max-width: 640px) {
  .series-page-header { padding: 20px 16px 16px; }
  .filter-bar { padding: 10px 16px 0; }
  .filter-label { display: none; }
  .filter-group { padding: 5px 8px 5px 10px; }
  .poster-grid { grid-template-columns: repeat(2, 1fr); padding: 16px; gap: 12px; }
  .poster-list { padding: 12px 16px; }
}
</style>
