<template>
  <div class="detail-page">

    <!-- Loading -->
    <div v-if="loading" class="load-screen">
      <span class="dot-pulse"><span /><span /><span /></span>
    </div>

    <template v-else-if="movie">

      <!-- ── Hero Banner ──────────────────────────────────────── -->
      <section class="detail-hero">
        <div class="hero-backdrop" :style="{ background: backdropGradient }" />
        <div class="hero-gradient" />

        <div class="hero-panel">
          <!-- Small poster thumbnail -->
          <div class="hero-thumb" :style="{ background: posterGradient }">
            <span class="thumb-genre">{{ movie.genre?.toUpperCase() }}</span>
          </div>

          <!-- Info -->
          <div class="hero-info">
            <p class="hero-eyebrow">{{ eyebrow }}</p>
            <h1 class="hero-title">{{ movie.title }}</h1>
            <p class="hero-tagline">{{ tagline }}</p>

            <div class="hero-rating-row">
              <span class="rating-star">⭐</span>
              <span class="rating-num">{{ displayRating }}</span>
              <span class="rating-denom">&nbsp;/ 10</span>
              <span class="rating-count">&nbsp;· ({{ reviewCount }} reviews)</span>
            </div>

            <div class="hero-chips">
              <span class="chip">{{ movie.year }}</span>
              <span class="chip-sep">·</span>
              <span class="chip">{{ duration }}</span>
              <span class="chip-sep">·</span>
              <span class="chip">{{ mpaaRating }}</span>
              <span class="chip-quality">4K</span>
              <span class="chip-quality">Dolby Atmos</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ── Action Buttons ──────────────────────────────────── -->
      <div class="action-row">
        <button class="btn-play">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="flex-shrink:0"><polygon points="5,3 19,12 5,21"/></svg>
          Play Now
        </button>
        <button class="btn-ghost-lg">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Download
        </button>
        <button class="btn-ghost-lg">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          My List
        </button>
        <button class="btn-icon-action" title="Share">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
        </button>
        <button class="btn-icon-action" title="More">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>
        </button>
      </div>

      <!-- ── Tab Bar ──────────────────────────────────────────── -->
      <div class="tab-bar">
        <div class="tab-bar-inner">
          <button
            v-for="t in tabs"
            :key="t"
            class="tab-btn"
            :class="{ active: activeTab === t }"
            @click="activeTab = t"
          >{{ t }}</button>
        </div>
      </div>

      <!-- ── Tab Content ─────────────────────────────────────── -->
      <div class="tab-body">

        <!-- Overview ── -->
        <div v-if="activeTab === 'Overview'" class="tab-overview">

          <div class="overview-main">
            <h3 class="content-label">Synopsis</h3>
            <p class="synopsis" :class="{ 'synopsis-clamped': !synopsisOpen }">
              {{ movie.description || staticSynopsis }}
            </p>
            <button class="show-more" @click="synopsisOpen = !synopsisOpen">
              {{ synopsisOpen ? 'Show less ▲' : 'Show more ▼' }}
            </button>
          </div>

          <div class="details-grid">
            <div class="detail-row" v-for="d in detailRows" :key="d.label">
              <span class="detail-lbl">{{ d.label }}</span>
              <span class="detail-val">{{ d.value }}</span>
            </div>
          </div>

          <div class="genre-pill-group">
            <span class="genre-link-pill" v-for="g in genrePills" :key="g">{{ g }}</span>
          </div>
        </div>

        <!-- Cast ── -->
        <div v-else-if="activeTab === 'Cast'" class="tab-cast">
          <h3 class="content-label">Cast</h3>
          <div class="cast-scroll-row">
            <div class="cast-card" v-for="c in castList" :key="c.actor">
              <div class="cast-avatar" :style="{ background: c.color }">{{ c.initials }}</div>
              <p class="cast-name">{{ c.actor }}</p>
              <p class="cast-role">{{ c.role }}</p>
            </div>
            <div class="cast-view-all-card">
              <a href="#" class="view-all-link">View full cast →</a>
            </div>
          </div>
        </div>

        <!-- Reviews ── -->
        <div v-else-if="activeTab === 'Reviews'" class="tab-reviews">

          <!-- Score summary -->
          <div class="score-card">
            <div class="score-left">
              <p class="score-big">{{ displayRating }}</p>
              <p class="score-label">out of 10</p>
            </div>
            <div class="score-bars">
              <div class="bar-row" v-for="b in starBars" :key="b.stars">
                <span class="bar-star-lbl">{{ b.stars }}★</span>
                <div class="bar-track">
                  <div class="bar-fill" :style="{ width: b.pct + '%' }" />
                </div>
                <span class="bar-pct">{{ b.pct }}%</span>
              </div>
            </div>
            <div class="score-count">
              <p class="score-total-num">{{ reviewCount }}</p>
              <p class="score-total-lbl">ratings</p>
            </div>
          </div>

          <!-- API comments shown as reviews -->
          <div v-if="comments.length > 0">
            <h3 class="content-label" style="margin-bottom:16px;">User Reviews</h3>
            <div class="review-card" v-for="(c, i) in comments" :key="'api-'+i">
              <div class="review-header">
                <div class="reviewer-avatar" :style="{ background: avatarColors[i % avatarColors.length] }">
                  {{ getUserInitials(c.userId) }}
                </div>
                <div>
                  <p class="reviewer-username">@viewer_{{ String(c.userId).slice(-4) }}</p>
                  <p class="reviewer-date">Recently</p>
                </div>
                <div class="review-stars">
                  <span v-for="s in 5" :key="s" :class="s <= 4 ? 'star-f' : 'star-e'">★</span>
                </div>
              </div>
              <p class="review-body-text">{{ c.comment }}</p>
            </div>
          </div>

          <!-- Write a review -->
          <div class="write-review-block" v-if="auth.isLoggedIn">
            <h3 class="content-label">Write a Review</h3>

            <!-- Star rating picker -->
            <div class="star-picker">
              <button
                v-for="n in 5"
                :key="n"
                class="star-btn"
                @mouseenter="hoverRating = n"
                @mouseleave="hoverRating = 0"
                @click="reviewRating = n"
                :aria-label="`Rate ${n} out of 5`"
              >
                <svg width="24" height="24" viewBox="0 0 24 24"
                  :fill="n <= (hoverRating || reviewRating) ? '#EF9F27' : 'none'"
                  :stroke="n <= (hoverRating || reviewRating) ? '#EF9F27' : 'rgba(255,255,255,0.25)'"
                  stroke-width="1.5">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                </svg>
              </button>
              <span class="star-label" v-if="reviewRating">{{ reviewRating }}/5</span>
              <span class="star-label muted" v-else>Select a rating</span>
            </div>

            <textarea
              id="addComment"
              class="review-textarea"
              v-model="newComment"
              placeholder="Share your thoughts on this film…"
              rows="4"
            />
            <div class="review-submit-row">
              <button class="btn-submit-review" @click="submitReview" :disabled="submitting || !reviewRating">
                {{ submitting ? 'Submitting…' : 'Submit Review' }}
              </button>
              <span v-if="!reviewRating && !submitting" class="review-hint">Pick a star rating first</span>
              <span v-if="commentError" class="review-err">{{ commentError }}</span>
              <span v-if="commentSuccess" class="review-ok">Review submitted!</span>
            </div>
          </div>
          <div v-else class="login-to-review">
            <router-link to="/login">Login</router-link> to write a review
          </div>
        </div>

        <!-- More Like This ── -->
        <div v-else-if="activeTab === 'More Like This'" class="tab-more">
          <h3 class="content-label">More Like This</h3>
          <div class="similar-grid">
            <div class="sim-card" v-for="f in similarFilms" :key="f.title">
              <div class="sim-poster" :style="{ background: f.gradient }">
                <div class="sim-overlay">
                  <div class="sim-play">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
                  </div>
                </div>
                <span class="sim-genre-tag">{{ f.genre }}</span>
              </div>
              <p class="sim-title">{{ f.title }}</p>
              <p class="sim-caption">⭐ {{ f.rating }} · {{ f.year }}</p>
            </div>
          </div>
        </div>

      </div>
    </template>

    <div v-else class="not-found">Movie not found.</div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { auth } from '../store/auth.js'
