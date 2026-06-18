import { reactive, computed } from 'vue'

export function useMovieFilters(sourceRef) {
  const filters = reactive({
    genre: '',
    yearMin: '',
    yearMax: '',
    rating: '',
    sort: 'trending',
  })

  const filtered = computed(() => {
    let list = [...sourceRef.value]
    if (filters.genre)   list = list.filter(f => f.genre === filters.genre)
    if (filters.rating)  list = list.filter(f => Number(f.rating) >= Number(filters.rating))
    if (filters.yearMin) list = list.filter(f => Number(f.year)   >= Number(filters.yearMin))
    if (filters.yearMax) list = list.filter(f => Number(f.year)   <= Number(filters.yearMax))
    if (filters.sort === 'top')    list.sort((a, b) => Number(b.rating) - Number(a.rating))
    if (filters.sort === 'newest') list.sort((a, b) => Number(b.year)   - Number(a.year))
    if (filters.sort === 'az')     list.sort((a, b) => a.title.localeCompare(b.title))
    return list
  })

  const activePills = computed(() => {
    const p = []
    if (filters.genre)   p.push({ key: 'genre',   label: filters.genre })
    if (filters.rating)  p.push({ key: 'rating',  label: `⭐ ${filters.rating}+` })
    if (filters.yearMin) p.push({ key: 'yearMin', label: `From ${filters.yearMin}` })
    if (filters.yearMax) p.push({ key: 'yearMax', label: `Until ${filters.yearMax}` })
    return p
  })

  function clearFilter(key) { filters[key] = '' }
  function clearAll() {
    filters.genre = ''
    filters.yearMin = ''
    filters.yearMax = ''
    filters.rating = ''
  }

  return { filters, filtered, activePills, clearFilter, clearAll }
}
