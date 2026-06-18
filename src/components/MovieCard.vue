<template>
  <div class="movie-card" @click="emit('click', id)">

    <!-- ── Poster ──────────────────────────────────────────── -->
    <div class="poster-wrap" :class="`ratio-${safeRatio}`">
      <div class="poster-bg" :style="{ background: gradient }">

        <!-- Rank badge -->
        <span v-if="rank" class="rank-badge">#{{ rank }}</span>

        <!-- Status / label badge (NEW, ● LIVE, etc.) -->
        <span
          v-if="badge"
          class="status-badge"
          :class="badgeColor === 'green' ? 'badge-green' : 'badge-red'"
        >{{ badge }}</span>

        <!-- Progress bar (0-100) -->
        <div v-if="progress > 0" class="progress-bar">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>

        <!-- Genre pill -->
        <span v-if="genre" class="genre-pill">{{ genre }}</span>

        <!-- Hover overlay -->
        <div class="hover-overlay">
          <button class="play-circle" @click.stop="emit('click', id)" aria-label="Play">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
          </button>
          <button class="list-btn" @click.stop="handleAddToList" aria-label="Add to My List">
            {{ inList ? '✓ Saved' : '+ My List' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ── Meta ────────────────────────────────────────────── -->
    <div v-if="showMeta" class="card-meta">
      <p class="card-title">{{ title }}</p>
      <p class="card-sub">
        <span v-if="genre">{{ genre }}</span>
        <span v-if="genre && (year || rating)" class="dot">·</span>
        <span v-if="year">{{ year }}</span>
        <span v-if="rating" class="rating-txt">⭐ {{ rating }}</span>
      </p>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useWatchlistStore } from '../stores/watchlist.js'
import { useToast } from '../composables/useToast.js'

const props = defineProps({
  id:       { type: String,          default: '' },
  title:    { type: String,          required: true },
  genre:    { type: String,          default: '' },
  year:     { type: [String, Number], default: '' },
  rating:   { type: [String, Number], default: '' },
  gradient: { type: String,          default: 'linear-gradient(175deg,#0f0f14,#1a1a24)' },
  rank:     { type: Number,          default: null },
  // '2/3' (portrait) or '16/9' (landscape)
  ratio:    { type: String,          default: '2/3' },
  badge:    { type: String,          default: '' },
  badgeColor: { type: String,        default: 'red' },
  progress: { type: Number,          default: 0 },
  showMeta: { type: Boolean,         default: true },
  // Full item object for watchlist — if provided, enables +My List
  item:     { type: Object,          default: null },
})

const emit = defineEmits(['click', 'add-to-list'])

const watchlist = useWatchlistStore()
const toast     = useToast()

const safeRatio = computed(() => props.ratio.replace('/', '-'))

const inList = computed(() => props.id ? watchlist.has(props.id) : false)

function handleAddToList() {
  if (!props.item && !props.id) return
  const entry = props.item ?? { id: props.id, title: props.title, genre: props.genre, year: props.year, rating: props.rating, gradient: props.gradient }
  const added = watchlist.add(entry)
  if (added) toast.success('Added to My List')
  else       toast.info('Already in your list')
  emit('add-to-list', entry)
}
</script>

<style scoped>
.movie-card { cursor: pointer; }

/* ── Poster ratios ─────────────────────────────────────────── */
.poster-wrap { position: relative; }
.poster-wrap.ratio-2-3  { aspect-ratio: 2 / 3; }
.poster-wrap.ratio-16-9 { aspect-ratio: 16 / 9; }

.poster-bg {
  position: absolute; inset: 0; border-radius: var(--radius-card);
  overflow: hidden; transition: transform 0.2s;
}
.movie-card:hover .poster-bg { transform: scale(1.02); }

/* ── Badges ────────────────────────────────────────────────── */
.rank-badge {
  position: absolute; top: 8px; left: 8px;
  background: var(--accent-red); color: #fff;
  font-size: 11px; font-weight: 700; padding: 2px 7px;
  border-radius: var(--radius-pill); z-index: 2;
}

.status-badge {
  position: absolute; top: 8px; right: 8px;
  font-size: 10px; font-weight: 600; padding: 3px 8px;
  border-radius: var(--radius-pill); z-index: 2; letter-spacing: 0.3px;
}
.badge-red   { background: rgba(226,75,74,0.2); color: #f87171; border: 1px solid rgba(226,75,74,0.4); }
.badge-green { background: rgba(34,197,94,0.2); color: #4ade80; border: 1px solid rgba(34,197,94,0.4); }

/* ── Progress bar ──────────────────────────────────────────── */
.progress-bar {
  position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
  background: rgba(255,255,255,0.1); z-index: 3;
}
.progress-fill { height: 100%; background: var(--accent-red); border-radius: 3px; }

/* ── Genre pill ────────────────────────────────────────────── */
.genre-pill {
  position: absolute; bottom: 8px; left: 8px;
  background: rgba(0,0,0,0.7); color: rgba(255,255,255,0.7);
  font-size: 10px; font-weight: 500; padding: 2px 7px;
  border-radius: var(--radius-pill); backdrop-filter: blur(4px); z-index: 3;
}

/* ── Hover overlay ─────────────────────────────────────────── */
.hover-overlay {
  position: absolute; inset: 0; border-radius: var(--radius-card);
  background: rgba(0,0,0,0.55);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 8px; opacity: 0; transition: opacity 0.2s; z-index: 4;
}
.poster-bg:hover .hover-overlay { opacity: 1; }

.play-circle {
  width: 48px; height: 48px; border-radius: 999px;
  background: rgba(255,255,255,0.15); border: 1.5px solid rgba(255,255,255,0.7);
  display: flex; align-items: center; justify-content: center;
  color: #fff; padding-left: 2px; cursor: pointer; backdrop-filter: blur(4px);
  transition: transform 0.15s;
}
.play-circle:hover { transform: scale(1.1); }

.list-btn {
  background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.35);
  color: #fff; font-size: 11px; font-weight: 500; font-family: inherit;
  padding: 5px 12px; border-radius: var(--radius-pill); cursor: pointer;
  backdrop-filter: blur(4px); transition: background 0.15s;
}
.list-btn:hover { background: rgba(255,255,255,0.2); }

/* ── Meta ──────────────────────────────────────────────────── */
.card-meta { padding: 8px 2px 0; }
.card-title {
  font-size: 13px; font-weight: 500; color: var(--text-primary);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 3px;
}
.card-sub {
  font-size: 12px; color: var(--text-muted);
  display: flex; align-items: center; gap: 4px; flex-wrap: wrap;
}
.dot        { color: var(--text-muted); }
.rating-txt { color: var(--accent-amber); }
</style>
