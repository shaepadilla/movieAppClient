import { reactive } from 'vue'

export const auth = reactive({
  token: localStorage.getItem('token') || null,
  isAdmin: localStorage.getItem('isAdmin') === 'true',

  get isLoggedIn() {
    return !!this.token
  },

  setAuth(token, isAdmin) {
    this.token = token
    this.isAdmin = isAdmin
    localStorage.setItem('token', token)
    localStorage.setItem('isAdmin', String(isAdmin))
  },

  clearAuth() {
    this.token = null
    this.isAdmin = false
    localStorage.removeItem('token')
    localStorage.removeItem('isAdmin')
  }
})
