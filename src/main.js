import { createApp, ref, computed } from 'vue'
import App from './App.vue'
import router from './router'
import '../src/assets/styles/main.css'

// Simple i18n implementation
const messages = {
  en: {
    title: 'Better History',
    searchPlaceholder: 'Search history...',
    recentHistory: 'Recent History',
    noHistory: 'No history records found',
    loading: 'Loading...',
    clearHistory: 'Clear History',
    today: 'Today',
    yesterday: 'Yesterday',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    viewFullHistory: 'View Full History',
    delete: 'Delete',
    cancel: 'Cancel',
    confirm: 'Confirm',
    searchResultsFor: 'Search results for',
    totalHistory: 'Total History',
    loadMore: 'Load More',
    historyStatistics: 'History Statistics',
    totalVisits: 'Total Visits',
    todayVisits: 'Today Visits',
    activeDays: 'Active Days',
    avgPerDay: 'Avg/Day',
    mostVisitedSites: 'Most Visited Sites',
    selectDate: 'Select date',
    historyCleared: 'History cleared successfully',
    itemDeleted: 'Item deleted',
    errorLoadingHistory: 'Error loading history',
    clearHistoryWarning: 'Are you sure you want to clear all browsing history?',
    darkMode: 'Switch to dark mode',
    lightMode: 'Switch to light mode'
  },
  'zh-CN': {
    title: '更好的历史记录',
    searchPlaceholder: '搜索历史记录...',
    recentHistory: '最近访问',
    noHistory: '未找到历史记录',
    loading: '加载中...',
    clearHistory: '清除历史记录',
    today: '今天',
    yesterday: '昨天',
    thisWeek: '本周',
    thisMonth: '本月',
    viewFullHistory: '查看完整历史',
    delete: '删除',
    cancel: '取消',
    confirm: '确认',
    searchResultsFor: '搜索结果',
    totalHistory: '历史记录总数',
    loadMore: '加载更多',
    historyStatistics: '历史统计',
    totalVisits: '总访问次数',
    todayVisits: '今日访问',
    activeDays: '活跃天数',
    avgPerDay: '日均访问',
    mostVisitedSites: '最常访问',
    selectDate: '选择日期',
    historyCleared: '历史记录已清除',
    itemDeleted: '项目已删除',
    errorLoadingHistory: '加载历史记录出错',
    clearHistoryWarning: '确定要清除所有历史记录吗？',
    darkMode: '切换到深色模式',
    lightMode: '切换到浅色模式'
  },
  fr: {
    title: 'Meilleur Historique',
    searchPlaceholder: 'Rechercher dans l\'historique...',
    recentHistory: 'Historique récent',
    noHistory: 'Aucun enregistrement trouvé',
    loading: 'Chargement...',
    clearHistory: 'Effacer l\'historique',
    today: 'Aujourd\'hui',
    yesterday: 'Hier',
    thisWeek: 'Cette semaine',
    thisMonth: 'Ce mois',
    viewFullHistory: 'Voir l\'historique complet',
    delete: 'Supprimer',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    searchResultsFor: 'Résultats pour',
    totalHistory: 'Total',
    loadMore: 'Charger plus',
    historyStatistics: 'Statistiques',
    totalVisits: 'Visites totales',
    todayVisits: 'Aujourd\'hui',
    activeDays: 'Jours actifs',
    avgPerDay: 'Moyenne/jour',
    mostVisitedSites: 'Sites les plus visités',
    selectDate: 'Sélectionner une date',
    historyCleared: 'Historique effacé',
    itemDeleted: 'Élément supprimé',
    errorLoadingHistory: 'Erreur de chargement',
    clearHistoryWarning: 'Effacer tout l\'historique ?',
    darkMode: 'Mode sombre',
    lightMode: 'Mode clair'
  },
  ru: {
    title: 'История',
    searchPlaceholder: 'Поиск в истории...',
    recentHistory: 'Недавняя история',
    noHistory: 'Записи не найдены',
    loading: 'Загрузка...',
    clearHistory: 'Очистить историю',
    today: 'Сегодня',
    yesterday: 'Вчера',
    thisWeek: 'На этой неделе',
    thisMonth: 'В этом месяце',
    viewFullHistory: 'Показать полную историю',
    delete: 'Удалить',
    cancel: 'Отмена',
    confirm: 'Подтвердить',
    searchResultsFor: 'Результаты поиска',
    totalHistory: 'Всего записей',
    loadMore: 'Загрузить ещё',
    historyStatistics: 'Статистика',
    totalVisits: 'Всего посещений',
    todayVisits: 'Сегодня',
    activeDays: 'Активных дней',
    avgPerDay: 'Среднее/день',
    mostVisitedSites: 'Часто посещаемые',
    selectDate: 'Выбрать дату',
    historyCleared: 'История очищена',
    itemDeleted: 'Элемент удалён',
    errorLoadingHistory: 'Ошибка загрузки',
    clearHistoryWarning: 'Очистить всю историю?',
    darkMode: 'Тёмная тема',
    lightMode: 'Светлая тема'
  }
}

const locale = ref(navigator.language.startsWith('zh') ? 'zh-CN' : 
                 navigator.language.startsWith('fr') ? 'fr' :
                 navigator.language.startsWith('ru') ? 'ru' : 'en')

const t = computed(() => (key) => {
  const keys = key.split('.')
  let result = messages[locale.value]
  for (const k of keys) {
    result = result?.[k]
  }
  return result || messages.en[key] || key
})

const app = createApp(App)
app.provide('t', t)
app.provide('locale', locale)
app.use(router)
app.mount('#app')
