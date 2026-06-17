<template>
  <Teleport to="body">
    <Transition name="loader">
      <div v-if="visible" class="full-loader">
        <div class="loader-brand">▶ Reelz</div>
        <div class="loader-dots">
          <span /><span /><span />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  visible: { type: Boolean, default: false },
})
</script>

<style scoped>
.full-loader {
  position: fixed; inset: 0; z-index: 9998;
  background: var(--bg-primary);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 24px;
}

.loader-brand {
  font-size: 32px; font-weight: 700; letter-spacing: -0.5px;
  color: var(--accent-red);
  animation: pulse 1.6s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.25; }
}

.loader-dots {
  display: flex; gap: 6px; align-items: center;
}
.loader-dots span {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--accent-red);
  animation: dp 1.2s infinite ease-in-out;
}
.loader-dots span:nth-child(2) { animation-delay: 0.2s; }
.loader-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes dp {
  0%,80%,100% { transform: scale(0.6); opacity: 0.35; }
  40%         { transform: scale(1);   opacity: 1; }
}

/* Fade transition */
.loader-enter-active,
.loader-leave-active { transition: opacity 0.3s; }
.loader-enter-from,
.loader-leave-to     { opacity: 0; }
</style>
