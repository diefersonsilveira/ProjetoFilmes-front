import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SearchView from '../views/SearchView.vue'
import MovieDetails from '../views/MovieDetails.vue'
import FavoritosPage from '../views/FavoritosPage.vue' 

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/search',
      name: 'search',
      component: SearchView
    },
    {
      path: '/movie/:id',
      name: 'movie-details',
      component: MovieDetails
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/favoritos',
      name: 'favoritos',
      component: FavoritosPage
    }
  ]
})

export default router
