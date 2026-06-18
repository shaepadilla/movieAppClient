<template>
  <div class="skeleton-card">
    <div class="skeleton-poster" :class="`ratio-${safeRatio}`"></div>
    <div v-if="showMeta" class="skeleton-meta">
      <div class="skeleton-line wide"></div>
      <div class="skeleton-line narrow"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  ratio:    { type: String,  default: '2/3' },
  showMeta: { type: Boolean, default: true },
})

const safeRatio = computed(() => props.ratio.replace('/', '-'))
</script>

<style scoped>
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}

.shimmer-bg {
  background: linear-gradient(90deg,
    #1e1e22 0%,
    #1e1e22 25%,
    #2c2c32 50%,
    #1e1e22 75%,
    #1e1e22 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite linear;
}

.skeleton-card { display: flex; flex-direction: column; gap: 8px; }

.skeleton-poster {
  width: 100%; border-radius: var(--radius-card);
  composes: shimmer-bg;
  background: linear-gradient(90deg,#1e1e22 25%,#2c2c32 50%,#1e1e22 75%);
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite linear;
}
.skeleton-poster.ratio-2-3  { aspect-ratio: 2 / 3; }
.skeleton-poster.ratio-16-9 { aspect-ratio: 16 / 9; }

.skeleton-meta { display: flex; flex-direction: column; gap: 6px; }

.skeleton-line {
  height: 11px; border-radius: 6px;
  background: linear-gradient(90deg,#1e1e22 25%,#2c2c32 50%,#1e1e22 75%);
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite linear;
}
.skeleton-line.wide   { width: 85%; }
.skeleton-line.narrow { width: 55%; }
</style>
