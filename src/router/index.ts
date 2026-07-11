import { createRouter, createWebHistory } from 'vue-router'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase/index.js' // Adjust this path if your firebase config is located elsewhere

// View Imports
import Home from '../views/public/Home.vue'
import Login from '../views/auth/Login.vue'
import Dashboard from '../views/admin/Dashboard.vue' // Adjust path if it's in an 'admin' subfolder
import CampaignTheme from '../views/admin/CampaignTheme.vue'
import DataDisaggregation from '../views/admin/DataDisaggregation.vue'
import Banner from '../views/admin/Banner.vue'
import Announcements from '../views/admin/Announcements.vue'
import Activities from '../views/admin/Activities.vue'
import ActivitiesPage from '../views/public/ActivitiesPage.vue'
import Documentation from '../views/admin/Documentation.vue'
import Directory from '../views/admin/Directory.vue'
import PubDirectory from '../views/public/PubDirectory.vue'
import TWG from '../views/admin/TWG.vue'
import PubResources from '../views/public/PubResources.vue'
import Resources from '../views/admin/Resources.vue'

// Helper function to reliably check Firebase Auth state on initial page load
const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe()
        resolve(user)
      },
      reject
    )
  })
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/activities',
      name: 'ActivitiesPage',
      component: ActivitiesPage
    },
    {
      path: '/directory',
      name: 'pubdirectory',
      component: PubDirectory
    },
    {
      path: '/resources',
      name: 'pubresources',
      component: PubResources
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { requiresGuest: true } // Add meta tag to identify guest-only routes
    },
    {
      path: '/admin',
      name: 'admin',
      component: Dashboard,
      meta: { requiresAuth: true } // Add meta tag to identify protected routes
    },
    {
      path: '/admin/theme',
      name: 'theme',
      component: CampaignTheme,
      meta: { requiresAuth: true } // Add meta tag to identify protected routes
    },
    {
      path: '/admin/data',
      name: 'data',
      component: DataDisaggregation,
      meta: { requiresAuth: true } // Add meta tag to identify protected routes
    },
    {
      path: '/admin/banner',
      name: 'banner',
      component: Banner,
      meta: { requiresAuth: true } // Add meta tag to identify protected routes
    },
    {
      path: '/admin/announcements',
      name: 'announcements',
      component: Announcements,
      meta: { requiresAuth: true } // Add meta tag to identify protected routes
    },
    {
      path: '/admin/activities',
      name: 'activities',
      component: Activities,
      meta: { requiresAuth: true } // Add meta tag to identify protected routes
    },
    {
      path: '/admin/documentations',
      name: 'documentations',
      component: Documentation,
      meta: { requiresAuth: true } // Add meta tag to identify protected routes
    },
    {
      path: '/admin/directory',
      name: 'directory',
      component: Directory,
      meta: { requiresAuth: true } // Add meta tag to identify protected routes
    },
    {
      path: '/admin/twg',
      name: 'twg',
      component: TWG,
      meta: { requiresAuth: true } // Add meta tag to identify protected routes
    },
    {
      path: '/admin/resources',
      name: 'resources',
      component: Resources,
      meta: { requiresAuth: true } // Add meta tag to identify protected routes
    },
    {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/public/NotFound.vue') // Verify your exact folder track mapping here
  }
  ]
})

// Global Navigation Guard
router.beforeEach(async (to, _from, next) => {
  // Check if the route requires authentication or guest status
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
  
  // Wait for Firebase to determine the current user
  const user = await getCurrentUser()

  if (requiresAuth && !user) {
    // If route requires auth and user is NOT logged in, redirect to login
    next('/login')
  } else if (requiresGuest && user) {
    // If route is for guests (like login) and user IS logged in, redirect to admin
    next('/admin')
  } else {
    // Otherwise, proceed to the requested route
    next()
  }
})

export default router