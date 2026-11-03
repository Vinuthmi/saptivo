import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,

    children: [
      {
        path: '',
        name: 'home',
        component: () => import('../views/homeView.vue')
      },
      {
        path: '/industries/',
        name: 'industries',
        component: () => import('../views/IndustriesView.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router