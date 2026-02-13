import { createRouter, createWebHashHistory } from 'vue-router'
import HistoryView from '@/views/HistoryView.vue'

const routes = [
  {
    path: '/',
    name: 'History',
    component: HistoryView
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// Redirect to history page if no hash
if (window.location.hash === '') {
  window.location.hash = '/';
}

export default router
