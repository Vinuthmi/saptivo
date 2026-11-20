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
        component: () => import('../views/homeView.vue'),
      },
      {
        path: 'features/',
        name: 'features',
        component: () => import('../views/featuresView.vue'),
      },
      {
        path: 'features/lead-management/',
        name: 'lead-management',
        component: () => import('../views/LeadManagementView.vue'),
      },
      {
        path: 'features/multi-branch-management/',
        name: 'multi-branch-management',
        component: () => import('../views/Multi-Branch Management.vue'),
        meta: {
          title: 'Multi-Branch Management CRM | Saptivo',
          description:
            'Manage sales, staff and stock across every location from one central Saptivo dashboard.',
        },
      },
      {
        path: 'features/inventory-management/',
        name: 'inventory-management',
        component: () => import('../views/Inventory&Multi-Warehouse.vue'),
        meta: {
          title: 'Inventory & Multi-Warehouse Management | Saptivo',
          description:
            'Keep inventory accurate across branches and warehouses, with stock visibility in one Saptivo system.',
        },
      },
      {
        path: 'features/service-maintenance-management/',
        name: 'service-maintenance-management',
        component: () => import('../views/service-maintenance-management.vue'),
        meta: {
          title: 'Service & AMC Management Software | Saptivo',
          description:
            'Manage service contracts, scheduled visits and after-sales work with Saptivo service and AMC management software.',
        },
      },
      {
        path: 'features/help-desk/',
        name: 'help-desk',
        component: () => import('../views/HelpDesk&Ticketing.vue'),
        meta: {
          title: 'Help Desk & Ticketing Software | Saptivo',
          description:
            'Resolve customer issues faster with Saptivo help desk ticketing, complete customer context and support history.'
        }
      },
      {
        path: 'features/sales-pipeline/',
        name: 'sales-pipeline',
        component: () => import('../views/SalesPipelineView.vue'),
      },
      {
        path: 'features/quotations-invoicing/',
        name: 'quotations-invoicing',
        component: () => import('../views/Quotations&Invoicing.vue'),
      },
      {
        path: 'features/whatsapp-crm/',
        name: 'whatsapp-crm',
        component: () => import('../views/WhatsAppCRM.vue'),
      },
      {
        path: 'features/3cx-crm-integration/',
        name: '3CX Call Integration',
        component: () => import('../views/3CX_Call.vue'),
      },
      {
        path: 'features/3CX/',
        name: '3CX Call Integration Legacy',
        component: () => import('../views/3CX_Call.vue'),
      },
      {
        path: 'features/vodia-integration/',
        name: 'Vodia Integration & AI Calls',
        component: () => import('../views/VodiaIntegration&AiCalls.vue'),
      },
      {
        path: 'features/workflow-automation/',
        name: 'Workflow Automation',
        component: () => import('../views/WorkflowAutomationView.vue'),
      },
      {
        path: 'features/marketing-campaigns/',
        name: 'Marketing Campaigns',
        component: () => import('../views/marketing-campaigns.vue')
      },
      {
        path: 'features/ai-crm/',
        name: 'AI CRM',
        component: () => import('../views/AICRM.vue')
      },
      {
        path: 'features/customer-portal/',
        name: 'Customer Portal',
        component: () => import('../views/customer-portal.vue')
      },
      {
        path: 'features/mobile-crm/',
        name: 'Mobile CRM',
        component: () => import('../views/MobileCRM.vue')
      },
      {
        path: 'features/reports-analytics/',
        name: 'reports-analytics',
        component: () => import('../views/reports-analytics.vue'),
        meta: {
          title: 'Reports & Analytics | Saptivo',
          description:
            'Turn sales, marketing and service data into clear reports that help your team make better decisions.'
        }
      },
      {
        path: 'integrations/',
        name: 'integrations',
        component: () => import('../views/IntegrationsView.vue'),
        meta: {
          title: 'CRM Integrations | WhatsApp, 3CX, Vodia & More | Saptivo',
          description:
            'Connect Saptivo with WhatsApp Business, 3CX, Vodia, WordPress forms, Facebook Lead Ads, Google Calendar and your own tools.',
        },
      },
      {
        path: '/industries/',
        name: 'industries',
        component: () => import('../views/IndustriesView.vue'),
        meta: {
          title: 'CRM Software by Industry | Retail, Distribution, Service',
          description:
            'Saptivo adapts to your industry: retail chains, wholesale distributors, contractors, field service companies and fast-growing startups.',
        },
      },
      {
        path: '/security/',
        name: 'security',
        component: () => import('../views/securityView.vue'),
        meta: {
          title: 'CRM Security | Data Protection | Saptivo',
          description:
            'Your customer data is protected. Saptivo is secure CRM software hardened at every layer, from login to export, so your business data is never left unguarded.',
        },
      },
      {
        path: '/pricing/',
        name: 'pricing',
        component: () => import('../views/pricingView.vue'),
        meta: {
          title: 'CRM Pricing | Saptivo',
          description:
            'Saptivo is affordable CRM software with no setup fees. Start your 14-day free trial today and see how Saptivo can help your business grow.',
        },
      },
    ],
  },
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
