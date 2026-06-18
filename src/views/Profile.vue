<template>
  <div class="profile-page">

    <!-- ── Profile Header Card ──────────────────────────────── -->
    <div class="profile-card-wrap">
      <div class="profile-card">
        <div class="avatar-xl">{{ userInitials }}</div>

        <div class="profile-info">
          <h2 class="profile-name">{{ userName }}</h2>
          <p class="profile-email">{{ userEmail }}</p>
          <p class="profile-since">Member since March 2023</p>
          <span class="plan-badge">Premium · 4K</span>
        </div>

        <button class="btn btn-ghost btn-sm edit-btn">Edit Profile</button>
      </div>
    </div>

    <!-- ── Stats Row ─────────────────────────────────────────── -->
    <div class="stats-row">
      <div class="stat-card" v-for="s in stats" :key="s.label">
        <p class="stat-value">{{ s.value }}</p>
        <p class="stat-label">{{ s.label }}</p>
      </div>
    </div>

    <!-- ── Preferences ───────────────────────────────────────── -->
    <section class="prefs-section">
      <h3 class="section-heading">Preferences</h3>


      <div class="pref-block">
        <p class="pref-block-title">Playback</p>

        <div class="pref-row">
          <div class="pref-info">
            <p class="pref-label">Auto-play next episode</p>
          </div>
          <button class="toggle" :class="{ on: prefs.autoplay }" @click="prefs.autoplay = !prefs.autoplay">
            <span class="toggle-knob"></span>
          </button>
        </div>

        <div class="pref-row">
          <div class="pref-info">
            <p class="pref-label">Video quality</p>
          </div>
          <div class="select-wrap">
            <select v-model="prefs.videoQuality">
              <option>Auto</option><option>4K</option><option>1080p</option><option>720p</option>
            </select>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="select-chevron"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>

        <div class="pref-row">
          <div class="pref-info">
            <p class="pref-label">Download quality</p>
          </div>
          <div class="select-wrap">
            <select v-model="prefs.downloadQuality">
              <option>High</option><option>Standard</option>
            </select>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="select-chevron"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>

        <div class="pref-row">
          <div class="pref-info">
            <p class="pref-label">Subtitles</p>
          </div>
          <button class="toggle" :class="{ on: prefs.subtitles }" @click="prefs.subtitles = !prefs.subtitles">
            <span class="toggle-knob"></span>
          </button>
        </div>

        <div class="pref-row">
          <div class="pref-info">
            <p class="pref-label">Subtitle language</p>
          </div>
          <div class="select-wrap">
            <select v-model="prefs.subtitleLang" :disabled="!prefs.subtitles">
              <option>English</option><option>Spanish</option><option>French</option><option>Japanese</option>
            </select>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="select-chevron"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>
      </div>

      <div class="pref-block">
        <p class="pref-block-title">Notifications</p>

        <div class="pref-row">
          <div class="pref-info">
            <p class="pref-label">New episodes of saved shows</p>
          </div>
          <button class="toggle" :class="{ on: prefs.notifNewEps }" @click="prefs.notifNewEps = !prefs.notifNewEps">
            <span class="toggle-knob"></span>
          </button>
        </div>

        <div class="pref-row">
          <div class="pref-info">
            <p class="pref-label">New releases in my genres</p>
          </div>
          <button class="toggle" :class="{ on: prefs.notifGenres }" @click="prefs.notifGenres = !prefs.notifGenres">
            <span class="toggle-knob"></span>
          </button>
        </div>

        <div class="pref-row">
          <div class="pref-info">
            <p class="pref-label">Reelz recommendations</p>
          </div>
          <button class="toggle" :class="{ on: prefs.notifRecs }" @click="prefs.notifRecs = !prefs.notifRecs">
            <span class="toggle-knob"></span>
          </button>
        </div>
      </div>
    </section>

    <!-- ── Account ───────────────────────────────────────────── -->
    <section class="account-section">
      <h3 class="section-heading">Account</h3>
      <div class="account-list">
        <button class="account-row" v-for="row in accountRows" :key="row.label">
          <div class="account-row-left">
            <p class="account-row-label">{{ row.label }}</p>
            <p class="account-row-detail" v-if="row.detail">{{ row.detail }}</p>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="row-arrow"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    </section>

    <!-- ── Danger Zone ───────────────────────────────────────── -->
    <section class="danger-section">
      <h3 class="section-heading">Danger Zone</h3>
      <div class="danger-actions">
        <button class="btn-signout" @click="signOut">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Sign out
        </button>
        <button class="btn-delete-acct">Delete account</button>
      </div>
    </section>

  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../store/auth.js'

