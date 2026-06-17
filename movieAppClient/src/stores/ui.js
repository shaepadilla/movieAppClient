import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
  const theme         = ref('dark')
  const isPageLoading = ref(false)
  const activeModal   = ref(null)

  function setTheme(t)        { theme.value = t }
  function setPageLoading(v)  { isPageLoading.value = v }
  function openModal(name)    { activeModal.value = name }
  function closeModal()       { activeModal.value = null }

  return { theme, isPageLoading, activeModal, setTheme, setPageLoading, openModal, closeModal }
})
