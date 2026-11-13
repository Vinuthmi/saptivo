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
        path: 'features/multi-branch-management/',
        name: 'multi-branch-management',
        component: () => import('../views/Multi-Branch Management.vue'),
        meta: {
          title: 'Multi-Branch Management CRM | Saptivo',
          description:
            'Manage sales, staff and stock across every location from one central Saptivo dashboard.'
        }
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
        path: 'integrations/',
        name: 'integrations',
        component: () => import('../views/IntegrationsView.vue'),
        meta: {
          title: 'CRM Integrations | WhatsApp, 3CX, Vodia & More | Saptivo',
          description:
            'Connect Saptivo with WhatsApp Business, 3CX, Vodia, WordPress forms, Facebook Lead Ads, Google Calendar and your own tools.'
        }
      },
      {
        path: '/industries/',
        name: 'industries',
        component: () => import('../views/IndustriesView.vue'),
        meta: {
          title: 'CRM Software by Industry | Retail, Distribution, Service',
          description:
            'Saptivo adapts to your industry: retail chains, wholesale distributors, contractors, field service companies and fast-growing startups.'
        }
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

const defaultTitle = 'CRM Software in Sri Lanka | All-in-One Cloud CRM – Saptivo'
const defaultDescription =
  'Manage leads, WhatsApp chats, 3CX calls, quotations and invoices in one cloud CRM. No setup fee. Start your 14-day free trial of Saptivo today.'

router.afterEach((to) => {
  document.title = to.meta.title ?? defaultTitle
  const description = document.querySelector('meta[name="description"]')
  if (description) {
    description.setAttribute('content', to.meta.description ?? defaultDescription)
  }
})

export default router