import { API } from '../config.js'
const route = useRoute()

/* ── API state ───────────────────────────────────────────────── */
const movie      = ref(null)
const comments   = ref([])
const loading    = ref(true)
const newComment     = ref('')
const reviewRating   = ref(0)
const hoverRating    = ref(0)
const submitting     = ref(false)
const commentError   = ref('')
const commentSuccess = ref(false)

/* ── UI state ────────────────────────────────────────────────── */
const tabs        = ['Overview', 'Cast', 'Reviews', 'More Like This']
const activeTab   = ref('Overview')
const synopsisOpen    = ref(false)

/* ── Genre → gradient map ────────────────────────────────────── */
const genreThemes = {
  'Sci-Fi':   { bd: 'linear-gradient(135deg,#090614 0%,#150a30 50%,#05030e 100%)', po: 'linear-gradient(175deg,#14093a,#2e1560,#08041a)' },
  'Action':   { bd: 'linear-gradient(135deg,#130604 0%,#2a0e08 50%,#090402 100%)', po: 'linear-gradient(175deg,#3a0e0e,#5e1812,#1c0808)' },
  'Thriller': { bd: 'linear-gradient(135deg,#06080e 0%,#0c1020 50%,#030408 100%)', po: 'linear-gradient(175deg,#0c1428,#162242,#07090f)' },
  'Drama':    { bd: 'linear-gradient(135deg,#06080a 0%,#0c1410 50%,#030504 100%)', po: 'linear-gradient(175deg,#0c2814,#163820,#070f09)' },
  'Horror':   { bd: 'linear-gradient(135deg,#0a0404 0%,#160606 50%,#050202 100%)', po: 'linear-gradient(175deg,#1c0808,#300c0c,#100606)' },
  'Romance':  { bd: 'linear-gradient(135deg,#0e0608 0%,#1e0c14 50%,#07030a 100%)', po: 'linear-gradient(175deg,#280e18,#381428,#100810)' },
}
const defaultTheme = { bd: 'linear-gradient(135deg,#080808,#141414,#050505)', po: 'linear-gradient(175deg,#141414,#202020,#0a0a0a)' }

