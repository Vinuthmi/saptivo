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
        path: 'features/whatsapp-crm/',
        name: 'whatsapp-crm',
        component: () => import('../views/WhatsAppCRM.vue')
      },
      {
        path: 'features/3cx-crm-integration/',
        name: '3CX Call Integration',
        component: () => import('../views/3CX_Call.vue')
      },
      {
        path: 'features/3CX/',
        name: '3CX Call Integration Legacy',
        component: () => import('../views/3CX_Call.vue')
      },
      {
        path: 'features/vodia-integration/',
        name: 'Vodia Integration & AI Calls',
        component: () => import('../views/VodiaIntegration&AiCalls.vue')
      },
      {
        path: 'features/workflow-automation/',
        name: 'Workflow Automation',
        component: () => import('../views/WorkflowAutomationView.vue')
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
