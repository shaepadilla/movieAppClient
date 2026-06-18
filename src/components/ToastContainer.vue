<template>
  <Teleport to="body">
    <div class="toast-container" aria-live="polite">
      <TransitionGroup name="toast" tag="div" class="toast-stack">
        <div
          v-for="t in toasts"
          :key="t.id"
          class="toast"
          :class="`toast-${t.type}`"
          @click="dismiss(t.id)"
        >
          <span class="toast-icon-wrap">
            <!-- success -->
            <svg v-if="t.type === 'success'" class="toast-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <!-- error -->
            <svg v-else-if="t.type === 'error'" class="toast-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            <!-- info -->
            <svg v-else class="toast-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </span>
          <span class="toast-msg">{{ t.message }}</span>
          <button class="toast-close" @click.stop="dismiss(t.id)" aria-label="Dismiss">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useToast } from '../composables/useToast.js'
const { toasts, dismiss } = useToast()
</script>

<style scoped>
.toast-container {
  position: fixed; bottom: 24px; right: 24px;
  z-index: 9999; pointer-events: none;
}

.toast-stack {
  display: flex; flex-direction: column; gap: 8px; align-items: flex-end;
}

.toast {
  pointer-events: all;
  display: flex; align-items: center; gap: 10px;
  background: #1c1c20; border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px; padding: 12px 14px;
  min-width: 240px; max-width: 340px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.6);
  cursor: pointer;
}

.toast-icon-wrap {
  flex-shrink: 0; width: 24px; height: 24px; border-radius: 999px;
  display: flex; align-items: center; justify-content: center;
}
.toast-success .toast-icon-wrap { background: rgba(34,197,94,0.15); }
.toast-success .toast-icon      { color: #4ade80; }
.toast-error   .toast-icon-wrap { background: rgba(226,75,74,0.15); }
.toast-error   .toast-icon      { color: #f87171; }
.toast-info    .toast-icon-wrap { background: rgba(99,102,241,0.15); }
.toast-info    .toast-icon      { color: #818cf8; }

.toast-msg   { flex: 1; font-size: 13px; font-weight: 500; color: var(--text-primary); line-height: 1.4; }
.toast-close {
  flex-shrink: 0; background: none; border: none; cursor: pointer;
  color: var(--text-muted); padding: 2px; border-radius: 4px; display: flex; transition: color 0.15s;
}
.toast-close:hover { color: var(--text-primary); }

/* Slide in from right */
.toast-enter-active { transition: all 0.25s cubic-bezier(0.2, 0, 0, 1); }
.toast-leave-active { transition: all 0.2s ease-in; }
.toast-enter-from   { transform: translateX(110%); opacity: 0; }
.toast-leave-to     { transform: translateX(110%); opacity: 0; }

@media (max-width: 480px) {
  .toast-container { bottom: 16px; right: 16px; left: 16px; }
  .toast { max-width: 100%; }
}
</style>
