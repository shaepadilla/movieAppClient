import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const INITIAL = [
  { id:'ml1', title:"Dune: Part Three",     type:'movie',  genre:'Sci-Fi',    year:2026, rating:'9.1', progress:0,   watched:false, newEpisode:false, gradient:'linear-gradient(175deg,#14093a,#2e1560,#08041a)' },
  { id:'ml2', title:'Interstellar',          type:'movie',  genre:'Sci-Fi',    year:2014, rating:'8.6', progress:22,  watched:false, newEpisode:false, gradient:'linear-gradient(175deg,#080c1e,#101838,#040810)' },
  { id:'ml3', title:'Wildlands',             type:'movie',  genre:'Drama',     year:2026, rating:'8.3', progress:0,   watched:false, newEpisode:false, gradient:'linear-gradient(175deg,#0c2814,#163820,#070f09)' },
  { id:'ml4', title:'The Syndicate (S1–S5)', type:'series', genre:'Crime',     year:2021, rating:'9.0', progress:100, watched:true,  newEpisode:false, gradient:'linear-gradient(175deg,#0c0e12,#141618,#060708)' },
  { id:'ml5', title:'Arrival II',            type:'movie',  genre:'Sci-Fi',    year:2025, rating:'8.9', progress:0,   watched:false, newEpisode:false, gradient:'linear-gradient(175deg,#0d1c32,#1a3050,#08100a)' },
  { id:'ml6', title:'Blackwood (S2)',        type:'series', genre:'Horror',    year:2025, rating:'8.7', progress:0,   watched:false, newEpisode:true,  gradient:'linear-gradient(175deg,#120606,#200808,#090404)' },
  { id:'ml7', title:"Gravity's Edge",        type:'movie',  genre:'Sci-Fi',    year:2024, rating:'8.5', progress:100, watched:true,  newEpisode:false, gradient:'linear-gradient(175deg,#0a0c22,#121530,#05060e)' },
  { id:'ml8', title:'The Council',           type:'series', genre:'Political', year:2023, rating:'8.9', progress:100, watched:true,  newEpisode:false, gradient:'linear-gradient(175deg,#0a1220,#0e1830,#050810)' },
]

export const useWatchlistStore = defineStore('watchlist', () => {
  const items = ref([...INITIAL])

  function add(item) {
    if (items.value.find(i => i.id === item.id)) return false // already saved
    items.value.unshift({ ...item, watched: false, progress: 0, newEpisode: false })
    return true
  }

  function remove(id) {
    const idx = items.value.findIndex(i => i.id === id)
    if (idx !== -1) items.value.splice(idx, 1)
  }

  function has(id) {
    return !!items.value.find(i => i.id === id)
  }

  function setProgress(id, pct) {
    const item = items.value.find(i => i.id === id)
    if (item) {
      item.progress = Math.min(100, Math.max(0, pct))
      item.watched  = item.progress >= 95
    }
  }

  const count = computed(() => items.value.length)

  return { items, count, add, remove, has, setProgress }
})
