import { defineStore } from 'pinia'
import { reactive, computed } from 'vue'
import { auth } from '../store/auth.js'

export const useUserStore = defineStore('user', () => {
  const prefs = reactive({
    theme:           'dark',
    autoplay:        true,
    videoQuality:    'Auto',
    downloadQuality: 'High',
    subtitles:       false,
    subtitleLang:    'English',
    notifNewEps:     true,
    notifGenres:     true,
    notifRecs:       false,
  })

  const stats = reactive({
    filmsWatched: 247,
    watchTimeHrs: 1840,
    inList:       24,
  })

  const userInitials = computed(() => {
    if (!auth.token) return 'JL'
    try {
      const p = JSON.parse(atob(auth.token.split('.')[1]))
      return (p.email || '').slice(0, 2).toUpperCase()
    } catch { return 'JL' }
  })

  const userEmail = computed(() => {
    if (!auth.token) return 'jamie.lee@email.com'
    try {
      const p = JSON.parse(atob(auth.token.split('.')[1]))
      return p.email || 'jamie.lee@email.com'
    } catch { return 'jamie.lee@email.com' }
  })

  const userName = computed(() => {
    const prefix = userEmail.value.split('@')[0]
    return prefix.replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  })

  return { prefs, stats, userInitials, userEmail, userName }
})
