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
        path: 'features/',
        name: 'features',
        component: () => import('../views/featuresView.vue')
      },
      {
        path: 'features/lead-management/',
        name: 'lead-management',
        component: () => import('../views/LeadManagementView.vue')
      },
      {
        path: 'features/sales-pipeline/',
        name: 'sales-pipeline',
        component: () => import('../views/SalesPipelineView.vue')
      },
      {
        path: 'features/quotations-invoicing/',
        name: 'quotations-invoicing',
        component: () => import('../views/Quotations&Invoicing.vue')
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
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
