<template>
  <div class="history-container bg-gray-50 dark:bg-gray-900 min-h-screen">
    <header class="header-bar bg-white dark:bg-gray-800 shadow-sm p-4">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center">
        <h1 class="text-xl font-bold text-gray-800 dark:text-white flex-1">
          {{ t('title') }}
        </h1>
        
        <div class="relative flex-1 max-w-xl">
          <input
            ref="searchInput"
            v-model="searchQuery"
            :placeholder="t('searchPlaceholder')"
            class="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            @input="handleSearchInput"
          />
          <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <button v-if="searchQuery" @click="clearSearch" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="flex gap-2 items-center">
          <DatePicker :model-value="selectedDate" @select="handleDateSelect" @today="handleTodaySelect" />
          <button @click="toggleTheme" class="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700" :title="darkMode ? t('lightMode') : t('darkMode')">
            <svg v-if="darkMode" class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"></path>
            </svg>
            <svg v-else class="w-5 h-5 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
            </svg>
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto p-4">
      <div class="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div class="flex items-center gap-4">
          <div class="text-sm text-gray-600 dark:text-gray-400">
            {{ t('totalHistory') }}: <span class="font-semibold text-gray-800 dark:text-gray-200">{{ totalHistoryCount }}</span>
          </div>
          <div v-if="isSearching" class="text-sm text-blue-600 dark:text-blue-400">
            {{ t('searchResultsFor') }}: "<span class="font-semibold">{{ searchQuery }}</span>"
          </div>
        </div>
        <button @click="confirmClearHistory" class="btn-secondary text-red-600 dark:text-red-400 hover:text-red-800 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
          {{ t('clearHistory') }}
        </button>
      </div>

      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="loading-spinner"></div>
        <span class="ml-2 text-gray-600 dark:text-gray-300">{{ t('loading') }}</span>
      </div>

      <div v-else-if="historyGroups.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
        {{ t('noHistory') }}
      </div>

      <div v-else class="space-y-0">
        <div v-for="(group, date) in historyGroups" :key="date" class="history-group">
          <h2 class="date-header">{{ formatDateHeading(date) }}</h2>
          <div class="divide-y divide-gray-100 dark:divide-gray-700">
            <div v-for="item in group" :key="item.id" class="history-item">
              <img :src="getFaviconUrl(item.url)" :data-url="item.url" :data-title="item.title || ''" :alt="item.title || item.url" class="favicon" @error="handleFaviconError" />
              <div class="item-content">
                <a :href="item.url" target="_blank" class="item-title" v-html="highlightText(item.title || item.url, searchQuery)"></a>
                <span class="item-url" :title="item.url" v-html="highlightText(item.url, searchQuery)"></span>
              </div>
              <span class="item-time">{{ formatTime(item.lastVisitTime) }}</span>
              <button @click="deleteSingleHistory(item)" class="delete-btn" :title="t('delete')">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="hasMore" class="mt-6 text-center">
        <button @click="loadMore" :disabled="loadingMore" class="btn-primary px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50">
          <span v-if="loadingMore">{{ t('loading') }}...</span>
          <span v-else>{{ t('loadMore') }}</span>
        </button>
      </div>
    </main>

    <div v-if="showConfirmModal" class="modal-overlay" @click.self="cancelClearHistory">
      <div class="modal-content bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">{{ t('clearHistory') }}</h3>
        <p class="text-gray-600 dark:text-gray-300 mb-4">{{ t('clearHistoryWarning') }}</p>
        <div class="flex justify-end space-x-3">
          <button @click="cancelClearHistory" class="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">{{ t('cancel') }}</button>
          <button @click="executeClearHistory" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">{{ t('confirm') }}</button>
        </div>
      </div>
    </div>

    <div v-if="showToast" class="toast bg-gray-900 dark:bg-gray-700 text-white px-4 py-2 rounded-lg shadow-lg">{{ toastMessage }}</div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, inject, nextTick } from 'vue'
