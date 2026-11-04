
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/homeView.vue'),
    },
    {
      path: '/features',
      name: 'features',
      component: () => import('../views/featuresView.vue'),
    },
  ],
})

export default router
