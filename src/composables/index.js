import { ref, computed, onMounted, onUnmounted } from 'vue';
import { getHistory, searchHistory, deleteHistoryUrl, deleteAllHistory } from '@/utils/api';

export function useHistory() {
  const historyItems = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const hasMore = ref(true);

  const loadHistory = async (params = {}) => {
    loading.value = true;
    error.value = null;
    
    try {
      const results = await getHistory(params);
      historyItems.value = results;
    } catch (err) {
      error.value = err.message || 'Failed to load history';
      console.error('Error loading history:', err);
    } finally {
      loading.value = false;
    }
  };

  const searchHistoryItems = async (query, options = {}) => {
    loading.value = true;
    error.value = null;
    
    try {
      const results = await searchHistory(query, options);
      historyItems.value = results;
    } catch (err) {
      error.value = err.message || 'Failed to search history';
      console.error('Error searching history:', err);
    } finally {
      loading.value = false;
    }
  };

  const removeHistoryItem = async (url) => {
    try {
      await deleteHistoryUrl(url);
      historyItems.value = historyItems.value.filter(item => item.url !== url);
    } catch (err) {
      error.value = err.message || 'Failed to delete history item';
      console.error('Error deleting history item:', err);
    }
  };

  return {
    historyItems,
    loading,
    error,
    hasMore,
    loadHistory,
    searchHistoryItems,
    removeHistoryItem
  };
}

export function useSearch() {
  const query = ref('');
  const searchResults = ref([]);
  const isSearching = ref(false);

  const filteredResults = computed(() => {
    if (!query.value.trim()) {
      return searchResults.value;
    }
    
    const searchTerm = query.value.toLowerCase();
    return searchResults.value.filter(item => 
      item.title?.toLowerCase().includes(searchTerm) ||
      item.url?.toLowerCase().includes(searchTerm)
    );
  });

  const performSearch = async (searchFn) => {
    if (!query.value.trim()) {
      searchResults.value = [];
      return;
    }
    
    isSearching.value = true;
    try {
      const results = await searchFn(query.value);
      searchResults.value = results;
    } catch (err) {
      console.error('Search error:', err);
      searchResults.value = [];
    } finally {
      isSearching.value = false;
    }
  };

  const clearSearch = () => {
    query.value = '';
    searchResults.value = [];
  };

  return {
    query,
    searchResults,
    filteredResults,
    isSearching,
    performSearch,
    clearSearch
  };
}

export function useLocalization() {
  const currentLocale = ref(navigator.language.startsWith('zh') ? 'zh-CN' : 'en');

  const translations = {
    en: {
      message: {
        title: 'My Better History',
        description: 'Modern history manager for Chrome',
        searchPlaceholder: 'Search history...',
        today: 'Today',
        yesterday: 'Yesterday',
        thisWeek: 'This Week',
        thisMonth: 'This Month',
        clearHistory: 'Clear History',
        viewFullHistory: 'View Full History',
        recentHistory: 'Recent History',
        noHistory: 'No history records found',
        loading: 'Loading...'
      }
    },
    'zh-CN': {
      message: {
        title: 'Vue 更好的历史记录',
        description: '现代化的Chrome历史记录管理器',
        searchPlaceholder: '搜索历史记录...',
        today: '今天',
        yesterday: '昨天',
        thisWeek: '本周',
        thisMonth: '本月',
        clearHistory: '清除历史记录',
        viewFullHistory: '查看完整历史',
        recentHistory: '最近历史',
        noHistory: '未找到历史记录',
        loading: '加载中...'
      }
    }
  };

  const t = computed(() => (key) => {
    const keys = key.split('.');
    let result = translations[currentLocale.value];

    for (const k of keys) {
      result = result?.[k];
    }

    return result || key;
  });

  const setLocale = (locale) => {
    currentLocale.value = locale;
    localStorage.setItem('locale', locale);
  };

  return {
    currentLocale,
    t,
    setLocale
  };
}