const theme = computed(() => genreThemes[movie.value?.genre] || defaultTheme)
const backdropGradient = computed(() => theme.value.bd)
const posterGradient   = computed(() => theme.value.po)

/* ── Derived display values ──────────────────────────────────── */
const eyebrow = computed(() => {
  const g = movie.value?.genre || ''
  return g.toUpperCase() + (g ? ' · EPIC' : '')
})

const taglineMap = {
  'Dune: Part Three': 'The spice must flow — for the last time.',
  'Eternal Run':       'Time is her weapon. The world her track.',
  'The Hollow Earth':  'What lies beneath will change everything.',
}
const tagline = computed(() =>
  taglineMap[movie.value?.title] || `${movie.value?.genre || 'Cinema'} at its finest.`
)

const durationMap   = { 'Sci-Fi': '2h 44m', 'Action': '2h 05m', 'Thriller': '2h 12m', 'Drama': '2h 02m', 'Horror': '1h 58m', 'Romance': '1h 52m' }
const mpaaMap       = { 'Sci-Fi': 'PG-13', 'Action': 'PG-13', 'Thriller': 'R', 'Drama': 'PG-13', 'Horror': 'R', 'Romance': 'PG-13' }
const ratingMap     = { 'Sci-Fi': '9.1', 'Action': '8.4', 'Thriller': '8.7', 'Drama': '8.3', 'Horror': '7.9', 'Romance': '7.2' }

