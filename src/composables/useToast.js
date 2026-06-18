import { ref } from 'vue'

// Module-level shared state — one queue, any component can push to it
const toasts = ref([])
let _nextId = 0

export function useToast() {
  function show(message, { type = 'success', duration = 3000 } = {}) {
    const id = ++_nextId
    toasts.value.push({ id, message, type })
    setTimeout(() => dismiss(id), duration)
    return id
  }

  function dismiss(id) {
    const idx = toasts.value.findIndex(t => t.id === id)
    if (idx !== -1) toasts.value.splice(idx, 1)
  }

  const success = (msg, opts) => show(msg, { type: 'success', ...opts })
  const error   = (msg, opts) => show(msg, { type: 'error',   ...opts })
  const info    = (msg, opts) => show(msg, { type: 'info',    ...opts })

  return { toasts, show, dismiss, success, error, info }
}