const router = useRouter()


const prefs = reactive({
  autoplay: true,
  videoQuality: 'Auto',
  downloadQuality: 'High',
  subtitles: false,
  subtitleLang: 'English',
  notifNewEps: true,
  notifGenres: true,
  notifRecs: false,
})

const stats = [
  { value: '247',    label: 'Films watched' },
  { value: '1,840',  label: 'Watch time (hrs)' },
  { value: '24',     label: 'In my list' },
]

const accountRows = [
  { label: 'Manage subscription', detail: 'Premium Plan · $14.99/mo' },
  { label: 'Payment method',      detail: 'Visa ending 4242' },
  { label: 'Linked devices',      detail: '3 devices' },
  { label: 'Download history',    detail: '' },
  { label: 'Watch history',       detail: '' },
  { label: 'Privacy settings',    detail: '' },
  { label: 'Help & support',      detail: '' },
]

const userInitials = computed(() => {
  if (!auth.token) return 'JL'
  try {
    const payload = JSON.parse(atob(auth.token.split('.')[1]))
    const email = payload.email || ''
    return email.slice(0, 2).toUpperCase()
  } catch { return 'JL' }
})

const userEmail = computed(() => {
  if (!auth.token) return 'jamie.lee@email.com'
  try {
    const payload = JSON.parse(atob(auth.token.split('.')[1]))
    return payload.email || 'jamie.lee@email.com'
  } catch { return 'jamie.lee@email.com' }
})

const userName = computed(() => {
  const email = userEmail.value
  const prefix = email.split('@')[0]
  return prefix.replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
})

function signOut() {
  auth.clearAuth()
  router.push('/login')
}
</script>

<style scoped>
.profile-page { min-height: 100vh; background: var(--bg-primary); padding-bottom: 80px; }

/* ── Profile card ────────────────────────────────────────────── */
.profile-card-wrap { padding: 40px 48px 0; }
.profile-card {
  background: var(--bg-card); border: 1px solid var(--border-subtle);
  border-radius: 16px; padding: 32px; display: flex; align-items: center; gap: 24px;
}

.avatar-xl {
  width: 80px; height: 80px; border-radius: 999px;
  background: var(--accent-red); color: #fff; font-size: 28px; font-weight: 600;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}

.profile-info { flex: 1; display: flex; flex-direction: column; gap: 5px; }
.profile-name  { font-size: 20px; font-weight: 600; color: var(--text-primary); letter-spacing: -0.3px; }
.profile-email { font-size: 13px; color: var(--text-secondary); }
.profile-since { font-size: 12px; color: var(--text-muted); }
.plan-badge {
  display: inline-block; margin-top: 4px;
  background: rgba(239,159,39,0.12); border: 1px solid rgba(239,159,39,0.3);
  color: var(--accent-amber); font-size: 11px; font-weight: 600;
  padding: 3px 10px; border-radius: var(--radius-pill);
}

.edit-btn { flex-shrink: 0; align-self: flex-start; }

/* ── Stats row ───────────────────────────────────────────────── */
.stats-row {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
  padding: 24px 48px;
}
.stat-card {
  background: var(--bg-card); border: 1px solid var(--border-subtle);
  border-radius: var(--radius-card); padding: 20px 24px;
  display: flex; flex-direction: column; gap: 6px;
}
.stat-value { font-size: 26px; font-weight: 700; color: var(--text-primary); letter-spacing: -0.5px; }
.stat-label { font-size: 12px; color: var(--text-muted); }

/* ── Preferences ─────────────────────────────────────────────── */
.prefs-section { padding: 0 48px 24px; }
.section-heading {
  font-size: 15px; font-weight: 600; color: var(--text-primary);
  margin-bottom: 16px; padding-bottom: 12px;
  border-bottom: 1px solid var(--border-subtle);
}

.pref-block { margin-bottom: 28px; }
.pref-block-title { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; color: var(--text-muted); margin-bottom: 4px; }

.pref-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 13px 0; border-bottom: 1px solid var(--border-subtle);
}
.pref-row:last-child { border-bottom: none; }