const duration     = computed(() => durationMap[movie.value?.genre]  || '2h 00m')
const mpaaRating   = computed(() => mpaaMap[movie.value?.genre]      || 'PG-13')
const displayRating= computed(() => movie.value?.rating ?? ratingMap[movie.value?.genre] ?? '8.0')
const reviewCount  = computed(() => {
  const base = { 'Sci-Fi': '142K', 'Action': '98K', 'Thriller': '87K', 'Drama': '74K', 'Horror': '56K', 'Romance': '43K' }
  return base[movie.value?.genre] || '62K'
})

const staticSynopsis = computed(() =>
  `${movie.value?.title || 'This film'} is a gripping story that pulls you in from the first frame. ` +
  `Directed with precision and performed with heart, it stands as one of the defining releases of ${movie.value?.year || 'its year'}.`
)

/* ── Details grid ────────────────────────────────────────────── */
const detailRows = computed(() => [
  { label: 'Director',     value: movie.value?.director || 'Denis Villeneuve' },
  { label: 'Writers',      value: 'Jon Spaihts, Denis Villeneuve' },
  { label: 'Producers',    value: 'Mary Parent, Cale Boyter' },
  { label: 'Studio',       value: 'Legendary Pictures' },
  { label: 'Language',     value: 'English' },
  { label: 'Country',      value: 'USA' },
  { label: 'Release Date', value: `${movie.value?.year || 2026}` },
  { label: 'Budget',       value: '$230M estimated' },
  { label: 'Box Office',   value: '$1.4B worldwide' },
])

const genrePills = computed(() => {
  const base = [movie.value?.genre]
  const extras = { 'Sci-Fi': ['Adventure', 'Epic', 'Drama'], 'Action': ['Thriller', 'Drama'], 'Thriller': ['Mystery', 'Drama'], 'Drama': ['Romance'], 'Horror': ['Thriller'], 'Romance': ['Drama'] }
  return [...new Set([...base, ...(extras[movie.value?.genre] || [])])].filter(Boolean)
})

/* ── Cast list ───────────────────────────────────────────────── */
const castList = [
  { actor: 'Timothée Chalamet', role: 'Paul Atreides',   initials: 'TC', color: '#241060' },
  { actor: 'Zendaya',           role: 'Chani',           initials: 'Z',  color: '#102840' },
  { actor: 'Rebecca Ferguson',  role: 'Lady Jessica',    initials: 'RF', color: '#0a2814' },
  { actor: 'Florence Pugh',     role: 'Princess Irulan', initials: 'FP', color: '#28100a' },
  { actor: 'Austin Butler',     role: 'Feyd-Rautha',     initials: 'AB', color: '#200a28' },
  { actor: 'Javier Bardem',     role: 'Stilgar',         initials: 'JB', color: '#282010' },
  { actor: 'Léa Seydoux',       role: 'Lady Margot',     initials: 'LS', color: '#101828' },
  { actor: 'Josh Brolin',       role: 'Gurney Halleck',  initials: 'JBr',color: '#141410' },
]

/* ── Star breakdown ──────────────────────────────────────────── */
const starBars = [
  { stars: 5, pct: 72 },
  { stars: 4, pct: 18 },
  { stars: 3, pct: 6  },
  { stars: 2, pct: 2  },
  { stars: 1, pct: 2  },
]


/* ── More Like This ──────────────────────────────────────────── */
const similarFilms = [
  { title: 'Arrival II',       genre: 'Sci-Fi', year: 2025, rating: '8.9', gradient: 'linear-gradient(175deg,#0d1c32,#1a3050,#08100a)' },
  { title: "Gravity's Edge",   genre: 'Sci-Fi', year: 2024, rating: '8.5', gradient: 'linear-gradient(175deg,#0a0c22,#121530,#05060e)' },
  { title: 'Interstellar',     genre: 'Sci-Fi', year: 2014, rating: '8.6', gradient: 'linear-gradient(175deg,#080c1e,#101838,#040810)' },
  { title: 'The Martian',      genre: 'Sci-Fi', year: 2015, rating: '8.0', gradient: 'linear-gradient(175deg,#1e0c0c,#300e10,#0c0606)' },
  { title: 'Ad Astra',         genre: 'Sci-Fi', year: 2019, rating: '7.4', gradient: 'linear-gradient(175deg,#08101e,#101828,#04080a)' },
  { title: 'Blade Runner 2049',genre: 'Sci-Fi', year: 2017, rating: '8.0', gradient: 'linear-gradient(175deg,#120820,#201030,#080410)' },
]

