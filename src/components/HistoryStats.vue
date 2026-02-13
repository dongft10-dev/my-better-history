<template>
  <div class="history-stats bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-4">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
        {{ $t('message.historyStatistics') }}
      </h3>
      <button 
        @click="toggleExpand"
        class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
      >
        <svg 
          class="w-5 h-5 transform transition-transform" 
          :class="{ 'rotate-180': expanded }"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
    </div>
    
    <div v-if="expanded" class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="stat-card bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3">
        <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ stats.totalItems }}</div>
        <div class="text-sm text-gray-600 dark:text-gray-400">{{ $t('message.totalVisits') }}</div>
      </div>
      <div class="stat-card bg-green-50 dark:bg-green-900/30 rounded-lg p-3">
        <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ stats.todayVisits }}</div>
        <div class="text-sm text-gray-600 dark:text-gray-400">{{ $t('message.todayVisits') }}</div>
      </div>
      <div class="stat-card bg-purple-50 dark:bg-purple-900/30 rounded-lg p-3">
        <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ stats.activeDays }}</div>
        <div class="text-sm text-gray-600 dark:text-gray-400">{{ $t('message.activeDays') }}</div>
      </div>
      <div class="stat-card bg-orange-50 dark:bg-orange-900/30 rounded-lg p-3">
        <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">{{ stats.avgPerDay }}</div>
        <div class="text-sm text-gray-600 dark:text-gray-400">{{ $t('message.avgPerDay') }}</div>
      </div>
    </div>
    
    <div v-if="expanded && stats.topSites.length > 0" class="mt-4">
      <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        {{ $t('message.mostVisitedSites') }}
      </h4>
      <div class="space-y-2">
        <div 
          v-for="(site, index) in stats.topSites" 
          :key="site.site"
          class="flex items-center gap-2"
        >
          <span class="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-400">
            {{ index + 1 }}
          </span>
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-center mb-1">
              <span class="text-sm text-gray-800 dark:text-gray-200 truncate">{{ site.site }}</span>
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ site.count }}</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div 
                class="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                :style="{ width: `${(site.count / stats.topSites[0].count) * 100}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';

export default {
  name: 'HistoryStats',
  emits: ['refresh'],
  setup(props, { emit }) {
    const expanded = ref(true);
    const stats = ref({
      totalItems: 0,
      todayVisits: 0,
      activeDays: 0,
      avgPerDay: 0,
      topSites: []
    });
    const loading = ref(false);

    const toggleExpand = () => {
      expanded.value = !expanded.value;
    };

    const loadStats = async () => {
      loading.value = true;
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const allHistory = await chrome.history.search({
          text: '',
          startTime: 0,
          maxResults: 10000
        });

        const todayHistory = allHistory.filter(h => h.lastVisitTime >= today.getTime());
        
        const siteCounts = {};
        const dateCounts = {};
        
        allHistory.forEach(item => {
          try {
            const url = new URL(item.url);
            const hostname = url.hostname.replace(/^www\./, '');
            siteCounts[hostname] = (siteCounts[hostname] || 0) + 1;
          } catch (e) {
            siteCounts['unknown'] = (siteCounts['unknown'] || 0) + 1;
          }
          
          const dateKey = new Date(item.lastVisitTime).toDateString();
          dateCounts[dateKey] = (dateCounts[dateKey] || 0) + 1;
        });

        const topSites = Object.entries(siteCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([site, count]) => ({ site, count }));

        const activeDays = Object.keys(dateCounts).length;
        const avgPerDay = Math.round(allHistory.length / Math.max(activeDays, 1));

        stats.value = {
          totalItems: allHistory.length,
          todayVisits: todayHistory.length,
          activeDays,
          avgPerDay,
          topSites
        };
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      loadStats();
    });

    return {
      expanded,
      stats,
      loading,
      toggleExpand,
      loadStats
    };
  }
};
</script>
