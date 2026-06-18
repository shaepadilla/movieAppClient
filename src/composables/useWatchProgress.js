import { ref, computed } from 'vue'

// Persisted in localStorage so progress survives refresh
const _raw = localStorage.getItem('watchProgress')
const progress = ref(_raw ? JSON.parse(_raw) : {})

function _persist() {
  localStorage.setItem('watchProgress', JSON.stringify(progress.value))
}

export function useWatchProgress() {
  function setProgress(id, pct) {
    progress.value = { ...progress.value, [id]: Math.min(100, Math.max(0, pct)) }
    _persist()
  }

  function getProgress(id) {
    return progress.value[id] ?? 0
  }

  function isWatched(id) {
    return (progress.value[id] ?? 0) >= 95
  }

  const allProgress = computed(() => progress.value)

  return { setProgress, getProgress, isWatched, allProgress }
}