/* ── Helpers ─────────────────────────────────────────────────── */
const avatarColors = ['#241060','#102840','#0a2814','#28100a','#200a28','#282010','#101828']

function getUserInitials(userId) {
  if (!userId) return 'U'
  const s = String(userId)
  return s.slice(-2).toUpperCase()
}

/* ── API calls ───────────────────────────────────────────────── */
async function fetchMovie() {
  loading.value = true
  try {
    const res = await axios.get(`${API}/movies/getMovie/${route.params.id}`)
    movie.value = res.data.movie || res.data
  } catch {
    movie.value = null
  } finally {
    loading.value = false
  }
}

async function fetchComments() {
  try {
    const res = await axios.get(`${API}/movies/getComments/${route.params.id}`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    comments.value = res.data.comments || (Array.isArray(res.data) ? res.data : [])
  } catch {
    comments.value = []
  }
}

async function submitReview() {
  if (!newComment.value.trim()) return
  commentError.value = ''
  commentSuccess.value = false
  submitting.value = true
  try {
    const ratingPrefix = reviewRating.value ? `[${'★'.repeat(reviewRating.value)}${'☆'.repeat(5 - reviewRating.value)} ${reviewRating.value}/5] ` : ''
    await axios.patch(
      `${API}/movies/addComment/${route.params.id}`,
      { comment: ratingPrefix + newComment.value },
      { headers: { Authorization: `Bearer ${auth.token}` }, timeout: 60000 }
    )
    newComment.value = ''
    reviewRating.value = 0
    commentSuccess.value = true
    setTimeout(() => { commentSuccess.value = false }, 3000)
  } catch (err) {
    if (err.code === 'ECONNABORTED') {
      commentError.value = 'Request timed out — try again.'
    } else {
      commentError.value = err.response?.data?.message || 'Failed to submit review.'
    }
  } finally {
    submitting.value = false
  }
  // Refresh comments separately — never let this failure affect the submit result
  fetchComments()
}

onMounted(async () => {
  await fetchMovie()
  await fetchComments()
})
</script>

<style scoped>
/* ── Page ────────────────────────────────────────────────────── */
.detail-page {
  background: var(--bg-primary);
  min-height: 100vh;
}

/* ── Loading screen ──────────────────────────────────────────── */
.load-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60vh;
}

.not-found {
  text-align: center;
  padding: 80px 24px;
  color: var(--text-muted);
}

/* ── Hero ────────────────────────────────────────────────────── */
.detail-hero {
  position: relative;
  height: 440px;
  overflow: hidden;
  margin-top: -60px;
  padding-top: 60px;
}

.hero-backdrop {
  position: absolute;
  inset: -30px;
  filter: blur(50px) saturate(0.35);
}

.hero-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    #0d0d0f 0%,
    rgba(13,13,15,0.97) 18%,
    rgba(13,13,15,0.70) 45%,
    rgba(13,13,15,0.20) 100%
  );
}

.hero-panel {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0 48px 36px;
  display: flex;
  align-items: flex-end;
  gap: 24px;
  z-index: 1;
}

/* Poster thumbnail */
.hero-thumb {
  width: 110px;
  aspect-ratio: 2 / 3;
  border-radius: 10px;
  flex-shrink: 0;
  box-shadow: 0 8px 32px rgba(0,0,0,0.7);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  padding: 8px;
}

.thumb-genre {
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.8px;
  color: rgba(255,255,255,0.6);
}

