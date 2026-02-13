<template>
  <div class="popup-container bg-gray-50 dark:bg-gray-900 min-h-screen">
    <div class="p-4">
      <header class="mb-4">
        <h1 class="text-xl font-bold text-gray-800 dark:text-white">{{ $t('message.recentHistory') }}</h1>
      </header>
      
      <div class="mb-4">
        <input
          v-model="searchQuery"
          :placeholder="$t('message.searchPlaceholder')"
          class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          @keyup.enter="performSearch"
        />
        <button 
          @click="performSearch"
          class="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors"
        >
          {{ $t('message.title') }}
        </button>
      </div>
      
      <div v-if="loading" class="flex justify-center items-center py-8">
        <div class="loading-spinner"></div>
        <span class="ml-2 text-gray-600 dark:text-gray-300">{{ $t('message.loading') }}</span>
      </div>
      
      <div v-else-if="historyItems.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
        {{ $t('message.noHistory') }}
      </div>
      
      <div v-else class="space-y-2 max-h-[400px] overflow-y-auto">
        <div 
          v-for="item in historyItems" 
          :key="item.id"
          class="card bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
        >
          <a 
            :href="item.url" 
            target="_blank"
            class="block truncate text-sm text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <div class="font-medium">{{ item.title || item.url }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ item.url }}</div>
            <div class="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {{ formatDate(item.lastVisitTime) }}
            </div>
          </a>
        </div>
      </div>
      
      <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button 
          @click="openFullHistory"
          class="w-full text-center text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
        >
          {{ $t('message.viewFullHistory') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'PopupView',
  setup() {
    const router = useRouter();
    const historyItems = ref([]);
    const searchQuery = ref('');
    const loading = ref(false);
    
    const loadRecentHistory = async () => {
      loading.value = true;
      try {
        // Get last 10 history items
        const startTime = Date.now() - (24 * 60 * 60 * 1000); // Last 24 hours
        const results = await chrome.history.search({
          text: '',
          startTime: startTime,
          maxResults: 10
        });
        
        historyItems.value = results.sort((a, b) => b.lastVisitTime - a.lastVisitTime);
      } catch (error) {
        console.error('Error loading history:', error);
      } finally {
        loading.value = false;
      }
    };
    
    const performSearch = async () => {
      if (!searchQuery.value.trim()) {
        await loadRecentHistory();
        return;
      }
      
      loading.value = true;
      try {
        const results = await chrome.history.search({
          text: searchQuery.value,
          startTime: 0,
          maxResults: 20
        });
        
        historyItems.value = results.sort((a, b) => b.lastVisitTime - a.lastVisitTime);
      } catch (error) {
        console.error('Error searching history:', error);
      } finally {
        loading.value = false;
      }
    };
    
    const openFullHistory = () => {
      // Open the full history page in a new tab
      if (chrome.runtime && chrome.runtime.id) {
        // We're in the extension environment
        chrome.tabs.create({ url: 'index.html' });
      } else {
        // For development purposes
        window.open('/index.html', '_blank');
      }
    };
    
    const formatDate = (timestamp) => {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    
    onMounted(() => {
      loadRecentHistory();
    });
    
    return {
      historyItems,
      searchQuery,
      loading,
      performSearch,
      openFullHistory,
      formatDate
    };
  }
};
</script>