.pref-label { font-size: 14px; color: var(--text-primary); }

/* Toggle switch */
.toggle {
  width: 44px; height: 24px; border-radius: 999px; border: none; cursor: pointer;
  position: relative; transition: background 0.2s; background: var(--border-medium);
  flex-shrink: 0;
}
.toggle.on { background: var(--accent-red); }
.toggle-knob {
  position: absolute; top: 3px; left: 3px; width: 18px; height: 18px;
  border-radius: 999px; background: #fff; transition: transform 0.2s; box-shadow: 0 1px 4px rgba(0,0,0,0.3);
}
.toggle.on .toggle-knob { transform: translateX(20px); }


/* Select wrap */
.select-wrap { position: relative; display: flex; align-items: center; }
.select-wrap select {
  appearance: none; -webkit-appearance: none; background: var(--bg-elevated);
  border: 1px solid var(--border-medium); color: var(--text-primary);
  font-family: inherit; font-size: 13px; font-weight: 500;
  padding: 6px 28px 6px 12px; border-radius: var(--radius-btn); cursor: pointer; outline: none;
}
.select-wrap select:disabled { opacity: 0.4; cursor: not-allowed; }
.select-wrap select option { background: var(--bg-elevated); }
.select-chevron { position: absolute; right: 10px; color: var(--text-muted); pointer-events: none; }

/* ── Account section ─────────────────────────────────────────── */
.account-section { padding: 0 48px 24px; }

.account-list {
  background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-card); overflow: hidden;
}
.account-row {
  width: 100%; display: flex; align-items: center; justify-content: space-between;
  padding: 15px 20px; background: none; border: none; cursor: pointer;
  border-bottom: 1px solid var(--border-subtle); text-align: left; transition: background 0.15s;
}
.account-row:last-child { border-bottom: none; }
.account-row:hover { background: var(--bg-elevated); }
.account-row-left { display: flex; flex-direction: column; gap: 3px; }
.account-row-label  { font-size: 14px; font-weight: 500; color: var(--text-primary); }
.account-row-detail { font-size: 12px; color: var(--text-muted); }
.row-arrow { color: var(--text-muted); flex-shrink: 0; }

/* ── Danger zone ─────────────────────────────────────────────── */
.danger-section { padding: 0 48px; }

.danger-actions { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }

.btn-signout {
  display: inline-flex; align-items: center; gap: 8px;
  background: none; border: 1.5px solid var(--accent-red); color: var(--accent-red);
  font-size: 14px; font-weight: 500; font-family: inherit;
  padding: 10px 22px; border-radius: var(--radius-btn); cursor: pointer; transition: all 0.15s;
}
.btn-signout:hover { background: rgba(226,75,74,0.08); }

.btn-delete-acct {
  background: none; border: none; color: var(--accent-red); font-size: 13px;
  font-family: inherit; cursor: pointer; opacity: 0.65; transition: opacity 0.15s; padding: 4px;
  text-decoration: underline;
}
.btn-delete-acct:hover { opacity: 1; }

/* ── Shared buttons ──────────────────────────────────────────── */
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; font-family: inherit; font-size: 14px; font-weight: 500; padding: 8px 18px; border-radius: var(--radius-btn); border: none; cursor: pointer; transition: background 0.15s, border-color 0.15s; }
.btn-ghost { background: none; color: var(--text-secondary); border: 1px solid var(--border-medium); }
.btn-ghost:hover { color: var(--text-primary); background: var(--bg-elevated); }
.btn-sm { padding: 6px 14px; font-size: 13px; }

/* ── Responsive ──────────────────────────────────────────────── */
@media (max-width: 1024px) {
  .profile-card-wrap { padding: 28px 24px 0; }
  .stats-row         { padding: 20px 24px; }
  .prefs-section     { padding: 0 24px 24px; }
  .account-section   { padding: 0 24px 24px; }
  .danger-section    { padding: 0 24px; }
}
@media (max-width: 640px) {
  .profile-card-wrap { padding: 20px 16px 0; }
  .profile-card      { flex-direction: column; align-items: flex-start; gap: 16px; padding: 24px; }
  .edit-btn          { align-self: stretch; text-align: center; }
  .stats-row         { grid-template-columns: 1fr; padding: 16px; }
  .prefs-section, .account-section, .danger-section { padding-left: 16px; padding-right: 16px; }
}
</style>