/* Info block */
.hero-info {
  padding-bottom: 4px;
}

.hero-eyebrow {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--accent-red);
  margin-bottom: 8px;
}

.hero-title {
  font-size: 32px;
  font-weight: 600;
  letter-spacing: -0.5px;
  color: #fff;
  margin-bottom: 6px;
  line-height: 1.15;
}

.hero-tagline {
  font-size: 14px;
  font-style: italic;
  color: var(--text-muted);
  margin-bottom: 12px;
}

.hero-rating-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.rating-star { color: var(--accent-amber); margin-right: 4px; }
.rating-num  { font-size: 18px; font-weight: 600; color: #fff; }
.rating-denom{ font-size: 14px; color: var(--text-muted); }
.rating-count{ font-size: 13px; color: var(--text-muted); }

.hero-chips {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.chip {
  font-size: 13px;
  color: var(--text-secondary);
}

.chip-sep {
  color: var(--text-muted);
  font-size: 13px;
}

.chip-quality {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.16);
  color: rgba(255,255,255,0.55);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.5px;
  padding: 2px 7px;
  border-radius: 4px;
}

/* ── Action row ──────────────────────────────────────────────── */
.action-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 48px 24px;
  flex-wrap: wrap;
}

.btn-play {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 48px;
  padding: 0 28px;
  background: var(--accent-red);
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
  border: none;
  border-radius: var(--radius-btn);
  cursor: pointer;
  transition: background 0.15s;
}
.btn-play:hover { background: var(--accent-red-hover); }

.btn-ghost-lg {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 48px;
  padding: 0 20px;
  background: none;
  border: 1px solid var(--border-medium);
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  border-radius: var(--radius-btn);
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}
.btn-ghost-lg:hover { background: var(--bg-elevated); border-color: rgba(255,255,255,0.22); }

.btn-icon-action {
  width: 48px;
  height: 48px;
  background: none;
  border: 1px solid var(--border-medium);
  color: var(--text-secondary);
  border-radius: var(--radius-btn);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
}
.btn-icon-action:hover { background: var(--bg-elevated); color: var(--text-primary); }

/* ── Tab bar ─────────────────────────────────────────────────── */
.tab-bar {
  position: sticky;
  top: 60px;
  z-index: 80;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-subtle);
  padding: 0 48px;
}

.tab-bar-inner {
  display: flex;
  gap: 0;
}

.tab-btn {
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  padding: 14px 18px;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  margin-bottom: -1px;
}

.tab-btn:hover { color: var(--text-primary); }

.tab-btn.active {
  color: #fff;
  border-bottom-color: #fff;
}

/* ── Tab body ────────────────────────────────────────────────── */
.tab-body {
  padding: 36px 48px 60px;
  max-width: 900px;
}

.content-label {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--text-muted);
  margin-bottom: 14px;
}

/* ── Overview tab ────────────────────────────────────────────── */
.tab-overview {}

.overview-main {
  margin-bottom: 36px;
}

.synopsis {
  font-size: 15px;
  line-height: 1.75;
  color: var(--text-secondary);
  transition: all 0.2s;
}

.synopsis-clamped {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.show-more {
  background: none;
  border: none;
  color: var(--accent-red);
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  padding: 8px 0 0;
  transition: color 0.15s;
}
.show-more:hover { color: var(--accent-red-hover); }

/* Details 2-column grid */
.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-card);
  overflow: hidden;
  margin-bottom: 28px;
}

.detail-row {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-subtle);
}

.detail-row:nth-last-child(-n+2) { border-bottom: none; }

.detail-lbl {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
  flex-shrink: 0;
  min-width: 100px;
}

.detail-val {
  font-size: 13px;
  color: var(--text-primary);
}

.genre-pill-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}

.genre-link-pill {
  background: rgba(226,75,74,0.1);
  border: 1px solid rgba(226,75,74,0.25);
  color: var(--accent-red);
  font-size: 12px;
  font-weight: 500;
  padding: 5px 14px;
  border-radius: var(--radius-pill);
  cursor: pointer;
  transition: background 0.15s;
}
.genre-link-pill:hover { background: rgba(226,75,74,0.2); }