import DatePicker from '@/components/DatePicker.vue'
import { highlightText, debounce } from '@/utils/helpers'

export default {
  name: 'HistoryView',
  components: { DatePicker },
  setup() {
    const t = inject('t')
    const searchInput = ref(null)
    const historyItems = ref([])
    const searchQuery = ref('')
    const loading = ref(false)
    const loadingMore = ref(false)
    const darkMode = ref(false)
    const selectedDate = ref(null)
    const selectedRange = ref('all')
    const showConfirmModal = ref(false)
    const currentPage = ref(1)
    const itemsPerPage = ref(50)
    const totalHistoryCount = ref(0)
    const isSearching = ref(false)
    const showToast = ref(false)
    const toastMessage = ref('')
    const systemThemeListener = ref(null)

    const initDarkMode = () => {
      const stored = localStorage.getItem('darkMode')
      if (stored !== null) {
        darkMode.value = stored === 'true'
      } else {
        darkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
      }
      applyTheme()
    }

    const applyTheme = () => {
      if (darkMode.value) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('darkMode', 'true')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('darkMode', 'false')
      }
    }

    const toggleTheme = () => {
      darkMode.value = !darkMode.value
      applyTheme()
    }

    const getFaviconUrl = (url) => {
      if (!url) return ''
      // 使用 Chrome 扩展内置的 favicon API
      if (chrome?.runtime?.getURL) {
        const encodedUrl = encodeURIComponent(url)
        return chrome.runtime.getURL(`/_favicon/?pageUrl=${encodedUrl}&size=32`)
      }
      // 降级：直接获取 favicon.ico
      const domain = new URL(url).hostname
      return `https://${domain}/favicon.ico`
    }

    const fetchFavicon = async (url) => {
      if (!url) return null
      const domain = new URL(url).hostname
      
      // 内网 IP 直接跳过
      if (/^(\d{1,3}\.){3}\d{1,3}$/.test(domain)) return null
      
      // 尝试获取 favicon.ico
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 2000)
        
        const response = await fetch(`https://${domain}/favicon.ico`, { 
          mode: 'cors', 
          signal: controller.signal 
        })
        clearTimeout(timeoutId)
        
        if (response.ok) {
          const blob = await response.blob()
          return URL.createObjectURL(blob)
        }
      } catch (e) {
        // fetch 失败，继续尝试其他方式
      }
      return null
    }

    const handleFaviconError = async (event) => {
      const img = event.target
      const url = img.dataset.url
      const title = img.dataset.title
      if (url && !img.dataset.tried) {
        img.dataset.tried = 'true'
        
        try {
          const faviconUrl = await fetchFavicon(url)
          if (faviconUrl) {
            img.src = faviconUrl
            return
          }
        } catch (e) {
          // 静默处理
        }
        
        // 降级：显示标题首字符图标
        const firstChar = title ? title.charAt(0).toUpperCase() : url.charAt(0).toUpperCase()
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect width="32" height="32" rx="4" fill="#f3f4f6"/><text x="16" y="22" font-size="14" text-anchor="middle" fill="#6b7280" font-family="Arial,sans-serif" font-weight="600">${firstChar}</text></svg>`
        img.src = `data:image/svg+xml,${encodeURIComponent(svg)}`
      }
    }

    const formatDateHeading = (timestamp) => {
      const date = new Date(Number(timestamp))
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      if (date.toDateString() === today.toDateString()) return 'Today'
      if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
      return date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    }

    const formatTime = (timestamp) => {
      return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const showToastMessage = (message) => {
      toastMessage.value = message
      showToast.value = true
      setTimeout(() => { showToast.value = false }, 3000)
    }

    const loadHistory = async (page = 1, append = false) => {
      if (page === 1) loading.value = true
      else loadingMore.value = true
      
      try {
        const text = searchQuery.value.trim()
        let startTime = 0, endTime = Date.now()
        
        if (selectedDate.value) {
          const date = new Date(selectedDate.value)
          startTime = new Date(date.setHours(0, 0, 0, 0)).getTime()
          endTime = new Date(date.setHours(23, 59, 59, 999)).getTime()
        } else if (selectedRange.value === 'today') {
          startTime = new Date(new Date().setHours(0, 0, 0, 0)).getTime()
        } else if (selectedRange.value === 'yesterday') {
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          startTime = new Date(yesterday.setHours(0, 0, 0, 0)).getTime()
          endTime = new Date(yesterday.setHours(23, 59, 59, 999)).getTime()
        } else if (selectedRange.value === 'week') {
          const weekAgo = new Date()
          weekAgo.setDate(weekAgo.getDate() - 7)
          startTime = weekAgo.getTime()
        } else if (selectedRange.value === 'month') {
          const monthAgo = new Date()
          monthAgo.setMonth(monthAgo.getMonth() - 1)
          startTime = monthAgo.getTime()
        }
        
        const results = await chrome.history.search({ text, startTime, endTime, maxResults: page * itemsPerPage.value })
        const sortedResults = results.sort((a, b) => b.lastVisitTime - a.lastVisitTime)
        
        if (append) historyItems.value = [...historyItems.value, ...sortedResults]
        else historyItems.value = sortedResults
        
        if (page === 1) totalHistoryCount.value = results.length
      } catch (error) {
        console.error('Error loading history:', error)
        showToastMessage(t('errorLoadingHistory'))
      } finally {
        if (page === 1) loading.value = false
        else loadingMore.value = false
      }
    }

    const handleSearchInput = debounce(() => {
      isSearching.value = searchQuery.value.trim() !== ''
      currentPage.value = 1
      loadHistory(1, false)
    }, 300)

    const clearSearch = () => {
      searchQuery.value = ''
      isSearching.value = false
      currentPage.value = 1
      loadHistory(1, false)
    }

    const handleDateSelect = (date) => {
      selectedDate.value = date
      selectedRange.value = 'all'
      currentPage.value = 1
      loadHistory(1, false)
    }

    const handleTodaySelect = () => {
      selectedDate.value = null
      selectedRange.value = 'today'
      currentPage.value = 1
      loadHistory(1, false)
    }

    const handleRangeChange = async () => {
      selectedDate.value = null
      currentPage.value = 1
      await loadHistory(1, false)
    }

    const loadMore = async () => {
      currentPage.value++
      await loadHistory(currentPage.value, true)
    }

    const confirmClearHistory = () => { showConfirmModal.value = true }
    const cancelClearHistory = () => { showConfirmModal.value = false }

    const executeClearHistory = async () => {
      try {
        await chrome.history.deleteAll()
        historyItems.value = []
        totalHistoryCount.value = 0
        showToastMessage(t('historyCleared'))
      } catch (error) {
        console.error('Error clearing history:', error)
      } finally {
        showConfirmModal.value = false
      }
    }

    const deleteSingleHistory = async (item) => {
      try {
        await chrome.history.deleteUrl({ url: item.url })
        historyItems.value = historyItems.value.filter(h => h.id !== item.id)
        totalHistoryCount.value--
        showToastMessage(t('itemDeleted'))
      } catch (error) {
        console.error('Error deleting:', error)
      }
    }

    const historyGroups = computed(() => {
      const groups = {}
      historyItems.value.forEach(item => {
        const dateKey = new Date(new Date(item.lastVisitTime).setHours(0, 0, 0, 0)).getTime()
        if (!groups[dateKey]) groups[dateKey] = []
        groups[dateKey].push(item)
      })
      return Object.keys(groups).sort((a, b) => b - a).reduce((obj, key) => { obj[key] = groups[key]; return obj }, {})
    })

    const hasMore = computed(() => historyItems.value.length < totalHistoryCount.value)
    const refreshHistory = () => { if (searchQuery.value === '' && !selectedDate.value) loadHistory() }

    onMounted(() => {
      initDarkMode()
      loadHistory()
      nextTick(() => {
        searchInput.value?.focus()
      })
      systemThemeListener.value = window.matchMedia('(prefers-color-scheme: dark)')
      systemThemeListener.value.addEventListener('change', (e) => {
        if (localStorage.getItem('darkMode') === null) {
          darkMode.value = e.matches
          applyTheme()
        }
      })
      if (chrome?.history?.onVisited) chrome.history.onVisited.addListener(refreshHistory)
    })

    onUnmounted(() => {
      if (systemThemeListener.value) systemThemeListener.value.removeEventListener('change', () => {})
      if (chrome?.history?.onVisited) chrome.history.onVisited.removeListener(refreshHistory)
    })

    return {
      searchInput,
      historyItems, historyGroups, searchQuery, loading, loadingMore, darkMode, selectedDate, selectedRange,
      showConfirmModal, totalHistoryCount, hasMore, isSearching, showToast, toastMessage,
      getFaviconUrl, handleFaviconError, formatDateHeading, formatTime, highlightText, t,
      handleSearchInput, clearSearch, handleDateSelect, handleTodaySelect, handleRangeChange,
      loadMore, confirmClearHistory, cancelClearHistory, executeClearHistory, deleteSingleHistory, toggleTheme
    }
  }
}
</script>

<style scoped>
.history-container {
  min-height: 100vh;
}

.header-bar {
  position: sticky;
  top: 0;
  z-index: 50;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
}

.dark .header-bar {
  background: #1f2937;
  border-bottom-color: #374151;
}

.loading-spinner {
  border: 2px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.history-group {
  margin-bottom: 0;
}

.date-header {
  position: sticky;
  top: 72px;
  z-index: 40;
  background: #f3f4f6;
  padding: 12px 16px;
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.dark .date-header {
  background: #374151;
  color: #f9fafb;
  border-bottom-color: #4b5563;
}

.history-item {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  gap: 10px;
  background: #ffffff;
  border-bottom: 1px solid #f3f4f6;
}

.dark .history-item {
  background: #1f2937;
  border-bottom-color: #374151;
}

.history-item:hover {
  background: #f9fafb;
}

.dark .history-item:hover {
  background: #374151;
}

.favicon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.item-content {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.item-title {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 300px;
}

.dark .item-title {
  color: #f9fafb;
}

.item-title:hover {
  color: #2563eb;
}

.dark .item-title:hover {
  color: #60a5fa;
}

.item-url {
  font-size: 12px;
  color: #6b7280;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
}

.dark .item-url {
  color: #9ca3af;
}

.item-time {
  flex-shrink: 0;
  font-size: 12px;
  color: #6b7280;
  margin-left: auto;
  padding-left: 12px;
}

.dark .item-time {
  color: #9ca3af;
}

.delete-btn {
  flex-shrink: 0;
  padding: 6px;
  border-radius: 50%;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  opacity: 0;
  transition: all 0.15s;
}

.dark .delete-btn {
  color: #9ca3af;
}

.history-item:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  background: #fee2e2;
  color: #dc2626;
}

.dark .delete-btn:hover {
  background: #7f1d1d;
  color: #fca5a5;
}

.btn-primary {
  padding: 8px 24px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  padding: 8px 16px;
  background: #f3f4f6;
  color: #dc2626;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s;
}

.dark .btn-secondary {
  background: #374151;
  color: #f87171;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.dark .btn-secondary:hover {
  background: #4b5563;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 16px;
}

.toast {
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 50;
}

:deep(.search-highlight) {
  background-color: #fef08a;
  padding: 0 2px;
  border-radius: 2px;
}

.dark :deep(.search-highlight) {
  background-color: #854d0e;
  color: white;
}
</style>
