import { ref, onMounted, onUnmounted } from 'vue'

export function useInfiniteScroll(callback, { threshold = 250 } = {}) {
  const isPending = ref(false)

  async function onScroll() {
    if (isPending.value) return
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement
    if (scrollHeight - scrollTop - clientHeight < threshold) {
      isPending.value = true
      try { await callback() } finally { isPending.value = false }
    }
  }

  onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
  onUnmounted(() => window.removeEventListener('scroll', onScroll))

  return { isPending }
}