/* ── Cast tab ────────────────────────────────────────────────── */
.cast-scroll-row {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  scrollbar-width: none;
  padding-bottom: 8px;
}
.cast-scroll-row::-webkit-scrollbar { display: none; }

.cast-card {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100px;
  text-align: center;
}

.cast-avatar {
  width: 64px;
  height: 64px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  color: rgba(255,255,255,0.8);
  flex-shrink: 0;
}

.cast-name {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1.3;
}

.cast-role {
  font-size: 11px;
  color: var(--text-muted);
  line-height: 1.3;
}

.cast-view-all-card {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 0 8px;
}

.view-all-link {
  font-size: 13px;
  color: var(--accent-red);
  white-space: nowrap;
}

/* ── Reviews tab ─────────────────────────────────────────────── */
.score-card {
  display: flex;
  align-items: center;
  gap: 32px;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-card);
  padding: 24px 28px;
  margin-bottom: 32px;
}

.score-left { text-align: center; }

.score-big {
  font-size: 48px;
  font-weight: 600;
  letter-spacing: -2px;
  color: #fff;
  line-height: 1;
}

.score-label {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 4px;
}

.score-bars {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.bar-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.bar-star-lbl {
  font-size: 12px;
  color: var(--text-secondary);
  width: 24px;
  flex-shrink: 0;
}

.bar-track {
  flex: 1;
  height: 6px;
  background: var(--bg-elevated);
  border-radius: 3px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: var(--accent-amber);
  border-radius: 3px;
  transition: width 0.4s ease;
}

.bar-pct {
  font-size: 11px;
  color: var(--text-muted);
  width: 32px;
  text-align: right;
  flex-shrink: 0;
}

.score-count { text-align: center; }
.score-total-num { font-size: 20px; font-weight: 600; color: #fff; }
.score-total-lbl { font-size: 12px; color: var(--text-muted); }

/* Review cards */
.review-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-card);
  padding: 20px;
  margin-bottom: 12px;
  transition: border-color 0.15s;
}
.review-card:hover { border-color: var(--border-medium); }

.review-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.reviewer-avatar {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: rgba(255,255,255,0.8);
  flex-shrink: 0;
}

.reviewer-username {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
}

.reviewer-date {
  font-size: 11px;
  color: var(--text-muted);
}

.review-stars {
  margin-left: auto;
  display: flex;
  gap: 2px;
}

.star-f { color: var(--accent-amber); font-size: 14px; }
.star-e { color: var(--text-muted);   font-size: 14px; }

.review-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.review-body-text {
  font-size: 13px;
  line-height: 1.7;
  color: var(--text-secondary);
  cursor: pointer;
}

