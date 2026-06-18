import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import Movies from '../views/Movies.vue'
import MovieView from '../views/MovieView.vue'
import AddMovie from '../views/AddMovie.vue'
import UpdateMovie from '../views/UpdateMovie.vue'
import MyList from '../views/MyList.vue'
import Search from '../views/Search.vue'
import Profile from '../views/Profile.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/movies', component: Movies },
  { path: '/movies/:id', component: MovieView, meta: { requiresAuth: true } },
  { path: '/addMovie', component: AddMovie, meta: { requiresAdmin: true } },
  { path: '/movies/:id/edit', component: UpdateMovie, meta: { requiresAdmin: true } },
  { path: '/my-list', component: MyList, meta: { requiresAuth: true } },
  { path: '/search', component: Search },
  { path: '/profile', component: Profile, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const isAdmin = localStorage.getItem('isAdmin') === 'true'

  if (to.meta.requiresAdmin && !isAdmin) {
    next('/movies')
  } else if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
