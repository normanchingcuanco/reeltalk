import { createRouter, createWebHistory } from "vue-router"
import { useAuthStore } from "../auth"

import Register from "../pages/Register.vue"
import Login from "../pages/Login.vue"
import Movies from "../pages/Movies.vue"
import MovieDetails from "../pages/MovieDetails.vue"
import Watchlist from "../pages/Watchlist.vue"
import AdminDashboard from "../pages/AdminDashboard.vue"

const routes = [
  { path: "/", redirect: "/login" },

  { path: "/register", component: Register, meta: { hideSidebar: true } },
  { path: "/login", component: Login, meta: { hideSidebar: true } },

  {
    path: "/movies",
    component: Movies,
    meta: { requiresAuth: true }
  },

  {
    path: "/movies/:id",
    component: MovieDetails,
    meta: { requiresAuth: true }
  },

  {
    path: "/watchlist",
    component: Watchlist,
    meta: { requiresAuth: true }
  },

  {
    path: "/admin",
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.token) {
    return "/login"
  }

  if (to.meta.requiresAdmin && auth.isAdmin !== true) {
    return "/movies"
  }

  return true
})

export default router