.body-clamped {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.review-footer {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.helpful-count {
  font-size: 12px;
  color: var(--text-muted);
}

.btn-load-reviews {
  background: none;
  border: 1px solid var(--border-medium);
  color: var(--text-secondary);
  font-size: 13px;
  font-family: inherit;
  padding: 9px 20px;
  border-radius: var(--radius-btn);
  cursor: pointer;
  margin: 8px 0 28px;
  transition: color 0.15s, border-color 0.15s;
}
.btn-load-reviews:hover { color: var(--text-primary); border-color: rgba(255,255,255,0.2); }

/* Write a review */
.write-review-block {
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid var(--border-subtle);
}

/* Star picker */
.star-picker {
  display: flex; align-items: center; gap: 4px; margin-bottom: 14px;
}
.star-btn {
  background: none; border: none; cursor: pointer; padding: 2px;
  display: flex; align-items: center; transition: transform 0.1s;
}
.star-btn:hover { transform: scale(1.15); }
.star-label {
  margin-left: 8px; font-size: 13px; font-weight: 500; color: var(--accent-amber);
}
.star-label.muted { color: var(--text-muted); font-weight: 400; }

.review-textarea {
  width: 100%;
  background: var(--bg-elevated);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-card);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 14px;
  line-height: 1.7;
  padding: 14px 16px;
  resize: vertical;
  outline: none;
  transition: border-color 0.15s;
  margin-bottom: 12px;
}
.review-textarea:focus { border-color: var(--accent-red); }
.review-textarea::placeholder { color: var(--text-muted); }

.review-submit-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.btn-submit-review {
  background: none;
  border: 1px solid var(--border-medium);
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  padding: 10px 24px;
  border-radius: var(--radius-btn);
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}
.btn-submit-review:hover { background: var(--bg-elevated); border-color: rgba(255,255,255,0.2); }
.btn-submit-review:disabled { opacity: 0.5; cursor: default; }

.review-err  { font-size: 13px; color: #ff7b7a; }
.review-ok   { font-size: 13px; color: #6de89a; }
.review-hint { font-size: 13px; color: var(--text-muted); }

.login-to-review {
  margin-top: 24px;
  font-size: 14px;
  color: var(--text-secondary);
  padding: 20px;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-card);
  text-align: center;
}

/* ── More Like This ──────────────────────────────────────────── */
.similar-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.sim-card { cursor: pointer; }

.sim-poster {
  width: 100%;
  aspect-ratio: 2 / 3;
  border-radius: var(--radius-card);
  position: relative;
  overflow: hidden;
  transition: transform 0.2s;
}
.sim-card:hover .sim-poster { transform: scale(1.02); }

.sim-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  border-radius: var(--radius-card);
}
.sim-card:hover .sim-overlay { opacity: 1; }

.sim-play {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  background: rgba(255,255,255,0.15);
  border: 1.5px solid rgba(255,255,255,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  padding-left: 2px;
  backdrop-filter: blur(4px);
}

.sim-genre-tag {
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: rgba(0,0,0,0.7);
  color: rgba(255,255,255,0.6);
  font-size: 10px;
  font-weight: 500;
  padding: 2px 7px;
  border-radius: var(--radius-pill);
}

.sim-title {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-primary);
  margin-top: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sim-caption {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 2px;
}

/* ── 3-dot pulse ─────────────────────────────────────────────── */
.dot-pulse { display: inline-flex; gap: 5px; align-items: center; }
.dot-pulse span { width: 8px; height: 8px; border-radius: 50%; background: var(--accent-red); animation: dp 1.2s infinite ease-in-out; }
.dot-pulse span:nth-child(2) { animation-delay: 0.2s; }
.dot-pulse span:nth-child(3) { animation-delay: 0.4s; }
@keyframes dp { 0%,80%,100%{transform:scale(0.6);opacity:0.4} 40%{transform:scale(1);opacity:1} }

/* ── Responsive ──────────────────────────────────────────────── */
@media (max-width: 1024px) {
  .hero-panel { padding: 0 24px 28px; }
  .action-row { padding: 16px 24px 20px; }
  .tab-bar    { padding: 0 24px; }
  .tab-body   { padding: 28px 24px 48px; }
  .details-grid { grid-template-columns: 1fr; }
  .detail-row:nth-last-child(-n+2) { border-bottom: 1px solid var(--border-subtle); }
  .detail-row:last-child { border-bottom: none; }
}

@media (max-width: 640px) {
  .detail-hero { height: 360px; }
  .hero-panel  { padding: 0 16px 20px; gap: 16px; }
  .hero-thumb  { width: 80px; }
  .hero-title  { font-size: 22px; }
  .hero-tagline{ display: none; }
  .action-row  { padding: 14px 16px; gap: 8px; }
  .btn-ghost-lg{ padding: 0 14px; font-size: 13px; }
  .tab-bar     { padding: 0 16px; }
  .tab-btn     { padding: 12px 12px; font-size: 13px; }
  .tab-body    { padding: 20px 16px 40px; }
  .score-card  { flex-wrap: wrap; gap: 20px; }
  .similar-grid{ grid-template-columns: repeat(2, 1fr); }
}
</style>
